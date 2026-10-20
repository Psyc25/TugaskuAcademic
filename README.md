# Panduan Deploy TugasKu ke Vercel 🚀

Aplikasi ini sudah dikonfigurasi secara lengkap untuk dapat langsung dideploy ke **Vercel** dengan arsitektur Full-Stack (Frontend Vite React + Backend Express Serverless Function).

---

## 📁 Konfigurasi yang Sudah Disediakan

1. **`vercel.json`**:
   - Mengarahkan request `/api/*` ke Serverless Function di `api/index.ts`.
   - Mengarahkan semua halaman SPA ke `dist/index.html`.
   - Menjalankan `vite build` sebagai Build Command dengan direktori output `dist`.

2. **`api/index.ts`**:
   - Menjalankan backend Express (Fitur Niraaa AI Chat, Text-to-Speech audio, Flashcards AI, dan API Gateway) sebagai Serverless Function di Vercel.

---

## 🌟 Cara 1: Deploy Melalui GitHub (Paling Direkomendasikan)

1. **Export / Push Kode ke GitHub:**
   - Di Google AI Studio, klik menu **Settings (ikon gear)** di pojok kanan atas, lalu pilih **Export to GitHub** atau **Download ZIP**.
   - Jika mendownload ZIP, ekstrak lalu push ke repository GitHub Anda:
     ```bash
     git init
     git add .
     git commit -m "Initial commit for Vercel deployment"
     git branch -M main
     git remote add origin https://github.com/USERNAME/REPO_NAME.git
     git push -u origin main
     ```

2. **Hubungkan ke Vercel:**
   - Masuk ke dashboard [vercel.com](https://vercel.com).
   - Klik **"Add New..."** > **"Project"**.
   - Pilih repository GitHub Anda, lalu klik **"Import"**.

3. **Konfigurasi Project Settings di Vercel:**
   - **Framework Preset**: Pilih **Vite** (biasanya terdeteksi otomatis).
   - **Root Directory**: `./` (biarkan default).
   - **Build and Output Settings**: Biarkan default karena sudah ditangani oleh `vercel.json`.

4. **Tambahkan Environment Variable:**
   - Di bagian **Environment Variables**, tambahkan:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: Masukkan API Key Gemini Anda (dapat dibuat gratis di [aistudio.google.com](https://aistudio.google.com/app/apikey)).
   - (Opsional) `NODE_ENV`: `production`

5. **Klik "Deploy":**
   - Tunggu proses build selesai (~1-2 menit).
   - Aplikasi TugasKu beserta asisten AI Niraa siap diakses di domain `https://your-project.vercel.app`! 🎉

---

## 💻 Cara 2: Deploy Menggunakan Vercel CLI

1. Pasang Vercel CLI di komputer Anda:
   ```bash
   npm install -g vercel
   ```

2. Login ke akun Vercel:
   ```bash
   vercel login
   ```

3. Jalankan perintah deploy di folder project:
   ```bash
   vercel
   ```

4. Masukkan Environment Variable API Key Gemini:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Pilih target (Production, Preview, Development), lalu paste API Key Anda.

5. Deploy ke Production:
   ```bash
   vercel --prod
   ```

---

## 🔍 Verifikasi Setelah Deploy

Setelah deploy selesai, Anda dapat memeriksa:
- **Halaman Utama**: Buka URL deployment Vercel Anda, halaman akan tampil secara instan.
- **Health Check API**: Buka `https://your-project.vercel.app/api/health` — akan mengembalikan `{ "status": "ok" }`.
- **Chat Asisten Niraa**: Coba kirim pesan di widget chat Niraaa AI untuk memastikan interaksi Gemini API bekerja lancar.

---

## 🤖 Integrasi 9Router & WhatsApp Auto-Pilot (Konten Otomatis)

Website ini telah dilengkapi sistem **Auto-Pilot Konten AI** dan **WhatsApp Gateway**:

### 📦 Apa yang Perlu Anda Siapkan?
1. **API Key AI**:
   - **Google Gemini API Key** (Bawaan & Gratis di [aistudio.google.com](https://aistudio.google.com/app/apikey))
   - *(Opsional)* **9Router API Key** dari [9router.com](https://9router.com) jika Anda ingin merutekan model seperti GPT-4o, DeepSeek, Claude, dll.
2. **Akun WhatsApp Gateway**:
   - Buat akun gratis di **Fonnte** ([fonnte.com](https://fonnte.com)) atau **Wablas** ([wablas.com](https://wablas.com)).
   - Scan QR Code WhatsApp nomor pengirim di dashboard Fonnte.
   - Salin **Token** yang diberikan.
3. **Nomor WhatsApp Anda**:
   - Nomor WhatsApp admin penerima konten (misal: `6285693009756`).

### ⚙️ Pengaturan Environment Variables (di Vercel / `.env`):
```env
# AI Engine
GEMINI_API_KEY=your_gemini_key
ROUTER9_API_KEY=your_9router_key       # Opsional jika pakai 9Router
ROUTER9_BASE_URL=https://api.9router.com/v1
ROUTER9_MODEL=gpt-4o-mini

# WhatsApp Gateway
WA_GATEWAY_PROVIDER=fonnte            # "fonnte", "wablas", atau "custom"
WA_GATEWAY_TOKEN=your_fonnte_token    # Token dari Fonnte/Wablas
WA_ADMIN_PHONE=6285693009756          # Nomor WhatsApp Anda
```

### ⏰ Penjadwalan Otomatis (Cron Job Harian)
`vercel.json` telah dikonfigurasi untuk memicu endpoint `/api/content/auto-pilot` secara otomatis setiap hari pada pukul **08:00 UTC**. Setiap pagi, AI akan memproduksi materi promosi/tips dan langsung menembakkannya ke WhatsApp Anda!
