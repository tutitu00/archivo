# 📄 Product Requirement Document (PRD)
## Archivo — Sistem Pengarsipan & Pelacakan Dokumen Fisik Nasabah

---

### 1. Informasi Dokumen & Metadata

* **Nama Produk:** Archivo
* **Deskripsi Singkat:** Sistem Pengarsipan & Pelacakan Lokasi Fisik Dokumen Nasabah
* **Target Platform:** Web Application (Desktop First, Mobile Responsive)
* **Versi Dokumen:** v1.0.0
* **Target Pengguna:** Staf Operasional, Legal, & Admin Arsip Perbankan/Keuangan (Semua Usia)
* **Status Dokumen:** Approved for Prototyping & Development

---

### 2. Latar Belakang & Ringkasan Eksekutif

Di lingkungan operasional perbankan dan lembaga keuangan, pengelolaan berkas fisik nasabah (seperti KTP, formulir pembukaan rekening, akad kredit, dan berkas agunan) sering kali menghadapi kendala dalam penataan dan pencarian lokasi fisik secara presisi. Keterlambatan dalam menemukan dokumen fisik dapat memperlambat proses audit, verifikasi legal, hingga pelayanan nasabah.

**Archivo** hadir sebagai sistem berbasis **Web Application** yang berfokus pada **kejelasan lokasi penyimpanan fisik** (Lemari → Rak → Folder/Map). Antarmuka (UI/UX) Archivo dirancang *ultra user-friendly* dengan font besar, kontras visual yang tinggi, serta alur kerja yang intuitif untuk mengakomodasi seluruh kelompok usia staf (termasuk staf senior), serta dilengkapi fitur lacak staf (*audit trail*) yang transparan.

---

### 3. Tujuan Produk (Product Goals)

1. **Akurasi Lokasi Fisik 100%:** Memastikan lokasi penyimpanan dokumen fisik dapat ditemukan dalam hitungan detik hingga tingkat Lemari, Baris Rak, dan Map/Binder.
2. **Inklusivitas & Usabilitas (Gen-Z & Senior-Friendly):** Menyediakan antarmuka dengan kontras tinggi, font berukuran besar, dan navigasi tanpa kerumitan teknis agar mudah dipakai oleh staf berusia tua maupun muda.
3. **Akuntabilitas & Transparansi (Track Staff):** Mencatat setiap aktivitas pergerakan, peminjaman, dan penyuntingan lokasi dokumen secara *real-time* untuk mencegah dokumen hilang atau selip tanpa penanggung jawab.

---

### 4. Profil Pengguna (User Personas)

#### Pak Bambang (53 Tahun) — Senior Admin Arsip
* **Karakteristik & Kebutuhan:** Bekerja teliti, mengutamakan kenyamanan visual, lebih menyukai tombol berukuran besar dan instruksi yang jelas.
* **Tantangan:** Cepat lelah membaca font kecil atau UI yang rumit.
* **Solusi Archivo:** UI Kontras tinggi, teks berukuran besar, alur input tidak berbelit-belit.

#### Siti (24 Tahun) — Staf Verifikasi & Legal
* **Karakteristik & Kebutuhan:** Membutuhkan kecepatan dalam memindahkan dan mencari berkas saat proses audit atau verifikasi nasabah.
* **Tantangan:** Butuh kepastian lokasi berkas dengan cepat & sat-set.
* **Solusi Archivo:** Search bar serbaguna dan penanda status fisik visual yang jelas.

---

### 5. Spesifikasi Fitur Utama

#### 5.1. Dashboard Utama
* **Header Branding:** Menampilkan logo dan nama **Archivo** secara jelas di sudut kiri atas.
* **Ringkasan Metrik (Metric Cards):** Menampilkan 4 kartu statistik utama:
  * Total Dokumen Fisik
  * Dokumen Proses Verifikasi
  * Dokumen Terarsip di Lemari
  * Pergerakan Dokumen Hari Ini
* **Pintas Akses (Quick Action):** Tombol besar untuk `"Cari Dokumen"` dan `"Input Dokumen Baru"`.
* **Aktivitas Terakhir:** Panel ringkas yang menampilkan 5 transaksi pemindahan atau pengarsipan dokumen terbaru.

#### 5.2. Formulir Input Data Dokumen
* **Identitas Nasabah:** Field input untuk Nomor CIF, Nomor Rekening, Nama Nasabah, dan Jenis Dokumen (KTP, Akad, Agunan, dll).
* **Pemilih Lokasi Fisik (Hierarkis):** Dropdown/Visual picker sederhana:
  * *Kode Lemari* (contoh: Lemari A)
  * *Baris Rak* (contoh: Rak 3)
  * *Kode Folder/Binder* (contoh: Binder 102)
* **Status Pengarsipan:** Toggle status intuitif: `"Proses Verifikasi"` vs `"Tersimpan di Lemari"`.
* **Tombol Simpan:** Tombol aksi besar dengan teks yang jelas `"Simpan Dokumen"`.

#### 5.3. Pencarian & Pelacakan Lokasi Fisik
* **Pencarian Multi-Kriteria:** Search bar serbaguna yang mendukung pencarian otomatis berdasarkan Nomor CIF, Nomor Rekening, maupun Nama Nasabah.
* **Visual Kartu Lokasi:** Hasil pencarian menampilkan kotak bergaris tegas yang menyoroti lokasi persis dokumen (contoh: **Lemari B → Rak 2 → Folder 405**).
* **Label Status Visual:** Tag warna untuk status (contoh: Kuning = *Proses Verifikasi*, Hijau = *Tersimpan di Lemari*).
* **Navigasi Aksi:** Tombol langsung untuk `"Edit Detail"` dan `"Pindahkan Dokumen"`.

#### 5.4. Edit & Pemindahan Lokasi Dokumen
* Modal/Formulir sederhana untuk memperbarui data nasabah atau memindahkan posisi fisik dokumen.
* **Catatan Alasan (Mandatory Field):** Kolom wajib diisi mengenai alasan pemindahan (contoh: *"Peminjaman tim Legal"* atau *"Penataan Ulang Lemari"*).

#### 5.5. Lacak Staf (Audit Trail / Staff Activity Log)
* Tabel kronologis otomatis yang mencatat:
  * Tanggal & Waktu Transaksi
  * Nama & ID Staf Pelaksana
  * Jenis Aksi (Input Baru, Edit Data, Pindah Lokasi)
  * Nomor CIF / Rekening Nasabah
  * Riwayat Perubahan Lokasi (Lokasi Lama → Lokasi Baru)

#### 5.6. Profil Pengguna
* Kartu informasi staf yang sedang login, badge peran/role, dan tombol logout yang jelas.

---

### 6. Persyaratan Non-Fungsional (Non-Functional Requirements)

* **Keterjangkauan (Accessibility):** Mengikuti standar WCAG 2.1 AA (Rasio kontras teks minimal 4.5:1, ukuran font bodi minimal 14px pada desktop, serta tombol aksi berukuran besar dengan padding luas).
* **Performa (Performance):** Waktu muat pencarian data di bawah 1.5 detik untuk mendukung kecepatan kerja operasional.
* **Responsivitas (Device Support):** Utama dioptimalkan untuk Web Browser PC/Laptop (Chrome, Edge) dan kompatibel saat dibuka lewat Tablet/Mobile.
* **Keamanan & Audit (Security):** Menggunakan Akses Berbasis Peran (RBAC) di mana catatan *Audit Trail* bersifat *immutable* (tidak dapat diubah/dihapus).

---

### 7. Desain Antarmuka & Skema Warna (UI Style Guide)

* **Base Theme:** Neutral Clean (Latar belakang terang/putih bersih untuk mengurangi kelelahan mata).
* **Accent Colors:** 
  * Soft Blue (`#2563EB`) untuk tombol utama dan navigasi.
  * Emerald Green (`#16A34A`) untuk status *"Tersimpan di Lemari"*.
  * Amber Yellow (`#D97706`) untuk status *"Proses Verifikasi"*.
* **Typography:** Font sans-serif yang mudah dibaca (Inter / Roboto / Arial) dengan bobot sedang hingga tebal pada label penting.
