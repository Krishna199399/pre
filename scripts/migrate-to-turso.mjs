import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../prestige.db');

const localDb = new DatabaseSync(dbPath);

const TURSO_URL = 'https://prestige-rose1911.aws-ap-southeast-1.turso.io/v2/pipeline';
const AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTU1OTY4MzUsImlkIjoiMDFhMjExZTctMmUwMS03NTA0LTkyYzAtNDc0MzgwYmZmNzdlIiwia2lkIjoiU09rR3Z6LW9vTGJSTFpLY3VUamZ5UVZXVi1OMUpUOFRta0ZXQnkyS2NrTSIsInJpZCI6IjUyZDBmZDIwLTQ4NWQtNGUxMi05ZWMxLTNiYTNmODQyMjRkZiJ9.Lazo4tRKFNqpPdGnHXRKYCbzI52zSJ7x3IHOOkFPtPzb3gZSxKu7h_2fQ1pV0O7jvEA1omGnX6UJdGZwY9TsAw';

let currentBaton = null;

async function executeTurso(requests) {
  const reqs = [
    { type: 'execute', stmt: { sql: 'PRAGMA foreign_keys = OFF' } },
    ...requests,
  ];
  const payload = { requests: reqs };
  if (currentBaton) payload.baton = currentBaton;

  let retries = 5;
  while (retries > 0) {
    try {
      const res = await fetch(TURSO_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        if (text.includes('limit exceeded') || res.status === 429) {
          console.log('    Connection limit hit, waiting 2s...');
          await new Promise(r => setTimeout(r, 2000));
          retries--;
          currentBaton = null; // reset connection
          continue;
        }
        throw new Error(`Turso HTTP ${res.status}: ${text}`);
      }
      const json = await res.json();
      currentBaton = json.baton || null;
      for (const r of json.results) {
        if (r.type === 'error') {
          throw new Error(`Turso execution error: ${r.error.message}`);
        }
      }
      return json;
    } catch (err) {
      if (err.message.includes('limit exceeded')) {
        console.log('    Connection limit hit in error, waiting 2s...');
        await new Promise(r => setTimeout(r, 2000));
        retries--;
        currentBaton = null;
        continue;
      }
      throw err;
    }
  }
}

function serializeValue(val) {
  if (val === null || val === undefined) return { type: 'null' };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { type: 'integer', value: String(val) };
    return { type: 'float', value: val };
  }
  if (typeof val === 'bigint') return { type: 'integer', value: String(val) };
  if (typeof val === 'boolean') return { type: 'integer', value: val ? '1' : '0' };
  if (Buffer.isBuffer(val) || val instanceof Uint8Array) {
    return { type: 'blob', base64: Buffer.from(val).toString('base64') };
  }
  return { type: 'text', value: String(val) };
}

async function main() {
  console.log('1. Reading tables from prestige.db...');
  const allTables = localDb.prepare("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND sql IS NOT NULL").all();

  const priority = ['users', 'pages', 'posts', 'courses', 'faculty', 'recruiters', 'gallery', 'media', 'categories', 'students', 'results', 'forms', 'redirects', 'site_settings', 'header', 'footer'];
  const tables = [...allTables].sort((a, b) => {
    const aPrio = priority.indexOf(a.name);
    const bPrio = priority.indexOf(b.name);
    if (aPrio !== -1 && bPrio === -1) return -1;
    if (aPrio === -1 && bPrio !== -1) return 1;
    if (aPrio !== -1 && bPrio !== -1) return aPrio - bPrio;
    return a.name.localeCompare(b.name);
  });

  console.log('2. Migrating table contents...');
  let totalMigrated = 0;
  for (const table of tables) {
    const rows = localDb.prepare(`SELECT * FROM "${table.name}"`).all();
    if (rows.length === 0) continue;

    console.log(`  Migrating ${rows.length} rows for: ${table.name}`);
    const batchSize = 30;
    for (let i = 0; i < rows.length; i += batchSize) {
      const slice = rows.slice(i, i + batchSize);
      const requests = slice.map(row => {
        const cols = Object.keys(row);
        const placeholders = cols.map(() => '?').join(', ');
        const values = Object.values(row).map(serializeValue);
        return {
          type: 'execute',
          stmt: {
            sql: `INSERT OR REPLACE INTO "${table.name}" (${cols.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`,
            args: values,
          },
        };
      });
      await executeTurso(requests);
      await new Promise(r => setTimeout(r, 60)); // gentle pacing to respect free tier concurrency
    }
    totalMigrated += rows.length;
  }

  // Close connection
  if (currentBaton) {
    await fetch(TURSO_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: [{ type: 'close' }], baton: currentBaton }),
    }).catch(() => {});
  }

  console.log('\n=========================================');
  console.log(`SUCCESS! Migrated ${totalMigrated} rows across ${tables.length} tables to Turso.`);
  console.log('=========================================');
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
