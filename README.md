# Tahfidz App V1

Aplikasi baru dibuat dari nol dan tidak memakai Apps Script / Node.js untuk production.

## Struktur

- `internal/` — dashboard user internal
- `orangtua/` — portal orang tua
- `firestore.rules` — rules Firestore
- `data/surah.json` — master 114 surah
- `firebase.json` — konfigurasi Firebase CLI
- `.firebaserc` — project Firebase `dibaliklayar-6623b`

## Konsep User

Semua akun Firebase Authentication dianggap sebagai user internal:
- admin + guru sekaligus;
- tidak ada role admin/guru;
- tidak ada collection `users` Firestore;
- tidak ada `tahfidz_users`;
- identitas internal cukup berasal dari Firebase Authentication.

Jika user berhasil login, langsung dianggap user internal Tahfidz.

## Portal orang tua

Orang tua tidak login.
Cukup masukkan NIS.

Portal hanya menampilkan:
- nama & kelas
- data setoran
- status setoran
- ayat terakhir
- tanggal setoran
- catatan guru
- saran untuk orang tua

Data portal diletakkan di collection `tahfidz_portal_*` yang hanya berisi data non-private yang memang disetujui untuk dilihat publik.

## Collection

Internal:
- `tahfidz_siswa`
- `tahfidz_setoran`
- `tahfidz_catatan`
- `tahfidz_surah`

Portal publik:
- `tahfidz_portal/{NIS}`
  - `setoran/{id}`
  - `catatan/{id}`

## Setup pertama

1. Pastikan rules Firestore sudah menggunakan `firestore.rules`.
2. Upload/import 114 surah dari `data/surah.json` sekali.
3. Buat satu user internal melalui Firebase Authentication.
4. Buka `internal/`.
5. Login. Profil `tahfidz_users/{UID}` dibuat otomatis.
6. Tambahkan siswa.
7. Tambahkan setoran.
8. Tambahkan catatan.
9. Buka `orangtua/` dan masukkan NIS.

## Hosting

Tidak membutuhkan Node.js untuk production.
Cukup upload:
- `internal/`
- `orangtua/`

ke shared hosting.

## Firebase CLI (opsional)

Untuk deploy rules:

```bash
firebase login
firebase use dibaliklayar-6623b
firebase deploy --only firestore:rules
```

Untuk mengisi 114 surah, paling mudah menggunakan Firebase Console import manual atau script sekali jalan di lokal. Aplikasi V1 tidak membutuhkan Node.js di hosting.

## Catatan keamanan

Portal orang tua menggunakan NIS sebagai lookup. Sesuai keputusan desain, portal hanya menampilkan data setoran dan catatan yang dianggap tidak sangat sensitif. Collection portal tidak boleh diisi langsung oleh publik; hanya user internal yang boleh menulis.


## Catatan penting tentang user

Tidak ada collection Firestore `users` yang dibutuhkan.
Tidak ada `tahfidz_users`.
Firebase Authentication adalah satu-satunya sumber identitas user internal.

Untuk membuat user internal:
Firebase Console → Authentication → Users → Add user.

Setelah akun dibuat, user langsung bisa login ke Dashboard Internal.

## V3 UI
Dashboard internal diperbarui dengan sidebar modern, responsive mobile bottom navigation, cards statistik, toolbar, modal, dan typography yang lebih rapi.

## V4 UI Islami
Tema visual V4 menggunakan nuansa hijau sage/emerald, krem, aksen emas lembut, background terang, dan pola geometris tipis agar nyaman dilihat dalam penggunaan lama.

## V6 UI Cleanup
Memangkas elemen header yang tidak perlu, memperbaiki tombol logout, dan merapatkan heading serta tabel agar konten tidak terlalu turun.

## V7 UI
Perbaikan fokus pada jarak vertikal, ukuran font, dan kepadatan tabel agar lebih nyaman dibaca.

## V8 — SMPIT Al Firdaus Purwodadi
Branding internal menggunakan logo sekolah dan nama SMPIT Al Firdaus Purwodadi. Desktop vertical alignment diperbaiki agar konten tidak ter-center secara vertikal dan tidak menyisakan ruang kosong besar antara header dan tabel.

## V9 — Input lebih cepat

Pada Data Siswa tersedia:
- tambah satu per satu;
- edit satu per satu;
- Edit Tabel untuk editing langsung;
- checkbox + hapus banyak;
- Export CSV;
- Import CSV;
- paste langsung dari Excel/Google Sheets;
- template CSV.

Setoran dan Catatan juga memiliki Import/Tempel dan Export.
Alert browser diganti modal aplikasi yang lebih rapi.

## V10 — Perkembangan Siswa

Setiap siswa kini memiliki tampilan perkembangan lengkap yang menggabungkan:
- ringkasan setoran;
- riwayat setoran lengkap;
- hafalan per surah dengan ayat terakhir dan persentase;
- status Lancar/Mengulang;
- catatan guru dan saran untuk orang tua.

Tombol `Perkembangan` tersedia dari Data Siswa dan Monitoring.

## V11 — Popup & inline action fix

Semua fungsi yang dipanggil melalui `onclick` dari HTML module kini diekspos ke `window`, termasuk `loadAll` dan `closeModal`.
Overlay modal dapat ditutup dengan klik di luar dialog atau tombol Escape.

## V12 — Dropdown Surah

Jika `tahfidz_surah` masih kosong, dashboard otomatis memuat 114 surah dari `data/surah.json` ke Firestore.
Dropdown Surah menampilkan placeholder `Pilih surah...`, menangani kondisi master kosong, dan validasi sebelum menyimpan setoran.

## V13 — Ikon & typography
Ikon navigasi diganti ke SVG line icons yang lebih konsisten dan ukuran font menu diperbesar agar lebih mudah dibaca.

## V14 — Workflow berorientasi perkembangan

Dashboard utama sekarang menghitung statistik seluruh siswa aktif.
Halaman Setoran bukan lagi daftar riwayat per baris, tetapi daftar seluruh siswa.
Setiap baris menampilkan setoran terakhir dan dapat diedit langsung di tabel.
Disediakan `Tempel Banyak` untuk memasukkan setoran massal dari Excel/Google Sheets.
Riwayat setoran tetap disimpan, sehingga perubahan terbaru tidak menghapus histori.

## V15 — Riwayat setoran tetap aman

Tabel Setoran menampilkan setoran terakhir setiap siswa, tetapi menyimpan seluruh riwayat.
- Jika tanggal yang dimasukkan belum memiliki setoran untuk siswa tersebut: dibuat riwayat baru.
- Jika tanggal tersebut sudah memiliki setoran: data yang sama diperbarui, tetapi hanya setelah konfirmasi.
- Scroll vertikal internal tabel dihapus; tabel memanjang ke bawah mengikuti jumlah siswa. Scroll horizontal tetap tersedia pada layar kecil.

## V16 — Inline setoran fix
Memperbaiki `markSetoranRowDirty` agar onchange inline tidak lagi menghasilkan ReferenceError.
Input ayat pada tabel setoran sekarang otomatis mendapatkan `max` sesuai jumlah ayat surah yang dipilih dan akan dikoreksi/ditolak jika melebihi batas.

## V17 — Catatan berorientasi perkembangan

Catatan mengikuti pola Setoran:
- satu baris = satu siswa;
- menampilkan catatan terakhir;
- seluruh riwayat catatan tetap tersimpan;
- setiap catatan dapat direferensikan ke setoran terakhir atau setoran tertentu;
- referensi disimpan sebagai `setoranId` dan snapshot `setoranReference`;
- riwayat catatan memperlihatkan konteks setoran terkait;
- tersedia input satu per satu dan paste catatan massal.

## V18 — Edit Catatan langsung di tabel

Catatan sekarang bisa diedit langsung seperti spreadsheet:
- mode `Edit Tabel`;
- pesan, saran orang tua, referensi setoran, dan tanggal dapat diedit langsung;
- simpan per baris atau simpan semua perubahan;
- jika tanggal sama dengan catatan terakhir, data tersebut diperbarui;
- jika tanggal diganti ke tanggal baru, catatan baru dibuat sebagai riwayat;
- checkbox untuk memilih beberapa catatan terakhir dan menghapusnya.

## V19 — Setoran safe edit mode

Setoran sekarang read-only secara default. Guru harus menekan `Edit Tabel` sebelum dapat mengubah surah, ayat, status, atau tanggal. Kolom NIS/Nama/Kelas tetap tidak dapat diubah. Jika ada perubahan yang belum disimpan dan guru mencoba keluar dari mode edit, aplikasi meminta konfirmasi.

## V20 — Catatan horizontal scroll

Memperbaiki horizontal scrolling Catatan dengan tiga kolom kiri yang sticky dan offset yang konsisten:
- checkbox: 42px
- NIS: 92px
- Nama: 220px

Kolom kanan sekarang bergeser horizontal tanpa menutupi NIS/nama.

## V21 — Catatan table cleanup

Kolom checklist di Catatan dihapus karena tidak diperlukan untuk workflow pembinaan.
Kolom sticky Catatan kini hanya NIS dan Nama Siswa, sehingga horizontal scroll lebih rapi dan tidak ada kolom kosong/bergeser.

## V22 — Catatan table geometry

Catatan table kini memakai `colgroup` dan fixed column widths. Ini memperbaiki kolom Catatan Terakhir yang sebelumnya tertutup/terpotong saat horizontal scroll.

## V23 — Catatan column alignment

Memperbaiki bug utama tabel Catatan: baris data tidak memiliki sel `KELAS`, sementara header memiliki kolom `KELAS`. Akibatnya semua kolom setelah Nama bergeser. Sekarang setiap baris memiliki urutan lengkap:
NIS → Nama → Kelas → Catatan → Saran → Setoran Terkait → Tanggal → Riwayat.

## V24 — Profil perkembangan terpadu

Tombol Riwayat pada Setoran dan Catatan sekarang membuka profil perkembangan siswa yang sama.
Profil terpadu menggunakan sumber data yang sama:
- Riwayat Setoran
- Hafalan per Surah
- Catatan Guru
- Referensi Catatan → Setoran

Riwayat Catatan tidak lagi membuka tampilan terpisah yang hanya berisi catatan.

## V25 — Template Excel Setoran

Tempel Setoran Banyak sekarang menggunakan format:
`NIS | Nama Siswa | Surah | Ayat | Status | Tanggal`.

Nama Siswa hanya menjadi informasi bantu untuk guru. Sistem tetap menggunakan NIS sebagai identitas utama; nama tidak dipakai sebagai index dan tidak diperbarui dari hasil tempelan.

Saat modal dibuka, template seluruh siswa aktif otomatis dimuat. Template dapat disalin ke clipboard atau diunduh sebagai file `.xls` yang dapat dibuka dengan Excel/Google Sheets.
Baris yang belum diisi kolom setoran akan dilewati saat disimpan.

## V26 — Tanggal otomatis

Pada fitur Tempel Setoran Banyak, kolom `Tanggal` boleh dikosongkan.
Sistem otomatis memakai tanggal hari ini berdasarkan waktu lokal browser.
Jika tanggal diisi manual, tanggal tersebut tetap digunakan.

## V27 — Alur Excel

Modal Tempel Setoran dibuka kosong. Guru mengunduh template `.xlsx`, mengisi setoran di Excel/Google Sheets, lalu copy seluruh tabel dan paste ke textarea aplikasi.

Template Excel berisi:
- Header: NIS, Nama Siswa, Surah, Ayat, Status, Tanggal
- NIS dan Nama Siswa seluruh siswa aktif
- Kolom setoran kosong

Nama Siswa hanya informasi bantu; NIS tetap menjadi identitas utama. Jika Tanggal kosong saat import/paste, sistem memakai tanggal hari ini.

## V28 — Dropdown pada template Excel

Template `.xlsx` sekarang menyediakan:
- dropdown Surah berisi 114 surah;
- dropdown Status: `Lancar` / `Mengulang`;
- validasi Ayat berupa angka;
- sheet `Master` dan `Petunjuk`.

Guru tetap mengikuti alur Download Template → isi di Excel → copy sheet Setoran → paste ke aplikasi.

## V29 — ExcelJS dropdown fix

Template Excel sekarang dibuat menggunakan ExcelJS agar `dataValidation` benar-benar ditulis ke file `.xlsx`.
Kolom Surah dan Status menggunakan validasi dropdown Excel yang nyata.

## V30 — Workflow Catatan via Excel

Catatan mengikuti alur Tempel Setoran:
- Download Template Excel
- Template otomatis berisi NIS + Nama Siswa seluruh siswa aktif
- Isi Catatan, Saran Orang Tua, Referensi Tanggal Setoran, dan Tanggal Catatan
- Copy seluruh sheet Catatan
- Paste ke aplikasi
- Preview lalu Simpan

Nama Siswa hanya informasi bantu. Identitas tetap NIS.
Referensi tanggal setoran dicari berdasarkan NIS + tanggal. Kosong = setoran terakhir.
Tanggal catatan kosong = tanggal hari ini.
Tanggal catatan yang sama = update catatan pada tanggal tersebut; tanggal baru = riwayat baru.

## V31 — Profil perkembangan terpadu

Riwayat dari Setoran dan Catatan sekarang selalu membuka renderer profil siswa yang sama.
Profil memuat Riwayat Setoran, Hafalan per Surah, Riwayat Catatan, dan referensi Catatan ke Setoran.

## V32 — Monitoring setoran

Monitoring sekarang fokus pada pola setoran yang tidak harus setiap hari:
- pilih tanggal tertentu untuk melihat siswa yang sudah/belum setor;
- tampilkan surah, ayat, dan status hafalan pada tanggal tersebut;
- pilih rentang tanggal untuk melihat matriks riwayat setoran per siswa;
- sel tanggal tanpa setoran ditampilkan sebagai `—`, bukan dianggap hari wajib setoran;
- tersedia export Excel untuk tanggal terpilih dan seluruh periode;
- export periode berisi `Rekap Periode`, `Detail Setoran`, dan `Petunjuk`.

## V33 — Modal & null-reference fix

Memperbaiki regresi dari V32:
- Memulihkan modal `Tambah/Edit Siswa`, `Setoran`, `Catatan`, serta modal bulk yang hilang dari HTML.
- `fillStudentSelects()` kini aman jika select belum tersedia.
- `fillSurahSelect()` dan `fillClassFilter()` aman jika elemen tidak terpasang.
- `closeModal()` tidak lagi mengakses `studentNis` setiap kali modal apa pun ditutup.

## V34 — Monitoring dengan navigasi tabel

Dua tabel Monitoring sekarang berada dalam satu navigasi tab:
- `Tanggal Terpilih`: melihat siapa yang sudah/belum setor pada satu tanggal dan capaian ayat.
- `Riwayat Periode`: melihat pola setoran lintas beberapa tanggal.

Dengan tab, kedua tabel tidak lagi tampil bersamaan sehingga halaman lebih ringkas.

## V35 — Monitoring period view cleanup

Sel pada tabel Riwayat Periode tidak lagi menggunakan tombol besar.
Setoran ditampilkan sebagai kartu informasi mini yang lebih ringan:
Surah, Ayat, dan status sebagai badge kecil. Sel tetap dapat diklik untuk membuka profil perkembangan.

## V36 — Menu Laporan sementara

Menu Laporan dibuat sebagai konsep sementara:
- periode mingguan, bulanan, semester, atau custom;
- filter kelas;
- ringkasan jumlah siswa, siswa yang setor, total setoran, dan catatan;
- rekap per siswa;
- rekap per kelas;
- catatan pembinaan;
- export Excel dengan sheet Laporan, Detail Setoran, Catatan Guru, dan Petunjuk.

Format ini belum dianggap format resmi sekolah dan dimaksudkan sebagai fondasi yang mudah disesuaikan.

## V37 — Laporan sidebar fix

Menu `Laporan` ditambahkan ke sidebar menggunakan struktur navigasi aplikasi yang benar (`navbtn`), setelah Monitoring.

## V38 — Laporan icon

Menambahkan icon `file-chart-column` ke registry icon internal agar icon pada menu Laporan tampil konsisten dengan menu lain.

## V39 — Menu Rapor

Rapor Tahfidz dibuat sebagai format sementara yang dapat diekspor ke PDF:
- cetak 1 siswa;
- cetak 1 kelas;
- cetak seluruh siswa aktif;
- periode Semester 1, Semester 2, atau Custom;
- identitas siswa;
- ringkasan jumlah setoran/hari setor/surah;
- capaian hafalan;
- catatan pembinaan dan saran orang tua;
- deskripsi perkembangan berbasis data;
- tempat tanda tangan Guru Tahfidz dan Orang Tua/Wali.

Format belum dianggap format resmi sekolah dan dapat diubah ketika format sekolah diterima.

## V40 — Ukuran kertas & logo rapor

Rapor sekarang dapat dipilih untuk:
- A4: 210 × 297 mm
- F4: 215,9 × 330,2 mm

PDF mencantumkan logo SMPIT Al Firdaus Purwodadi dari asset aplikasi.
Ukuran kertas memengaruhi ukuran halaman PDF dan posisi bagian tanda tangan/footer.

## V41 — Juziyah

Menu Juziyah dibuat sebagai fondasi sementara:
- manajemen hasil Juziyah per siswa;
- status Lulus / Belum Lulus;
- nilai opsional;
- catatan hasil ujian;
- filter siswa/kelas/hasil;
- export Excel;
- sertifikat Juziyah PDF A4 hanya untuk hasil Lulus;
- logo SMPIT Al Firdaus Purwodadi pada sertifikat;
- Juziyah masuk ke Profil Perkembangan Siswa sebagai tab tersendiri.
Data menggunakan collection Firestore `tahfidz_juziyah`.
Format sertifikat dan kriteria kelulusan sengaja dibuat sementara sampai format resmi sekolah diterima.

## V42 — Juziyah runtime fix
Memperbaiki fungsi Juziyah yang hilang dari script V41, menambahkan registry icon `award`, dan menghubungkan Juziyah kembali ke profil perkembangan siswa.

## V43 — Juziyah permission guard

Jika collection `tahfidz_juziyah` belum memiliki rule Firestore, dashboard tidak lagi gagal total.
Aplikasi akan memuat `tahfidz_juziyah` sebagai data kosong dan mencatat peringatan di console.
Tetap disarankan menambahkan rule resmi agar menu Juziyah dapat membaca/menulis datanya.

## V44 — Juziyah per siswa

Tabel Juziyah kini mengikuti pola Setoran/Hafalan:
- satu baris untuk satu siswa;
- kolom kanan menampilkan Juziyah terakhir;
- riwayat dapat berisi beberapa ujian/Juz untuk siswa yang sama;
- tombol `Hasil` untuk menambahkan ujian baru;
- tombol `Riwayat` membuka profil perkembangan pada tab Juziyah;
- `Edit` mengubah hasil Juziyah terakhir;
- sertifikat hanya muncul pada hasil terakhir yang Lulus.

## V45 — Semua Juz dalam satu baris siswa

Tabel utama Juziyah sekarang benar-benar satu baris per siswa. Semua Juz yang pernah diuji untuk siswa tersebut dirangkum dalam kolom `JUZ`, masing-masing sebagai chip kecil dengan status terakhirnya.
Tidak ada lagi nama siswa yang muncul berkali-kali hanya karena memiliki beberapa riwayat Juziyah.

## V46 — Sesi Juziyah dan sertifikat

Satu sesi Juziyah sekarang dapat menguji beberapa Juz sekaligus. Semua record dalam satu sesi memakai `sesiId`.
Sertifikat tidak lagi selalu mengambil hasil terakhir; guru dapat memilih sesi Juziyah mana yang lulus untuk direview dan dicetak.
Sesi lama tetap dipertahankan. Ujian berikutnya dengan jumlah Juz lebih sedikit tidak menghapus atau menggugurkan sertifikat sesi sebelumnya.
Sebelum cetak PDF A4, sertifikat selalu masuk ke tahap pratinjau/review.

## V47 — Restore shared functions
Restored shared utilities/UI functions that were accidentally omitted by V46 while preserving V46 multi-Juz session and certificate review logic.

## V49 — Laporan & Rapor navigation/render fix

Perbaikan regresi V48:
- navigasi sekarang menjalankan renderer halaman saat halaman dibuka;
- Laporan otomatis mengisi filter tahun/bulan/kelas dan data tabel saat menu dibuka;
- Rapor otomatis mengisi filter kelas/siswa dan pratinjau saat menu dibuka;
- Monitoring, Juziyah, Setoran, Catatan, dan Dashboard tetap diinisialisasi melalui handler yang sama.

## V50 — Manajemen siswa: pindah kelas, naik kelas, lulus

Data Siswa sekarang memiliki operasi:
- `Kelas` untuk satu siswa;
- `Pindah Kelas`, `Naik Kelas`, dan `Lulus` untuk banyak siswa menggunakan checkbox yang sudah tersedia;
- preview dan konfirmasi sebelum perubahan;
- 7A → 8A, 8A → 9A, dan 9A → Lulus secara otomatis;
- riwayat Setoran, Catatan, Juziyah, dan perkembangan tidak dihapus.

## V51 — Review Rapor kelas & semua

Selain pratinjau rapor individu, Rapor sekarang memiliki:
- `Review Satu Kelas` untuk seluruh siswa dalam kelas terpilih;
- `Review Semua` untuk seluruh siswa aktif;
- navigasi siswa Sebelumnya/Berikutnya;
- dropdown untuk langsung memilih siswa dalam daftar review;
- tombol `Cetak Siswa Ini`;
- tombol `Cetak Semua dalam Daftar` setelah review.
Template pratinjau tetap sama dengan rapor individu agar review dan PDF konsisten.

## V52 — Pemisahan Review dan Cetak Rapor

Tombol Rapor sekarang dikelompokkan menjadi dua area berbeda:
- `REVIEW`: Review Satu Kelas dan Review Semua;
- `CETAK / DOWNLOAD`: PDF Siswa Dipilih, PDF Satu Kelas, PDF Semua Siswa.

Tujuannya agar fungsi meninjau dan fungsi menghasilkan file tidak terlihat sebagai satu kelompok tindakan yang sama.

## V53 — Pengingat motivasi guru saat membuka aplikasi

Saat aplikasi pertama kali dibuka dalam satu sesi browser:
- satu ayat Al-Qur'an atau hadis dipilih secara acak;
- popup menampilkan sumbernya;
- ditutup dengan tombol `Saya siap membina`;
- popup tidak muncul berulang selama tab/sesi yang sama;
- membuka aplikasi pada sesi baru memilih kutipan secara acak lagi.

Kutipan diposisikan sebagai pengingat nilai peran guru dalam membimbing hafalan siswa.

## V54 — Pengingat guru yang lebih halus

Bahasa popup motivasi disesuaikan agar terasa hangat, menghargai peran guru, tetapi tetap profesional dan tidak terlalu personal.
- Judul: `PENGINGAT HARI INI`
- Pesan utama menekankan dampak jangka panjang dari bimbingan guru.
- Penutup: `Terima kasih telah menjaga proses mereka.`
- Tombol: `Mulai Pembinaan →`

## V55 — Popup motivasi independen dari Firestore

Popup `Pengingat Hari Ini` sekarang dipanggil segera setelah Firebase Authentication berhasil menampilkan aplikasi, sebelum `loadAll()` membaca Firestore.
Dengan demikian popup tetap muncul walaupun pengambilan data Firestore gagal atau koneksi sedang bermasalah.
Pemanggilan yang sebelumnya salah masuk ke fungsi Monitoring juga sudah dihapus.

## V56 — Motivasi setiap login

Popup `Pengingat Hari Ini` sekarang tampil setiap kali autentikasi berhasil.
Logout lalu login kembali akan menampilkan popup lagi dengan kutipan acak baru.
Refresh halaman tanpa logout tidak dianggap sebagai login baru.


## V57 — White Label Foundation

Branding dan Firebase config sekarang dapat diganti lewat file:
- `data/tenant-config.json`
- `data/firebase-config.json`
- `assets/tenant-logo.png`

Internal dashboard dan portal wali murid sama-sama membaca konfigurasi tersebut.
Lihat `WHITE_LABEL_GUIDE.md`.

## V58 — Akun Saya & Ganti Password

User internal sekarang memiliki menu `Akun` di header.
- melihat email akun Firebase Authentication;
- mengganti password sendiri dari aplikasi;
- password saat ini diverifikasi dengan `reauthenticateWithCredential`;
- password baru disimpan memakai `updatePassword`;
- tidak membutuhkan collection `users` tambahan di Firestore.


## V59 — Lihat password
Menambahkan tombol ikon mata pada password saat ini, password baru, dan konfirmasi password baru. Ikon berubah antara tampil/sembunyikan tanpa mengubah nilai password.

## V60 — Mobile editing UX

Pada layar mobile, tabel Setoran dan Catatan tidak lagi dipaksa menjadi spreadsheet horizontal. Aplikasi menggunakan kartu per siswa:
- Setoran: tampilkan setoran terakhir + tombol `Edit Setoran` + `Riwayat`;
- Catatan: tampilkan catatan terakhir, saran orang tua, konteks setoran + tombol `Edit Catatan` + `Riwayat`.

Desktop tetap memakai tabel spreadsheet seperti sebelumnya.


## V62 — Mobile navigation
Semua 8 menu internal sekarang terlihat pada mobile dalam grid 4x2 di bottom navigation: Dashboard, Data Siswa, Setoran, Juziyah, Catatan, Monitoring, Laporan, dan Rapor.


## V63 — Monitoring & Laporan mobile responsive
Monitoring kini memiliki kartu siswa untuk tanggal terpilih dan kartu riwayat periode di mobile. Laporan memiliki kartu rekap per siswa, filter dua kolom, statistik dua kolom, dan layout satu kolom pada mobile. Desktop tetap memakai tabel lengkap.


## V64 — Monitoring & Laporan table visible on mobile
Mobile now keeps the actual Monitoring and Laporan tables visible inside horizontal scroll containers. The mobile card summaries are hidden for these two pages so the table remains the source of truth on phone screens.


## V65 — Mobile Monitoring/Laporan visual refinement
Refined mobile table widths, sticky columns, typography, spacing, tabs, and class summary cards so Monitoring and Laporan remain table-based but are easier to scan and horizontally scroll on phones.

## V66 — Monitoring mobile sticky refinement

Pada mobile, hanya kolom `NIS` yang tetap sticky. Kolom `Nama Siswa` sekarang ikut bergulir horizontal sehingga ruang untuk `Status Setor`, `Surah`, `Ayat`, dan `Status Hafalan` lebih luas.

## V67 — Laporan mobile horizontal scrolling

Tabel Rekap Siswa pada Laporan sekarang dipaksa menjadi tabel dengan lebar konten yang lebih besar dari viewport dan wrapper khusus sebagai horizontal scroll container. Touch scrolling horizontal diaktifkan dan ditambahkan petunjuk geser di bawah tabel.


## V68 — Mobile bottom navigation spacing
Increased mobile content bottom spacing so the fixed 4x2 navigation no longer overlaps the bottom of Monitoring and Laporan content/tables.

## V69 — Laporan mobile layout refinement

Laporan mobile kini mencegah overflow halaman secara keseluruhan. Filter, statistik, ringkasan kelas, catatan, dan concept card dibuat fluid terhadap lebar layar. Hanya area `Rekap Siswa` yang boleh scroll horizontal, dengan tabel yang memiliki lebar konten terkontrol.

## V70 — Rapor preview follows paper size

Pratinjau Rapor tidak lagi berubah menjadi layout mobile. Saat dibuka di HP:
- isi rapor tetap memakai layout kertas;
- A4 tetap 210 × 297 mm;
- F4 tetap 215.9 × 330.2 mm;
- preview dapat digeser horizontal jika kertas lebih lebar dari layar;
- grid identitas, metrik, tanda tangan, ukuran logo, dan typography di dalam kertas tidak ikut collapse menjadi layout mobile.

## V71 — Sertifikat Juziyah preview follows A4

Preview sertifikat Juziyah sekarang menggunakan kanvas kertas A4 tetap (210 × 297 mm), sama prinsipnya dengan Preview Rapor.
Pada mobile hanya viewport preview yang dapat digeser horizontal; isi sertifikat tidak diubah menjadi layout mobile.

## V72 — Motivation popup mobile button fix

Pada layar mobile, popup motivasi sekarang memiliki tinggi maksimum mengikuti viewport dan dapat di-scroll jika diperlukan. Footer tombol dibuat sticky sehingga `Mulai Pembinaan →` selalu terlihat dan dapat ditekan.


## V73 — Portal Orang Tua Tahfidz

Portal orang tua direbuild memakai pola UI dari referensi portal SPA yang diberikan:
- halaman awal pencarian NIS;
- dashboard dengan hero, statistik, kartu data;
- sidebar desktop;
- bottom navigation mobile;
- halaman Beranda, Setoran, Perkembangan, Catatan, dan Juziyah;
- tetap tanpa username/password untuk orang tua.

UI diadaptasi menjadi tema hijau Tahfidz/Bina Tahfidz dan hanya menampilkan data yang memang sudah dimirror ke `tahfidz_portal/{nis}`.

Juziyah sekarang ikut dimirror ke:
`tahfidz_portal/{nis}/juziyah`
saat guru menyimpan/menghapus hasil Juziyah, agar bisa ditampilkan aman di portal orang tua.

## V74 — Parent portal icon refinement

Mengganti glyph/karakter teks pada navigasi Portal Orang Tua dengan inline SVG icons yang lebih konsisten dan bersih. Tombol refresh dan ganti siswa juga menggunakan SVG.

## V75 — Parent portal NIS lookup compatibility

Portal orang tua sekarang:
1. mencoba `tahfidz_portal/{NIS}` terlebih dahulu;
2. bila tidak ditemukan, mencari dokumen `tahfidz_portal` berdasarkan field `nis`;
3. mencoba tipe string dan numeric untuk data impor lama;
4. setelah menemukan dokumen, subcollection setoran/catatan/juziyah dibaca dari referensi dokumen tersebut.

Ini mencegah portal gagal hanya karena ID dokumen portal lama tidak persis sama dengan NIS.

## V76 — Juziyah portal projection/backfill

Memperbaiki Juziyah orang tua:
- menambahkan rules untuk `tahfidz_portal/{nis}/juziyah/{id}`;
- hasil Juziyah baru otomatis dimirror dengan projection publik;
- hasil Juziyah lama otomatis di-backfill ke portal saat dashboard internal berhasil memuat koleksi Juziyah;
- field internal seperti `createdBy` dan `updatedBy` tidak ikut diekspos ke portal.
