# Platform Potensi

Repositori utama proyek **Platform Potensi** untuk Tugas Kelompok mata kuliah *Perancangan dan Pengembangan Teknologi Informasi dan Komunikasi (PPPTIK)* - Universitas Siber Asia (UNSIA).

---

## 📁 Struktur Folder Proyek

```text
platform_potensi/
├── potensi_backend/             # Backend REST API (Laravel 11/12 + PHP 8.3)
│   ├── app/
│   ├── routes/
│   ├── .env                     # Environment utama backend
│   └── Dockerfile.dev & Dockerfile
│
├── potensi_frontend/            # Frontend Client SPA (React.js + Vite)
│   ├── src/
│   ├── .env                     # Environment utama frontend
│   └── Dockerfile.dev & Dockerfile
│
├── docker/                      # Pembungkus konfigurasi Docker
│   ├── docker-compose.dev.yml   # Mode Development (Live reload HMR)
│   ├── docker-compose.prod.yml  # Mode Production (Optimized Nginx + Opcache)
│   └── README.md                # Panduan penggunaan Docker
│
└── docs_platform_potensi/       # Dokumentasi proyek (Proposal, analisis, perancangan, API spec)
```

---

## ⚡ Cara Menjalankan

### 1. Menjalankan secara Lokal (Tanpa Docker)
- **Backend**:
  ```powershell
  cd potensi_backend
  php artisan serve
  ```
  *(Berjalan di http://127.0.0.1:8000)*

- **Frontend**:
  ```powershell
  cd potensi_frontend
  npm run dev
  ```
  *(Berjalan di http://localhost:5173)*

### 2. Menjalankan via Docker
Environment dimuat otomatis dari file `.env` masing-masing platform (`potensi_backend/.env` dan `potensi_frontend/.env`).

- **Mode Development**:
  ```powershell
  docker compose -f docker/docker-compose.dev.yml up -d --build
  ```
- **Mode Production**:
  ```powershell
  docker compose -f docker/docker-compose.prod.yml up -d --build
  ```
