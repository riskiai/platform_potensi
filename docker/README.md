# Konfigurasi Docker (Platform Potensi)

File konfigurasi Docker terletak langsung di dalam folder `docker/`:

```text
docker/
├── docker-compose.dev.yml       # Mode Development (Live reload HMR)
├── docker-compose.prod.yml      # Mode Production (Optimized Nginx + Opcache)
└── README.md                    # Dokumentasi penggunaan Docker
```

> [!NOTE]
> Environment dimuat langsung dari masing-masing project:
> - **Backend**: [`../potensi_backend/.env`](file:///../potensi_backend/.env)
> - **Frontend**: [`../potensi_frontend/.env`](file:///../potensi_frontend/.env)

---

## 🛠️ Cara Menjalankan

### 1. Mode Development (`docker-compose.dev.yml`)
Jalankan dari root project `platform_potensi`:
```powershell
docker compose -f docker/docker-compose.dev.yml up -d --build
```
Atau jika sedang berada di dalam folder `docker/`:
```powershell
docker compose -f docker-compose.dev.yml up -d --build
```

**Akses Development:**
- **Frontend (Live Reload)**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000/api/ping](http://localhost:8000/api/ping)
- **MySQL Container**: Port `3307` pada host (mencegah bentrok dengan MySQL lokal di 3306)

Untuk menghentikan:
```powershell
docker compose -f docker/docker-compose.dev.yml down
```

---

### 2. Mode Production (`docker-compose.prod.yml`)
Jalankan dari root project `platform_potensi`:
```powershell
docker compose -f docker/docker-compose.prod.yml up -d --build
```
Atau jika sedang berada di dalam folder `docker/`:
```powershell
docker compose -f docker-compose.prod.yml up -d --build
```

**Akses Production:**
- **Web App & API**: [http://localhost](http://localhost) (Port 80 standar Nginx)
  - Frontend React: `http://localhost/`
  - Reverse Proxy API: `http://localhost/api/ping`

Untuk menghentikan:
```powershell
docker compose -f docker/docker-compose.prod.yml down
```
