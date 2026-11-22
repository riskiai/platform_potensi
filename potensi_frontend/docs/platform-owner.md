# Platform Owner POTENSI

Modul ini mendukung alur [registrasi dan persetujuan institusi](../../docs_platform_potensi/POTENSI_BUSINESS_FLOW.md). Admin Institusi mengirim pengajuan sendiri. Owner meninjau pengajuan dan mengambil keputusan. Admin dapat login setelah pengajuan disetujui.

## Halaman

- `/owner` menampilkan jumlah institusi, distribusi status, institusi terbaru, dan tautan ke antrean review.
- `/owner/permintaan-institusi` membuka antrean Menunggu. Owner dapat mencari pengajuan, membaca detail, menyetujui, atau menolak dengan alasan. Filter status menampilkan keputusan sebelumnya.
- `/owner/institusi` menampilkan daftar dengan pencarian, filter, pengurutan, dan paginasi. Tautan detail membuka `/owner/institusi/:tenantId`. Dalam mode mock, Owner dapat mengaktifkan atau menonaktifkan institusi dari halaman detail setelah konfirmasi. Status tersimpan setelah muat ulang dan menentukan akses login admin hasil registrasi.
- `/owner/monitoring` menunjukkan konektivitas API dan jumlah tenant yang dapat dibaca akun. Pada simulasi, sepuluh aktivitas terbaru ditampilkan berdasarkan waktu peristiwa dalam riwayat pengajuan.
- `/owner/profil` menampilkan profil akun yang sedang masuk.

## Menjalankan demo

Gunakan Node dan npm yang kompatibel dengan Vite pada proyek ini. Dari folder frontend, jalankan `npm ci`, salin `.env.example` menjadi `.env` jika belum ada, atur `VITE_USE_MOCK=true`, lalu jalankan `npm run dev`.

1. Daftarkan institusi dengan email admin baru di `/registrasi-institusi`. Simpan nomor pengajuan.
2. Masuk sebagai Owner menggunakan `owner@potensi.test` dan sandi demo `password`. Pilih **Tinjau Pengajuan** dan buka pengajuan tadi.
3. Setujui pengajuan, lalu keluar dari akun Owner. Cari nomor dan email tadi di `/status-registrasi`. Admin yang disetujui dapat login dengan email tersebut dan sandi demo `password`.
4. Gunakan pengajuan baru untuk mencoba penolakan. Isi alasan dan konfirmasi. Periksa bahwa status publik mencantumkan keputusan dan admin tersebut tidak dapat login.

Lakukan seluruh langkah pada browser dan origin yang sama. Mode mock menyimpan pengajuan di penyimpanan lokal browser dan menggunakan akun simulasi.

## Integrasi API

Mode API menggunakan `VITE_USE_MOCK=false` dan `VITE_API_URL` yang mengarah ke basis API Laravel. Autentikasi menggunakan `POST /login`, `GET /me`, dan `POST /logout`. Role backend `owner` diarahkan ke dashboard Owner. Daftar serta detail institusi menggunakan data `GET /tenants`. Monitoring memanggil `GET /ping`. Semua path relatif terhadap basis API.

Backend yang diperiksa belum menyediakan kontrak registrasi publik, pencarian status, atau keputusan Owner. Persetujuan dan pembatasan login admin baru sudah terhubung pada simulasi. Integrasi produksi memerlukan kontrak tersebut dan pemeriksaan status di server.

## Status terhadap alur bisnis

Alur utama mock sudah diperiksa untuk pengajuan menunggu, persetujuan, penolakan, dan akses login setelah keputusan. Verifikasi ini dilakukan pada service mock. Pengujian manual seluruh alur melalui browser masih perlu dilakukan.

Dialog review menampilkan nama, jabatan, email, dan telepon penanggung jawab jika tersedia. Uji kontrol status dengan menonaktifkan institusi yang baru disetujui, mencoba login kembali sebagai admin, lalu mengaktifkannya kembali. Integrasi produksi memerlukan operasi perubahan status dan sumber data riwayat aktivitas. Metrik penggunaan seperti sesi aktif dan penggunaan sumber daya memerlukan telemetri dari backend.

Verifikasi rilis Fase 4 mencakup build produksi, lint, serta uji service mock untuk identitas penanggung jawab, keputusan persetujuan dan penolakan, pencarian status, dan login admin sebelum serta sesudah perubahan status institusi.
