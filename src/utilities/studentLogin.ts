/**
 * Student-portal login helpers, shared by the portal and the Students collection.
 *
 * Registration numbers are printed like PRE/DWD/DFISM/25-26/111, but students log in with the short
 * form: course code + number → DFISM111 (same rule as the original site). Either form is accepted.
 */
export function normalizeRegNo(input: string): string {
  const value = input.trim().toUpperCase().replace(/\s+/g, '')
  const parts = value.split(/[/\\]/).filter(Boolean)
  if (parts.length >= 3) {
    const number = parts[parts.length - 1]
    // The course code is the letters-only part that isn't the institute prefix (PRE / DWD)
    const code = parts.find((p) => /^[A-Z]{2,}$/.test(p) && p !== 'PRE' && p !== 'DWD')
    if (code && /^\d+$/.test(number)) return `${code}${number}`
  }
  return value.replace(/[^A-Z0-9]/g, '')
}

/** "10/10/2000", "10-10-2000" or "10.10.2000" (also "2000-10-10") → "2000-10-10"; null if not a real date. */
export function parseDob(input: string): string | null {
  const v = input.trim()
  let d: number, m: number, y: number
  const dmy = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
  const ymd = v.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dmy) [d, m, y] = [Number(dmy[1]), Number(dmy[2]), Number(dmy[3])]
  else if (ymd) [y, m, d] = [Number(ymd[1]), Number(ymd[2]), Number(ymd[3])]
  else return null
  const date = new Date(Date.UTC(y, m - 1, d))
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** Formats digits as the student types: "10102000" → "10/10/2000". */
export function formatDobInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/')
}
