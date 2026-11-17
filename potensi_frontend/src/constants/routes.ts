/** Satu sumber kebenaran untuk semua path aplikasi. */
export const ROUTES = {
  home: '/',
  login: '/login',
  forgotPassword: '/lupa-kata-sandi',
  registerInstitution: '/registrasi-institusi',
  registrationStatus: '/status-registrasi',
  uiKit: '/ui-kit',

  owner: {
    dashboard: '/owner',
    institutionRequests: '/owner/permintaan-institusi',
    institutions: '/owner/institusi',
    monitoring: '/owner/monitoring',
    profile: '/owner/profil',
  },

  admin: {
    dashboard: '/admin',
    institutionProfile: '/admin/profil-institusi',
    programs: '/admin/program-akademik',
    tracks: '/admin/track-akademik',
    assessments: '/admin/assessment',
    questions: '/admin/bank-soal',
    participants: '/admin/peserta',
    datasets: '/admin/dataset',
    training: '/admin/training-model',
    evaluation: '/admin/evaluasi-model',
    models: '/admin/model',
    results: '/admin/hasil-rekomendasi',
    settings: '/admin/pengaturan',
  },

  participant: {
    dashboard: '/peserta',
    assessments: '/peserta/assessment',
    history: '/peserta/riwayat',
    profile: '/peserta/profil',
  },
} as const
