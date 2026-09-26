# White Label Deployment Guide

Aplikasi dapat digunakan sebagai template untuk sekolah lain.

## File tenant

`data/tenant-config.json` berisi branding per sekolah:
- `tenantId`
- `productName`
- `programName`
- `schoolName`
- `schoolShortName`
- `portalName`
- `internalTagline`
- `parentTagline`
- `logo`
- `footerText`
- `theme`
- `features`

Logo aktif adalah `assets/tenant-logo.png`. Untuk tenant baru, ganti file tersebut.

## Firebase per sekolah

`data/firebase-config.json` sekarang dibaca saat runtime oleh dashboard internal dan portal wali murid.

Untuk model jual/sewa yang paling sederhana, gunakan **satu Firebase project per sekolah**. Dengan begitu data antar sekolah tidak bercampur dan aturan Firestore tetap sederhana.

```text
Sekolah A
  ├─ tenant-config.json
  ├─ firebase-config.json
  ├─ tenant-logo.png
  └─ database A

Sekolah B
  ├─ tenant-config.json
  ├─ firebase-config.json
  ├─ tenant-logo.png
  └─ database B
```

## Contoh tenant

```json
{
  "tenantId": "sekolah-abc",
  "productName": "Bina Tahfidz",
  "programName": "Tahfidz",
  "schoolName": "SMP Islam Contoh",
  "schoolShortName": "SMP Contoh",
  "portalName": "Portal Wali Murid",
  "internalTagline": "Kelola perkembangan hafalan siswa.",
  "parentTagline": "Pantau perkembangan hafalan putra-putri Anda.",
  "logo": "../assets/tenant-logo.png",
  "footerText": "Bina Tahfidz · SMP Islam Contoh",
  "theme": {
    "primary": "#087443",
    "primaryDark": "#075b36",
    "primaryLight": "#eaf6ef",
    "gold": "#c9a45b",
    "pageBackground": "#f4f8f5"
  },
  "features": {
    "juziyah": true,
    "rapor": true,
    "laporan": true,
    "monitoring": true
  }
}
```

## Catatan arsitektur

V57 adalah fondasi white-label **per deployment**, bukan multi-tenant SaaS dalam satu database.

Ini cocok untuk:
- jual putus;
- sewa per sekolah;
- deployment dengan subdomain sekolah;
- branding berbeda tetapi source code/fungsi sama.

Multi-tenant satu server/database dapat dibuat tahap berikutnya dengan `tenantId` pada setiap data dan isolasi rules berdasarkan tenant.
