# Dokumentasi REST API — Platform POTENSI

> **Status Dokumen:** Aktif & Tersinkronisasi dengan Kode Backend (`potensi_backend`)  
> **Versi Framework:** Laravel 11/12 (PHP 8.3) + Laravel Sanctum  
> **Terakhir Diperbarui:** 23 November 2026

Dokumen ini merupakan referensi resmi kontrak **REST API Backend POTENSI** yang sudah aktif di [`potensi_backend/routes/api.php`](../potensi_backend/routes/api.php). Setiap perubahan atau penambahan endpoint pada backend wajib diperbarui pada dokumen ini.

---

## 1. Konfigurasi Dasar (Base URL & Headers)

### Base URL
| Lingkungan (Environment) | Base URL | Keterangan |
|---|---|---|
| **Local / Docker Dev** | `http://localhost:8000/api` | Berjalan melalui `php artisan serve` / container `potensi_backend_dev` |
| **Docker Production** | `http://localhost/api` | Berjalan melalui Reverse Proxy Nginx (`potensi_frontend_prod` $\rightarrow$ `backend:8000`) |

### Standar Request Headers
Semua request ke API wajib menyertakan header berikut:
```http
Accept: application/json
Content-Type: application/json
```

Untuk endpoint yang dilindungi autentikasi (**Protected Routes / `auth:sanctum`**), tambahkan header:
```http
Authorization: Bearer <plainTextToken>
```

---

## 2. Akun Seeder Bawaan (Untuk Pengujian API)

Jalankan perintah berikut untuk memastikan tabel dan data awal tersedia di database:
```bash
php artisan migrate --seed
# Atau via Docker:
docker exec potensi_backend_dev php artisan migrate --seed
```

Daftar akun bawaan dari [`DatabaseSeeder.php`](../potensi_backend/database/seeders/DatabaseSeeder.php):

| Role (`roles.slug`) | Email | Password | Company / Tenant |
|---|---|---|---|
| `owner` | `bravomasun@gmail.com` | `password` | `null` (Global Platform Owner) |
| `admin` | `itsuntoro@gmail.com` | `password` | `KELOMPOK_05` (Internal) |
| `participant` | `participant.internal@if701.local` | `password` | `KELOMPOK_05` (Internal) |
| `participant` | `test@example.com` | `password` | `TENANT_B` (External) |

*(Akun dengan role `admin_external` dapat dibuat melalui endpoint `POST /api/tenants/{tenant}/admins`)*.

---

## 3. Ringkasan Endpoint Aktif & Matriks Hak Akses

### 3.1. Inventaris Route Aktif (Otomatis Tersinkronisasi via `php artisan docs:sync-api`)
<!-- AUTO-GENERATED-ROUTES:START -->
| No | Method | Endpoint URL | Autentikasi | Handler Controller |
|:---:|:---:|---|---|---|
| 1 | `GET` | `{BASE_URL}/ping` | Publik | `Closure (`routes/api.php`)` |
| 2 | `POST` | `{BASE_URL}/login` | Publik | `AuthController@login` |
| 3 | `GET` | `{BASE_URL}/questions` | Publik | `QuestionnaireController@index` |
| 4 | `POST` | `{BASE_URL}/logout` | Bearer (`auth:sanctum`) | `AuthController@logout` |
| 5 | `GET` | `{BASE_URL}/me` | Bearer (`auth:sanctum`) | `AuthController@me` |
| 6 | `GET` | `{BASE_URL}/user` | Bearer (`auth:sanctum`) | `Closure (`routes/api.php`)` |
| 7 | `POST` | `{BASE_URL}/assessments` | Bearer (`auth:sanctum`) | `AssessmentController@store` |
| 8 | `GET` | `{BASE_URL}/assessments/{assessment}` | Bearer (`auth:sanctum`) | `AssessmentController@show` |
| 9 | `GET` | `{BASE_URL}/tenants` | Bearer (`auth:sanctum`) | `TenantController@index` |
| 10 | `POST` | `{BASE_URL}/tenants` | Bearer (`auth:sanctum`) | `TenantController@store` |
| 11 | `PUT` | `{BASE_URL}/tenants/{tenant}` | Bearer (`auth:sanctum`) | `TenantController@update` |
| 12 | `POST` | `{BASE_URL}/tenants/{tenant}/admins` | Bearer (`auth:sanctum`) | `TenantController@storeAdmin` |
<!-- AUTO-GENERATED-ROUTES:END -->

### 3.2. Matriks Role & Deskripsi Endpoint
| No | Method | Endpoint URL | Auth | Role yang Diizinkan | Controller & Method | Deskripsi Singkat |
|:---:|:---:|---|:---:|---|---|---|
| 1 | `GET` | `{BASE_URL}/ping` | Publik | Semua | Closure (`routes/api.php`) | Cek status kesehatan server API & versi PHP |
| 2 | `POST` | `{BASE_URL}/login` | Publik | Semua | `AuthController@login` | Login pengguna & dapatkan Bearer Token Sanctum |
| 3 | `GET` | `{BASE_URL}/me` | Bearer | Semua Role | `AuthController@me` | Ambil profil ringkas user yang sedang login |
| 4 | `GET` | `{BASE_URL}/user` | Bearer | Semua Role | Closure (`routes/api.php`) | Ambil objek model `User` mentah yang sedang login |
| 5 | `POST` | `{BASE_URL}/logout` | Bearer | Semua Role | `AuthController@logout` | Logout & cabut (*revoke*) token akses saat ini |
| 6 | `GET` | `{BASE_URL}/questions` | Publik | Semua | `QuestionnaireController@index` | Ambil daftar 25 pertanyaan aktif kuesioner |
| 7 | `POST` | `{BASE_URL}/assessments` | Bearer | `participant` | `AssessmentController@store` | Kirim 25 jawaban kuesioner mahasiswa (skala 1–5) |
| 8 | `GET` | `{BASE_URL}/assessments/{id}` | Bearer | Pemilik Assessment | `AssessmentController@show` | Lihat detail assessment & 25 jawaban milik mahasiswa |
| 9 | `GET` | `{BASE_URL}/tenants` | Bearer | `owner`, `admin`, `admin_external` | `TenantController@index` | Lihat daftar tenant/institusi sesuai cakupan akses |
| 10 | `POST` | `{BASE_URL}/tenants` | Bearer | `owner`, `admin` | `TenantController@store` | Daftarkan tenant/institusi eksternal baru |
| 11 | `PUT` | `{BASE_URL}/tenants/{id}` | Bearer | `owner`, `admin` | `TenantController@update` | Ubah nama/nomor telepon tenant eksternal |
| 12 | `POST` | `{BASE_URL}/tenants/{id}/admins` | Bearer | `owner`, `admin` | `TenantController@storeAdmin` | Buat akun `admin_external` untuk tenant aktif |

---

## 4. Spesifikasi Detail Endpoint

---

### 4.1. Health Check (`GET /api/ping`)
Memeriksa konektivitas API backend dan versi runtime PHP.

- **URL:** `http://localhost:8000/api/ping`
- **Method:** `GET`
- **Autentikasi:** Tidak diperlukan (Publik)
- **Referensi Kode:** [`routes/api.php`](../potensi_backend/routes/api.php)

#### Contoh Request (cURL)
```bash
curl -X GET "http://localhost:8000/api/ping" \
  -H "Accept: application/json"
```

#### Contoh Response Sukses (`200 OK`)
```json
{
  "status": "success",
  "message": "Backend API potensi_backend is ready!",
  "php_version": "8.3.36"
}
```

---

### 4.2. Login Pengguna (`POST /api/login`)
Mengautentikasi email & password pengguna serta menerbitkan token Sanctum (`Bearer`).

- **URL:** `http://localhost:8000/api/login`
- **Method:** `POST`
- **Autentikasi:** Tidak diperlukan (Publik)
- **Referensi Kode:** [`AuthController.php`](../potensi_backend/app/Http/Controllers/AuthController.php)

#### Parameter Request Body
| Field | Tipe | Wajib | Aturan Validasi | Deskripsi |
|---|---|:---:|---|---|
| `email` | `string` | Ya | `required`, `email` | Email pengguna terdaftar |
| `password` | `string` | Ya | `required`, `string` | Kata sandi pengguna |

#### Contoh Request Body
```json
{
  "email": "bravomasun@gmail.com",
  "password": "password"
}
```

#### Contoh Response Sukses (`200 OK`)
```json
{
  "status": "success",
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": 1,
      "name": "IF701 KEL-05",
      "email": "bravomasun@gmail.com",
      "role": "owner",
      "company": null
    },
    "token": "1|aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcdef",
    "token_type": "Bearer"
  }
}
```

#### Contoh Response Error — Kredensial Salah (`401 Unauthorized`)
```json
{
  "status": "error",
  "message": "Email atau password tidak sesuai."
}
```

#### Contoh Response Error — Validasi Gagal (`422 Unprocessable Entity`)
```json
{
  "message": "The email field is required. (and 1 more error)",
  "errors": {
    "email": [
      "The email field is required."
    ],
    "password": [
      "The password field is required."
    ]
  }
}
```

---

### 4.3. Profil Pengguna Aktif (`GET /api/me`)
Mengambil profil pengguna yang sedang login beserta slug `role` dan nama `company`.

- **URL:** `http://localhost:8000/api/me`
- **Method:** `GET`
- **Autentikasi:** Wajib (`Bearer Token`)
- **Referensi Kode:** [`AuthController.php`](../potensi_backend/app/Http/Controllers/AuthController.php)

#### Contoh Request (cURL)
```bash
curl -X GET "http://localhost:8000/api/me" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 1|aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcdef"
```

#### Contoh Response Sukses (`200 OK`)
```json
{
  "status": "success",
  "data": {
    "id": 3,
    "name": "Participant Internal",
    "email": "participant.internal@if701.local",
    "role": "participant",
    "company": "KELOMPOK_05"
  }
}
```

#### Contoh Response Error — Belum Login / Token Tidak Valid (`401 Unauthorized`)
```json
{
  "message": "Unauthenticated."
}
```

---

### 4.4. Data Model User Mentah (`GET /api/user`)
Mengembalikan atribut langsung dari tabel `users` untuk pengguna yang sedang login.

- **URL:** `http://localhost:8000/api/user`
- **Method:** `GET`
- **Autentikasi:** Wajib (`Bearer Token`)
- **Referensi Kode:** [`routes/api.php`](../potensi_backend/routes/api.php)

#### Contoh Response Sukses (`200 OK`)
```json
{
  "id": 3,
  "name": "Participant Internal",
  "email": "participant.internal@if701.local",
  "email_verified_at": null,
  "created_at": "2026-11-18T03:00:00.000000Z",
  "updated_at": "2026-11-18T03:00:00.000000Z",
  "company_id": 2,
  "role_id": 4
}
```

---

### 4.5. Logout Pengguna (`POST /api/logout`)
Menghapus (*revoke*) token Sanctum yang sedang digunakan pada sesi saat ini.

- **URL:** `http://localhost:8000/api/logout`
- **Method:** `POST`
- **Autentikasi:** Wajib (`Bearer Token`)
- **Referensi Kode:** [`AuthController.php`](../potensi_backend/app/Http/Controllers/AuthController.php)

#### Contoh Request (cURL)
```bash
curl -X POST "http://localhost:8000/api/logout" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 1|aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcdef"
```

#### Contoh Response Sukses (`200 OK`)
```json
{
  "status": "success",
  "message": "Logout berhasil."
}
```

---

### 4.6. Ambil Daftar Pertanyaan Kuesioner (`GET /api/questions`)
Mengambil seluruh (25 butir) pertanyaan kuesioner yang berstatus aktif (`is_active = true`) diurutkan berdasarkan `sort_order`.

- **URL:** `http://localhost:8000/api/questions`
- **Method:** `GET`
- **Autentikasi:** Tidak diperlukan (Publik)
- **Referensi Kode:** [`QuestionnaireController.php`](../potensi_backend/app/Http/Controllers/QuestionnaireController.php)

#### Contoh Request (cURL)
```bash
curl -X GET "http://localhost:8000/api/questions" \
  -H "Accept: application/json"
```

#### Contoh Response Sukses (`200 OK`)
```json
{
  "status": "success",
  "message": "Data pertanyaan berhasil diambil.",
  "data": {
    "total": 25,
    "questions": [
      {
        "id": 1,
        "code": "NS1",
        "specialization": "network_specialist",
        "category": "interest",
        "question": "Saya tertarik mempelajari jaringan komputer.",
        "description": "Ketertarikan pada konsep dan teknologi jaringan komputer.",
        "sort_order": 1
      },
      {
        "id": 11,
        "code": "DS1",
        "specialization": "data_science",
        "category": "interest",
        "question": "Saya tertarik menganalisis data.",
        "description": "Ketertarikan pada kegiatan analisis data.",
        "sort_order": 11
      },
      {
        "id": 21,
        "code": "U1",
        "specialization": "general",
        "category": "general",
        "question": "Saya tertarik menggunakan pemikiran logis untuk menyelesaikan masalah.",
        "description": "Ketertarikan pada pemikiran logis.",
        "sort_order": 21
      }
    ]
  }
}
```

---

### 4.7. Submit Jawaban Assessment (`POST /api/assessments`)
Menyimpan sesi pengerjaan assessment beserta **25 jawaban skala Likert (1–5)** dari mahasiswa dalam satu transaksi database.

- **URL:** `http://localhost:8000/api/assessments`
- **Method:** `POST`
- **Autentikasi:** Wajib (`Bearer Token`)
- **Hak Akses Role:** Khusus **`participant`** (mahasiswa yang terikat `company_id`)
- **Referensi Kode:** [`AssessmentController.php`](../potensi_backend/app/Http/Controllers/AssessmentController.php)

#### Parameter Request Body
| Field | Tipe | Wajib | Aturan Validasi | Deskripsi |
|---|---|:---:|---|---|
| `answers` | `array` | Ya | `required`, `array`, `size:25` | Array berisi tepat **25 objek jawaban** |
| `answers.*.question_id` | `integer` | Ya | `required`, `integer`, `distinct`, `exists:questions_default,id` | ID pertanyaan aktif (tidak boleh duplikat) |
| `answers.*.answer` | `integer` | Ya | `required`, `integer`, `between:1,5` | Nilai skala Likert `1` s/d `5` |

#### Contoh Request Body
```json
{
  "answers": [
    { "question_id": 1, "answer": 2 },
    { "question_id": 2, "answer": 2 },
    { "question_id": 3, "answer": 3 },
    { "question_id": 4, "answer": 2 },
    { "question_id": 5, "answer": 3 },
    { "question_id": 6, "answer": 2 },
    { "question_id": 7, "answer": 2 },
    { "question_id": 8, "answer": 2 },
    { "question_id": 9, "answer": 2 },
    { "question_id": 10, "answer": 3 },
    { "question_id": 11, "answer": 5 },
    { "question_id": 12, "answer": 5 },
    { "question_id": 13, "answer": 5 },
    { "question_id": 14, "answer": 4 },
    { "question_id": 15, "answer": 5 },
    { "question_id": 16, "answer": 4 },
    { "question_id": 17, "answer": 5 },
    { "question_id": 18, "answer": 4 },
    { "question_id": 19, "answer": 5 },
    { "question_id": 20, "answer": 5 },
    { "question_id": 21, "answer": 4 },
    { "question_id": 22, "answer": 4 },
    { "question_id": 23, "answer": 5 },
    { "question_id": 24, "answer": 4 },
    { "question_id": 25, "answer": 4 }
  ]
}
```

#### Contoh Response Sukses (`201 Created`)
```json
{
  "status": "success",
  "message": "Assessment berhasil disimpan.",
  "data": {
    "assessment_id": 1,
    "status": "completed",
    "total_answers": 25,
    "completed_at": "2026-11-23T10:15:30.000000Z"
  }
}
```

#### Contoh Response Error — Bukan Role Participant (`403 Forbidden`)
```json
{
  "status": "error",
  "message": "Hanya mahasiswa yang dapat mengirim assessment."
}
```

#### Contoh Response Error — Jawaban Kurang dari 25 / Nilai di Luar 1–5 (`422 Unprocessable Entity`)
```json
{
  "status": "error",
  "message": "Data jawaban tidak valid.",
  "errors": {
    "answers": [
      "The answers field must contain 25 items."
    ]
  }
}
```

---

### 4.8. Lihat Detail Assessment Mahasiswa (`GET /api/assessments/{assessment}`)
Mengambil detail hasil pengerjaan assessment beserta rincian 25 pertanyaan dan jawaban milik mahasiswa yang sedang login.

- **URL:** `http://localhost:8000/api/assessments/{assessment_id}`
- **Method:** `GET`
- **Autentikasi:** Wajib (`Bearer Token`)
- **Hak Akses:** Hanya pengguna pemilik assessment tersebut (`user_id` cocok dengan user login)
- **Referensi Kode:** [`AssessmentController.php`](../potensi_backend/app/Http/Controllers/AssessmentController.php)

#### Contoh Request (cURL)
```bash
curl -X GET "http://localhost:8000/api/assessments/1" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <token_participant>"
```

#### Contoh Response Sukses (`200 OK`)
```json
{
  "status": "success",
  "message": "Detail assessment berhasil diambil.",
  "data": {
    "assessment_id": 1,
    "status": "completed",
    "started_at": "2026-11-23T10:15:30.000000Z",
    "completed_at": "2026-11-23T10:15:30.000000Z",
    "total_answers": 25,
    "answers": [
      {
        "question_id": 1,
        "code": "NS1",
        "specialization": "network_specialist",
        "category": "interest",
        "question": "Saya tertarik mempelajari jaringan komputer.",
        "answer": 2
      },
      {
        "question_id": 11,
        "code": "DS1",
        "specialization": "data_science",
        "category": "interest",
        "question": "Saya tertarik menganalisis data.",
        "answer": 5
      }
    ]
  }
}
```

#### Contoh Response Error — Assessment Milik User Lain / Tidak Ditemukan (`404 Not Found`)
```json
{
  "message": "No query results for model [App\\Models\\Assessment] 99"
}
```

---

### 4.9. Ambil Daftar Tenant / Institusi (`GET /api/tenants`)
Menampilkan daftar tenant/institusi berdasarkan hak akses pengguna:
- Role `owner` dan `admin` (Internal): Melihat **seluruh tenant**.
- Role `admin_external`: Hanya melihat **1 tenant miliknya sendiri** (`company_id`).
- Role `participant`: Ditolak (`403 Forbidden`).

- **URL:** `http://localhost:8000/api/tenants`
- **Method:** `GET`
- **Autentikasi:** Wajib (`Bearer Token`)
- **Hak Akses Role:** `owner`, `admin`, `admin_external`
- **Referensi Kode:** [`TenantController.php`](../potensi_backend/app/Http/Controllers/TenantController.php)

#### Contoh Request (cURL)
```bash
curl -X GET "http://localhost:8000/api/tenants" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <token_owner_atau_admin>"
```

#### Contoh Response Sukses (`200 OK`)
```json
{
  "status": "success",
  "message": "Daftar tenant berhasil diambil.",
  "data": {
    "total": 4,
    "tenants": [
      {
        "id": 2,
        "name": "KELOMPOK_05",
        "phone": null,
        "type": "internal",
        "status": "active",
        "created_at": "2026-11-18T03:00:00.000000Z"
      },
      {
        "id": 3,
        "name": "TENANT_A",
        "phone": "081234567890",
        "type": "external",
        "status": "active",
        "created_at": "2026-11-18T03:00:00.000000Z"
      },
      {
        "id": 1,
        "name": "TENANT_B",
        "phone": null,
        "type": "external",
        "status": "active",
        "created_at": "2026-11-18T03:00:00.000000Z"
      },
      {
        "id": 4,
        "name": "UGM",
        "phone": "081234567890",
        "type": "external",
        "status": "active",
        "created_at": "2026-11-18T03:00:00.000000Z"
      }
    ]
  }
}
```

#### Contoh Response Error — Role Participant (`403 Forbidden`)
```json
{
  "status": "error",
  "message": "Anda tidak memiliki akses untuk melihat daftar tenant."
}
```

---

### 4.10. Daftarkan Tenant Baru (`POST /api/tenants`)
Membuat tenant baru dengan tipe otomatis `external` dan status `active`.

- **URL:** `http://localhost:8000/api/tenants`
- **Method:** `POST`
- **Autentikasi:** Wajib (`Bearer Token`)
- **Hak Akses Role:** Khusus `owner` dan `admin` (Internal)
- **Referensi Kode:** [`TenantController.php`](../potensi_backend/app/Http/Controllers/TenantController.php)

#### Parameter Request Body
| Field | Tipe | Wajib | Aturan Validasi | Deskripsi |
|---|---|:---:|---|---|
| `name` | `string` | Ya | `required`, `string`, `max:255` | Nama institusi / kampus |
| `phone` | `string \| null` | Tidak | `nullable`, `string`, `max:30` | Nomor telepon institusi |

#### Contoh Request Body
```json
{
  "name": "Universitas Siber Asia (UNSIA)",
  "phone": "021-12345678"
}
```

#### Contoh Response Sukses (`201 Created`)
```json
{
  "status": "success",
  "message": "Tenant berhasil didaftarkan.",
  "data": {
    "id": 5,
    "name": "Universitas Siber Asia (UNSIA)",
    "phone": "021-12345678",
    "type": "external",
    "status": "active",
    "created_at": "2026-11-23T10:20:00.000000Z"
  }
}
```

#### Contoh Response Error — Bukan Owner / Admin Internal (`403 Forbidden`)
```json
{
  "status": "error",
  "message": "Hanya Owner dan Admin Internal yang dapat mendaftarkan tenant."
}
```

---

### 4.11. Perbarui Informasi Tenant (`PUT /api/tenants/{tenant}`)
Mengubah nama atau nomor telepon dari tenant yang bertipe `external`.

- **URL:** `http://localhost:8000/api/tenants/{tenant_id}`
- **Method:** `PUT`
- **Autentikasi:** Wajib (`Bearer Token`)
- **Hak Akses Role:** Khusus `owner` dan `admin` (Internal)
- **Referensi Kode:** [`TenantController.php`](../potensi_backend/app/Http/Controllers/TenantController.php)

#### Parameter Request Body
| Field | Tipe | Wajib | Aturan Validasi | Deskripsi |
|---|---|:---:|---|---|
| `name` | `string` | Opsional | `sometimes`, `required`, `string`, `max:255` | Nama baru institusi |
| `phone` | `string \| null` | Opsional | `sometimes`, `nullable`, `string`, `max:30` | Nomor telepon baru institusi |

#### Contoh Request Body
```json
{
  "name": "Universitas Siber Asia",
  "phone": "021-87654321"
}
```

#### Contoh Response Sukses (`200 OK`)
```json
{
  "status": "success",
  "message": "Data tenant berhasil diperbarui.",
  "data": {
    "id": 5,
    "name": "Universitas Siber Asia",
    "phone": "021-87654321",
    "type": "external",
    "status": "active"
  }
}
```

#### Contoh Response Error — Mencoba Mengubah Tenant Internal (`422 Unprocessable Entity`)
```json
{
  "status": "error",
  "message": "Hanya tenant eksternal yang dapat diubah."
}
```

---

### 4.12. Buat Akun Admin External untuk Tenant (`POST /api/tenants/{tenant}/admins`)
Membuat akun pengguna baru dengan role `admin_external` yang terhubung ke `company_id` tenant tertentu. Tenant wajib bertipe `external` dan berstatus `active`.

- **URL:** `http://localhost:8000/api/tenants/{tenant_id}/admins`
- **Method:** `POST`
- **Autentikasi:** Wajib (`Bearer Token`)
- **Hak Akses Role:** Khusus `owner` dan `admin` (Internal)
- **Referensi Kode:** [`TenantController.php`](../potensi_backend/app/Http/Controllers/TenantController.php)

#### Parameter Request Body
| Field | Tipe | Wajib | Aturan Validasi | Deskripsi |
|---|---|:---:|---|---|
| `name` | `string` | Ya | `required`, `string`, `max:255` | Nama lengkap admin institusi |
| `email` | `string` | Ya | `required`, `email`, `max:255`, `unique:users,email` | Email login (harus unik) |
| `password` | `string` | Ya | `required`, `string`, `min:8` | Kata sandi minimal 8 karakter |

#### Contoh Request Body
```json
{
  "name": "Admin Akademik UNSIA",
  "email": "admin@unsia.ac.id",
  "password": "password123"
}
```

#### Contoh Response Sukses (`201 Created`)
```json
{
  "status": "success",
  "message": "Admin External berhasil dibuat.",
  "data": {
    "id": 5,
    "name": "Admin Akademik UNSIA",
    "email": "admin@unsia.ac.id",
    "role": "admin_external",
    "company_id": 5,
    "tenant": "Universitas Siber Asia"
  }
}
```

#### Contoh Response Error — Email Sudah Terdaftar (`422 Unprocessable Entity`)
```json
{
  "status": "error",
  "message": "Data Admin External tidak valid.",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  }
}
```

---

## 5. Pemetaan Integrasi Frontend (`potensi_frontend`) ke Backend (`potensi_backend`)

Pada Frontend Phase 4 ([`src/services/auth.service.ts`](../potensi_frontend/src/services/auth.service.ts) dan [`src/services/owner.service.ts`](../potensi_frontend/src/services/owner.service.ts)), adapter HTTP sudah terhubung dengan endpoint di atas ketika `VITE_USE_MOCK=false`:

| Service Frontend | Memanggil Endpoint Backend | Status Sinkronisasi |
|---|---|---|
| `authService.login()` | `POST /api/login` | ✅ Sinkron (`identifier` dipetakan ke `email`, `role` dipetakan ke role FE) |
| `authService.me()` | `GET /api/me` | ✅ Sinkron (`company` dipetakan ke `institutionName`) |
| `authService.logout()` | `POST /api/logout` | ✅ Sinkron |
| `ownerService.getHealth()` | `GET /api/ping` | ✅ Sinkron |
| `ownerService.listTenants()` | `GET /api/tenants` | ✅ Sinkron |
| `ownerService.createTenant()` | `POST /api/tenants` | ✅ Sinkron |
| `ownerService.updateTenant()` | `PUT /api/tenants/{id}` | ✅ Sinkron |
| `ownerService.createTenantAdmin()` | `POST /api/tenants/{id}/admins` | ✅ Sinkron |
| `ownerService.listRequests()` | *(Belum ada di Backend)* | ⏳ Menunggu implementasi endpoint pengajuan registrasi di Backend |
| `ownerService.reviewRequest()` | *(Belum ada di Backend)* | ⏳ Menunggu implementasi endpoint approval registrasi di Backend |

---

## 6. Panduan Pemeliharaan Dokumentasi API

Setiap kali menambahkan atau mengubah route di [`potensi_backend/routes/api.php`](../potensi_backend/routes/api.php):
1. Jalankan `php artisan route:list --path=api` untuk memverifikasi daftar route aktif.
2. Tambahkan/perbarui entri pada **Tabel Ringkasan (Bagian 3)** dan **Spesifikasi Detail (Bagian 4)** di dokumen ini.
3. Pastikan contoh payload `Request` dan `Response` sesuai dengan `Validator` dan `response()->json(...)` pada Controller terkait.
