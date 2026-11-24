'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { CheckCircle2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { cn } from '@/utilities/ui'

import { FieldTable, groupTableFields } from './FieldTable'
import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
}

/** The form itself, without any section wrapper — reused by the Contact section. */
export const PayloadForm: React.FC<{ form: FormType; className?: string }> = ({
  form: formFromProps,
  className,
}) => {
  const { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } =
    formFromProps

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<string | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      const submitForm = async () => {
        setError(undefined)
        setIsLoading(true)

        // Skip optional fields left empty — the database requires a value for every saved field.
        const dataToSend = Object.entries(data)
          .map(([name, value]) => ({
            field: name,
            value: Array.isArray(value) ? value.join(', ') : value,
          }))
          .filter(({ value }) => value !== undefined && value !== null && String(value).trim() !== '')

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions/`, {
            body: JSON.stringify({ form: formID, submissionData: dataToSend }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })
          const res = await req.json().catch(() => ({}))
          setIsLoading(false)

          if (req.status >= 400) {
            setError(res.errors?.[0]?.message || 'Sorry, we could not send your details. Please try again or call us.')
            return
          }

          setHasSubmitted(true)
          if (confirmationType === 'redirect' && redirect?.url) router.push(redirect.url)
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError('Network error — please check your connection and try again.')
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  if (hasSubmitted && confirmationType === 'message') {
    return (
      <div className={cn('flex flex-col items-center gap-4 py-8 text-center', className)} role="status">
        <CheckCircle2 className="size-14 text-green-600" aria-hidden />
        <RichText data={confirmationMessage} enableGutter={false} className="prose-headings:text-navy" />
      </div>
    )
  }

  return (
    <FormProvider {...formMethods}>
      <form id={formID} onSubmit={handleSubmit(onSubmit)} className={className} noValidate>
        {/* counter-reset numbers the section headings (message fields) 1, 2, 3… */}
        <div className="-mx-2 flex flex-wrap [counter-reset:formstep]">
          {groupTableFields(formFromProps?.fields || []).map((field, index) => {
            if ('kind' in field) {
              return (
                <div key={index} className="mb-5 w-full px-2">
                  <FieldTable item={field} />
                </div>
              )
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
            if (!Field) return null
            const width = 'width' in field && field.width ? Number(field.width) : 100
            return (
              <div
                className={cn('mb-5 w-full px-2 md:w-[var(--w)]', field.blockType === 'message' && index > 0 && 'mt-5')}
                key={index}
                style={{ '--w': `${width}%` } as React.CSSProperties}
              >
                <Field
                  form={formFromProps}
                  {...field}
                  width={undefined}
                  {...formMethods}
                  control={control}
                  errors={errors}
                  register={register}
                />
              </div>
            )
          })}
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-error px-4 py-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button
          form={formID}
          type="submit"
          size="lg"
          disabled={isLoading}
          className="btn-shine bg-gradient-primary h-12 w-full rounded-full px-8 shadow-lg shadow-primary/30 sm:w-auto"
        >
          {isLoading && <Loader2 className="animate-spin" aria-hidden />}
          {isLoading ? 'Sending…' : submitButtonLabel || 'Submit'}
        </Button>
      </form>
    </FormProvider>
  )
}

export const FormBlock: React.FC<{ id?: string } & FormBlockType> = (props) => {
  const { enableIntro, form, introContent } = props

  const card = (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-[0_20px_60px_-30px_rgba(38,57,174,0.35)] sm:p-8">
      <PayloadForm form={form} />
    </div>
  )

  return (
    <section className="section bg-card">
      <div className="container">
        {enableIntro && introContent ? (
          // Intro becomes a side panel ("Before you start…") that stays in view next to a long form
          <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] xl:gap-10">
            <aside className="bg-mesh rounded-3xl p-6 text-white lg:sticky lg:top-28">
              <RichText
                data={introContent}
                enableGutter={false}
                className="max-w-none text-[15px] prose-invert prose-headings:mt-0 prose-headings:font-heading prose-headings:text-white prose-h3:text-lg prose-p:text-white/80 prose-a:text-white prose-strong:text-white prose-li:my-1 prose-li:text-white/85 prose-li:marker:text-accent"
              />
            </aside>
            {card}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">{card}</div>
        )}
      </div>
    </section>
  )
}
