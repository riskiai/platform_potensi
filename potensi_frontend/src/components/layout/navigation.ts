import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart3,
  BookOpenCheck,
  Boxes,
  Building2,
  ClipboardList,
  Cpu,
  Database,
  FileQuestion,
  GitBranch,
  GraduationCap,
  History,
  Inbox,
  LayoutDashboard,
  Settings,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import type { UserRole } from '@/types/auth'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

export interface NavGroup {
  /** Judul grup di sidebar; kosong = tanpa judul. */
  label?: string
  items: NavItem[]
}

/**
 * Menu sidebar per role. Menambah halaman baru cukup di sini —
 * route & breadcrumb ikut dibuat dari konfigurasi ini.
 */
export const NAVIGATION: Record<UserRole, NavGroup[]> = {
  platform_owner: [
    {
      items: [{ label: 'Dashboard', path: ROUTES.owner.dashboard, icon: LayoutDashboard }],
    },
    {
      label: 'Institusi',
      items: [
        { label: 'Permintaan Institusi', path: ROUTES.owner.institutionRequests, icon: Inbox },
        { label: 'Manajemen Institusi', path: ROUTES.owner.institutions, icon: Building2 },
      ],
    },
    {
      label: 'Sistem',
      items: [
        { label: 'Monitoring', path: ROUTES.owner.monitoring, icon: Activity },
        { label: 'Profil', path: ROUTES.owner.profile, icon: UserRound },
      ],
    },
  ],

  institution_admin: [
    {
      items: [{ label: 'Dashboard', path: ROUTES.admin.dashboard, icon: LayoutDashboard }],
    },
    {
      label: 'Institusi',
      items: [
        { label: 'Profil Institusi', path: ROUTES.admin.institutionProfile, icon: Building2 },
        { label: 'Program Akademik', path: ROUTES.admin.programs, icon: GraduationCap },
        { label: 'Track Akademik', path: ROUTES.admin.tracks, icon: GitBranch },
      ],
    },
    {
      label: 'Assessment',
      items: [
        { label: 'Manajemen Assessment', path: ROUTES.admin.assessments, icon: ClipboardList },
        { label: 'Bank Soal', path: ROUTES.admin.questions, icon: FileQuestion },
        { label: 'Peserta', path: ROUTES.admin.participants, icon: Users },
      ],
    },
    {
      label: 'Machine Learning',
      items: [
        { label: 'Dataset', path: ROUTES.admin.datasets, icon: Database },
        { label: 'Training Model', path: ROUTES.admin.training, icon: Cpu },
        { label: 'Evaluasi Model', path: ROUTES.admin.evaluation, icon: BarChart3 },
        { label: 'Manajemen Model', path: ROUTES.admin.models, icon: Boxes },
      ],
    },
    {
      label: 'Hasil',
      items: [
        { label: 'Hasil Rekomendasi', path: ROUTES.admin.results, icon: Sparkles },
        { label: 'Pengaturan', path: ROUTES.admin.settings, icon: Settings },
      ],
    },
  ],

  participant: [
    {
      items: [
        { label: 'Dashboard', path: ROUTES.participant.dashboard, icon: LayoutDashboard },
        { label: 'Assessment Saya', path: ROUTES.participant.assessments, icon: BookOpenCheck },
        { label: 'Riwayat Assessment', path: ROUTES.participant.history, icon: History },
        { label: 'Profil', path: ROUTES.participant.profile, icon: UserRound },
      ],
    },
  ],
}

/** Tujuan menu "Profil" di dropdown Topbar. */
export const PROFILE_PATH: Record<UserRole, string> = {
  platform_owner: ROUTES.owner.profile,
  institution_admin: ROUTES.admin.settings,
  participant: ROUTES.participant.profile,
}
