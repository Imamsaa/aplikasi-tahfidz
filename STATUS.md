# Tahfidz App V2 — Authentication Only

- Firebase Authentication adalah satu-satunya identitas user internal.
- Tidak ada collection users Firestore.
- Tidak ada tahfidz_users.
- Semua user Auth memiliki hak internal yang sama.
- Orang tua hanya memakai NIS.
- Portal orang tua membaca projection publik `tahfidz_portal/{NIS}` + subcollection `setoran`/`catatan`.


## V7 — Typography & spacing
Jarak antara navigasi atas dan konten dipadatkan, judul/form/tabel diperbesar, serta whitespace pada halaman Data Siswa dan halaman lain dikurangi tanpa mengubah fungsi.


## V8 — School branding & desktop layout
Logo SMPIT Al Firdaus Purwodadi ditambahkan. Margin vertikal desktop diperbaiki (`margin: 0 auto`) sehingga konten mulai wajar di bawah header. Font form/tabel diperbesar.


## V9 — Data entry & alerts
Spreadsheet-like siswa editing, import/export/paste, bulk delete, dan custom alert/confirm modal.


## V10 — Student development profile
Added complete student progress view: setoran history, memorization by surah, latest memorization, status distribution, and teacher notes.


## V11 — Popup fix
Fixed inline module handlers: loadAll/closeModal and other popup actions are available on window; added Escape/overlay-close support; JS syntax checked with Node.


## V12 — Surah dropdown
Fixed blank/non-working Surah select by auto-seeding master 114 surah when collection is empty and adding explicit placeholder/validation.


## V13 — Better icons & menu typography
Replaced emoji/text icons with inline SVG icons and increased sidebar menu typography.


## V14 — Student-centric setoran
Redesigned Dashboard for all-student statistics and Setoran into one row per student with latest setoran inline-edit + bulk paste.


## V15 — Setoran history semantics
Table grows vertically, latest setoran per student, new date creates history, existing date updates existing history after confirmation.


## V16 — Setoran inline fix
Fixed missing markSetoranRowDirty global handler and added dynamic max-ayat validation per selected surah.


## V17 — Catatan history + reference
Latest note per student, full note history, reference to latest/specific setoran, and bulk paste.


## V18 — Inline catatan editing
Added direct table editing, save one/all, reference-to-setoran editing, date-based update/history behavior, and bulk last-note delete.


## V19 — Setoran edit mode & table alignment
Removed accidental extra checkbox header in Setoran and added explicit Edit Tabel mode with unsaved-change protection.


## V20 — Catatan scroll fix
Fixed Catatan sticky-column offsets and scoped horizontal scrolling to the Catatan table area.


## V21 — Catatan clean table
Removed unnecessary Catatan checkbox column and reset sticky offsets to NIS=0, Nama=92px.


## V22 — Catatan geometry fix
Added explicit colgroup widths and fixed table layout to prevent sticky columns from overlapping the note column.


## V23 — Catatan column alignment
Inserted missing Kelas cell into Catatan rows and corrected empty-state colspan.


## V24 — Unified progress profile
Catatan History now delegates to the same unified openStudentProgress profile used by Setoran, with note-to-setoran context displayed in the profile.


## V25 — Bulk setoran template
Added NIS + Nama Siswa columns, auto-generated full-student template, copy/download template actions, name ignored for identity, and blank template rows skipped.


## V26 — Auto today for blank date
Bulk setoran parser uses today's local browser date when tanggal is blank.


## V27 — Real XLSX workflow
Textarea starts empty; Download Template generates a real .xlsx workbook via SheetJS containing active students and blank setoran columns.


## V28 — Excel dropdowns
Added Surah and Status dropdowns to the real XLSX template generated in the browser.


## V29 — Real Excel data validation
Replaced SheetJS template generation with ExcelJS because dropdown validation was not reliably written to the XLSX by the previous generator.


## V30 — Catatan Excel workflow
Added Excel-first Catatan template, NIS + name, reference setoran date, auto-today note date, and date-based update/history semantics for bulk paste.


## V31 — Unified profile restored
Setoran and Catatan history now use one canonical student development profile.


## V32 — Monitoring setoran
Date-specific monitoring + date-range matrix + Excel exports for current date and period.


## V33 — Modal regression fix
Restored missing modals from V31 and added null-safe DOM handling for select population and modal close.


## V34 — Monitoring tabs
Replaced stacked dual-table Monitoring view with tab navigation for selected-date and period-history tables.


## V35 — Monitoring cell cleanup
Replaced bulky period cells with compact clickable status chips.


## V36 — Laporan concept
Added a temporary school-report concept with period/class filters, student/class summaries, notes, and Excel export.


## V37 — Laporan sidebar
Added the missing Laporan nav button using the app's actual navbtn structure.


## V38 — Laporan icon
Added the missing file-chart-column icon to the local icon registry.


## V39 — Rapor PDF
Added temporary report-card page with individual/class/all PDF export using jsPDF + AutoTable.


## V40 — Rapor paper sizes & logo
Added A4/F4 paper selection and embedded SMPIT Al Firdaus Purwodadi logo in PDF export and preview.


## V41 — Juziyah
Added Juziyah management, A4 certificate PDF for Lulus results, Excel export, and Juziyah tab in unified student progress.


## V42 — Juziyah runtime fix
Restored Juziyah state, Firestore load, CRUD, export, certificate, progress tab, and award icon; exposed inline handlers on window.


## V43 — Juziyah permission guard
Juziyah read is now non-fatal during initial load when Firestore rules are not yet configured.


## V44 — Juziyah table model
Changed Juziyah main table to one row per student with latest result; full multiple-attempt history remains in the student development profile.


## V45 — One student row with all Juz
The main Juziyah table now aggregates all tested Juz per student into one row; each Juz displays its latest result.


## V46 — Multi-Juz sessions and certificate review
Added session grouping, multi-Juz entry, certificate picker, review modal, and immutable historical certificate eligibility.


## V47 — Shared functions restored
Restored shared utilities and window exports from V45.


## V49 — Report/Rapor page initialization
Restored page-specific rendering on navigation so Laporan and Rapor populate their controls/data immediately when opened.


## V50 — Student class management
Individual and bulk class transfer, promotion, and graduation with confirmation and persistent history.


## V51 — Batch report review
Added review workflow for class/all report batches with per-student navigation before PDF export.


## V52 — Rapor action grouping
Separated review actions from PDF print/download actions visually and semantically.


## V53 — Teacher motivation startup popup
Added random Quran/hadith motivational reminder on first app open per browser session.


## V54 — Refined teacher motivation copy
Refined the startup motivational popup to feel warm, appreciative, and professional without sounding personally romantic.


## V55 — Motivation popup startup fix
Moved motivation popup trigger to authenticated app-shell initialization, independent of Firestore/data loading.


## V56 — Motivation every login
Removed sessionStorage gating; motivation popup now appears after each successful authentication.


## V57 — White-label foundation
Added tenant branding config, dynamic Firebase config, shared tenant logo, runtime theme variables, parent portal branding, and deployment guide.


## V58 — Account/password management
Added self-service Firebase Authentication password change with recent-auth verification and a small account modal in the header.


## V59 — Password visibility
Added eye toggles for all password fields in Account modal.


## V60 — Mobile editing UX
Added mobile student cards for Setoran and Catatan to avoid horizontal spreadsheet editing on phones while preserving desktop tables.


## V62 — Mobile navigation
Changed bottom navigation to a 4x2 grid so all eight pages are directly accessible on phone screens.


## V63 — Monitoring/Laporan responsive
Added dedicated mobile cards and responsive filter/grid layout while preserving desktop tables.


## V64 — Monitoring/Laporan mobile tables
Restored actual tables on mobile with horizontal scrolling and compact cells; mobile card summaries are hidden on these pages.


## V65 — Mobile Monitoring/Laporan refinement
Fixed sticky-column alignment and improved compact mobile table readability and spacing.


## V66 — Monitoring mobile sticky refinement
Only NIS remains sticky on monitoring mobile; student name now scrolls with the table to reveal more columns.


## V67 — Laporan table mobile scroll
Forced horizontal scroll container and content width for the mobile Laporan table.


## V68 — Mobile bottom nav spacing
Added extra bottom padding to page content and report/monitoring sections to prevent the fixed navigation bar from covering table rows.


## V69 — Laporan mobile layout refinement
Prevented page-wide horizontal overflow and constrained the report table scrolling to its own container; report cards now use fluid widths.


## V70 — Rapor paper preview on mobile
Kept report preview as fixed A4/F4 paper dimensions on mobile; only the preview viewport scrolls horizontally.


## V71 — Juziyah certificate paper preview
Kept certificate preview at A4 dimensions on mobile; only preview viewport scrolls horizontally.


## V72 — Motivation mobile button visibility
Fixed mobile motivation popup footer clipping; action button remains visible via sticky footer and scrollable modal body.


## V73 — Parent portal redesign
Rebuilt the parent portal UI using the uploaded ICT SPA as a visual/interaction reference, while adapting navigation and content to Tahfidz.
Added responsive dashboard pages for Beranda, Setoran, Perkembangan, Catatan, and Juziyah.
Added Juziyah mirroring into tahfidz_portal/{nis}/juziyah for parent-safe display.

## V74 — Parent portal icons
Replaced text glyph icons with consistent inline SVG icons across desktop sidebar, mobile bottom nav, refresh, and change-student controls.

## V75 — Parent portal lookup compatibility
Added direct-document and field-based NIS fallback lookup, including numeric NIS compatibility, and read child collections from the resolved portal document reference.

## V76 — Juziyah portal projection/backfill
Added Juziyah portal rules and one-session historical backfill, with sanitized public projection for parent portal.
