import { assessmentDefinitionSchema, assessmentInputSchema, type AssessmentInput, questionInputSchema, type QuestionInput } from '@/types/assessment-definition'
import { trackSchema, type TrackInput } from '@/types/academic-track'
import { z } from 'zod'
import { programSchema, type AcademicProgram, type ProgramInput } from '@/types/academic-program'
import { env } from '@/lib/env'

const records = z.array(programSchema.extend({
  id: z.string(),
  assessments: z.array(assessmentDefinitionSchema).default([]),
  tracks: z.array(trackSchema.extend({ id: z.string() })).default([]),
}))

function storageKey(institutionId: string) {
  if (!env.useMock || !institutionId) throw new Error('Data program institusi belum tersedia.')
  return 'potensi.mock.programs.' + institutionId
}

function read(key: string) {
  return records.parse(JSON.parse(localStorage.getItem(key) ?? '[]'))
}

export const programService = {
  available: env.useMock,
  async list(institutionId: string): Promise<AcademicProgram[]> {
    return read(storageKey(institutionId)).sort((a, b) => a.name.localeCompare(b.name, 'id'))
  },
  async save(institutionId: string, input: ProgramInput, id?: string) {
    const key = storageKey(institutionId)
    const programs = read(key)
    const values = programSchema.parse(input)
    if (id && !programs.some(program => program.id === id)) throw new Error('Program sudah dihapus.')
    if (programs.some(program => program.id !== id && program.name.toLowerCase() === values.name.toLowerCase())) {
      throw new Error('Nama program sudah digunakan di institusi ini.')
    }
    const existing = programs.find(program => program.id === id)
    const updated = { ...existing, ...values, tracks: existing?.tracks ?? [], assessments: existing?.assessments ?? [], id: id ?? crypto.randomUUID() }
    localStorage.setItem(key, JSON.stringify([...programs.filter(program => program.id !== id), updated]))
  },
  async remove(institutionId: string, id: string) {
    const key = storageKey(institutionId)
    const programs = read(key)
    const parent = programs.find(program => program.id === id)
    if (parent?.assessments.length) throw new Error('Hapus asesmen pada program ini terlebih dahulu.')
    if (parent?.tracks.length) {
      throw new Error('Hapus track pada program ini terlebih dahulu.')
    }
    localStorage.setItem(key, JSON.stringify(programs.filter(program => program.id !== id)))
  },
}


function readParent(institutionId: string, programId: string) {
  const key = storageKey(institutionId)
  const programs = read(key)
  const parent = programs.find(program => program.id === programId)
  if (!parent) throw new Error('Program induk sudah tidak tersedia.')
  return { key, programs, parent }
}

export const trackService = {
  async list(institutionId: string, programId: string) {
    return readParent(institutionId, programId).parent.tracks.sort((a, b) => a.name.localeCompare(b.name, 'id'))
  },
  async save(institutionId: string, programId: string, input: TrackInput, id?: string) {
    const { key, programs, parent } = readParent(institutionId, programId)
    const values = trackSchema.parse(input)
    if (id && !parent.tracks.some(track => track.id === id)) throw new Error('Track sudah dihapus.')
    if (parent.tracks.some(track => track.id !== id && track.name.toLowerCase() === values.name.toLowerCase())) {
      throw new Error('Nama track sudah digunakan dalam program ini.')
    }
    parent.tracks = [...parent.tracks.filter(track => track.id !== id), { ...values, id: id ?? crypto.randomUUID() }]
    localStorage.setItem(key, JSON.stringify(programs))
  },
  async remove(institutionId: string, programId: string, id: string) {
    const { key, programs, parent } = readParent(institutionId, programId)
    parent.tracks = parent.tracks.filter(track => track.id !== id)
    localStorage.setItem(key, JSON.stringify(programs))
  },
}

export const assessmentService = {
  async list(institutionId: string, programId: string) {
    return readParent(institutionId, programId).parent.assessments.sort((a, b) => a.name.localeCompare(b.name, 'id'))
  },
  async save(institutionId: string, programId: string, input: AssessmentInput, id?: string) {
    const { key, programs, parent } = readParent(institutionId, programId)
    const values = assessmentInputSchema.parse(input)
    const existing = parent.assessments.find(row => row.id === id)
    if (id && !existing) throw new Error('Asesmen sudah dihapus.')
    if (existing?.status === 'published') throw new Error('Kembalikan asesmen ke draf sebelum mengubahnya.')
    if (parent.assessments.some(row => row.id !== id && row.name.toLowerCase() === values.name.toLowerCase())) {
      throw new Error('Nama asesmen sudah digunakan pada program ini.')
    }
    parent.assessments = [...parent.assessments.filter(row => row.id !== id), { ...values, id: id ?? crypto.randomUUID(), questions: existing?.questions ?? [], status: 'draft' }]
    localStorage.setItem(key, JSON.stringify(programs))
  },
  async setStatus(institutionId: string, programId: string, id: string, status: 'draft' | 'published') {
    const { key, programs, parent } = readParent(institutionId, programId)
    const row = parent.assessments.find(item => item.id === id)
    if (!row) throw new Error('Asesmen sudah dihapus.')
    row.status = status
    localStorage.setItem(key, JSON.stringify(programs))
  },
  async remove(institutionId: string, programId: string, id: string) {
    const { key, programs, parent } = readParent(institutionId, programId)
    if (parent.assessments.find(row => row.id === id)?.status === 'published') {
      throw new Error('Kembalikan asesmen ke draf sebelum menghapusnya.')
    }
    parent.assessments = parent.assessments.filter(row => row.id !== id)
    localStorage.setItem(key, JSON.stringify(programs))
  },
}


function editableAssessment(institutionId: string, programId: string, assessmentId: string) {
  const { key, programs, parent } = readParent(institutionId, programId)
  const assessment = parent.assessments.find(item => item.id === assessmentId)
  if (!assessment) throw new Error('Asesmen sudah dihapus.')
  if (assessment.status !== 'draft') throw new Error('Kembalikan asesmen ke draf untuk mengubah soal.')
  return { assessment, persist: () => localStorage.setItem(key, JSON.stringify(programs)) }
}

export const questionService = {
  async save(institutionId: string, programId: string, assessmentId: string, input: QuestionInput, id?: string) {
    const { assessment, persist } = editableAssessment(institutionId, programId, assessmentId)
    const values = questionInputSchema.parse(input)
    if (id) {
      const row = assessment.questions.find(item => item.id === id)
      if (!row) throw new Error('Soal sudah dihapus.')
      row.text = values.text
    } else {
      assessment.questions.push({ ...values, id: crypto.randomUUID() })
    }
    persist()
  },
  async remove(institutionId: string, programId: string, assessmentId: string, id: string) {
    const { assessment, persist } = editableAssessment(institutionId, programId, assessmentId)
    assessment.questions = assessment.questions.filter(item => item.id !== id)
    persist()
  },
}
