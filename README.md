
# AI Gratis Indonesia

Template situs AI berbahasa Indonesia dengan desain orisinal, terinspirasi dari pola umum antarmuka asisten AI. Ini **bukan salinan resmi Grok** dan tidak terafiliasi dengan xAI.

## Fitur yang sudah berfungsi
- Antarmuka responsif untuk Chromebook, HP, dan desktop.
- Chat demo lokal yang memberi tahu dengan jelas bahwa model AI online belum terhubung.
- Pembuat prompt untuk gambar, video, konten sosial, dan foto produk.
- Persiapan prompt gambar dan tombol salin.
- Riwayat chat tersimpan di browser perangkat (localStorage).
- Tema terang/gelap.

## Yang belum aktif
- Chat AI online sungguhan.
- Generasi gambar AI langsung di situs.
- Pencarian internet.

Tidak ada API key yang disertakan. Jangan menganggap jawaban demo sebagai keluaran model AI online.

## Menjalankan di Chromebook / komputer
1. Unduh dan ekstrak ZIP proyek ini.
2. Buka folder `ai-gratis-indonesia`.
3. Klik dua kali `index.html` untuk mencoba situs secara lokal.

Untuk pengembangan, kamu bisa memakai VS Code atau editor teks apa pun.

## Hosting gratis dengan GitHub Pages
1. Buat akun GitHub jika belum punya.
2. Buat repository baru, misalnya `ai-gratis-indonesia`.
3. Unggah `index.html`, `style.css`, `app.js`, dan `README.md` ke root repository.
4. Buka **Settings → Pages**.
5. Di bagian build/deployment, pilih **Deploy from a branch**, pilih branch `main` dan folder `/(root)`, lalu simpan.
6. Tunggu proses deployment selesai. GitHub akan menampilkan alamat situs publikmu.

Hosting statis cocok untuk antarmuka demo. Jangan memasukkan API key rahasia ke `app.js`, karena pengunjung dapat melihat kode tersebut.

## Mengaktifkan AI online dengan kuota gratis
Untuk chat online, pilih penyedia AI yang saat ini menyediakan free tier dan cek syarat, batas pemakaian, ketersediaan wilayah, serta kebijakan privasinya. Kuota gratis dapat berubah dan tidak dijamin permanen.

**Arsitektur yang aman:**
Browser → backend/serverless function → penyedia AI.

Simpan API key sebagai secret/environment variable di pengaturan backend, bukan di file frontend. Backend harus memvalidasi input, membatasi ukuran pesan dan pemakaian, serta menangani rate limit. Setelah itu, ubah fungsi pengiriman chat di `app.js` agar memanggil endpoint backend milikmu. Endpoint sengaja tidak dikarang atau diaktifkan di template ini.

## Mengaktifkan gambar AI
Gunakan provider gambar yang memiliki kuota gratis dan API yang boleh digunakan dari backend. Integrasikan melalui serverless function yang menyimpan key sebagai secret. Fitur gambar pada template saat ini hanya menyiapkan prompt, bukan menghasilkan file gambar.

## Biaya
Template dan hosting statis bisa digunakan tanpa biaya jika memenuhi ketentuan platform. Penggunaan provider AI dapat memiliki kuota, batas, atau perubahan kebijakan. Tidak ada jaminan seluruh layanan AI selalu gratis atau tanpa batas.
