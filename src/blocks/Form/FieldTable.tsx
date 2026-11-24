'use client'
import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'

import { useFormContext } from 'react-hook-form'
import React from 'react'

import { Input } from '@/components/ui/input'

type TextLike = Extract<FormFieldBlock, { blockType: 'text' }>
export type FieldTableItem = { kind: 'table'; rows: string[]; cols: string[]; cells: Record<string, TextLike> }

const SPLIT = /^(.+?)\s+[–—-]\s+(.+)$/

/**
 * Finds runs of text fields labelled "Row – Column" (e.g. "10th – Year of passing", "12th – Board")
 * that form a complete grid, so they can be shown as one compact table like a paper form.
 */
export function groupTableFields(fields: FormFieldBlock[]): (FormFieldBlock | FieldTableItem)[] {
  const out: (FormFieldBlock | FieldTableItem)[] = []
  let i = 0
  while (i < fields.length) {
    let j = i
    while (j < fields.length && fields[j].blockType === 'text' && SPLIT.test(String((fields[j] as TextLike).label || ''))) j++
    const run = fields.slice(i, j) as TextLike[]
    if (run.length >= 4) {
      const rows: string[] = []
      const cols: string[] = []
      const cells: Record<string, TextLike> = {}
      for (const f of run) {
        const [, r, c] = String(f.label).match(SPLIT)!
        if (!rows.includes(r)) rows.push(r)
        if (!cols.includes(c)) cols.push(c)
        cells[`${r}|${c}`] = f
      }
      if (rows.length > 1 && cols.length > 1 && rows.length * cols.length === run.length) {
        out.push({ kind: 'table', rows, cols, cells })
        i = j
        continue
      }
    }
    out.push(fields[i])
    i++
  }
  return out
}

export const FieldTable: React.FC<{ item: FieldTableItem }> = ({ item }) => {
  const { register, formState } = useFormContext()
  const { rows, cols, cells } = item
  const grid = { gridTemplateColumns: `5rem repeat(${cols.length}, minmax(0, 1fr))` }

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      {/* Column headings (desktop) */}
      <div className="hidden gap-3 bg-secondary px-4 py-3 text-xs font-semibold tracking-wide text-navy uppercase md:grid" style={grid}>
        <span>Class</span>
        {cols.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      {rows.map((r) => (
        <fieldset key={r} className="grid gap-3 max-md:grid-cols-2 border-t border-border px-4 py-4 first-of-type:border-t-0 md:items-center md:[grid-template-columns:var(--cols)] md:first-of-type:border-t" style={{ '--cols': grid.gridTemplateColumns } as React.CSSProperties}>
          <legend className="sr-only">{r}</legend>
          <span className="font-heading font-bold text-navy max-md:col-span-2" aria-hidden>
            {r}
          </span>
          {cols.map((c) => {
            const f = cells[`${r}|${c}`]
            const invalid = !!formState.errors[f.name]
            return (
              <label key={c} className="block">
                {/* Label shown on phones; on desktop the column heading does the job */}
                <span className="mb-1 block text-xs font-medium text-muted-foreground md:sr-only">
                  {c}
                  {f.required && ' *'}
                </span>
                <Input
                  aria-label={`${r} – ${c}`}
                  aria-invalid={invalid || undefined}
                  aria-required={f.required || undefined}
                  inputMode={/year|percent|marks/i.test(c) ? 'decimal' : undefined}
                  placeholder={f.required ? 'Required' : 'Optional'}
                  defaultValue={'defaultValue' in f ? (f.defaultValue as string | undefined) : undefined}
                  {...register(f.name, { required: !!f.required })}
                />
              </label>
            )
          })}
        </fieldset>
      ))}
    </div>
  )
}
