import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ROUTES } from '@/constants/routes'
import { ConfirmDialog, FormDialog } from '@/components/shared/dialogs'
import { FormField } from '@/components/shared/FormField'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/states'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { assessmentService, questionService } from '@/services/academic-program.service'
import { questionInputSchema, type AssessmentDefinition, type QuestionInput } from '@/types/assessment-definition'
import { ProgramWorkspace } from '../components/ProgramWorkspace'

type Question = AssessmentDefinition['questions'][number]

export function QuestionBankPage() {
  return <ProgramWorkspace title="Bank Soal" unavailable="Pengelolaan soal per asesmen menunggu integrasi API admin.">
    {(institutionId, programId) => <AssessmentPicker key={programId} institutionId={institutionId} programId={programId} />}
  </ProgramWorkspace>
}

function AssessmentPicker({ institutionId, programId }: { institutionId: string; programId: string }) {
  const [selected, select] = useState('')
  const queryKey = ['assessment-definitions', institutionId, programId]
  const client = useQueryClient()
  const query = useQuery({ queryKey, queryFn: () => assessmentService.list(institutionId, programId), retry: false })
  if (query.isLoading) return <LoadingState />
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />
  const assessment = query.data?.find(item => item.id === selected) ?? query.data?.[0]
  if (!assessment) return <Card><EmptyState title="Belum ada asesmen" description="Buat asesmen untuk menambahkan pertanyaan."
    action={<Button asChild><Link to={ROUTES.admin.assessments}>Kelola asesmen</Link></Button>} /></Card>
  return <>
    <FormField id="question-assessment" label="Asesmen">
      <select id="question-assessment" className="h-11 rounded-md border border-border bg-surface px-3 sm:max-w-sm"
        value={assessment.id} onChange={event => select(event.target.value)}>
        {query.data?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
    </FormField>
    <QuestionList key={assessment.id} assessment={assessment}
      save={(values, id) => questionService.save(institutionId, programId, assessment.id, values, id)}
      remove={id => questionService.remove(institutionId, programId, assessment.id, id)}
      refresh={() => client.invalidateQueries({ queryKey })} />
  </>
}

interface ListProps {
  assessment: AssessmentDefinition
  save: (values: QuestionInput, id?: string) => Promise<void>
  remove: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

function QuestionList({ assessment, save, remove, refresh }: ListProps) {
  const [editor, setEditor] = useState<Question | null | undefined>()
  const [deleting, setDeleting] = useState<Question | null>(null)
  const editable = assessment.status === 'draft'
  const deletion = useMutation({
    mutationFn: remove,
    onSuccess: async () => { setDeleting(null); toast.success('Soal dihapus.'); await refresh() },
    onError: error => toast.error(error.message),
  })
  return <Card className="p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-semibold">Pertanyaan ({assessment.questions.length})</h2>
      <StatusBadge status={assessment.status} />
      {editable && <Button onClick={() => setEditor(null)}>Tambah soal</Button>}
    </div>
    <p className="my-3 text-sm text-muted-foreground">Jawaban peserta menggunakan skala 1–5.</p>
    {!assessment.questions.length && <EmptyState title="Belum ada soal" description={editable ? 'Tambahkan pertanyaan pertama untuk asesmen ini.' : 'Asesmen ini belum memiliki pertanyaan.'} />}
    <ol className="list-decimal space-y-3 pl-6">{assessment.questions.map(question => <li key={question.id}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-2">
        <span className="min-w-0 flex-1 whitespace-pre-wrap break-words">{question.text}</span>
        {editable && <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditor(question)}>Ubah</Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleting(question)}>Hapus</Button>
        </div>}
      </div>
    </li>)}</ol>
    {editable && editor !== undefined && <QuestionEditor question={editor} close={() => setEditor(undefined)} save={async values => {
      await save(values, editor?.id)
      setEditor(undefined)
      toast.success('Soal tersimpan.')
      await refresh()
    }} />}
    <ConfirmDialog open={editable && !!deleting} title="Hapus soal?" description={deleting?.text} confirmLabel="Hapus soal"
      variant="destructive" loading={deletion.isPending} onOpenChange={open => { if (!open) setDeleting(null) }}
      onConfirm={() => { if (deleting) deletion.mutate(deleting.id) }} />
  </Card>
}

function QuestionEditor({ question, close, save }: { question: Question | null; close: () => void; save: (values: QuestionInput) => Promise<void> }) {
  const form = useForm<QuestionInput>({ resolver: zodResolver(questionInputSchema), mode: 'onTouched', defaultValues: { text: question?.text ?? '' } })
  return <FormDialog open title={question ? 'Ubah soal' : 'Tambah soal'} onOpenChange={open => { if (!open) close() }}
    loading={form.formState.isSubmitting} onSubmit={form.handleSubmit(async values => {
      try { await save(values) }
      catch (error) { form.setError('root', { message: error instanceof Error ? error.message : 'Soal gagal disimpan.' }) }
    })}>
    <FormField id="question-text" label="Teks pertanyaan" required error={form.formState.errors.text?.message}>
      <Textarea id="question-text" rows={4} required {...form.register('text')} />
    </FormField>
    {form.formState.errors.root && <p role="alert">{form.formState.errors.root.message}</p>}
  </FormDialog>
}
