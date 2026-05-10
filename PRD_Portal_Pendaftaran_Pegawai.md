# PRD — Portal Pendaftaran Pegawai

### Employee Registration Portal

| Atribut         | Detail                           |
| --------------- | -------------------------------- |
| **Versi**       | v1.0.0                           |
| **Status**      | Draft — Review Internal          |
| **Tanggal**     | 10 Mei 2026                      |
| **Klasifikasi** | Internal / Confidential          |
| **Tim**         | Engineering & Cloud Architecture |

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Latar Belakang & Pernyataan Masalah](#2-latar-belakang--pernyataan-masalah)
3. [Tujuan & Sasaran](#3-tujuan--sasaran)
4. [Ruang Lingkup](#4-ruang-lingkup)
5. [Pemangku Kepentingan](#5-pemangku-kepentingan)
6. [Spesifikasi Tech Stack](#6-spesifikasi-tech-stack)
7. [Arsitektur Sistem](#7-arsitektur-sistem)
8. [Kebutuhan Fungsional](#8-kebutuhan-fungsional)
9. [Kebutuhan Non-Fungsional](#9-kebutuhan-non-fungsional)
10. [Spesifikasi Teknis Detail](#10-spesifikasi-teknis-detail)
11. [Panduan Konfigurasi Azure Portal](#11-panduan-konfigurasi-azure-portal)
12. [User Stories & Acceptance Criteria](#12-user-stories--acceptance-criteria)
13. [Analisis Risiko & Mitigasi](#13-analisis-risiko--mitigasi)
14. [Rencana Implementasi & Milestone](#14-rencana-implementasi--milestone)
15. [Definition of Done](#15-definition-of-done)
16. [Glosarium](#16-glosarium)
17. [Riwayat Revisi Dokumen](#17-riwayat-revisi-dokumen)

---

## 1. Ringkasan Eksekutif

**Portal Pendaftaran Pegawai** adalah aplikasi web modern berbasis Next.js 14+ yang dibangun di atas ekosistem Microsoft Azure. Aplikasi ini dirancang untuk mendigitalisasi dan mengotomatisasi proses pendaftaran kandidat pegawai baru, menggantikan proses manual berbasis formulir kertas atau spreadsheet yang rentan terhadap kesalahan dan tidak efisien.

Solusi ini mengadopsi arsitektur **stateless** yang cocok untuk deployment di Azure Container Apps, memungkinkan skalabilitas horizontal otomatis sesuai beban kerja. Seluruh aset digital kandidat (foto/dokumen) disimpan di **Azure Blob Storage**, sementara data struktural dikelola oleh **Azure Database for PostgreSQL** melalui **Prisma ORM** — memastikan konsistensi data, integritas referensial, dan kemudahan migrasi skema.

> 💡 **Pernyataan Nilai Utama**
>
> _"Membangun sistem pendaftaran pegawai yang aman, cepat, dan scalable — mengintegrasikan kekuatan Next.js App Router dengan layanan cloud Azure kelas enterprise, sehingga tim HR dapat memfokuskan energi pada seleksi bakat, bukan administrasi data."_

---

## 2. Latar Belakang & Pernyataan Masalah

### 2.1 Konteks Bisnis

Proses rekrutmen dan pendaftaran pegawai baru di banyak organisasi masih berjalan secara manual: kandidat mengisi formulir fisik, mengirimkan dokumen via email, dan data disalin ulang secara manual ke dalam sistem internal. Proses ini menghadapi berbagai tantangan operasional yang signifikan.

### 2.2 Masalah yang Diidentifikasi

| #   | Masalah                                            | Dampak                                  | Prioritas  |
| --- | -------------------------------------------------- | --------------------------------------- | ---------- |
| 1   | Proses pendaftaran manual via kertas/email         | Lambat, rawan kesalahan entri data      | **KRITIS** |
| 2   | Tidak ada validasi real-time input kandidat        | Data tidak konsisten, duplikasi rekaman | **TINGGI** |
| 3   | File foto/dokumen tersebar di email/lokal          | Sulit diakses, keamanan rendah          | **TINGGI** |
| 4   | Infrastruktur tidak scalable saat rekrutmen massal | Sistem lambat, pengguna frustrasi       | **SEDANG** |
| 5   | Kredensial database di-hardcode dalam kode         | Risiko keamanan dan kepatuhan           | **KRITIS** |

### 2.3 Sasaran Solusi

- Menyediakan antarmuka pendaftaran yang intuitif dengan validasi real-time
- Menyimpan file digital secara aman dan terstruktur di cloud storage
- Memastikan ketersediaan tinggi (high availability) dan skalabilitas otomatis
- Menerapkan praktik keamanan terbaik: zero hardcoded credentials, HTTPS only, input sanitization
- Memberikan pondasi arsitektur yang dapat dikembangkan (extensible) untuk fitur rekrutmen lanjutan

---

## 3. Tujuan & Sasaran

### 3.1 Tujuan Bisnis

- Mengurangi waktu proses pendaftaran kandidat dari rata-rata 2 hari menjadi < 10 menit
- Menghilangkan kesalahan entri data manual sebesar 100% melalui validasi otomatis
- Memusatkan semua data kandidat dalam satu sumber kebenaran (single source of truth)
- Memungkinkan tim HR mengakses data kandidat kapan saja dan dari mana saja

### 3.2 Tujuan Teknis

- Membangun aplikasi stateless yang dapat di-deploy sebagai container di Azure Container Apps
- Implementasi Repository/Service pattern untuk pemisahan concern yang jelas
- Zero hardcoded credentials: semua konfigurasi sensitif via Environment Variables
- Waktu respons API < 2 detik untuk operasi normal (upload file < 5 detik)
- Cakupan validasi form 100% pada sisi client dan server

### 3.3 Key Performance Indicators (KPI)

| Metrik               | Deskripsi                        | Target     | Baseline |
| -------------------- | -------------------------------- | ---------- | -------- |
| Waktu Pendaftaran    | Durasi proses form submission    | < 10 menit | ~2 hari  |
| Uptime Sistem        | Ketersediaan layanan per bulan   | 99.9%      | N/A      |
| Waktu Respons API    | P95 latency pada kondisi normal  | < 2 detik  | N/A      |
| Error Rate Upload    | Kegagalan upload file ke Blob    | < 0.1%     | N/A      |
| Validasi Form Client | Persentase field yang divalidasi | 100%       | 0%       |

---

## 4. Ruang Lingkup

### 4.1 Dalam Ruang Lingkup (In-Scope)

- Formulir pendaftaran kandidat dengan validasi (Nama Lengkap, Email, Upload Foto)
- Upload dan penyimpanan file foto kandidat ke Azure Blob Storage dengan nama unik (UUID)
- Penyimpanan data kandidat ke PostgreSQL/MySQL via Prisma ORM
- Server Actions Next.js untuk pemrosesan backend
- Feedback visual (loading state, success, error) pada antarmuka pengguna
- Template konfigurasi environment variables (`.env.example`)
- Skema database Prisma untuk entitas `Candidate`
- Panduan konfigurasi Azure Portal untuk environment variables
- Deployment sebagai container di Azure Container Apps

### 4.2 Di Luar Ruang Lingkup (Out-of-Scope) — Fase 1

- Sistem autentikasi dan otorisasi pengguna (admin login)
- Dashboard manajemen kandidat (CRUD penuh)
- Notifikasi email otomatis ke kandidat
- Integrasi dengan sistem HR eksternal (SAP, Workday, dll.)
- Multi-tenant / multi-perusahaan
- Fitur pencarian dan filter kandidat
- Export data ke Excel/PDF

---

## 5. Pemangku Kepentingan

| Peran                 | Nama/Tim              | Tanggung Jawab                                   | Keterlibatan  |
| --------------------- | --------------------- | ------------------------------------------------ | ------------- |
| Product Owner         | Tim HR / Rekrutmen    | Menentukan kebutuhan bisnis dan validasi fitur   | Tinggi        |
| Tech Lead / Architect | Senior Full-stack Dev | Desain arsitektur, review kode, keputusan teknis | Sangat Tinggi |
| Frontend Developer    | Dev Team              | Implementasi UI/UX, integrasi Server Actions     | Tinggi        |
| Cloud Engineer        | DevOps Team           | Konfigurasi Azure services, CI/CD pipeline       | Tinggi        |
| End User (Kandidat)   | Pelamar/Kandidat      | Mengisi dan submit formulir pendaftaran          | Rendah        |
| Security Officer      | InfoSec Team          | Review keamanan, audit kredensial                | Sedang        |

---

## 6. Spesifikasi Tech Stack

| Layer      | Teknologi               | Versi           | Justifikasi                                                               |
| ---------- | ----------------------- | --------------- | ------------------------------------------------------------------------- |
| Framework  | Next.js (App Router)    | 14+             | SSR/SSG, Server Actions, built-in routing, optimal untuk SEO dan performa |
| Language   | TypeScript              | 5.x             | Type safety, IDE support superior, mengurangi bug runtime                 |
| Styling    | Tailwind CSS            | 3.x             | Utility-first, konsisten di seluruh komponen, tree-shaking otomatis       |
| ORM        | Prisma ORM              | 5.x             | Type-safe queries, migrasi otomatis, mendukung PostgreSQL & MySQL         |
| Database   | Azure DB for PostgreSQL | Flexible Server | Fully managed, auto-backup, enkripsi at-rest, SLA 99.99%                  |
| Storage    | Azure Blob Storage      | SDK v12+        | Scalable, geo-redundant, CDN integration, biaya efisien                   |
| Deployment | Azure Container Apps    | Latest          | Serverless container management, auto-scaling, stateless-ready            |
| Validation | Zod / React Hook Form   | 3.x / 7.x       | Schema-based validation, integrasi baik dengan TypeScript                 |

---

## 7. Arsitektur Sistem

### 7.1 Gambaran Arsitektur High-Level

```
┌──────────────────────────────────────────────┐
│         PRESENTATION LAYER (Client Side)     │
│  RegistrationForm.tsx (React Client Component│
│  - Validasi real-time (Zod + React Hook Form)│
│  - Loading state & feedback visual           │
└──────────────────────┬───────────────────────┘
                       │ Server Action Call
                       ▼
┌──────────────────────────────────────────────┐
│         APPLICATION LAYER (Server Actions)   │
│  actions/registration.ts                     │
│  - Orkestrasi: upload file → simpan database │
│  - Error handling & validasi server-side     │
└─────────────────────┬────────────────────────┘
                      │ Panggil Service Layer
                      ▼
┌──────────────────────────────────────────────┐
│         SERVICE LAYER (Business Logic)       │
│  services/blobStorageService.ts              │
│  services/candidateService.ts                │
└────────────┬─────────────────────────────────┘
             │ Repository                │
             ▼                           ▼
┌────────────────────┐    ┌──────────────────────┐
│   Azure Blob       │    │  PostgreSQL (Prisma)  │
│   Storage          │    │  repositories/        │
└────────────────────┘    └──────────────────────┘
```

### 7.2 Struktur Folder Proyek

```
portal-pendaftaran/
├── app/
│   ├── (registration)/page.tsx      # Halaman utama form
│   ├── actions/                     # Server Actions
│   │   └── registration.ts
│   └── layout.tsx
├── components/
│   └── RegistrationForm.tsx         # Client Component
├── lib/
│   ├── prisma.ts                    # Prisma Client singleton
│   └── azureBlobClient.ts           # Azure Blob client factory
├── repositories/
│   └── candidateRepository.ts       # Data access layer
├── services/
│   ├── blobStorageService.ts        # Upload logic ke Azure
│   └── candidateService.ts          # Business logic kandidat
├── prisma/
│   └── schema.prisma                # Skema database
├── .env.example                     # Template env variables
└── Dockerfile                       # Container image definition
```

---

## 8. Kebutuhan Fungsional

### FR-01 — Form Pendaftaran Kandidat

| Atribut       | Detail                                                                                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**        | FR-01                                                                                                                                                                                           |
| **Judul**     | Form Pendaftaran dengan Validasi Real-Time                                                                                                                                                      |
| **Aktor**     | Kandidat (pengguna akhir)                                                                                                                                                                       |
| **Deskripsi** | Sistem menyediakan formulir web interaktif dengan tiga field wajib: Nama Lengkap, Alamat Email, dan Upload Foto Profil. Validasi dilakukan di sisi client (real-time) dan server (saat submit). |
| **Prioritas** | MUST HAVE                                                                                                                                                                                       |

#### Aturan Validasi Field

| Field        | Tipe        | Aturan                                                                    | Pesan Error                                              |
| ------------ | ----------- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| Nama Lengkap | Text input  | Wajib, min 2 karakter, maks 100 karakter, hanya huruf dan spasi           | "Nama lengkap wajib diisi (2–100 karakter, hanya huruf)" |
| Email        | Email input | Wajib, format email valid (RFC 5322), maks 255 karakter, unik di database | "Email tidak valid" / "Email sudah terdaftar"            |
| Foto Profil  | File input  | Wajib, tipe: JPG/PNG/WebP, ukuran maks 5MB, dimensi maks 4000×4000px      | "Hanya file gambar (JPG/PNG/WebP, maks 5MB)"             |

---

### FR-02 — Upload File ke Azure Blob Storage

- Sistem membaca file dari form submission sebagai buffer/stream
- Sistem menghasilkan nama file unik menggunakan UUID v4 + ekstensi asli (contoh: `550e8400-e29b-41d4-a716-446655440000.jpg`)
- Upload dilakukan ke container Azure Blob Storage yang dikonfigurasi via environment variable
- Sistem mengembalikan URL publik file yang berhasil di-upload
- Jika upload gagal, sistem melempar exception dan **tidak** melanjutkan ke penyimpanan database

---

### FR-03 — Penyimpanan Data Kandidat

- Setelah upload berhasil, sistem menyimpan record baru ke tabel `candidates` di database
- Data yang disimpan: `full_name`, `email`, `photo_url` (URL dari Blob Storage), `created_at` (auto-generated)
- Jika penyimpanan database gagal, sistem mencatat error dan menginformasikan pengguna
- Duplikasi email (unique constraint) menghasilkan pesan error yang informatif ke pengguna

---

### FR-04 — Feedback Visual & Loading State

- Tombol submit menampilkan spinner/loading indicator saat proses sedang berjalan
- Tombol submit di-disable saat loading untuk mencegah double-submission
- Pesan sukses ditampilkan dengan informasi konfirmasi setelah pendaftaran berhasil
- Pesan error ditampilkan secara spesifik: error validasi per-field, error upload, error database
- Progress bar opsional untuk feedback upload file besar

---

## 9. Kebutuhan Non-Fungsional

### 9.1 Performa

| Metrik            | Deskripsi                                     | Target          |
| ----------------- | --------------------------------------------- | --------------- |
| Page Load Time    | Waktu muat halaman form pertama kali (FCP)    | < 1.5 detik     |
| API Latency (P95) | Waktu respons submission form normal          | < 2 detik       |
| Upload Time       | Waktu upload file 5MB ke Azure Blob           | < 5 detik       |
| Concurrent Users  | Jumlah pengguna bersamaan yang dapat dilayani | 100+ concurrent |
| Core Web Vitals   | LCP, FID, CLS score (Google PageSpeed)        | Score > 90      |

### 9.2 Keamanan

- Semua kredensial dan konfigurasi sensitif disimpan sebagai **Environment Variables** — TIDAK ada hardcoded credentials
- HTTPS wajib untuk semua komunikasi (dikelola Azure Container Apps)
- Input sanitization dan validasi pada sisi server untuk mencegah injection attacks
- File upload divalidasi berdasarkan **MIME type** dan ukuran — tidak hanya ekstensi
- Connection string database menggunakan SSL/TLS (`sslmode=require`)
- Prisma ORM menggunakan parameterized queries secara default — mencegah SQL Injection
- Azure Blob Container menggunakan **private access** — URL publik hanya dihasilkan melalui aplikasi
- Implementasi Content Security Policy (CSP) headers pada Next.js

### 9.3 Skalabilitas & Ketersediaan

- Arsitektur **stateless**: tidak ada sesi atau data sementara yang disimpan di server/memory lokal
- Azure Container Apps mendukung auto-scaling berdasarkan jumlah request (scale to zero support)
- Database menggunakan Azure PostgreSQL Flexible Server dengan connection pooling (PgBouncer)
- Azure Blob Storage bersifat globally distributed dengan redundansi geo (GRS/ZRS)
- Target uptime: **99.9%** (maksimal 8.76 jam downtime per tahun)

### 9.4 Pemeliharaan & Observabilitas

- Logging terstruktur (JSON format) untuk semua Server Actions dan service calls
- Error tracking terintegrasi dengan Azure Application Insights (opsional fase 1)
- Skema database dikelola melalui Prisma Migrations — versioned dan reversible
- Dockerfile multi-stage build untuk image yang lebih kecil dan aman

---

## 10. Spesifikasi Teknis Detail

### 10.1 Skema Database (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Candidate {
  id        String   @id @default(cuid())
  fullName  String   @db.VarChar(100)
  email     String   @unique @db.VarChar(255)
  photoUrl  String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("candidates")
}
```

### 10.2 Environment Variables (`.env.example`)

```env
# ================================================
# Portal Pendaftaran Pegawai — Environment Template
# Salin file ini ke .env.local dan isi nilainya
# JANGAN commit file .env.local ke version control!
# ================================================

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net"
AZURE_STORAGE_CONTAINER_NAME="candidate-photos"

# Database (Azure PostgreSQL Flexible Server)
DATABASE_URL="postgresql://username:password@hostname:5432/dbname?sslmode=require"

# Aplikasi
NEXT_PUBLIC_APP_URL="https://your-app.azurecontainerapps.io"
NODE_ENV="production"
```

### 10.3 Alur Proses Pendaftaran

```
[KANDIDAT] Buka halaman pendaftaran
     |
[FORM] Isi Nama, Email, Upload Foto
     |
[VALIDASI CLIENT] Cek format, ukuran file, tipe file
     |                    |
   VALID           TIDAK VALID → [UI] Tampilkan error per-field
     |
[SERVER ACTION] Terima FormData
     |
[VALIDASI SERVER] Zod schema validation
     |
[blobStorageService] Generate UUID + Upload ke Azure Blob
     |                    |
   SUKSES            GAGAL → [UI] "Upload gagal, coba lagi"
     |
[candidateRepository] Simpan ke PostgreSQL via Prisma
     |                    |
   SUKSES            GAGAL → [blobService] Hapus file (rollback)
     |
[UI] Tampilkan pesan sukses + konfirmasi
```

### 10.4 Contoh Implementasi Kunci

#### `lib/azureBlobClient.ts`

```typescript
import { BlobServiceClient } from "@azure/storage-blob";

export function getBlobServiceClient(): BlobServiceClient {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is not defined");
  }
  return BlobServiceClient.fromConnectionString(connectionString);
}
```

#### `services/blobStorageService.ts`

```typescript
import { v4 as uuidv4 } from "uuid";
import { getBlobServiceClient } from "@/lib/azureBlobClient";

export async function uploadCandidatePhoto(file: File): Promise<string> {
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;
  const extension = file.name.split(".").pop();
  const blobName = `${uuidv4()}.${extension}`;

  const client = getBlobServiceClient();
  const containerClient = client.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: file.type },
  });

  return blockBlobClient.url;
}
```

#### `repositories/candidateRepository.ts`

```typescript
import { prisma } from "@/lib/prisma";

export async function createCandidate(data: {
  fullName: string;
  email: string;
  photoUrl: string;
}) {
  return prisma.candidate.create({ data });
}
```

#### `app/actions/registration.ts`

```typescript
"use server";

import { z } from "zod";
import { uploadCandidatePhoto } from "@/services/blobStorageService";
import { createCandidate } from "@/repositories/candidateRepository";

const schema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(255),
});

export async function registerCandidate(formData: FormData) {
  const file = formData.get("photo") as File;
  const parsed = schema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  let photoUrl: string | null = null;

  try {
    photoUrl = await uploadCandidatePhoto(file);
    await createCandidate({ ...parsed.data, photoUrl });
    return { success: true };
  } catch (error) {
    // Rollback: hapus file jika DB gagal
    if (photoUrl) await deleteBlobByUrl(photoUrl);
    return {
      success: false,
      errors: { _form: ["Pendaftaran gagal. Silakan coba lagi."] },
    };
  }
}
```

---

## 11. Panduan Konfigurasi Azure Portal

### 11.1 Konfigurasi Environment Variables di Azure Container Apps

#### Langkah 1 — Akses Azure Container Apps

1. Buka Azure Portal ([https://portal.azure.com](https://portal.azure.com)) dan login
2. Navigasi ke Resource Group yang berisi Container App Anda
3. Pilih Container App `portal-pendaftaran` dari daftar resources

#### Langkah 2 — Buka Menu Containers

1. Di panel kiri, klik **Containers** di bawah bagian **Application**
2. Klik tombol **Edit and deploy** di bagian atas halaman
3. Pada tab **Container**, pilih container Anda dan klik **Edit**

#### Langkah 3 — Tambahkan Environment Variables

| Name                              | Source              | Value / Secret Ref                  |
| --------------------------------- | ------------------- | ----------------------------------- |
| `AZURE_STORAGE_CONNECTION_STRING` | Secret Reference ⭐ | Buat sebagai Secret terlebih dahulu |
| `AZURE_STORAGE_CONTAINER_NAME`    | Manual Entry        | `candidate-photos`                  |
| `DATABASE_URL`                    | Secret Reference ⭐ | Buat sebagai Secret terlebih dahulu |
| `NODE_ENV`                        | Manual Entry        | `production`                        |

> ⚠️ **Praktik Keamanan Terbaik:** Gunakan **Secret Reference** (bukan Manual Entry) untuk nilai sensitif seperti `CONNECTION_STRING` dan `DATABASE_URL`. Azure Container Apps mengenkripsi secrets dan tidak menampilkannya di log.

#### Langkah 4 — Cara Menambahkan Secret

1. Di panel kiri Container App, klik **Secrets** di bawah **Settings**
2. Klik **+ Add secret**
3. Masukkan nama secret (contoh: `azure-storage-conn-str`) dan nilainya
4. Klik **Add** untuk menyimpan
5. Kembali ke konfigurasi Container, gunakan **Reference a secret** dan pilih secret yang baru dibuat

#### Langkah 5 — Deploy Ulang

1. Setelah selesai, klik **Save** pada dialog edit container
2. Klik **Create** untuk membuat revision baru
3. Azure Container Apps akan otomatis membuat revision baru dengan konfigurasi terbaru
4. Monitor deployment di menu **Revision management**

---

### 11.2 Konfigurasi Azure Blob Storage

1. Di Azure Portal, buat **Storage Account** baru (Redundancy: LRS untuk dev, GRS untuk production)
2. Buat Container baru dengan nama `candidate-photos` (**Access level: Private** — JANGAN public)
3. Salin **Connection String** dari menu **Access keys** di Storage Account
4. Simpan sebagai secret di Container Apps (lihat langkah 11.1)

### 11.3 Konfigurasi Azure Database for PostgreSQL

1. Buat **Azure Database for PostgreSQL Flexible Server** baru
2. Aktifkan **"Allow Azure services and resources to access this server"** di Networking
3. Buat database baru (contoh: `portal_pegawai`)
4. Susun `DATABASE_URL` dalam format:
   ```
   postgresql://user:pass@hostname:5432/dbname?sslmode=require
   ```
5. Jalankan `prisma migrate deploy` setelah aplikasi pertama kali di-deploy

---

## 12. User Stories & Acceptance Criteria

| ID    | Sebagai...     | Saya ingin...                                              | Sehingga...                                                         |
| ----- | -------------- | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| US-01 | Kandidat       | Mengisi formulir dengan nama, email, dan foto saya         | Data saya dapat terdaftar di sistem rekrutmen                       |
| US-02 | Kandidat       | Mendapatkan feedback langsung jika input saya tidak valid  | Saya tahu persis apa yang perlu diperbaiki                          |
| US-03 | Kandidat       | Melihat indikator loading saat form sedang diproses        | Saya tahu sistem sedang bekerja dan tidak meng-klik submit berulang |
| US-04 | Kandidat       | Mendapat konfirmasi sukses setelah pendaftaran berhasil    | Saya yakin pendaftaran saya telah diterima                          |
| US-05 | Developer      | Menggunakan env variables untuk semua konfigurasi sensitif | Sistem aman dan credential tidak bocor ke version control           |
| US-06 | Cloud Engineer | Men-deploy aplikasi sebagai container di Azure             | Sistem dapat di-scale secara otomatis sesuai kebutuhan              |

---

## 13. Analisis Risiko & Mitigasi

| #   | Risiko                                              | Likelihood | Impact     | Mitigasi                                                                                             |
| --- | --------------------------------------------------- | ---------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| R1  | Credential Azure Blob bocor ke repository           | Sedang     | **KRITIS** | Wajib gunakan `.gitignore`, Secret References, dan pre-commit hook untuk deteksi credential          |
| R2  | Upload file berbahaya (malware, script)             | Sedang     | **TINGGI** | Validasi MIME type server-side, simpan di blob terpisah dari aplikasi, scan antivirus opsional       |
| R3  | Database connection exhaustion                      | Rendah     | **TINGGI** | Gunakan Prisma singleton pattern, connection pooling (PgBouncer di Azure), limit container instances |
| R4  | Biaya Azure membengkak akibat penyalahgunaan upload | Rendah     | **SEDANG** | Batasi ukuran file (5MB), rate limiting per IP, monitoring Azure Cost Alerts                         |
| R5  | Inkonsistensi data jika upload sukses tapi DB gagal | Sedang     | **SEDANG** | Implementasi rollback: hapus file dari Blob jika penyimpanan DB gagal                                |

---

## 14. Rencana Implementasi & Milestone

| Sprint   | Durasi     | Deliverable                                                                                   |
| -------- | ---------- | --------------------------------------------------------------------------------------------- |
| Sprint 1 | Minggu 1–2 | Setup proyek Next.js, konfigurasi Prisma, skema database, template `.env.example`, Dockerfile |
| Sprint 2 | Minggu 3–4 | Implementasi `blobStorageService`, `candidateRepository`, `candidateService`, unit tests      |
| Sprint 3 | Minggu 5–6 | Implementasi Server Action, `RegistrationForm` component, validasi Zod, loading states        |
| Sprint 4 | Minggu 7   | Integration testing, deployment ke Azure Container Apps (staging), konfigurasi environment    |
| Sprint 5 | Minggu 8   | UAT (User Acceptance Testing), bug fixing, deployment ke production, dokumentasi akhir        |

---

## 15. Definition of Done

Sebuah fitur dianggap **selesai** dan siap untuk release apabila memenuhi semua kriteria berikut:

- [ ] Kode telah di-review dan disetujui oleh minimal 1 reviewer (Pull Request)
- [ ] Unit tests lulus dengan code coverage > 70% pada logika service dan repository
- [ ] Tidak ada hardcoded credentials — semua konfigurasi via environment variables
- [ ] Form validasi berjalan dengan benar di browser Chrome, Firefox, dan Safari terbaru
- [ ] Upload file ke Azure Blob Storage berfungsi dan URL publik dapat diakses
- [ ] Data tersimpan di database dengan benar dan dapat di-query melalui Prisma Studio
- [ ] Aplikasi berhasil di-build sebagai Docker image dan berjalan di Azure Container Apps
- [ ] Tidak ada console errors di browser untuk happy path dan error scenarios umum
- [ ] Responsive design berfungsi di mobile (375px), tablet (768px), dan desktop (1280px)
- [ ] `README.md` telah diperbarui dengan instruksi setup lokal dan deployment

---

## 16. Glosarium

| Istilah                  | Definisi                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **App Router**           | Sistem routing Next.js 13+ yang menggunakan direktori `app/` dan mendukung React Server Components                      |
| **Azure Blob Storage**   | Layanan penyimpanan objek Microsoft Azure untuk data tidak terstruktur seperti gambar, video, dan dokumen               |
| **Azure Container Apps** | Layanan serverless Microsoft Azure untuk menjalankan container tanpa mengelola infrastruktur Kubernetes secara langsung |
| **Prisma ORM**           | Object-Relational Mapper modern untuk TypeScript/JavaScript yang menyederhanakan akses dan migrasi database             |
| **Repository Pattern**   | Pola desain yang mengabstraksi logika akses data dari logika bisnis, membuat kode lebih mudah diuji dan dipelihara      |
| **Server Actions**       | Fitur Next.js 14+ yang memungkinkan fungsi async di server dipanggil langsung dari komponen React klien                 |
| **Stateless**            | Arsitektur di mana server tidak menyimpan state sesi pengguna — setiap request bersifat independen                      |
| **UUID**                 | Universally Unique Identifier — pengenal unik 128-bit yang digunakan sebagai nama file untuk menghindari collision      |
| **Zod**                  | Library validasi schema TypeScript-first yang memungkinkan validasi runtime dengan inferensi tipe otomatis              |

---

## 17. Riwayat Revisi Dokumen

| Versi  | Tanggal     | Penulis         | Perubahan                                                 |
| ------ | ----------- | --------------- | --------------------------------------------------------- |
| v1.0.0 | 10 Mei 2026 | Tim Engineering | Versi awal — PRD lengkap untuk Portal Pendaftaran Pegawai |

---

> _Dokumen ini berisi informasi rahasia dan hak milik organisasi. Penyebaran, reproduksi, atau penggunaan sebagian maupun seluruh isi dokumen tanpa izin tertulis adalah dilarang._

