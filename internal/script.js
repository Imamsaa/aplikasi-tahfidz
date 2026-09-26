import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getAuth, setPersistence, browserLocalPersistence,
  signInWithEmailAndPassword, onAuthStateChanged, signOut,
  EmailAuthProvider, reauthenticateWithCredential, updatePassword,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc,
  updateDoc, deleteDoc, writeBatch, serverTimestamp, query, orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


const ICONS = {
  "layout-dashboard": `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.2"></rect><rect x="14" y="3" width="7" height="7" rx="1.2"></rect><rect x="3" y="14" width="7" height="7" rx="1.2"></rect><rect x="14" y="14" width="7" height="7" rx="1.2"></rect></svg>`,
  "users": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  "book-open-check": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 4.5A2.5 2.5 0 0 1 5 2h5.5v18H5a2.5 2.5 0 0 0-2.5 2.5z"></path><path d="M21.5 4.5A2.5 2.5 0 0 0 19 2h-5.5v18H19a2.5 2.5 0 0 1 2.5 2.5z"></path><path d="m16.5 10 1.8 1.8 3.2-3.2"></path></svg>`,
  "message-square-text": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3v-7a4 4 0 0 1-1-3V7a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4z"></path><path d="M7 8h10"></path><path d="M7 12h7"></path></svg>`,
  "chart-no-axes-combined": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18"></path><path d="m7 15 3-3 3 2 5-6"></path><path d="M18 8h3v3"></path></svg>`,
  "file-chart-column": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M8 17v-3"></path><path d="M12 17v-6"></path><path d="M16 17v-8"></path></svg>`,
  "file-badge": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><circle cx="12" cy="14" r="3"></circle><path d="m13.8 16.4 1.1 3.1-2.9-1.3-2.9 1.3 1.1-3.1"></path></svg>`,
  "award": `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="5"></circle><path d="M8.5 12.1 7 21l5-3 5 3-1.5-8.9"></path><path d="m10 8 1.3 1.3L14.5 6"></path></svg>`,
  "bell": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg>`,
  "settings": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06A1.7 1.7 0 0 0 16.06 18l-.2.08a1.7 1.7 0 0 0-1.06 1.56V20h-2.55v-.36A1.7 1.7 0 0 0 11.2 18.1L11 18a1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 7.66 15l-.08-.2A1.7 1.7 0 0 0 6.02 13.7H5.5v-2.55h.52A1.7 1.7 0 0 0 7.58 10l.08-.2a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.8-1.8.06.06A1.7 1.7 0 0 0 11 6.46l.2-.08A1.7 1.7 0 0 0 12.26 4.8V4.5h2.55v.3a1.7 1.7 0 0 0 1.06 1.56l.2.08a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0 0 19.4 10l.08.2a1.7 1.7 0 0 0 1.56 1.06h.46v2.55h-.46A1.7 1.7 0 0 0 19.48 15z"></path></svg>`
};

let juziyahPortalBackfillDone = false;

function renderIcons() {
  document.querySelectorAll("[data-icon]").forEach(el => {
    const name = el.getAttribute("data-icon");
    if (ICONS[name]) el.innerHTML = ICONS[name];
  });
}



// V47 restored shared functions from V45
function addDays(baseDate, amount) {
  const d = new Date(`${baseDate}T00:00:00`);
  d.setDate(d.getDate() + amount);
  return formatLocalDate(d);
}

function buildStudentHafalan(progress) {
  const map = new Map();

  progress.forEach(p => {
    const key = String(p.idSurah);
    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        idSurah: p.idSurah,
        namaSurah: p.namaSurah,
        juz: p.juz,
        totalAyat: Number(p.totalAyat) || 0,
        ayat: Number(p.ayatTerakhir) || 0,
        status: p.status,
        tanggal: p.tanggal,
        count: 1
      });
      return;
    }

    existing.count += 1;

    // Highest recorded ayat is used as the student's maximum recorded
    // memorization progress on that surah.
    if (Number(p.ayatTerakhir) > existing.ayat) {
      existing.ayat = Number(p.ayatTerakhir);
    }

    if (String(p.tanggal).localeCompare(String(existing.tanggal)) > 0) {
      existing.status = p.status;
      existing.tanggal = p.tanggal;
    }
  });

  return [...map.values()]
    .map(x => ({
      ...x,
      percent: x.totalAyat ? Math.round((x.ayat / x.totalAyat) * 100) : 0
    }))
    .sort((a,b) => Number(a.idSurah) - Number(b.idSurah));
}


function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) {
    console.warn(`Modal tidak ditemukan: ${id}`);
    return false;
  }

  if (modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }

  if (id !== "noticeModal") {
    document.getElementById("noticeModal")?.classList.add("hidden");
  }
  if (id !== "confirmModal") {
    document.getElementById("confirmModal")?.classList.add("hidden");
  }

  modal.classList.remove("hidden");
  modal.style.display = "grid";
  modal.style.zIndex = "1200";
  void modal.offsetWidth;
  return true;
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("hidden");
  modal.style.display = "";
  const studentNis = document.getElementById("studentNis");
  if (studentNis) studentNis.disabled = false;
}

async function deleteCatatan(id) {
  const confirmed = await askConfirm(
    "Hapus catatan?",
    "Catatan ini akan dihapus dari database dan portal orang tua."
  );
  if (!confirmed) return;
  try {
    await deleteDoc(doc(db,"tahfidz_catatan",id));
    const c = catatan.find(x => x.id === id);
    if (c) await deleteDoc(doc(db, "tahfidz_portal", c.nis, "catatan", id));
    await loadAll();
  } catch(e){ alert(readableFirestoreError(e)); }
}

async function deleteSetoran(id) {
  const confirmed = await askConfirm(
    "Hapus setoran?",
    "Data setoran ini akan dihapus dari database dan portal orang tua."
  );
  if (!confirmed) return;
  try {
    await deleteDoc(doc(db,"tahfidz_setoran",id));
    const p = setoran.find(x => x.id === id);
    if (p) await deleteDoc(doc(db, "tahfidz_portal", p.nis, "setoran", id));
    await loadAll();
  } catch(e){ alert(readableFirestoreError(e)); }
}

function esc(v){ return String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }

function excelColumnName(n) {
  let s="";
  while(n>0) {
    const rem=(n-1)%26;
    s=String.fromCharCode(65+rem)+s;
    n=Math.floor((n-1)/26);
  }
  return s;
}

async function exportMonitoringCurrentDate() {
  const date = monitoringDateValue();
  const rows = getMonitoringStudents();
  if (!window.ExcelJS) {
    showNotice("Excel belum siap","Library Excel belum berhasil dimuat.","warning");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Monitoring");
    ws.addRow([
      "NIS","Nama Siswa","Kelas","Status Setor","Surah",
      "Juz","Ayat","Total Ayat","Status Hafalan"
    ]);
    makeMonitoringRowsForExport(rows,date).forEach(r => ws.addRow(r));

    ws.columns = [
      {width:12},{width:28},{width:10},{width:16},{width:22},
      {width:8},{width:10},{width:12},{width:16}
    ];
    ws.getRow(1).font = {bold:true,color:{argb:"FFFFFF"}};
    ws.getRow(1).fill = {type:"pattern",pattern:"solid",fgColor:{argb:"087443"}};
    ws.views = [{state:"frozen",ySplit:1}];
    ws.autoFilter = {from:"A1",to:`I${Math.max(1,rows.length+1)}`};

    const info = workbook.addWorksheet("Petunjuk");
    info.addRow([`Monitoring tanggal ${formatMonitoringDate(date)}`]);
    info.addRow(["Sudah setor = ada riwayat setoran pada tanggal tersebut. Belum setor = tidak ada setoran tercatat."]);
    info.getColumn(1).width = 100;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monitoring-setoran-${date}.xlsx`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);

    showNotice("Export monitoring selesai",`${rows.length} siswa diekspor untuk ${formatMonitoringDate(date)}.`);
  } catch(e) {
    console.error(e);
    showNotice("Gagal export",e?.message || "Export Excel gagal.","warning");
  }
}

async function exportMonitoringRange() {
  const dates = getDateRange(
    document.getElementById("monitoringStartDate")?.value || addDays(today(),-6),
    document.getElementById("monitoringEndDate")?.value || today()
  );
  const rows = getMonitoringStudents();

  if (!dates.length) {
    showNotice("Rentang tanggal tidak valid","Pilih tanggal mulai dan tanggal akhir.","warning");
    return;
  }
  if (!window.ExcelJS) {
    showNotice("Excel belum siap","Library Excel belum berhasil dimuat.","warning");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();

    const summary = workbook.addWorksheet("Rekap Periode",{
      views:[{state:"frozen",ySplit:1,xSplit:3}]
    });

    summary.addRow([
      "NIS","Nama Siswa","Kelas",
      ...dates.map(d => formatMonitoringDate(d))
    ]);

    rows.forEach(s => {
      summary.addRow([
        s.nis,s.nama,s.kelas,
        ...dates.map(d => {
          const p = getSetoranForStudentDate(s.nis,d);
          return p
            ? `${p.namaSurah} | Ayat ${p.ayatTerakhir} | ${p.status}`
            : "";
        })
      ]);
    });

    summary.columns = [
      {width:12},{width:28},{width:10},
      ...dates.map(() => ({width:24}))
    ];
    summary.getRow(1).font = {bold:true,color:{argb:"FFFFFF"}};
    summary.getRow(1).fill = {type:"pattern",pattern:"solid",fgColor:{argb:"087443"}};
    summary.autoFilter = {from:"A1",to:`${excelColumnName(3+dates.length)}${Math.max(1,rows.length+1)}`};

    // A second sheet with one record per setoran is useful for filtering.
    const detail = workbook.addWorksheet("Detail Setoran");
    detail.addRow([
      "Tanggal","NIS","Nama Siswa","Kelas","Surah","Juz",
      "Ayat","Total Ayat","Status Hafalan"
    ]);

    setoran
      .filter(p => dates.includes(String(p.tanggal)))
      .map(p => {
        const s = studentByNis(p.nis);
        return [
          p.tanggal,p.nis,s?.nama || "",s?.kelas || "",
          p.namaSurah,p.juz,p.ayatTerakhir,p.totalAyat || "",p.status
        ];
      })
      .sort((a,b) => String(b[0]).localeCompare(String(a[0])) || String(a[3]).localeCompare(String(b[3])))
      .forEach(r => detail.addRow(r));

    detail.columns = [
      {width:14},{width:12},{width:28},{width:10},{width:22},
      {width:8},{width:10},{width:12},{width:16}
    ];
    detail.getRow(1).font = {bold:true,color:{argb:"FFFFFF"}};
    detail.getRow(1).fill = {type:"pattern",pattern:"solid",fgColor:{argb:"087443"}};
    detail.views = [{state:"frozen",ySplit:1}];
    detail.autoFilter = {from:"A1",to:`I${Math.max(1,detail.rowCount)}`};

    const info = workbook.addWorksheet("Petunjuk");
    info.addRow(["MONITORING SETORAN"]);
    info.addRow([`Periode: ${formatMonitoringDate(dates[0])} — ${formatMonitoringDate(dates[dates.length-1])}`]);
    info.addRow(["Sel kosong pada Rekap Periode berarti tidak ada setoran tercatat pada tanggal tersebut."]);
    info.addRow(["Detail Setoran berisi setiap transaksi setoran pada periode yang dipilih."]);
    info.getColumn(1).width = 100;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monitoring-setoran-${dates[0]}-sd-${dates[dates.length-1]}.xlsx`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);

    showNotice("Export periode selesai",`${rows.length} siswa dan ${dates.length} tanggal diekspor.`);
  } catch(e) {
    console.error(e);
    showNotice("Gagal export",e?.message || "Export Excel gagal.","warning");
  }
}

function fillMonitoringClassFilter() {
  const select = document.getElementById("monitoringClassFilter");
  if (!select) return;

  const classes = [...new Set(
    students.map(s => String(s.kelas || "").trim()).filter(Boolean)
  )].sort();

  const current = select.value || "ALL";
  select.innerHTML =
    '<option value="ALL">Semua kelas</option>' +
    classes.map(k => `<option value="${escAttr(k)}">${esc(k)}</option>`).join("");

  select.value = classes.includes(current) ? current : "ALL";
}

function formatLocalDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

function formatMonitoringDate(dateText) {
  if (!dateText) return "-";
  const [y,m,d] = String(dateText).split("-");
  if (!y || !m || !d) return dateText;
  return `${d}/${m}/${y}`;
}

function getDateRange(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return [];

  const dates = [];
  const cursor = new Date(start);
  let guard = 0;

  while (cursor <= end && guard < 93) {
    dates.push(formatLocalDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
    guard++;
  }

  return dates;
}

function getMonitoringStudents() {
  const q = document.getElementById("monitoringSearch")?.value.toLowerCase().trim() || "";
  const cls = document.getElementById("monitoringClassFilter")?.value || "ALL";

  return students
    .filter(s => s.aktif !== false)
    .filter(s => {
      const text = `${s.nis} ${s.nama} ${s.kelas}`.toLowerCase();
      return text.includes(q) && (cls === "ALL" || String(s.kelas) === cls);
    })
    .sort((a,b) =>
      String(a.kelas).localeCompare(String(b.kelas)) ||
      String(a.nama).localeCompare(String(b.nama))
    );
}

function getSetoranForStudentDate(nis, tanggal) {
  return setoran
    .filter(p => String(p.nis) === String(nis) && String(p.tanggal) === String(tanggal))
    .sort((a,b) => Number(b.createdAt?.seconds || 0) - Number(a.createdAt?.seconds || 0))[0] || null;
}

function jsq(v){ return String(v).replaceAll("\\","\\\\").replaceAll("'","\\'"); }

function makeMonitoringRowsForExport(rows, date) {
  return rows.map(s => {
    const p = getSetoranForStudentDate(s.nis, date);
    return [
      s.nis,
      s.nama,
      s.kelas,
      p ? "Sudah setor" : "Belum setor",
      p?.namaSurah || "",
      p?.juz || "",
      p?.ayatTerakhir || "",
      p?.totalAyat || "",
      p?.status || ""
    ];
  });
}

function monitoringDateValue() {
  return document.getElementById("monitoringDate")?.value || today();
}

function monitoringEndValue() {
  return document.getElementById("monitoringEndDate")?.value || today();
}

function monitoringStartValue() {
  return document.getElementById("monitoringStartDate")?.value || addDays(today(), -6);
}

function openCatatanModal(id="") {
  const c = catatan.find(x => x.id === id);
  const nis = c?.nis || students.find(s => s.aktif !== false)?.nis || "";

  document.getElementById("catatanModalTitle").textContent = c ? "Edit Catatan" : "Catatan untuk Orang Tua";
  document.getElementById("catatanId").value = c?.id || "";
  document.getElementById("catatanNis").value = nis;
  document.getElementById("catatanPesan").value = c?.pesan || "";
  document.getElementById("catatanSaran").value = c?.saranOrtu || "";
  document.getElementById("catatanTanggal").value = c?.tanggal || today();

  populateCatatanReferenceSelect(nis, c?.setoranId || "");

  document.getElementById("catatanNis").onchange = () => {
    populateCatatanReferenceSelect(document.getElementById("catatanNis").value);
  };

  document.getElementById("catatanSetoranRef").onchange = () => {
    updateCatatanReferencePreview(document.getElementById("catatanNis").value);
  };

  document.getElementById("catatanModal").classList.remove("hidden");
}

function openCatatanModalForStudent(nis) {
  openCatatanModal();
  document.getElementById("catatanNis").value = String(nis);
}

function openSetoranModal(id="") {
  const p = setoran.find(x=>x.id===id);
  document.getElementById("setoranModalTitle").textContent = p ? "Edit Setoran" : "Setoran Hafalan";
  document.getElementById("setoranId").value = p?.id || "";
  document.getElementById("setoranNis").value = p?.nis || students.find(s=>s.aktif!==false)?.nis || "";
  document.getElementById("setoranSurah").value = p
    ? String(p.idSurah)
    : (surahs[0] ? String(surahs[0].id) : "");
  document.getElementById("setoranAyat").value = p?.ayatTerakhir || "";
  document.getElementById("setoranStatus").value = p?.status || "Lancar";
  document.getElementById("setoranTanggal").value = p?.tanggal || today();
  document.getElementById("setoranModal").classList.remove("hidden");
}

function openSetoranModalForStudent(nis) {
  openSetoranModal();
  document.getElementById("setoranNis").value = String(nis);
}

function openStudentModal(nis="") {
  const s = studentByNis(nis);
  document.getElementById("studentModalTitle").textContent = s ? "Edit Siswa" : "Tambah Siswa";
  document.getElementById("studentOriginalNis").value = s?.nis || "";
  document.getElementById("studentNis").value = s?.nis || "";
  document.getElementById("studentNama").value = s?.nama || "";
  document.getElementById("studentKelas").value = s?.kelas || "";
  document.getElementById("studentAktif").value = String(s?.aktif !== false);
  const studentStatusHint = document.getElementById("studentStatusHint");
  if (studentStatusHint) {
    studentStatusHint.textContent = s?.statusSiswa === "Lulus"
      ? "Siswa sudah lulus. Untuk perubahan kelas gunakan Manajemen Kelas."
      : s?.aktif === false
        ? "Siswa nonaktif."
        : "Siswa aktif mengikuti pembinaan.";
  }
  document.getElementById("studentNis").disabled = !!s;
  document.getElementById("studentModal").classList.remove("hidden");
}

function openStudentProgress(nis, focusTab = "ringkasan") {
  const student = studentByNis(nis);
  if (!student) {
    showNotice("Siswa tidak ditemukan", "Data siswa tidak tersedia.", "warning");
    return;
  }

  progressStudentNis = String(nis);

  const progress = getSetoranByStudent(nis);
  const notes = getStudentCatatanHistory(nis);
  const juziyahHistory = getJuziyahForStudent(nis);
  const perSurah = buildStudentHafalan(progress);

  const lancar = progress.filter(p => p.status === "Lancar").length;
  const mengulang = progress.filter(p => p.status === "Mengulang").length;
  const total = progress.length;
  const lancarPct = total ? Math.round((lancar / total) * 100) : 0;
  const ulangPct = total ? Math.round((mengulang / total) * 100) : 0;
  const latest = progress[0] || null;

  document.getElementById("progressStudentName").textContent = student.nama;
  document.getElementById("progressStudentMeta").textContent =
    `NIS ${student.nis} · Kelas ${student.kelas} · ${student.aktif === false ? "Nonaktif" : "Aktif"}`;

  document.getElementById("progressTotalSetoran").textContent = total;
  document.getElementById("progressSurahCount").textContent = perSurah.length;
  document.getElementById("progressLancarCount").textContent = lancar;
  document.getElementById("progressCatatanCount").textContent = notes.length;
  const progressJuziyahCount = document.getElementById("progressJuziyahCount");
  if (progressJuziyahCount) progressJuziyahCount.textContent = juziyahHistory.filter(x => x.hasil === "Lulus").length;

  document.getElementById("progressLancarPercent").textContent = `${lancarPct}%`;
  document.getElementById("progressUlangPercent").textContent = `${ulangPct}%`;
  document.getElementById("progressLancarBar").style.width = `${lancarPct}%`;
  document.getElementById("progressUlangBar").style.width = `${ulangPct}%`;

  const latestBox = document.getElementById("progressLatestMemory");
  latestBox.className = latest ? "progress-highlight" : "progress-highlight empty";
  latestBox.innerHTML = latest
    ? `<strong>${esc(latest.namaSurah)}</strong>
       <span>Juz ${esc(latest.juz)} · Ayat terakhir ${esc(latest.ayatTerakhir)} · ${esc(latest.tanggal)}</span>
       <div style="margin-top:9px">
         <span class="badge ${latest.status === "Lancar" ? "badge-green" : "badge-amber"}">${esc(latest.status)}</span>
       </div>`
    : "Belum ada setoran.";

  document.getElementById("progressJourney").innerHTML =
    perSurah.length
      ? perSurah.slice(0, 12).map(x => {
          const pct = Math.max(0, Math.min(100, x.percent));
          return `
            <div class="journey-item">
              <div class="journey-item-top">
                <div class="journey-name">${esc(x.namaSurah)}</div>
                <span class="badge ${x.status === "Lancar" ? "badge-green" : "badge-amber"}">${esc(x.status)}</span>
              </div>
              <div class="journey-meta">Juz ${esc(x.juz)} · Ayat ${esc(x.ayat)} / ${esc(x.totalAyat)} · ${pct}%</div>
              <div class="journey-progress"><span style="width:${pct}%"></span></div>
            </div>`;
        }).join("")
      : `<div class="empty" style="grid-column:1/-1">Belum ada perjalanan hafalan yang tercatat.</div>`;

  document.getElementById("progressSetoranTable").innerHTML =
    progress.length
      ? progress.map(p => `
          <tr>
            <td>${esc(p.tanggal)}</td>
            <td>${esc(p.namaSurah)}</td>
            <td>${esc(p.juz)}</td>
            <td><span class="ayah-pill">${esc(p.ayatTerakhir)}</span></td>
            <td><span class="badge ${p.status === "Lancar" ? "badge-green" : "badge-amber"}">${esc(p.status)}</span></td>
            <td><div class="actions">
              <button class="btn btn-light" onclick="closeModal('studentProgressModal'); editSetoran('${jsq(p.id)}')">Edit</button>
            </div></td>
          </tr>`).join("")
      : `<tr><td colspan="6" class="empty">Belum ada riwayat setoran.</td></tr>`;

  document.getElementById("progressHafalanList").innerHTML =
    perSurah.length
      ? perSurah.map(x => {
          const pct = Math.max(0, Math.min(100, x.percent));
          return `
          <div class="journey-item" style="margin-bottom:8px">
            <div class="journey-item-top">
              <div>
                <div class="journey-name">${esc(x.idSurah)} · ${esc(x.namaSurah)}</div>
                <div class="journey-meta">Juz ${esc(x.juz)} · Ayat terakhir ${esc(x.ayat)} dari ${esc(x.totalAyat)}</div>
              </div>
              <strong style="font-size:11px;color:#316d55">${pct}%</strong>
            </div>
            <div class="journey-progress"><span style="width:${pct}%"></span></div>
            <div style="margin-top:7px;font-size:9px;color:#8a9790">
              Setoran pada surah ini: ${esc(x.count)} kali · Terakhir: ${esc(x.tanggal)}
            </div>
          </div>`;
        }).join("")
      : `<div class="empty">Belum ada data hafalan per surah.</div>`;

  document.getElementById("progressJuziyahList").innerHTML =
    juziyahHistory.length
      ? juziyahHistory.map(r => `
          <div class="progress-juziyah-item">
            <div class="progress-juziyah-main">
              <div>
                <div class="progress-juziyah-title">Juz ${esc(r.juz)}</div>
                <div class="progress-juziyah-meta">${esc(r.tanggal)}${r.nilai !== "" && r.nilai != null ? ` · Nilai ${esc(r.nilai)}` : ""}</div>
              </div>
              <span class="badge ${r.hasil === "Lulus" ? "badge-green" : "badge-amber"}">${esc(r.hasil)}</span>
            </div>
            ${r.catatan ? `<div class="progress-juziyah-note">${esc(r.catatan)}</div>` : ""}
            <div class="actions" style="margin-top:8px">
              <button class="btn btn-light" onclick="editJuziyah('${jsq(r.id)}')">Edit</button>
              ${r.hasil === "Lulus" ? `<button class="btn btn-primary-soft" onclick="exportJuziyahCertificate('${jsq(r.id)}')">Sertifikat</button>` : ""}
            </div>
          </div>`).join("")
      : `<div class="empty">Belum ada hasil Juziyah.</div>`;

    const progressJuziyahBtn = document.getElementById("progressAddJuziyahBtn");
    if (progressJuziyahBtn) {
      progressJuziyahBtn.onclick = () => openJuziyahModalForStudent(nis);
    }

  document.getElementById("progressCatatanList").innerHTML =
    notes.length
      ? notes.map(c => {
          const ref = c.setoranReference || null;
          return `
            <div class="progress-note">
              <div class="progress-note-date">${esc(c.tanggal)}</div>
              <div class="progress-note-title">Evaluasi Guru</div>
              <div class="progress-note-text">${esc(c.pesan || "")}</div>
              ${c.saranOrtu ? `<div class="progress-note-saran"><strong>Saran Orang Tua</strong><br>${esc(c.saranOrtu)}</div>` : ""}
              ${ref ? `<div class="progress-note-reference">
                <strong>Setoran terkait</strong>
                <span>${esc(ref.tanggal)} · ${esc(ref.namaSurah)} · ayat ${esc(ref.ayatTerakhir)} · ${esc(ref.status)}</span>
              </div>` : `<div class="progress-note-reference progress-note-reference-muted">
                <strong>Setoran terkait</strong>
                <span>Tidak direferensikan ke setoran tertentu</span>
              </div>`}
              <div class="actions" style="margin-top:9px">
                <button class="btn btn-light" onclick="closeModal('studentProgressModal'); editCatatan('${jsq(c.id)}')">Edit Catatan</button>
              </div>
            </div>`;
        }).join("")
      : `<div class="empty">Belum ada catatan guru.</div>`;

  document.getElementById("progressAddSetoranBtn").onclick = () => {
    closeModal("studentProgressModal");
    openSetoranModalForStudent(nis);
  };

  document.getElementById("progressAddCatatanBtn").onclick = () => {
    closeModal("studentProgressModal");
    openCatatanModalForStudent(nis);
  };

  document.getElementById("studentProgressModal").classList.remove("hidden");
  switchProgressTab(focusTab);
}

function readableAuthError(e){ const c=e?.code||""; if(c.includes("invalid-credential"))return"Email atau password salah."; if(c.includes("too-many-requests"))return"Terlalu banyak percobaan. Coba lagi nanti."; return e?.message||"Login gagal."; }

function readableFirestoreError(e){ if(e?.code==="permission-denied")return"Firestore menolak akses. Pastikan Anda login dan rules sudah dipasang."; return e?.message||"Operasi Firestore gagal."; }

function renderLatest() {
  const rows = [...setoran].sort((a,b)=>String(b.tanggal).localeCompare(String(a.tanggal))).slice(0,8);
  document.getElementById("latestSetoran").innerHTML = rows.length ? rows.map(p => `
    <div class="activity-row">
      <div class="activity-icon">${p.status==="Lancar"?"✓":"↻"}</div>
      <div><div class="activity-name">${esc(studentByNis(p.nis)?.nama || p.nis)}</div><div class="activity-desc">${esc(p.namaSurah)} · ayat ${esc(p.ayatTerakhir)}</div></div>
      <div class="activity-time">${esc(p.tanggal)}<br><span class="badge ${p.status==="Lancar"?"badge-green":"badge-amber"}">${esc(p.status)}</span></div>
    </div>`).join("") : `<div class="empty">Belum ada setoran.</div>`;
}

function renderMonitoring() {
  fillMonitoringClassFilter();

  const selectedDate = monitoringDateValue();
  const rows = getMonitoringStudents();

  document.getElementById("monitoringDate").value = selectedDate;
  const startInput = document.getElementById("monitoringStartDate");
  const endInput = document.getElementById("monitoringEndDate");
  if (startInput && !startInput.value) startInput.value = monitoringStartValue();
  if (endInput && !endInput.value) endInput.value = monitoringEndValue();

  const done = rows.filter(s => getSetoranForStudentDate(s.nis, selectedDate));
  const notDone = rows.length - done.length;
  const mengulang = done.filter(s => getSetoranForStudentDate(s.nis, selectedDate)?.status === "Mengulang").length;
  const percent = rows.length ? Math.round((done.length / rows.length) * 100) : 0;

  document.getElementById("monDone").textContent = done.length;
  document.getElementById("monNotDone").textContent = notDone;
  document.getElementById("monPercent").textContent = `${percent}%`;
  document.getElementById("monMengulang").textContent = mengulang;
  document.getElementById("monDoneHint").textContent = `pada ${formatMonitoringDate(selectedDate)}`;

  const tbody = document.getElementById("monitoringCurrentTable");
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty">Tidak ada siswa.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(s => {
    const p = getSetoranForStudentDate(s.nis, selectedDate);

    return p
      ? `<tr class="monitoring-done-row">
          <td class="sticky-col sticky-nis student-nis-cell">${esc(s.nis)}</td>
          <td class="sticky-col sticky-name student-name-cell">${esc(s.nama)}</td>
          <td>${esc(s.kelas)}</td>
          <td><span class="monitor-status monitor-status-done">✓ Sudah setor</span></td>
          <td class="monitor-setoran-detail">
            <strong>${esc(p.namaSurah)}</strong>
            <span>Juz ${esc(p.juz)}</span>
          </td>
          <td><strong>${esc(p.ayatTerakhir)}</strong> / ${esc(p.totalAyat || "")}</td>
          <td><span class="badge ${p.status === "Lancar" ? "badge-green" : "badge-amber"}">${esc(p.status)}</span></td>
          <td><button class="btn btn-light" onclick="openStudentProgress('${jsq(s.nis)}','setoran')">Perkembangan</button></td>
        </tr>`
      : `<tr class="monitoring-pending-row">
          <td class="sticky-col sticky-nis student-nis-cell">${esc(s.nis)}</td>
          <td class="sticky-col sticky-name student-name-cell">${esc(s.nama)}</td>
          <td>${esc(s.kelas)}</td>
          <td><span class="monitor-status monitor-status-pending">— Belum setor</span></td>
          <td class="monitoring-no-data">—</td>
          <td class="monitoring-no-data">—</td>
          <td class="monitoring-no-data">—</td>
          <td><button class="btn btn-light" onclick="openStudentProgress('${jsq(s.nis)}','ringkasan')">Perkembangan</button></td>
        </tr>`;
  }).join("");

  renderMonitoringRange();
}

function renderMonitoringRange() {
  fillMonitoringClassFilter();

  let startDate = document.getElementById("monitoringStartDate")?.value || addDays(today(), -6);
  let endDate = document.getElementById("monitoringEndDate")?.value || today();

  if (startDate > endDate) {
    const swap = startDate;
    startDate = endDate;
    endDate = swap;
    document.getElementById("monitoringStartDate").value = startDate;
    document.getElementById("monitoringEndDate").value = endDate;
  }

  const dates = getDateRange(startDate, endDate);
  const rows = getMonitoringStudents();

  document.getElementById("monitoringRangeLabel").textContent =
    `${formatMonitoringDate(startDate)} — ${formatMonitoringDate(endDate)}`;

  const head = document.getElementById("monitoringRangeHead");
  head.innerHTML = `
    <tr>
      <th class="sticky-col sticky-nis">NIS</th>
      <th class="sticky-col sticky-name">NAMA SISWA</th>
      <th>KELAS</th>
      ${dates.map(d => `
        <th class="monitor-day-head">
          <div class="monitor-date-label">${formatMonitoringDate(d)}</div>
          <div class="monitor-date-week">${shortWeekday(d)}</div>
        </th>`).join("")}
    </tr>`;

  const tbody = document.getElementById("monitoringRangeTable");

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="${3 + dates.length}" class="empty">Tidak ada siswa.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(s => `
    <tr>
      <td class="sticky-col sticky-nis student-nis-cell">${esc(s.nis)}</td>
      <td class="sticky-col sticky-name student-name-cell">${esc(s.nama)}</td>
      <td>${esc(s.kelas)}</td>
      ${dates.map(d => {
        const p = getSetoranForStudentDate(s.nis, d);
        return p
          ? `<td class="monitor-cell monitor-cell-setor"
                title="${esc(p.namaSurah)} · Ayat ${esc(p.ayatTerakhir)} · ${esc(p.status)}"
                onclick="openStudentProgress('${jsq(s.nis)}','setoran')">
              <div class="monitor-progress-cell">
                <div class="monitor-surah">${esc(p.namaSurah)}</div>
                <div class="monitor-ayat">Ayat ${esc(p.ayatTerakhir)}</div>
                <span class="monitor-status-mini ${p.status === "Lancar" ? "is-lancar" : "is-mengulang"}">${esc(p.status)}</span>
              </div>
            </td>`
          : `<td class="monitor-cell monitor-cell-empty">
              <span class="empty-mark">—</span>
            </td>`;
      }).join("")}
    </tr>`).join("");
}

async function saveCatatan() {
  const id = document.getElementById("catatanId").value.trim();
  const nis = document.getElementById("catatanNis").value;
  const pesan = document.getElementById("catatanPesan").value.trim();
  const saranOrtu = document.getElementById("catatanSaran").value.trim();
  const tanggal = document.getElementById("catatanTanggal").value;
  const refValue = document.getElementById("catatanSetoranRef").value;

  if (!studentByNis(nis) || !pesan || !tanggal) {
    return alert("Siswa, catatan, dan tanggal wajib diisi.");
  }

  let referencedSetoran = null;
  if (refValue === "__LATEST__") referencedSetoran = getSetoranByStudent(nis)[0] || null;
  else if (refValue) referencedSetoran = setoran.find(p => p.id === refValue) || null;

  const payload = {
    nis,pesan,saranOrtu,tanggal,
    setoranId: referencedSetoran?.id || null,
    setoranReference: referencedSetoran ? {
      id: referencedSetoran.id,
      tanggal: referencedSetoran.tanggal,
      namaSurah: referencedSetoran.namaSurah,
      juz: referencedSetoran.juz,
      ayatTerakhir: referencedSetoran.ayatTerakhir,
      status: referencedSetoran.status
    } : null,
    updatedBy: currentUser.uid,
    updatedByName: currentUser.displayName || currentUser.email || "",
    updatedAt: serverTimestamp()
  };

  try {
    if (id) {
      await updateDoc(doc(db,"tahfidz_catatan",id),payload);
      await setDoc(doc(db,"tahfidz_portal",nis,"catatan",id),{
        nis,pesan,saranOrtu,tanggal,
        setoranId:payload.setoranId,
        setoranReference:payload.setoranReference
      },{merge:true});
    } else {
      const ref = await addDoc(collection(db,"tahfidz_catatan"),{
        ...payload,
        createdBy:currentUser.uid,
        createdByName:currentUser.displayName || currentUser.email || "",
        createdAt:serverTimestamp()
      });
      await setDoc(doc(db,"tahfidz_portal",nis,"catatan",ref.id),{
        nis,pesan,saranOrtu,tanggal,
        setoranId:payload.setoranId,
        setoranReference:payload.setoranReference
      });
    }

    closeModal("catatanModal");
    showNotice(
      "Catatan tersimpan",
      referencedSetoran
        ? `Catatan direferensikan ke ${referencedSetoran.namaSurah} ayat ${referencedSetoran.ayatTerakhir} (${referencedSetoran.tanggal}).`
        : "Catatan tersimpan tanpa referensi setoran."
    );
    await loadAll();
  } catch(e) {
    showNotice("Gagal menyimpan",readableFirestoreError(e),"warning");
  }
}

async function saveSetoran() {
  const id = document.getElementById("setoranId").value.trim();
  const nis = document.getElementById("setoranNis").value;
  const selectedSurah = document.getElementById("setoranSurah").value;
  if (!selectedSurah) return alert("Silakan pilih surah terlebih dahulu.");
  const idSurah = Number(selectedSurah);
  const ayatTerakhir = Number(document.getElementById("setoranAyat").value);
  const status = document.getElementById("setoranStatus").value;
  const tanggal = document.getElementById("setoranTanggal").value;
  const s = studentByNis(nis);
  const surah = surahs.find(x=>Number(x.id)===idSurah);

  if (!s || !surah) return alert("Siswa atau surah tidak valid.");
  if (!Number.isInteger(ayatTerakhir) || ayatTerakhir < 1 || ayatTerakhir > Number(surah.ayat)) {
    return alert(`Ayat harus 1 sampai ${surah.ayat}.`);
  }
  if (!tanggal) return alert("Tanggal wajib diisi.");

  const payload = {
    nis, idSurah, namaSurah: surah.nama, juz: surah.juz, totalAyat: surah.ayat,
    ayatTerakhir, status, tanggal,
    createdBy: currentUser.uid,
    createdByName: currentUser.displayName || currentUser.email || "",
    updatedAt: serverTimestamp()
  };

  try {
    if (id) {
      await updateDoc(doc(db,"tahfidz_setoran",id), payload);
      await updateDoc(
        doc(db, "tahfidz_portal", nis, "setoran", id),
        {nis,idSurah,namaSurah:surah.nama,juz:surah.juz,ayatTerakhir,status,tanggal}
      );
    } else {
      const ref = await addDoc(collection(db,"tahfidz_setoran"), {
        ...payload, createdAt:serverTimestamp()
      });
      await setDoc(
        doc(db, "tahfidz_portal", nis, "setoran", ref.id),
        {nis,idSurah,namaSurah:surah.nama,juz:surah.juz,ayatTerakhir,status,tanggal}
      );
    }
    closeModal("setoranModal");
    await loadAll();
  } catch(e) { alert(readableFirestoreError(e)); }
}

async function saveStudent() {
  const original = document.getElementById("studentOriginalNis").value.trim();
  const nis = document.getElementById("studentNis").value.trim();
  const nama = document.getElementById("studentNama").value.trim();
  const kelas = document.getElementById("studentKelas").value.trim();
  const aktif = document.getElementById("studentAktif").value === "true";
  const oldStudent = original ? studentByNis(original) : null;
  const statusSiswa = aktif ? "Aktif" : (oldStudent?.statusSiswa === "Lulus" ? "Lulus" : "Nonaktif");
  if (!nis || !nama || !kelas) return alert("NIS, nama, dan kelas wajib diisi.");
  try {
    const ref = doc(db, "tahfidz_siswa", nis);
    await setDoc(ref, {nis, nama, kelas, aktif, statusSiswa, updatedAt:serverTimestamp(), updatedBy:currentUser.uid}, {merge:true});
    await setDoc(doc(db, "tahfidz_portal", nis), {
      nis, nama, kelas, aktif, statusSiswa, updatedAt:serverTimestamp()
    }, {merge:true});
    closeModal("studentModal");
    await loadAll();
  } catch(e) { alert(readableFirestoreError(e)); }
}

function shortWeekday(dateText) {
  const d = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID",{weekday:"short"}).format(d);
}

function studentByNis(nis){ return students.find(s=>String(s.nis)===String(nis)); }

function switchMonitoringTab(tab) {
  const target = tab === "riwayat" ? "riwayat" : "tanggal";
  monitoringActiveTab = target;

  const tabTanggal = document.getElementById("monitorTabTanggal");
  const tabRiwayat = document.getElementById("monitorTabRiwayat");
  const panelTanggal = document.getElementById("monitorPanelTanggal");
  const panelRiwayat = document.getElementById("monitorPanelRiwayat");

  const tanggalActive = target === "tanggal";
  tabTanggal?.classList.toggle("active", tanggalActive);
  tabRiwayat?.classList.toggle("active", !tanggalActive);

  tabTanggal?.setAttribute("aria-selected", String(tanggalActive));
  tabRiwayat?.setAttribute("aria-selected", String(!tanggalActive));

  panelTanggal?.classList.toggle("hidden", !tanggalActive);
  panelRiwayat?.classList.toggle("hidden", tanggalActive);

  // Keep both datasets current so switching is instant.
  if (tanggalActive) {
    renderMonitoring();
  } else {
    renderMonitoringRange();
  }
}

function switchProgressTab(tab) {
  document.querySelectorAll(".progress-tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  document.querySelectorAll(".progress-panel").forEach(panel => {
    panel.classList.add("hidden");
  });

  document.getElementById(`progress-tab-${tab}`)?.classList.remove("hidden");
}

function today(){ return new Date().toISOString().slice(0,10); }

async function toggleStudent(nis) {
  const s = studentByNis(nis);
  if (!s) return;
  const next = s.aktif === false;
  const confirmed = await askConfirm(
    next ? "Aktifkan siswa?" : "Nonaktifkan siswa?",
    `${next ? "Aktifkan" : "Nonaktifkan"} ${s.nama}?`
  );
  if (!confirmed) return;
  await updateDoc(doc(db, "tahfidz_siswa", nis), {aktif:next, updatedAt:serverTimestamp(), updatedBy:currentUser.uid});
  await updateDoc(doc(db, "tahfidz_portal", nis), {aktif:next, updatedAt:serverTimestamp()});
  await loadAll();
}

const firebaseConfig = {
  apiKey: "AIzaSyAORCF3YPW6vWnPqTWUFmIpbMHPB8vPWHg",
  authDomain: "dibaliklayar-6623b.firebaseapp.com",
  projectId: "dibaliklayar-6623b",
  storageBucket: "dibaliklayar-6623b.firebasestorage.app",
  messagingSenderId: "894922389545",
  appId: "1:894922389545:web:d4d520b83a576e22194438",
  measurementId: "G-7D32ZHB487"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let students = [];
let surahs = [];
let setoran = [];
let catatan = [];
let juziyah = [];
let currentUser = null;
let studentEditMode = false;
let studentClassOperation = 'pindah';
let selectedStudents = new Set();
let importType = "siswa";
let confirmResolver = null;
let progressStudentNis = "";
let latestSetoranByNis = new Map();
let dirtySetoranRows = new Set();
let setoranEditMode = false;
let monitoringActiveTab = "tanggal";
let latestCatatanByNis = new Map();
let catatanEditMode = false;
let dirtyCatatanRows = new Set();

const authReady = setPersistence(auth, browserLocalPersistence).catch(console.warn);
renderIcons();

document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("accountBtn")?.addEventListener("click", openAccountModal);

document.getElementById("logoutBtn").addEventListener("click", async () => {
  const btn = document.getElementById("logoutBtn");
  const old = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="logout-icon">↪</span><span>Keluar...</span>';
  try {
    await signOut(auth);
  } finally {
    btn.disabled = false;
    btn.innerHTML = old;
  }
});

document.querySelectorAll(".navbtn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".navbtn").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    const page = document.getElementById("page-" + btn.dataset.page);
    if (!page) return;
    page.classList.remove("hidden");

    // Initialize page-specific controls immediately when the page opens.
    requestAnimationFrame(() => {
      try {
        switch (btn.dataset.page) {
          case "monitoring":
            if (typeof renderMonitoring === "function") renderMonitoring();
            break;
          case "laporan":
            if (typeof renderLaporan === "function") renderLaporan();
            break;
          case "rapor":
            if (typeof renderRapor === "function") renderRapor();
            break;
          case "juziyah":
            if (typeof renderJuziyah === "function") renderJuziyah();
            break;
          case "siswa":
            if (typeof renderStudents === "function") renderStudents();
            break;
          case "setoran":
            if (typeof renderStudentSetoranGrid === "function") renderStudentSetoranGrid();
            break;
          case "catatan":
            if (typeof renderStudentCatatanGrid === "function") renderStudentCatatanGrid();
            break;
          case "dashboard":
            if (typeof renderLatest === "function") renderLatest();
            break;
        }
      } catch (e) {
        console.error("Page render error:", btn.dataset.page, e);
      }
    });
  });
});


const TEACHER_MOTIVATIONS = [
  {
    type: "Ayat Al-Qur'an",
    text: "Allah akan meninggikan orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu beberapa derajat.",
    source: "QS. Al-Mujadilah: 11"
  },
  {
    type: "Hadis",
    text: "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur’an dan mengajarkannya.",
    source: "HR. Al-Bukhari, no. 5027"
  },
  {
    type: "Hadis",
    text: "Sesungguhnya Allah, para malaikat-Nya, penduduk langit dan bumi, bahkan semut di dalam lubangnya dan ikan di laut, mendoakan orang yang mengajarkan kebaikan kepada manusia.",
    source: "HR. At-Tirmidzi"
  },
  {
    type: "Ayat Al-Qur'an",
    text: "Dan barang siapa yang menghidupkan satu jiwa, maka seakan-akan dia telah menghidupkan seluruh manusia.",
    source: "QS. Al-Ma'idah: 32"
  },
  {
    type: "Ayat Al-Qur'an",
    text: "Maka tetaplah kamu memberi peringatan, karena sesungguhnya peringatan itu bermanfaat bagi orang-orang yang beriman.",
    source: "QS. Adz-Dzariyat: 55"
  },
  {
    type: "Hadis",
    text: "Barang siapa menempuh jalan untuk mencari ilmu, Allah akan memudahkan baginya jalan menuju surga.",
    source: "HR. Muslim"
  }
];

function getRandomTeacherMotivation() {
  const index = Math.floor(Math.random() * TEACHER_MOTIVATIONS.length);
  return TEACHER_MOTIVATIONS[index];
}

function showTeacherMotivation() {
  const modal = document.getElementById("teacherMotivationModal");
  if (!modal) return;

  // The reminder is shown once for every successful login.
  // It is not tied to sessionStorage, so logging out and logging in again
  // produces a new random reminder.
  const item = getRandomTeacherMotivation();

  document.getElementById("teacherMotivationType").textContent = item.type;
  document.getElementById("teacherMotivationText").textContent = `“${item.text}”`;
  document.getElementById("teacherMotivationSource").textContent = item.source;

  // Use the existing modal helper so the startup popup sits above the SPA.
  if (typeof openModal === "function") {
    openModal("teacherMotivationModal");
  } else {
    modal.classList.remove("hidden");
  }
}

function closeTeacherMotivation() {
  if (typeof closeModal === "function") {
    closeModal("teacherMotivationModal");
  } else {
    document.getElementById("teacherMotivationModal")?.classList.add("hidden");
  }
}

function initializeCurrentPage() {
  const active = document.querySelector(".navbtn.active")?.dataset.page || "siswa";
  switch (active) {
    case "monitoring": renderMonitoring(); break;
    case "laporan": renderLaporan(); break;
    case "rapor": renderRapor(); break;
    case "juziyah": renderJuziyah(); break;
    case "siswa": if (typeof renderStudents === "function") renderStudents(); break;
    case "setoran": if (typeof renderStudentSetoranGrid === "function") renderStudentSetoranGrid(); break;
    case "catatan": if (typeof renderStudentCatatanGrid === "function") renderStudentCatatanGrid(); break;
    default: if (typeof renderLatest === "function") renderLatest();
  }
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const err = document.getElementById("loginError");
  err.style.display = "none";
  if (!email || !password) {
    err.textContent = "Email dan password wajib diisi.";
    err.style.display = "block";
    return;
  }
  const btn = document.getElementById("loginBtn");
  btn.disabled = true; btn.textContent = "Memeriksa...";
  try {
    await authReady;
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    console.error(e);
    err.textContent = readableAuthError(e);
    err.style.display = "block";
  } finally {
    btn.disabled = false; btn.textContent = "Masuk";
  }
}


function readablePasswordError(error) {
  const code = error?.code || "";
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Password saat ini salah.";
    case "auth/weak-password":
      return "Password baru terlalu lemah. Gunakan minimal 6 karakter.";
    case "auth/password-does-not-meet-requirements":
      return "Password baru tidak memenuhi persyaratan keamanan Firebase.";
    case "auth/requires-recent-login":
      return "Sesi login sudah terlalu lama. Silakan logout lalu login kembali, kemudian coba lagi.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi.";
    case "auth/network-request-failed":
      return "Koneksi ke Firebase bermasalah. Periksa internet lalu coba lagi.";
    case "auth/user-token-expired":
      return "Sesi login telah kedaluwarsa. Silakan login kembali.";
    default:
      return error?.message || "Gagal mengubah password.";
  }
}

function openAccountModal() {
  const displayName = currentUser?.displayName || currentUser?.email || "User";
  const email = currentUser?.email || "—";
  document.getElementById("accountAvatar").textContent = displayName.charAt(0).toUpperCase();
  document.getElementById("accountDisplayName").textContent = displayName;
  document.getElementById("accountEmail").textContent = email;

  ["accountCurrentPassword","accountNewPassword","accountConfirmPassword"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  const err = document.getElementById("accountPasswordError");
  if (err) {
    err.textContent = "";
    err.style.display = "none";
  }

  const btn = document.getElementById("saveAccountPasswordBtn");
  if (btn) {
    btn.disabled = false;
    btn.textContent = "Simpan Password";
  }

  openModal("accountModal");
}


function togglePasswordVisibility(inputId, button) {
  const input = document.getElementById(inputId);
  if (!input || !button) return;

  const show = input.type === "password";
  input.type = show ? "text" : "password";
  button.setAttribute("aria-pressed", String(show));
  button.setAttribute("aria-label", show ? "Sembunyikan password" : "Lihat password");
  button.classList.toggle("is-visible", show);
}

async function changeMyPassword() {
  const user = currentUser;
  if (!user || !user.email) {
    showNotice("Akun belum siap", "Silakan login kembali.", "warning");
    return;
  }

  const currentPassword = document.getElementById("accountCurrentPassword").value;
  const newPassword = document.getElementById("accountNewPassword").value;
  const confirmPassword = document.getElementById("accountConfirmPassword").value;
  const errorBox = document.getElementById("accountPasswordError");
  const btn = document.getElementById("saveAccountPasswordBtn");

  const fail = (message) => {
    errorBox.textContent = message;
    errorBox.style.display = "block";
    return false;
  };

  errorBox.textContent = "";
  errorBox.style.display = "none";

  if (!currentPassword) return fail("Masukkan password saat ini.");
  if (!newPassword) return fail("Masukkan password baru.");
  if (newPassword.length < 6) return fail("Password baru minimal 6 karakter.");
  if (newPassword === currentPassword) return fail("Password baru harus berbeda dari password saat ini.");
  if (newPassword !== confirmPassword) return fail("Konfirmasi password baru tidak sama.");

  btn.disabled = true;
  btn.textContent = "Menyimpan...";

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    // Re-authenticate first because changing a password is a sensitive operation.
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);

    closeModal("accountModal");
    showNotice("Password berhasil diubah", "Gunakan password baru pada login berikutnya.");
  } catch (error) {
    console.error("changeMyPassword", error);

    // Keep the form open so the user can correct the password or retry.
    errorBox.textContent = readablePasswordError(error);
    errorBox.style.display = "block";
  } finally {
    btn.disabled = false;
    btn.textContent = "Simpan Password";
  }
}

onAuthStateChanged(auth, async user => {
  if (!user) {
    document.getElementById("login").style.display = "grid";
    document.getElementById("app").style.display = "none";
    return;
  }
  currentUser = user;
  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";

  // The reminder is UI-only and must not depend on Firestore.
  // Show it immediately after each successful authentication.
  setTimeout(showTeacherMotivation, 120);

  try {
    // Any Firebase Authentication user is an internal Tahfidz user.
    // No Firestore user profile is required.
    const displayName = user.displayName || user.email || "User";
    document.getElementById("userName").textContent = displayName;
    document.getElementById("userAvatar").textContent = displayName.charAt(0).toUpperCase();
    await loadAll();
  } catch (e) {
    console.error(e);
    alert("Gagal menyiapkan akun: " + (e.message || e));
    await signOut(auth);
  }
});

async function loadAll() {
  try {
    const [studentsSnap, surahsSnap, setoranSnap, catatanSnap] = await Promise.all([
      getDocs(collection(db, "tahfidz_siswa")),
      getDocs(collection(db, "tahfidz_surah")),
      getDocs(collection(db, "tahfidz_setoran")),
      getDocs(collection(db, "tahfidz_catatan"))
    ]);

    let juziyahSnap = null;
    try {
      juziyahSnap = await getDocs(collection(db, "tahfidz_juziyah"));
    } catch (juziyahError) {
      console.warn("Juziyah belum dapat diakses. Pastikan Firestore Rules mengizinkan tahfidz_juziyah.", juziyahError);
      juziyahSnap = { docs: [] };
    }

    // First-run convenience: if the master surah collection is empty,
    // automatically load the bundled 114-surah master into Firestore.
    if (surahsSnap.empty) {
      await ensureSurahMaster();
    }

    const finalSurahsSnap = surahsSnap.empty
      ? await getDocs(collection(db, "tahfidz_surah"))
      : surahsSnap;

    students = studentsSnap.docs.map(d => ({ id:d.id, ...d.data() }));
    surahs = finalSurahsSnap.docs.map(d => ({ id:d.id, ...d.data() }))
      .sort((a,b) => Number(a.id)-Number(b.id));
    setoran = setoranSnap.docs.map(d => ({ id:d.id, ...d.data() }));
    catatan = catatanSnap.docs.map(d => ({ id:d.id, ...d.data() }));
    juziyah = juziyahSnap.docs.map(d => ({ id:d.id, ...d.data() }));

    // Mirror historical/current Juziyah into the parent-safe projection so
    // parents can see results that existed before portal mirroring was added.
    await backfillJuziyahPortalProjection(juziyahSnap.docs);

    const activeStudents = students.filter(s => s.aktif !== false);
    const todayDate = today();

    const todaySetoran = setoran.filter(p => String(p.tanggal) === todayDate);
    const todayNis = new Set(todaySetoran.map(p => String(p.nis)));
    const noToday = activeStudents.filter(s => !todayNis.has(String(s.nis))).length;

    const latestMap = buildLatestSetoranMap();
    const latestValues = [...latestSetoranByNis.values()];
    const latestLancar = activeStudents.filter(s => latestSetoranByNis.get(String(s.nis))?.status === "Lancar").length;
    const latestMengulang = activeStudents.filter(s => latestSetoranByNis.get(String(s.nis))?.status === "Mengulang").length;
    const latestBelum = activeStudents.length - latestLancar - latestMengulang;

    const todayPercent = activeStudents.length
      ? Math.round((todayNis.size / activeStudents.length) * 100)
      : 0;

    document.getElementById("stStudents").textContent = activeStudents.length;
    document.getElementById("stToday").textContent = todayNis.size;
    document.getElementById("stNoToday").textContent = noToday;
    document.getElementById("stMengulang").textContent = latestMengulang;

    document.getElementById("heroStudents").textContent = activeStudents.length;
    document.getElementById("heroToday").textContent = todayNis.size;
    document.getElementById("heroNoToday").textContent = noToday;
    document.getElementById("heroSetoran").textContent = setoran.length;

    document.getElementById("dashTodayPercent").textContent = todayPercent + "%";
    document.getElementById("dashTodayBar").style.width = todayPercent + "%";
    document.getElementById("dashTodayDone").textContent = todayNis.size;
    document.getElementById("dashTodayNot").textContent = noToday;

    document.getElementById("legendLancar").textContent = latestLancar;
    document.getElementById("legendMengulang").textContent = latestMengulang;
    document.getElementById("legendBelum").textContent = latestBelum;

    const classMap = new Map();
    activeStudents.forEach(s => classMap.set(s.kelas, (classMap.get(s.kelas) || 0) + 1));
    const maxClass = Math.max(1, ...classMap.values());

    document.getElementById("dashClasses").innerHTML = [...classMap.entries()]
      .sort((a,b) => String(a[0]).localeCompare(String(b[0])))
      .map(([kelas,count]) => `
        <div class="class-stat-row">
          <span>${esc(kelas)}</span>
          <div class="class-stat-bar"><span style="width:${Math.round(count/maxClass*100)}%"></span></div>
          <span class="class-stat-number">${count}</span>
        </div>
      `).join("");

    fillClassFilter();
    fillStudentSelects();
    fillSurahSelect();
    buildLatestSetoranMap();
    buildLatestCatatanMap();
    renderStudents();
    renderStudentSetoranGrid();
    renderStudentCatatanGrid();
    renderJuziyah();
    renderMonitoring();
    renderLatest();
  } catch (e) {
    console.error(e);
    alert(readableFirestoreError(e));
  }
}

async function ensureSurahMaster() {
  try {
    const response = await fetch("../data/surah.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Master surah lokal gagal dimuat (${response.status}).`);
    }

    const master = await response.json();

    if (!Array.isArray(master) || master.length !== 114) {
      throw new Error("Master surah harus berisi 114 surah.");
    }

    for (let i = 0; i < master.length; i += 200) {
      const batch = writeBatch(db);

      for (const s of master.slice(i, i + 200)) {
        batch.set(
          doc(db, "tahfidz_surah", String(s.id)),
          {
            id: Number(s.id),
            nama: String(s.nama),
            juz: Number(s.juz),
            ayat: Number(s.ayat),
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );
      }

      await batch.commit();
    }

    showNotice(
      "Master surah disiapkan",
      "114 surah berhasil dimuat ke database Tahfidz."
    );
  } catch (e) {
    console.error("ensureSurahMaster:", e);
    showNotice(
      "Master surah belum tersedia",
      e.message || "Gagal memuat 114 surah. Periksa data/surah.json dan Security Rules.",
      "warning"
    );
    throw e;
  }
}


function fillClassFilter() {
  const sel = document.getElementById("studentClassFilter");
  if (!sel) return;

  const classes = [...new Set(students.map(s => String(s.kelas || "").trim()).filter(Boolean))].sort();
  sel.innerHTML = '<option value="ALL">Semua kelas</option>' +
    classes.map(k => `<option value="${escAttr(k)}">${esc(k)}</option>`).join("");
}

function fillStudentSelects() {
  const opts = students.filter(s => s.aktif !== false)
    .sort((a,b)=>String(a.nama).localeCompare(String(b.nama)))
    .map(s => `<option value="${esc(s.nis)}">${esc(s.nis)} — ${esc(s.nama)} (${esc(s.kelas)})</option>`)
    .join("");

  const setoranNis = document.getElementById("setoranNis");
  if (setoranNis) {
    setoranNis.innerHTML = opts;
  }

  const catatanNis = document.getElementById("catatanNis");
  if (catatanNis) {
    catatanNis.innerHTML = opts;
  }
}

function fillSurahSelect() {
  const select = document.getElementById("setoranSurah");
  if (!select) return;

  if (!surahs.length) {
    select.innerHTML = '<option value="">Belum ada master surah</option>';
    select.value = "";
    return;
  }

  select.innerHTML =
    '<option value="">Pilih surah...</option>' +
    surahs.map(s =>
      `<option value="${escAttr(s.id)}">${esc(s.id)} — ${esc(s.nama)}</option>`
    ).join("");

  // Default to the first actual surah only when the user opens a new record.
  if (!select.value) select.selectedIndex = 0;
}


function getSelectedStudentObjects() {
  return students.filter(s => selectedStudents.has(String(s.nis)));
}

function getAutomaticNextClass(kelas) {
  const raw = String(kelas || "").trim().toUpperCase();
  const m = raw.match(/^(\d+)\s*([A-Z]*)$/);
  if (!m) return "";
  const grade = Number(m[1]);
  const suffix = m[2] || "";
  if (grade >= 9) return "LULUS";
  return `${grade + 1}${suffix}`;
}

function getClassManagerTargets() {
  return getSelectedStudentObjects().filter(s => s.aktif !== false && s.statusSiswa !== "Lulus");
}

function renderClassManagerPreview() {
  const box = document.getElementById("classManagerPreview");
  if (!box) return;
  const list = getClassManagerTargets();
  if (!list.length) {
    box.innerHTML = '<div class="empty">Pilih siswa aktif terlebih dahulu.</div>';
    return;
  }

  if (studentClassOperation === "lulus") {
    box.innerHTML = `<div class="class-manager-summary"><strong>${list.length} siswa akan ditandai LULUS.</strong><span>Semua riwayat tetap tersimpan.</span></div>`;
    return;
  }

  if (studentClassOperation === "naik") {
    box.innerHTML = `<div class="class-manager-summary"><strong>Pratinjau kenaikan kelas</strong>${list.map(s => `<div class="class-manager-row"><span>${esc(s.nama)} <small>${esc(s.kelas)}</small></span><b>→ ${esc(getAutomaticNextClass(s.kelas) || "Tidak dapat ditentukan")}</b></div>`).join("")}</div>`;
    return;
  }

  const target = document.getElementById("classManagerTargetClass")?.value.trim().toUpperCase() || "";
  box.innerHTML = `<div class="class-manager-summary"><strong>${list.length} siswa</strong><span>${target ? `Akan dipindahkan ke kelas <b>${esc(target)}</b>.` : "Isi kelas tujuan terlebih dahulu."}</span></div>`;
}

function setStudentClassOperation(op) {
  studentClassOperation = ["pindah","naik","lulus"].includes(op) ? op : "pindah";
  document.querySelectorAll(".class-manager-op").forEach(btn => btn.classList.toggle("active", btn.dataset.op === studentClassOperation));
  document.getElementById("classManagerTargetWrap")?.classList.toggle("hidden", studentClassOperation !== "pindah");
  renderClassManagerPreview();
}

function openStudentClassManager(nis = "") {
  if (nis) {
    selectedStudents.clear();
    selectedStudents.add(String(nis));
  }

  const selected = getSelectedStudentObjects();
  document.getElementById("classManagerSelected").innerHTML = selected.length
    ? `<strong>${selected.length} siswa dipilih</strong><span>${selected.slice(0,8).map(s=>esc(s.nama)).join(", ")}${selected.length>8?"…":""}</span>`
    : `<strong>Belum ada siswa dipilih</strong><span>Centang siswa pada tabel untuk operasi massal.</span>`;

  const target = document.getElementById("classManagerTargetClass");
  target.value = selected.length === 1 ? (selected[0].kelas || "") : "";
  setStudentClassOperation("pindah");
  renderClassManagerPreview();
  openModal("studentClassManagerModal");
}

function validateClassName(value) {
  return /^[0-9]{1,2}[A-Za-z]?$/.test(String(value || "").trim());
}

async function applyStudentClassOperation() {
  const selected = getClassManagerTargets();
  if (!selected.length) {
    showNotice("Belum ada siswa", "Pilih siswa aktif terlebih dahulu.", "warning");
    return;
  }

  const op = studentClassOperation;
  const target = document.getElementById("classManagerTargetClass")?.value.trim().toUpperCase() || "";

  if (op === "pindah" && !validateClassName(target)) {
    showNotice("Kelas tujuan tidak valid", "Gunakan format seperti 7A, 8B, atau 9A.", "warning");
    return;
  }

  const label = op === "pindah"
    ? `${selected.length} siswa ke ${target}`
    : op === "naik"
      ? `${selected.length} siswa naik kelas`
      : `${selected.length} siswa menjadi Lulus`;

  if (!await askConfirm("Konfirmasi manajemen siswa", `Perubahan: ${label}. Riwayat Setoran, Catatan, Juziyah, dan perkembangan tidak dihapus.`)) return;

  try {
    for (let i=0; i<selected.length; i+=150) {
      const batch = writeBatch(db);
      selected.slice(i,i+150).forEach(s => {
        const next = op === "naik" ? getAutomaticNextClass(s.kelas) : "";
        const graduated = op === "lulus" || next === "LULUS";
        const data = {
          updatedAt: serverTimestamp(),
          updatedBy: currentUser?.uid || "",
          aktif: !graduated,
          statusSiswa: graduated ? "Lulus" : "Aktif"
        };

        if (op === "pindah") data.kelas = target;
        if (op === "naik" && next && next !== "LULUS") data.kelas = next;

        batch.set(doc(db, "tahfidz_siswa", String(s.nis)), data, {merge:true});
        batch.set(doc(db, "tahfidz_portal", String(s.nis)), {
          nis:s.nis, nama:s.nama, kelas:data.kelas ?? s.kelas, aktif:data.aktif, statusSiswa:data.statusSiswa,
          updatedAt: serverTimestamp()
        }, {merge:true});
      });
      await batch.commit();
    }

    selectedStudents.clear();
    closeModal("studentClassManagerModal");
    showNotice("Berhasil", op==="pindah" ? `${selected.length} siswa dipindahkan ke ${target}.` : op==="naik" ? `${selected.length} siswa diproses naik kelas.` : `${selected.length} siswa ditandai Lulus.`);
    await loadAll();
  } catch(e) {
    console.error(e);
    showNotice("Gagal mengubah siswa", readableFirestoreError(e), "warning");
  }
}

async function promoteSelectedStudents() {
  if (!selectedStudents.size) {
    showNotice("Belum ada siswa", "Centang siswa yang ingin dinaikkan kelas.", "warning");
    return;
  }
  openStudentClassManager();
  setStudentClassOperation("naik");
}

async function graduateSelectedStudents() {
  if (!selectedStudents.size) {
    showNotice("Belum ada siswa", "Centang siswa yang ingin diluluskan.", "warning");
    return;
  }
  openStudentClassManager();
  setStudentClassOperation("lulus");
}

function renderStudents() {
  const q = document.getElementById("studentSearch").value.toLowerCase().trim();
  const cls = document.getElementById("studentClassFilter").value;

  const rows = students.filter(s => {
    const match =
      String(s.nis).toLowerCase().includes(q) ||
      String(s.nama).toLowerCase().includes(q);
    return match && (cls === "ALL" || String(s.kelas) === cls);
  });

  document.getElementById("studentTable").innerHTML = rows.length
    ? rows.map(s => {
        const checked = selectedStudents.has(String(s.nis)) ? "checked" : "";
        const status = s.statusSiswa || (s.aktif === false ? "Nonaktif" : "Aktif");

        if (studentEditMode) {
          return `
          <tr class="edit-mode-row" data-nis="${escAttr(s.nis)}">
            <td class="check-col">
              <input class="row-check" type="checkbox" ${checked}
                onchange="toggleStudentSelection('${jsq(s.nis)}', this.checked)">
            </td>
            <td><strong>${esc(s.nis)}</strong></td>
            <td class="inline-cell"><input class="inline-input student-inline-name" value="${escAttr(s.nama)}"></td>
            <td class="inline-cell"><input class="inline-input student-inline-class" value="${escAttr(s.kelas)}"></td>
            <td class="inline-cell">
              <select class="inline-select student-inline-active">
                <option value="active" ${status === "Aktif" ? "selected" : ""}>Aktif</option>
                <option value="inactive" ${status === "Nonaktif" ? "selected" : ""}>Nonaktif</option>
                <option value="graduated" ${status === "Lulus" ? "selected" : ""}>Lulus</option>
              </select>
            </td>
            <td><button class="btn btn-light" onclick="saveInlineStudent('${jsq(s.nis)}')">Simpan</button></td>
          </tr>`;
        }

        return `
        <tr>
          <td class="check-col">
            <input class="row-check" type="checkbox" ${checked}
              onchange="toggleStudentSelection('${jsq(s.nis)}', this.checked)">
          </td>
          <td>${esc(s.nis)}</td>
          <td>${esc(s.nama)}</td>
          <td>${esc(s.kelas)}</td>
          <td>${status === "Lulus"
            ? '<span class="badge badge-gray">Lulus</span>'
            : status === "Nonaktif"
              ? '<span class="badge badge-gray">Nonaktif</span>'
              : '<span class="badge badge-green">Aktif</span>'}</td>
          <td><div class="actions">
            <button class="btn btn-light" onclick="editStudent('${jsq(s.nis)}')">Edit</button>
            <button class="btn btn-light" onclick="openStudentClassManager('${jsq(s.nis)}')">Kelas</button>
            <button class="btn btn-red" onclick="toggleStudent('${jsq(s.nis)}')">${s.aktif === false ? "Aktifkan" : "Nonaktifkan"}</button>
          </div></td>
        </tr>`;
      }).join("")
    : `<tr><td colspan="6" class="empty">Belum ada siswa.</td></tr>`;

  syncStudentSelectionUI();
}

function toggleStudentEditMode() {
  studentEditMode = !studentEditMode;
  document.getElementById("studentEditModeBtn").textContent =
    studentEditMode ? "✓ Selesai Edit" : "✎ Edit Tabel";
  document.getElementById("studentEditModeBtn").classList.toggle("btn-primary", studentEditMode);
  renderStudents();
}

async function saveInlineStudent(nis) {
  const row = document.querySelector(`tr[data-nis="${cssEscape(nis)}"]`);
  if (!row) return;

  const nama = row.querySelector(".student-inline-name")?.value.trim() || "";
  const kelas = row.querySelector(".student-inline-class")?.value.trim() || "";
  const statusValue = row.querySelector(".student-inline-active")?.value || "active";
  const aktif = statusValue === "active";
  const statusSiswa = statusValue === "graduated" ? "Lulus" : aktif ? "Aktif" : "Nonaktif";

  if (!nama || !kelas) {
    showNotice("Data belum lengkap", "Nama dan kelas wajib diisi.", "warning");
    return;
  }

  try {
    await setDoc(doc(db, "tahfidz_siswa", nis), {
      nis,nama,kelas,aktif,statusSiswa,updatedAt:serverTimestamp(),updatedBy:currentUser.uid
    }, {merge:true});

    await setDoc(doc(db, "tahfidz_portal", nis), {
      nis,nama,kelas,aktif,statusSiswa,updatedAt:serverTimestamp()
    }, {merge:true});

    showNotice("Tersimpan", `Data ${nama} berhasil diperbarui.`);
    await loadAll();
  } catch (e) {
    showNotice("Gagal menyimpan", readableFirestoreError(e), "warning");
  }
}

function toggleStudentSelection(nis, checked) {
  nis = String(nis);
  if (checked) selectedStudents.add(nis);
  else selectedStudents.delete(nis);
  syncStudentSelectionUI();
}

function toggleSelectAllStudents(checked) {
  const q = document.getElementById("studentSearch").value.toLowerCase().trim();
  const cls = document.getElementById("studentClassFilter").value;

  students.filter(s => {
    const match =
      String(s.nis).toLowerCase().includes(q) ||
      String(s.nama).toLowerCase().includes(q);
    return match && (cls === "ALL" || String(s.kelas) === cls);
  }).forEach(s => {
    if (checked) selectedStudents.add(String(s.nis));
    else selectedStudents.delete(String(s.nis));
  });

  renderStudents();
}

function syncStudentSelectionUI() {
  const all = [...document.querySelectorAll("#studentTable .row-check")];
  const selected = all.filter(x => x.checked).length;
  const allBox = document.getElementById("selectAllStudents");
  if (allBox) {
    allBox.checked = all.length > 0 && selected === all.length;
    allBox.indeterminate = selected > 0 && selected < all.length;
  }

  const btn = document.getElementById("deleteSelectedStudentsBtn");
  if (btn) {
    btn.classList.toggle("visible", selectedStudents.size > 0);
    btn.textContent = selectedStudents.size
      ? `Hapus Terpilih (${selectedStudents.size})`
      : "Hapus Terpilih";
  }
}

async function deleteSelectedStudents() {
  if (!selectedStudents.size) return;

  const ok = await askConfirm(
    "Hapus siswa terpilih?",
    `${selectedStudents.size} data siswa akan dihapus dari database dan portal orang tua. Tindakan ini tidak dapat dibatalkan.`
  );
  if (!ok) return;

  const ids = [...selectedStudents];

  try {
    for (let i = 0; i < ids.length; i += 200) {
      const batch = writeBatch(db);
      for (const nis of ids.slice(i, i + 200)) {
        batch.delete(doc(db, "tahfidz_siswa", nis));
        batch.delete(doc(db, "tahfidz_portal", nis));
      }
      await batch.commit();
    }

    selectedStudents.clear();
    showNotice("Berhasil", `${ids.length} siswa telah dihapus.`);
    await loadAll();
  } catch (e) {
    showNotice("Gagal menghapus", readableFirestoreError(e), "warning");
  }
}

function exportData(type) {
  let headers = [];
  let rows = [];
  let filename = "";

  if (type === "siswa") {
    headers = ["nis","nama","kelas","aktif"];
    rows = students.map(s => [s.nis,s.nama,s.kelas,s.aktif !== false ? "true":"false"]);
    filename = "tahfidz-siswa.csv";
  } else if (type === "setoran") {
    headers = ["tanggal","nis","namaSurah","juz","ayatTerakhir","status"];
    rows = setoran.map(p => [p.tanggal,p.nis,p.namaSurah,p.juz,p.ayatTerakhir,p.status]);
    filename = "tahfidz-setoran.csv";
  } else {
    headers = ["tanggal","nis","pesan","saranOrtu"];
    rows = catatan.map(c => [c.tanggal,c.nis,c.pesan,c.saranOrtu]);
    filename = "tahfidz-catatan.csv";
  }

  const csv = "\uFEFF" + [headers, ...rows]
    .map(row => row.map(csvCell).join(","))
    .join("\r\n");

  downloadTextFile(filename, csv, "text/csv;charset=utf-8");
  showNotice("Export selesai", `${rows.length} baris berhasil diekspor.`);
}

function openImportModal(type) {
  importType = type;
  const titles = {
    siswa: "Import Data Siswa",
    setoran: "Import Setoran Hafalan",
    catatan: "Import Catatan Guru"
  };
  const hints = {
    siswa: "Kolom: nis, nama, kelas, aktif",
    setoran: "Kolom: tanggal, nis, namaSurah atau idSurah, juz, ayatTerakhir, status",
    catatan: "Kolom: tanggal, nis, pesan, saranOrtu"
  };

  document.getElementById("importTitle").textContent = titles[type];
  document.getElementById("importHint").textContent = hints[type];
  document.getElementById("importText").value = "";
  document.getElementById("importPreview").innerHTML = "Belum ada data untuk dipreview.";
  document.getElementById("importFile").value = "";
  document.getElementById("importModal").classList.remove("hidden");
}

function loadImportFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("importText").value = reader.result || "";
    previewImport();
  };
  reader.readAsText(file, "UTF-8");
}

async function pasteClipboardIntoImport() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("importText").value = text;
    previewImport();
  } catch {
    showNotice("Clipboard belum bisa dibaca", "Klik area teks, lalu tekan Ctrl+V untuk menempelkan data.", "warning");
  }
}

function parseDelimitedLine(line, delimiter) {
  const out = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"' && quoted && next === '"') {
      current += '"';
      i++;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === delimiter && !quoted) {
      out.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }

  out.push(current.trim());
  return out;
}

function normalizeHeader(h) {
  return String(h || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function parseTabularText(text) {
  const cleaned = String(text || "").replace(/^\uFEFF/, "").trim();
  if (!cleaned) return {headers:[],rows:[]};

  const lines = cleaned.split(/\r?\n/).filter(line => line.trim() !== "");
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const parsed = lines.map(line => parseDelimitedLine(line, delimiter));

  const normalizedFirst = parsed[0].map(normalizeHeader);
  const known = ["nis","nama","kelas","aktif","tanggal","namasurah","idsurah","juz","ayatterakhir","status","pesan","saranortu"];
  const hasHeader = normalizedFirst.some(h => known.includes(h));

  if (hasHeader) return {headers:normalizedFirst,rows:parsed.slice(1)};

  const fallback = {
    siswa:["nis","nama","kelas","aktif"],
    setoran:["tanggal","nis","namasurah","juz","ayatterakhir","status"],
    catatan:["tanggal","nis","pesan","saranortu"]
  }[importType];

  return {headers:fallback,rows:parsed};
}

function mapRow(headers,row) {
  const obj = {};
  headers.forEach((h,i) => obj[normalizeHeader(h)] = row[i] ?? "");
  return obj;
}

function previewImport() {
  const parsed = parseTabularText(document.getElementById("importText").value);

  if (!parsed.rows.length) {
    document.getElementById("importPreview").innerHTML = "Belum ada data untuk dipreview.";
    return;
  }

  const rows = parsed.rows.slice(0,8);
  document.getElementById("importPreview").innerHTML = `
    <div style="font-size:11px;font-weight:800;margin-bottom:8px">${parsed.rows.length} baris terdeteksi</div>
    <div class="tablewrap">
      <table class="preview-table">
        <thead><tr>${parsed.headers.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>${rows.map(row => `<tr>${parsed.headers.map((_,i) => `<td>${esc(row[i] || "")}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>`;
}

async function runImport() {
  const parsed = parseTabularText(document.getElementById("importText").value);

  if (!parsed.rows.length) {
    showNotice("Tidak ada data", "Silakan pilih file atau tempel data terlebih dahulu.", "warning");
    return;
  }

  const ok = await askConfirm(
    "Import data?",
    `Sistem menemukan ${parsed.rows.length} baris. Lanjutkan proses import?`
  );
  if (!ok) return;

  const btn = document.getElementById("importSaveBtn");
  btn.disabled = true;
  btn.textContent = "Memproses...";

  try {
    if (importType === "siswa") await importStudents(parsed);
    else if (importType === "setoran") await importSetoran(parsed);
    else await importCatatan(parsed);

    closeModal("importModal");
    showNotice("Import selesai", `${parsed.rows.length} baris diproses.`);
    await loadAll();
  } catch (e) {
    console.error(e);
    showNotice("Import gagal", e.message || "Format data belum sesuai.", "warning");
  } finally {
    btn.disabled = false;
    btn.textContent = "Import Data";
  }
}

async function importStudents(parsed) {
  const operations = [];

  for (const row of parsed.rows) {
    const obj = mapRow(parsed.headers,row);
    const nis = String(obj.nis || "").trim();
    const nama = String(obj.nama || "").trim();
    const kelas = String(obj.kelas || "").trim();
    const aktif = String(obj.aktif ?? "true").toLowerCase() !== "false";

    if (!nis || !nama || !kelas) continue;

    operations.push({nis,nama,kelas,aktif});
  }

  if (!operations.length) throw new Error("Tidak ada baris siswa valid.");

  for (let i = 0; i < operations.length; i += 200) {
    const batch = writeBatch(db);
    for (const s of operations.slice(i,i+200)) {
      batch.set(doc(db,"tahfidz_siswa",s.nis), {
        ...s,updatedAt:serverTimestamp(),updatedBy:currentUser.uid
      },{merge:true});
      batch.set(doc(db,"tahfidz_portal",s.nis), {
        ...s,updatedAt:serverTimestamp()
      },{merge:true});
    }
    await batch.commit();
  }
}

async function importSetoran(parsed) {
  const operations = [];

  for (const row of parsed.rows) {
    const obj = mapRow(parsed.headers,row);
    const nis = String(obj.nis || "").trim();    const tanggalInput = String(isSixColumns ? (r[5] ?? "") : (r[4] ?? "")).trim();
    const tanggal = tanggalInput || document.getElementById("setoranTanggalCepat")?.value || today();
    const status = String(obj.status || "Lancar").trim();
    const ayatTerakhir = Number(obj.ayatterakhir || obj.ayat || 0);

    let idSurah = Number(obj.idsurah || 0);
    let surah = surahs.find(s => Number(s.id) === idSurah);

    if (!surah && obj.namasurah) {
      const needle = String(obj.namasurah).toLowerCase().trim();
      surah = surahs.find(s => String(s.nama).toLowerCase() === needle);
      if (surah) idSurah = Number(surah.id);
    }

    if (!studentByNis(nis) || !surah || !tanggal ||
        !Number.isInteger(ayatTerakhir) ||
        ayatTerakhir < 1 || ayatTerakhir > Number(surah.ayat) ||
        !["Lancar","Mengulang"].includes(status)) continue;

    operations.push({nis,idSurah,surah,ayatTerakhir,status,tanggal});
  }

  if (!operations.length) throw new Error("Tidak ada baris setoran valid.");

  for (let i = 0; i < operations.length; i += 200) {
    const batch = writeBatch(db);
    for (const p of operations.slice(i,i+200)) {
      const ref = doc(collection(db,"tahfidz_setoran"));
      batch.set(ref,{
        nis:p.nis,idSurah:p.idSurah,namaSurah:p.surah.nama,juz:p.surah.juz,
        totalAyat:p.surah.ayat,ayatTerakhir:p.ayatTerakhir,status:p.status,tanggal:p.tanggal,
        createdBy:currentUser.uid,createdByName:currentUser.displayName || currentUser.email || "",
        createdAt:serverTimestamp(),updatedAt:serverTimestamp()
      });
      batch.set(doc(db,"tahfidz_portal",p.nis,"setoran",ref.id),{
        nis:p.nis,idSurah:p.idSurah,namaSurah:p.surah.nama,juz:p.surah.juz,
        ayatTerakhir:p.ayatTerakhir,status:p.status,tanggal:p.tanggal
      });
    }
    await batch.commit();
  }
}

async function importCatatan(parsed) {
  const operations = [];

  for (const row of parsed.rows) {
    const obj = mapRow(parsed.headers,row);
    const nis = String(obj.nis || "").trim();
    const tanggal = String(obj.tanggal || "").trim();
    const pesan = String(obj.pesan || "").trim();
    const saranOrtu = String(obj.saranortu || "").trim();

    if (!studentByNis(nis) || !tanggal || !pesan) continue;
    operations.push({nis,tanggal,pesan,saranOrtu});
  }

  if (!operations.length) throw new Error("Tidak ada baris catatan valid.");

  for (let i = 0; i < operations.length; i += 200) {
    const batch = writeBatch(db);
    for (const c of operations.slice(i,i+200)) {
      const ref = doc(collection(db,"tahfidz_catatan"));
      batch.set(ref,{
        ...c,createdBy:currentUser.uid,createdByName:currentUser.displayName || currentUser.email || "",
        createdAt:serverTimestamp(),updatedAt:serverTimestamp()
      });
      batch.set(doc(db,"tahfidz_portal",c.nis,"catatan",ref.id),c);
    }
    await batch.commit();
  }
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"','""')}"` : text;
}

function downloadTextFile(filename,content,mime) {
  const blob = new Blob([content],{type:mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}

function downloadImportTemplate() {
  const templates = {
    siswa:"nis,nama,kelas,aktif\\n260789,Ahmad Fulan,7A,true",
    setoran:"tanggal,nis,namaSurah,juz,ayatTerakhir,status\\n2026-08-22,260789,An-Naba',30,10,Lancar",
    catatan:"tanggal,nis,pesan,saranOrtu\\n2026-08-22,260789,Hafalan perlu murojaah,Mohon lebih sering menyimak hafalan di rumah."
  };
  downloadTextFile(`${importType}-template.csv`,templates[importType],"text/csv;charset=utf-8");
}

function showNotice(title,message,type="success") {
  document.getElementById("noticeTitle").textContent = title;
  document.getElementById("noticeMessage").textContent = message;
  const icon = document.getElementById("noticeIcon");
  icon.textContent = type === "warning" ? "!" : "✓";
  icon.classList.toggle("notice-warning",type==="warning");
  document.getElementById("noticeModal").classList.remove("hidden");
}

function askConfirm(title,message) {
  return new Promise(resolve => {
    confirmResolver = resolve;
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmMessage").textContent = message;
    document.getElementById("confirmModal").classList.remove("hidden");
  });
}

function resolveConfirm(answer) {
  document.getElementById("confirmModal").classList.add("hidden");
  if (confirmResolver) {
    const resolver = confirmResolver;
    confirmResolver = null;
    resolver(answer);
  }
}

function cssEscape(value) {
  if (window.CSS?.escape) return CSS.escape(String(value));
  return String(value).replace(/["\\]/g,"\\$&");
}

function escAttr(v) {
  return String(v ?? "")
    .replaceAll("&","&amp;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

window.loadAll = loadAll;
window.closeModal = closeModal;
window.toggleStudentEditMode = toggleStudentEditMode;
window.saveInlineStudent = saveInlineStudent;
window.toggleStudentSelection = toggleStudentSelection;
window.toggleSelectAllStudents = toggleSelectAllStudents;
window.deleteSelectedStudents = deleteSelectedStudents;
window.openImportModal = openImportModal;
window.loadImportFile = loadImportFile;
window.pasteClipboardIntoImport = pasteClipboardIntoImport;
window.downloadImportTemplate = downloadImportTemplate;
window.runImport = runImport;
window.exportData = exportData;
window.resolveConfirm = resolveConfirm;
window.showNotice = showNotice;
window.renderStudentSetoranGrid = renderStudentSetoranGrid;
window.saveAllInlineSetoran = saveAllInlineSetoran;
window.toggleSetoranEditMode = toggleSetoranEditMode;
window.markSetoranRowDirty = markSetoranRowDirty;
window.validateSetoranGridAyat = validateSetoranGridAyat;
window.openBulkSetoranPasteModal = openBulkSetoranPasteModal;
window.downloadSetoranTemplate = downloadSetoranTemplate;
window.saveBulkSetoran = saveBulkSetoran;
window.previewBulkSetoran = previewBulkSetoran;
window.exportStudentSetoranGrid = exportStudentSetoranGrid;
window.renderStudentCatatanGrid = renderStudentCatatanGrid;
window.openStudentCatatanHistory = openStudentCatatanHistory;
window.openCatatanModalForStudent = openCatatanModalForStudent;
window.openBulkCatatanPasteModal = openBulkCatatanPasteModal;
window.downloadCatatanTemplate = downloadCatatanTemplate;
window.previewBulkCatatan = previewBulkCatatan;
window.saveBulkCatatan = saveBulkCatatan;
window.exportStudentCatatanGrid = exportStudentCatatanGrid;
window.toggleCatatanEditMode = toggleCatatanEditMode;
window.saveInlineCatatan = saveInlineCatatan;
window.saveAllInlineCatatan = saveAllInlineCatatan;





function getSetoranByStudentAndDate(nis, tanggal) {
  return setoran.find(p =>
    String(p.nis) === String(nis) &&
    String(p.tanggal || "") === String(tanggal || "")
  ) || null;
}

function getSetoranByStudent(nis) {
  return setoran
    .filter(p => String(p.nis) === String(nis))
    .sort((a,b) => {
      const d = String(b.tanggal || "").localeCompare(String(a.tanggal || ""));
      if (d !== 0) return d;
      return Number(b.createdAt?.seconds || 0) - Number(a.createdAt?.seconds || 0);
    });
}

function buildLatestSetoranMap() {
  latestSetoranByNis = new Map();

  [...setoran]
    .sort((a,b) => {
      const dateCompare = String(b.tanggal || "").localeCompare(String(a.tanggal || ""));
      if (dateCompare !== 0) return dateCompare;
      const tb = Number(b.createdAt?.seconds || 0);
      const ta = Number(a.createdAt?.seconds || 0);
      return tb - ta;
    })
    .forEach(p => {
      const nis = String(p.nis);
      if (!latestSetoranByNis.has(nis)) {
        latestSetoranByNis.set(nis, p);
      }
    });
}

function fillSetoranClassFilter() {
  const sel = document.getElementById("setoranClassFilter");
  if (!sel) return;
  const classes = [...new Set(
    students.map(s => String(s.kelas || "").trim()).filter(Boolean)
  )].sort();
  const current = sel.value || "ALL";
  sel.innerHTML = '<option value="ALL">Semua kelas</option>' +
    classes.map(k => `<option value="${escAttr(k)}">${esc(k)}</option>`).join("");
  sel.value = classes.includes(current) ? current : "ALL";
}


function updateSetoranGridAyatLimit(row) {
  if (!row) return;

  const surahSelect = row.querySelector('[data-field="surah"]');
  const ayatInput = row.querySelector('[data-field="ayat"]');

  if (!surahSelect || !ayatInput) return;

  const selectedId = Number(surahSelect.value || 0);
  const surah = surahs.find(x => Number(x.id) === selectedId);

  if (!surah) {
    ayatInput.removeAttribute("max");
    ayatInput.title = "Pilih surah terlebih dahulu";
    return;
  }

  const maxAyat = Number(surah.ayat);
  ayatInput.max = String(maxAyat);
  ayatInput.title = `Maksimal ${maxAyat} ayat`;

  if (ayatInput.value && Number(ayatInput.value) > maxAyat) {
    ayatInput.value = String(maxAyat);
  }
}

function validateSetoranGridAyat(input, nis) {
  const row = input?.closest("tr");
  if (!row) return;

  updateSetoranGridAyatLimit(row);

  const max = Number(input.max || 0);
  const value = Number(input.value || 0);

  if (max && value > max) {
    input.value = String(max);
    showNotice(
      "Ayat melebihi batas",
      `${studentByNis(nis)?.nama || nis}: ayat maksimal untuk surah yang dipilih adalah ${max}.`,
      "warning"
    );
  }

  if (value < 1 && input.value !== "") {
    input.value = "1";
  }
}


function toggleSetoranEditMode() {
  const page = document.getElementById("page-setoran");
  const btn = document.getElementById("setoranEditModeBtn");
  const saveBtn = document.getElementById("setoranSaveChangesBtn");

  // If attempting to leave edit mode with unsaved changes, confirm first.
  if (setoranEditMode && dirtySetoranRows.size) {
    askConfirm(
      "Batalkan perubahan?",
      "Masih ada perubahan setoran yang belum disimpan. Jika keluar dari mode edit, perubahan tersebut akan dibuang."
    ).then(ok => {
      if (!ok) return;
      dirtySetoranRows.clear();
      setoranEditMode = false;
      renderStudentSetoranGrid();
      updateSetoranEditControls();
    });
    return;
  }

  setoranEditMode = !setoranEditMode;
  updateSetoranEditControls();
  renderStudentSetoranGrid();
}

function updateSetoranEditControls() {
  const page = document.getElementById("page-setoran");
  const btn = document.getElementById("setoranEditModeBtn");
  const saveBtn = document.getElementById("setoranSaveChangesBtn");

  page?.classList.toggle("setoran-readonly", !setoranEditMode);
  page?.classList.toggle("setoran-edit-active", setoranEditMode);

  if (btn) {
    btn.textContent = setoranEditMode ? "✓ Selesai Edit" : "✎ Edit Tabel";
    btn.classList.toggle("btn-primary", setoranEditMode);
    btn.classList.toggle("btn-light", !setoranEditMode);
  }

  if (saveBtn) {
    saveBtn.classList.toggle("setoran-save-hidden", !setoranEditMode);
  }
}

function renderStudentSetoranGrid() {
  updateSetoranEditControls();
  fillSetoranClassFilter();

  const q = document.getElementById("setoranStudentSearch")?.value.toLowerCase().trim() || "";
  const cls = document.getElementById("setoranClassFilter")?.value || "ALL";
  const selectedDate =
    document.getElementById("setoranTanggalCepat")?.value || today();

  const rows = students
    .filter(s => s.aktif !== false)
    .filter(s => {
      const searchMatch =
        String(s.nis).toLowerCase().includes(q) ||
        String(s.nama).toLowerCase().includes(q);
      const classMatch = cls === "ALL" || String(s.kelas) === cls;
      return searchMatch && classMatch;
    })
    .sort((a,b) => {
      const c = String(a.kelas).localeCompare(String(b.kelas));
      return c || String(a.nama).localeCompare(String(b.nama));
    });

  const tbody = document.getElementById("studentSetoranGrid");
  const mobile = document.getElementById("studentSetoranMobile");
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty">Tidak ada siswa.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(s => {
    const p = latestSetoranByNis.get(String(s.nis));
    const noSetoran = !p;
    const status = p?.status || "Lancar";
    const date = p?.tanggal || selectedDate;

    return `
      <tr data-student-setoran="${escAttr(s.nis)}" class="${noSetoran ? "row-no-setoran" : ""}">
        <td class="sticky-col sticky-nis student-nis-cell">${esc(s.nis)}</td>
        <td class="sticky-col sticky-name student-name-cell">
          <div>${esc(s.nama)}</div>
          <div style="font-size:9px;color:#96a29c;margin-top:2px">${noSetoran ? "Belum ada setoran" : `Terakhir: ${esc(p.tanggal)}`}</div>
        </td>
        <td>${esc(s.kelas)}</td>

        <td class="latest-cell ${dirtySetoranRows.has(String(s.nis)) ? "cell-dirty" : ""}">
          <select class="inline-select setoran-grid-select" data-field="surah" data-nis="${escAttr(s.nis)}"
            ${setoranEditMode ? "" : "disabled"}
            onchange="markSetoranRowDirty('${jsq(s.nis)}')">
            <option value="">Pilih surah...</option>
            ${surahs.map(x => `<option value="${escAttr(x.id)}" ${p && Number(p.idSurah)===Number(x.id) ? "selected" : ""}>${esc(x.nama)}</option>`).join("")}
          </select>
        </td>

        <td class="latest-cell ${dirtySetoranRows.has(String(s.nis)) ? "cell-dirty" : ""}">
          <input class="inline-input setoran-grid-input" data-field="ayat" data-nis="${escAttr(s.nis)}"
            type="number" min="1" max="${escAttr(p?.totalAyat || surahs.find(x => Number(x.id) === Number(p?.idSurah || 0))?.ayat || "")}"
            value="${p?.ayatTerakhir ?? ""}" placeholder="Ayat"
            title="${p?.totalAyat ? `Maksimal ${p.totalAyat} ayat` : "Pilih surah terlebih dahulu"}"
            ${setoranEditMode ? "" : "disabled"}
            onchange="markSetoranRowDirty('${jsq(s.nis)}'); validateSetoranGridAyat(this, '${jsq(s.nis)}')">
        </td>

        <td class="latest-cell ${dirtySetoranRows.has(String(s.nis)) ? "cell-dirty" : ""}">
          <select class="inline-select setoran-grid-select" data-field="status" data-nis="${escAttr(s.nis)}"
            ${setoranEditMode ? "" : "disabled"}
            onchange="markSetoranRowDirty('${jsq(s.nis)}')">
            <option value="Lancar" ${status==="Lancar" ? "selected" : ""}>Lancar</option>
            <option value="Mengulang" ${status==="Mengulang" ? "selected" : ""}>Mengulang</option>
          </select>
        </td>

        <td class="latest-cell ${dirtySetoranRows.has(String(s.nis)) ? "cell-dirty" : ""}">
          <input class="inline-input" data-field="tanggal" data-nis="${escAttr(s.nis)}"
            type="date" value="${escAttr(date)}"
            ${setoranEditMode ? "" : "disabled"}
            onchange="markSetoranRowDirty('${jsq(s.nis)}')">
        </td>

        <td>
          <button class="btn btn-light history-btn" onclick="openStudentProgress('${jsq(s.nis)}', 'ringkasan')">
            Riwayat
          </button>
        </td>
      </tr>`;
  }).join("");


  if (mobile) {
    mobile.innerHTML = rows.map(s => {
      const nis = String(s.nis);
      const p = latestSetoranByNis.get(nis);
      const noSetoran = !p;
      const status = p?.status || "Lancar";
      const date = p?.tanggal || selectedDate;
      const surah = p?.namaSurah || "Belum ada setoran";
      const ayat = p?.ayatTerakhir ?? "—";
      return `<article class="mobile-student-card ${noSetoran ? "is-empty" : ""}">
        <div class="mobile-card-head">
          <div><strong>${esc(s.nama)}</strong><span>NIS ${esc(s.nis)} · Kelas ${esc(s.kelas)}</span></div>
          <span class="mobile-status ${status==="Lancar" ? "mobile-badge-green" : "mobile-badge-amber"}">${esc(status)}</span>
        </div>
        <div class="mobile-card-latest">
          <div class="mobile-card-label">SETORAN TERAKHIR</div>
          <div class="mobile-card-surah">${esc(surah)}</div>
          <div class="mobile-card-meta"><span>Ayat ${esc(ayat)}</span><span>${esc(date)}</span></div>
        </div>
        <div class="mobile-card-actions">
          <button type="button" class="btn btn-primary mobile-main-action"
            onclick="${p ? `openSetoranModal('${jsq(p.id)}')` : `openSetoranModalForStudent('${jsq(nis)}')`}">
            ${p ? "✎ Edit Setoran" : "＋ Tambah Setoran"}
          </button>
          <button type="button" class="btn btn-light" onclick="openStudentProgress('${jsq(nis)}','ringkasan')">Riwayat</button>
        </div>
      </article>`;
    }).join("");
  }

  document.querySelectorAll("#studentSetoranGrid [data-field='surah']").forEach(sel => {
    sel.addEventListener("change", () => {
      const row = sel.closest("tr");
      const nis = row?.dataset.studentSetoran;
      updateSetoranGridAyatLimit(row);
      markSetoranRowDirty(nis);
    });
  });

  document.querySelectorAll("#studentSetoranGrid tr[data-student-setoran]").forEach(row => {
    updateSetoranGridAyatLimit(row);
  });
}

function markSetoranRowDirty(nis) {
  dirtySetoranRows.add(String(nis));
  const row = document.querySelector(`[data-student-setoran="${cssEscape(nis)}"]`);
  row?.querySelectorAll(".latest-cell").forEach(cell => cell.classList.add("cell-dirty"));
}

async function saveAllInlineSetoran() {
  if (!dirtySetoranRows.size) {
    showNotice("Tidak ada perubahan", "Belum ada baris setoran yang diubah.");
    return;
  }

  const changes = [];

  for (const nis of dirtySetoranRows) {
    const row = document.querySelector(`[data-student-setoran="${cssEscape(nis)}"]`);
    const student = studentByNis(nis);
    if (!row || !student) continue;

    const surahId = Number(row.querySelector('[data-field="surah"]')?.value || 0);
    const ayat = Number(row.querySelector('[data-field="ayat"]')?.value || 0);
    const status = row.querySelector('[data-field="status"]')?.value || "";
    const tanggal = row.querySelector('[data-field="tanggal"]')?.value || "";

    const surah = surahs.find(x => Number(x.id) === surahId);

    if (!surah || !tanggal || !Number.isInteger(ayat) || ayat < 1 || ayat > Number(surah.ayat)) {
      showNotice(
        "Data belum lengkap",
        `${student.nama}: ayat harus diisi dari 1 sampai ${surah?.ayat || "maksimal yang tersedia"} dan surah, status, serta tanggal wajib dipilih.`,
        "warning"
      );
      return;
    }

    const existing = getSetoranByStudentAndDate(nis, tanggal);

    changes.push({
      nis,
      student,
      surah,
      ayat,
      status,
      tanggal,
      existing
    });
  }

  // One global confirmation for the save operation.
  const updateCount = changes.filter(x => x.existing).length;
  const createCount = changes.length - updateCount;

  let confirmMessage = [];
  if (createCount) confirmMessage.push(`${createCount} setoran baru akan ditambahkan ke riwayat.`);
  if (updateCount) confirmMessage.push(`${updateCount} setoran pada tanggal yang sudah ada akan diperbarui.`);

  const confirmed = await askConfirm(
    updateCount ? "Simpan perubahan setoran?" : "Tambah setoran ke riwayat?",
    confirmMessage.join(" ")
  );
  if (!confirmed) return;

  try {
    for (let i = 0; i < changes.length; i += 150) {
      const batch = writeBatch(db);

      for (const item of changes.slice(i, i + 150)) {
        const payload = {
          nis: item.nis,
          idSurah: Number(item.surah.id),
          namaSurah: item.surah.nama,
          juz: item.surah.juz,
          totalAyat: item.surah.ayat,
          ayatTerakhir: item.ayat,
          status: item.status,
          tanggal: item.tanggal,
          updatedBy: currentUser.uid,
          updatedByName: currentUser.displayName || currentUser.email || "",
          updatedAt: serverTimestamp()
        };

        let refId;
        if (item.existing) {
          refId = item.existing.id;
          batch.update(doc(db, "tahfidz_setoran", refId), payload);
        } else {
          const ref = doc(collection(db, "tahfidz_setoran"));
          refId = ref.id;
          batch.set(ref, {
            ...payload,
            createdBy: currentUser.uid,
            createdByName: currentUser.displayName || currentUser.email || "",
            createdAt: serverTimestamp()
          });
        }

        batch.set(
          doc(db, "tahfidz_portal", item.nis, "setoran", refId),
          {
            nis: item.nis,
            idSurah: Number(item.surah.id),
            namaSurah: item.surah.nama,
            juz: item.surah.juz,
            ayatTerakhir: item.ayat,
            status: item.status,
            tanggal: item.tanggal
          },
          { merge: true }
        );
      }

      await batch.commit();
    }

    dirtySetoranRows.clear();
    showNotice(
      "Setoran tersimpan",
      `${changes.length} baris berhasil diproses. Riwayat lama tetap dipertahankan kecuali tanggal yang sama memang diperbarui.`
    );
    await loadAll();
  } catch (e) {
    console.error(e);
    showNotice("Gagal menyimpan", readableFirestoreError(e), "warning");
  }
}



function buildSetoranTemplateRows() {
  return students
    .filter(s => s.aktif !== false)
    .sort((a,b) =>
      String(a.kelas).localeCompare(String(b.kelas)) ||
      String(a.nama).localeCompare(String(b.nama))
    )
    .map(s => [s.nis, s.nama, "", "", "", ""]);
}

function buildSetoranTemplateTSV() {
  const rows = [
    ["NIS","Nama Siswa","Surah","Ayat","Status","Tanggal"],
    ...buildSetoranTemplateRows()
  ];
  return rows.map(r => r.join("\t")).join("\n");
}

async function downloadSetoranTemplate() {
  const rows = [
    ["NIS","Nama Siswa","Surah","Ayat","Status","Tanggal"],
    ...buildSetoranTemplateRows()
  ];

  if (!window.ExcelJS) {
    showNotice(
      "Template Excel belum siap",
      "Library Excel belum berhasil dimuat. Pastikan internet aktif lalu refresh halaman.",
      "warning"
    );
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Bina Tahfidz";
    workbook.lastModifiedBy = currentUser?.email || "Bina Tahfidz";
    workbook.created = new Date();
    workbook.modified = new Date();

    const ws = workbook.addWorksheet("Setoran", {
      views: [{ state: "frozen", ySplit: 1 }]
    });

    // Write header and student rows.
    rows.forEach(row => ws.addRow(row));

    // Column widths.
    ws.columns = [
      { key: "nis", width: 12 },
      { key: "nama", width: 26 },
      { key: "surah", width: 24 },
      { key: "ayat", width: 10 },
      { key: "status", width: 14 },
      { key: "tanggal", width: 14 }
    ];

    // Header styling.
    const header = ws.getRow(1);
    header.font = { bold: true, color: { argb: "FFFFFF" } };
    header.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "087443" }
    };
    header.alignment = { vertical: "middle", horizontal: "center" };
    header.height = 22;

    // Light borders + number formats.
    ws.eachRow((row, rowNumber) => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: "thin", color: { argb: "DDE7E1" } },
          left: { style: "thin", color: { argb: "DDE7E1" } },
          bottom: { style: "thin", color: { argb: "DDE7E1" } },
          right: { style: "thin", color: { argb: "DDE7E1" } }
        };
        cell.alignment = { vertical: "middle" };
      });
      if (rowNumber > 1) {
        row.getCell(1).numFmt = "@"; // keep NIS as text
      }
    });

    // Auto-filter.
    ws.autoFilter = {
      from: "A1",
      to: `F${Math.max(1, rows.length)}`
    };

    // Master surah sheet.
    const master = workbook.addWorksheet("Master");
    master.addRow(["Surah"]);
    surahs
      .slice()
      .sort((a,b) => Number(a.id) - Number(b.id))
      .forEach(s => master.addRow([`${s.id} — ${s.nama}`]));
    master.getColumn(1).width = 32;

    // Status master sheet to keep validation robust and easy to inspect.
    master.getColumn(2).values = [];
    master.getCell("C1").value = "Status";
    master.getCell("C2").value = "Lancar";
    master.getCell("C3").value = "Mengulang";
    master.getColumn(3).width = 16;

    // Hide helper data; the user can still unhide if desired.
    master.state = "veryHidden";

    // Actual Excel data validation (not merely a visual dropdown).
    const lastDataRow = Math.max(2, rows.length);

    for (let r = 2; r <= lastDataRow; r++) {
      ws.getCell(`C${r}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: ["'Master'!$A$2:$A$115"],
        showErrorMessage: true,
        errorTitle: "Surah tidak valid",
        error: "Pilih surah dari dropdown."
      };

      ws.getCell(`E${r}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: ["'Master'!$C$2:$C$3"],
        showErrorMessage: true,
        errorTitle: "Status tidak valid",
        error: "Pilih Lancar atau Mengulang."
      };

      ws.getCell(`D${r}`).dataValidation = {
        type: "whole",
        operator: "between",
        formulae: [1, 999],
        allowBlank: true,
        showErrorMessage: true,
        errorTitle: "Ayat tidak valid",
        error: "Ayat harus berupa angka 1–999."
      };

      ws.getCell(`F${r}`).numFmt = "dd/mm/yyyy";
    }

    // Instructions sheet.
    const info = workbook.addWorksheet("Petunjuk");
    [
      ["PETUNJUK TEMPLATE SETORAN"],
      [""],
      ["1. NIS dan Nama Siswa sudah disediakan."],
      ["2. Pilih Surah menggunakan dropdown pada kolom Surah."],
      ["3. Pilih Status menggunakan dropdown Lancar / Mengulang."],
      ["4. Isi Ayat."],
      ["5. Tanggal boleh dikosongkan; aplikasi otomatis menggunakan tanggal hari ini."],
      ["6. Setelah selesai, copy seluruh tabel pada sheet Setoran dan paste ke aplikasi."],
      [""],
      ["Nama Siswa hanya untuk membantu guru. Sistem menggunakan NIS sebagai identitas utama."]
    ].forEach(r => info.addRow(r));
    info.getColumn(1).width = 110;
    info.getCell("A1").font = { bold: true, size: 14 };
    info.state = "visible";

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-setoran-bina-tahfidz.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);

    showNotice(
      "Template Excel siap",
      `Template ${rows.length - 1} siswa aktif berhasil dibuat dengan dropdown Surah dan Status.`
    );
  } catch (e) {
    console.error("Excel template error:", e);
    showNotice(
      "Gagal membuat Excel",
      e?.message || "Template Excel tidak dapat dibuat.",
      "warning"
    );
  }
}

function openBulkSetoranPasteModal() {
  document.getElementById("bulkSetoranText").value = "";
  document.getElementById("bulkSetoranPreview").innerHTML =
    `<div class="muted">
      1) Download template Excel → 2) isi setoran → 3) copy seluruh tabel → 4) paste di sini.
      <br><br>
      Kolom Nama Siswa hanya untuk membantu guru. Sistem tetap memakai <b>NIS</b> sebagai identitas utama.
    </div>`;
  document.getElementById("bulkSetoranModal").classList.remove("hidden");
}

function parseBulkSetoran(text) {
  const cleaned = String(text || "").replace(/^\uFEFF/, "").trim();
  if (!cleaned) return [];

  const lines = cleaned.split(/\r?\n/).filter(line => line.trim() !== "");
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const rows = lines.map(line => parseDelimitedLine(line, delimiter));

  const first = rows[0].map(normalizeHeader);
  const hasHeader = first.some(x => [
    "nis","namasiswa","nama","surah","namasurah","idsurah",
    "ayat","ayatterakhir","status","tanggal"
  ].includes(x));
  const dataRows = hasHeader ? rows.slice(1) : rows;

  return dataRows.map(r => {
    // New template format:
    // NIS | Nama Siswa | Surah | Ayat | Status | Tanggal
    // For backward compatibility, also accept the old 5-column format:
    // NIS | Surah | Ayat | Status | Tanggal
    const isSixColumns = r.length >= 6;

    const nis = String(r[0] || "").trim();
    const namaSiswa = isSixColumns ? String(r[1] || "").trim() : "";
    const surahText = isSixColumns ? String(r[2] || "").trim() : String(r[1] || "").trim();
    const ayat = Number(isSixColumns ? r[3] : r[2]);
    const status = String(isSixColumns ? (r[4] ?? "") : (r[3] ?? "Lancar")).trim();
    const tanggalInput = String(isSixColumns ? (r[5] ?? "") : (r[4] ?? "")).trim();
    const tanggal = tanggalInput || document.getElementById("setoranTanggalCepat")?.value || today();
    return { nis, namaSiswa, surahText, ayat, status, tanggal };
  });
}

document.addEventListener("input", e => {
  if (e.target?.id === "bulkSetoranText") previewBulkSetoran();
});

function previewBulkSetoran() {
  const rows = parseBulkSetoran(document.getElementById("bulkSetoranText").value);
  if (!rows.length) {
    document.getElementById("bulkSetoranPreview").innerHTML =
      "Belum ada data untuk dipreview.";
    return;
  }

  const htmlRows = rows.slice(0, 10).map(r => `
    <tr>
      <td>${esc(r.nis)}</td>
      <td class="bulk-preview-name">${esc(r.namaSiswa || "—")}</td>
      <td>${esc(r.surahText)}</td>
      <td>${esc(r.ayat || "")}</td>
      <td>${esc(r.status || "")}</td>
      <td>${esc(r.tanggal || "")}</td>
    </tr>`).join("");

  document.getElementById("bulkSetoranPreview").innerHTML = `
    <div style="font-size:11px;font-weight:800;margin-bottom:8px">${rows.length} baris terdeteksi</div>
    <div class="tablewrap">
      <table class="preview-table">
        <thead>
          <tr><th>NIS</th><th>Nama Siswa</th><th>Surah</th><th>Ayat</th><th>Status</th><th>Tanggal</th></tr>
        </thead>
        <tbody>${htmlRows}</tbody>
      </table>
    </div>`;
}

async function saveBulkSetoran() {
  const rows = parseBulkSetoran(document.getElementById("bulkSetoranText").value);
  if (!rows.length) {
    showNotice("Tidak ada data", "Tempel data setoran terlebih dahulu.", "warning");
    return;
  }

  const valid = [];
  const errors = [];

  for (const row of rows) {
    const student = studentByNis(row.nis);
    let surah = surahs.find(x => String(x.nama).toLowerCase() === row.surahText.toLowerCase());

    if (!surah && /^\d+$/.test(row.surahText)) {
      surah = surahs.find(x => Number(x.id) === Number(row.surahText));
    }

    // Template contains every student. A row with no setoran fields is intentional and skipped.
    const noSetoranData = !row.surahText && !row.ayat && !row.status && !row.tanggal;
    if (noSetoranData) continue;

    // Partial row must be completed instead of silently inserting incomplete data.
    if (!student) {
      errors.push(`${row.nis}: siswa tidak ditemukan`);
      continue;
    }
    if (!row.surahText || !row.ayat || !row.tanggal) {
      errors.push(`${row.nis}: data setoran belum lengkap`);
      continue;
    }
    if (!surah) {
      errors.push(`${row.nis}: surah "${row.surahText}" tidak ditemukan`);
      continue;
    }
    if (!Number.isInteger(row.ayat) || row.ayat < 1 || row.ayat > Number(surah.ayat)) {
      errors.push(`${row.nis}: ayat harus 1-${surah.ayat}`);
      continue;
    }
    if (!["Lancar", "Mengulang"].includes(row.status)) {
      errors.push(`${row.nis}: status harus Lancar/Mengulang`);
      continue;
    }
    if (!row.tanggal) {
      errors.push(`${row.nis}: tanggal kosong`);
      continue;
    }

    valid.push({
      row,
      student,
      surah,
      existing: getSetoranByStudentAndDate(row.nis, row.tanggal)
    });
  }

  if (!valid.length) {
    showNotice("Import tidak dapat diproses", errors.slice(0, 5).join(" · "), "warning");
    return;
  }

  const updateCount = valid.filter(x => x.existing).length;
  const createCount = valid.length - updateCount;

  let details = [];
  if (createCount) details.push(`${createCount} riwayat baru`);
  if (updateCount) details.push(`${updateCount} riwayat tanggal yang sama akan diperbarui`);

  const ok = await askConfirm(
    updateCount ? "Konfirmasi import setoran" : "Simpan setoran massal?",
    `${details.join(" dan ")} akan diproses.` +
    (errors.length ? ` ${errors.length} baris tidak valid akan dilewati.` : "")
  );
  if (!ok) return;

  try {
    for (let i = 0; i < valid.length; i += 150) {
      const batch = writeBatch(db);

      for (const item of valid.slice(i, i + 150)) {
        const { row, surah, existing } = item;

        const payload = {
          nis: row.nis,
          idSurah: Number(surah.id),
          namaSurah: surah.nama,
          juz: surah.juz,
          totalAyat: surah.ayat,
          ayatTerakhir: row.ayat,
          status: row.status,
          tanggal: row.tanggal,
          updatedBy: currentUser.uid,
          updatedByName: currentUser.displayName || currentUser.email || "",
          updatedAt: serverTimestamp()
        };

        let refId;
        if (existing) {
          refId = existing.id;
          batch.update(doc(db, "tahfidz_setoran", refId), payload);
        } else {
          const ref = doc(collection(db, "tahfidz_setoran"));
          refId = ref.id;
          batch.set(ref, {
            ...payload,
            createdBy: currentUser.uid,
            createdByName: currentUser.displayName || currentUser.email || "",
            createdAt: serverTimestamp()
          });
        }

        batch.set(
          doc(db, "tahfidz_portal", row.nis, "setoran", refId),
          {
            nis: row.nis,
            idSurah: Number(surah.id),
            namaSurah: surah.nama,
            juz: surah.juz,
            ayatTerakhir: row.ayat,
            status: row.status,
            tanggal: row.tanggal
          },
          { merge: true }
        );
      }

      await batch.commit();
    }

    closeModal("bulkSetoranModal");
    showNotice(
      "Setoran berhasil diproses",
      `${createCount} riwayat baru ditambahkan${updateCount ? ` dan ${updateCount} riwayat tanggal yang sama diperbarui` : ""}.` +
      (errors.length ? ` ${errors.length} baris dilewati.` : "")
    );
    await loadAll();
  } catch (e) {
    console.error(e);
    showNotice("Gagal menyimpan", readableFirestoreError(e), "warning");
  }
}



function buildCatatanTemplateRows() {
  return students
    .filter(s => s.aktif !== false)
    .sort((a,b) =>
      String(a.kelas).localeCompare(String(b.kelas)) ||
      String(a.nama).localeCompare(String(b.nama))
    )
    .map(s => [s.nis, s.nama, "", "", "", ""]);
}

async function downloadCatatanTemplate() {
  const rows = [
    ["NIS","Nama Siswa","Catatan","Saran Orang Tua","Referensi Tanggal Setoran","Tanggal Catatan"],
    ...buildCatatanTemplateRows()
  ];

  if (!window.ExcelJS) {
    showNotice(
      "Template Excel belum siap",
      "Library Excel belum berhasil dimuat. Pastikan internet aktif lalu refresh halaman.",
      "warning"
    );
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Bina Tahfidz";
    workbook.lastModifiedBy = currentUser?.email || "Bina Tahfidz";
    workbook.created = new Date();
    workbook.modified = new Date();

    const ws = workbook.addWorksheet("Catatan", {
      views: [{ state: "frozen", ySplit: 1 }]
    });

    rows.forEach(row => ws.addRow(row));

    ws.columns = [
      { key: "nis", width: 12 },
      { key: "nama", width: 26 },
      { key: "catatan", width: 44 },
      { key: "saran", width: 38 },
      { key: "ref", width: 24 },
      { key: "tanggal", width: 18 }
    ];

    const header = ws.getRow(1);
    header.font = { bold: true, color: { argb: "FFFFFF" } };
    header.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "087443" }
    };
    header.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    header.height = 28;

    ws.eachRow((row, rowNumber) => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: "thin", color: { argb: "DDE7E1" } },
          left: { style: "thin", color: { argb: "DDE7E1" } },
          bottom: { style: "thin", color: { argb: "DDE7E1" } },
          right: { style: "thin", color: { argb: "DDE7E1" } }
        };
        cell.alignment = { vertical: "top", wrapText: true };
      });
      if (rowNumber > 1) row.getCell(1).numFmt = "@";
    });

    ws.autoFilter = { from: "A1", to: `F${Math.max(1, rows.length)}` };

    // Date columns are text in the template on purpose so Excel/Google Sheets
    // can accept both yyyy-mm-dd and dd/mm/yyyy and the web parser normalizes it.
    // We provide a status hint in Petunjuk instead of forcing a date formula.

    const info = workbook.addWorksheet("Petunjuk");
    [
      ["PETUNJUK TEMPLATE CATATAN"],
      [""],
      ["1. NIS dan Nama Siswa sudah disediakan."],
      ["2. Isi Catatan Guru."],
      ["3. Isi Saran Orang Tua bila diperlukan."],
      ["4. Referensi Tanggal Setoran boleh dikosongkan → sistem memakai setoran terakhir siswa."],
      ["5. Bila diisi, referensi dicari berdasarkan NIS + tanggal setoran."],
      ["6. Tanggal Catatan boleh dikosongkan → sistem memakai tanggal hari ini."],
      ["7. Setelah selesai, copy seluruh tabel pada sheet Catatan dan paste ke aplikasi."],
      [""],
      ["Nama Siswa hanya untuk membantu guru. Sistem menggunakan NIS sebagai identitas utama."]
    ].forEach(r => info.addRow(r));
    info.getColumn(1).width = 115;
    info.getCell("A1").font = { bold: true, size: 14 };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-catatan-bina-tahfidz.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);

    showNotice(
      "Template Excel siap",
      `Template ${rows.length - 1} siswa aktif berhasil dibuat. Isi di Excel lalu copy sheet Catatan ke aplikasi.`
    );
  } catch (e) {
    console.error("Catatan template error:", e);
    showNotice("Gagal membuat Excel", e?.message || "Template tidak dapat dibuat.", "warning");
  }
}

function openBulkCatatanPasteModal() {
  document.getElementById("bulkCatatanText").value = "";
  document.getElementById("bulkCatatanPreview").innerHTML =
    `<div class="muted">
      1) Download template Excel → 2) isi catatan → 3) copy seluruh sheet Catatan → 4) paste di sini.
      <br><br>
      <b>NIS</b> adalah identitas utama. Nama hanya untuk membantu guru.
    </div>`;
  document.getElementById("bulkCatatanModal").classList.remove("hidden");
}

function normalizeDateInput(value) {
  const raw = String(value || "").trim();
  if (!raw) return today();

  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  // dd/mm/yyyy or d/m/yyyy
  const m = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    const d = String(m[1]).padStart(2, "0");
    const mo = String(m[2]).padStart(2, "0");
    return `${m[3]}-${mo}-${d}`;
  }

  // Excel/Sheets textual date that can safely be parsed by browser.
  const dt = new Date(raw);
  if (!Number.isNaN(dt.getTime())) {
    return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;
  }

  return raw;
}

function parseBulkCatatan(text) {
  const cleaned = String(text || "").replace(/^\uFEFF/,"").trim();
  if (!cleaned) return [];

  const lines = cleaned.split(/\r?\n/).filter(Boolean);
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const rows = lines.map(line => parseDelimitedLine(line, delimiter));

  const first = rows[0].map(normalizeHeader);
  const hasHeader = first.some(x => [
    "nis","namasiswa","nama","catatan","pesan","saranortu",
    "referensitanggalsetoran","referensisetoran","tanggalcatatan","tanggal"
  ].includes(x));

  const data = hasHeader ? rows.slice(1) : rows;

  return data.map(r => ({
    nis: String(r[0] || "").trim(),
    namaSiswa: String(r[1] || "").trim(),
    pesan: String(r[2] || "").trim(),
    saranOrtu: String(r[3] || "").trim(),
    referenceDate: normalizeDateInput(r[4]),
    tanggal: normalizeDateInput(r[5])
  }));
}

function previewBulkCatatan() {
  const rows = parseBulkCatatan(document.getElementById("bulkCatatanText").value);

  if (!rows.length) {
    document.getElementById("bulkCatatanPreview").innerHTML =
      "Belum ada data untuk dipreview.";
    return;
  }

  document.getElementById("bulkCatatanPreview").innerHTML = `
    <div style="font-size:11px;font-weight:800;margin-bottom:8px">${rows.length} baris terdeteksi</div>
    <div class="tablewrap">
      <table class="preview-table">
        <thead>
          <tr>
            <th>NIS</th><th>Nama Siswa</th><th>Catatan</th><th>Saran</th><th>Ref. Setoran</th><th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          ${rows.slice(0,10).map(r => `
            <tr>
              <td>${esc(r.nis)}</td>
              <td class="bulk-preview-name">${esc(r.namaSiswa || "—")}</td>
              <td>${esc(r.pesan)}</td>
              <td>${esc(r.saranOrtu)}</td>
              <td>${esc(r.referenceDate || "Setoran terakhir")}</td>
              <td>${esc(r.tanggal || today())}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function resolveNoteReference(nis, referenceDate) {
  const list = getSetoranByStudent(nis);
  if (!list.length) return null;

  const date = normalizeDateInput(referenceDate);
  if (!referenceDate) return list[0];

  return list.find(p => String(p.tanggal) === String(date)) || null;
}

async function saveBulkCatatan() {
  const rows = parseBulkCatatan(document.getElementById("bulkCatatanText").value);

  if (!rows.length) {
    showNotice("Tidak ada data", "Paste data catatan terlebih dahulu.", "warning");
    return;
  }

  const valid = [];
  const errors = [];

  for (const row of rows) {
    // Completely empty setoran-independent row: skip.
    if (!row.nis && !row.pesan && !row.saranOrtu) continue;

    const student = studentByNis(row.nis);
    if (!student) {
      errors.push(`${row.nis}: siswa tidak ditemukan`);
      continue;
    }

    if (!row.pesan) {
      errors.push(`${row.nis}: catatan kosong`);
      continue;
    }

    const referencedSetoran = resolveNoteReference(row.nis, row.referenceDate);

    if (row.referenceDate && !referencedSetoran) {
      errors.push(`${row.nis}: setoran tanggal ${row.referenceDate} tidak ditemukan`);
    }

    valid.push({
      row,
      student,
      referencedSetoran
    });
  }

  if (!valid.length) {
    showNotice(
      "Tidak dapat diproses",
      errors.slice(0,8).join(" · "),
      "warning"
    );
    return;
  }

  const ok = await askConfirm(
    "Simpan catatan massal?",
    `${valid.length} catatan akan diproses.` +
    (errors.length ? ` ${errors.length} baris/peringatan perlu diperiksa.` : "")
  );
  if (!ok) return;

  try {
    for (let i=0; i<valid.length; i+=150) {
      const batch = writeBatch(db);

      for (const item of valid.slice(i,i+150)) {
        const {row, referencedSetoran} = item;
        const existing = getStudentCatatanHistory(row.nis)
          .find(c => String(c.tanggal) === String(row.tanggal));

        const payload = {
          nis: row.nis,
          pesan: row.pesan,
          saranOrtu: row.saranOrtu,
          tanggal: row.tanggal,
          setoranId: referencedSetoran?.id || null,
          setoranReference: referencedSetoran ? {
            id: referencedSetoran.id,
            tanggal: referencedSetoran.tanggal,
            namaSurah: referencedSetoran.namaSurah,
            juz: referencedSetoran.juz,
            ayatTerakhir: referencedSetoran.ayatTerakhir,
            status: referencedSetoran.status
          } : null,
          updatedBy: currentUser.uid,
          updatedByName: currentUser.displayName || currentUser.email || "",
          updatedAt: serverTimestamp()
        };

        let refId = existing?.id;

        if (existing) {
          batch.update(doc(db,"tahfidz_catatan",existing.id),payload);
        } else {
          const ref = doc(collection(db,"tahfidz_catatan"));
          refId = ref.id;
          batch.set(ref,{
            ...payload,
            createdBy: currentUser.uid,
            createdByName: currentUser.displayName || currentUser.email || "",
            createdAt: serverTimestamp()
          });
        }

        batch.set(
          doc(db,"tahfidz_portal",row.nis,"catatan",refId),
          {
            nis: row.nis,
            pesan: row.pesan,
            saranOrtu: row.saranOrtu,
            tanggal: row.tanggal,
            setoranId: payload.setoranId,
            setoranReference: payload.setoranReference
          },
          {merge:true}
        );
      }

      await batch.commit();
    }

    closeModal("bulkCatatanModal");
    showNotice(
      "Catatan berhasil diproses",
      `${valid.length} catatan diproses. Tanggal baru menambah riwayat; tanggal yang sama memperbarui catatan pada tanggal tersebut.`
    );
    await loadAll();
  } catch (e) {
    console.error(e);
    showNotice("Gagal menyimpan", readableFirestoreError(e),"warning");
  }
}

document.addEventListener("input", e => {
  if (e.target?.id === "bulkCatatanText") previewBulkCatatan();
});

function exportStudentCatatanGrid() {
  const rows = students.filter(s=>s.aktif!==false)
    .sort((a,b)=>String(a.kelas).localeCompare(String(b.kelas)) || String(a.nama).localeCompare(String(b.nama)))
    .map(s => {
      const c = latestCatatanByNis.get(String(s.nis));
      const r = c?.setoranReference;
      return [s.nis,s.nama,s.kelas,c?.pesan||"",c?.saranOrtu||"",
        r ? `${r.tanggal} - ${r.namaSurah} ayat ${r.ayatTerakhir}` : "",
        c?.tanggal||""];
    });

  const csv = "\uFEFF" + [
    ["NIS","Nama","Kelas","Catatan Terakhir","Saran Orang Tua","Setoran Terkait","Tanggal"],
    ...rows
  ].map(r=>r.map(csvCell).join(",")).join("\r\n");

  downloadTextFile("bina-tahfidz-catatan-terakhir.csv",csv,"text/csv;charset=utf-8");
  showNotice("Export selesai",`${rows.length} siswa diekspor.`);
}

document.addEventListener("input",e=>{
  if(e.target?.id==="bulkCatatanText") previewBulkCatatan();
});

function exportStudentSetoranGrid() {
  const rows = students
    .filter(s => s.aktif !== false)
    .sort((a,b) => {
      const c = String(a.kelas).localeCompare(String(b.kelas));
      return c || String(a.nama).localeCompare(String(b.nama));
    })
    .map(s => {
      const p = latestSetoranByNis.get(String(s.nis));
      return [
        s.nis,
        s.nama,
        s.kelas,
        p?.namaSurah || "",
        p?.ayatTerakhir || "",
        p?.status || "",
        p?.tanggal || ""
      ];
    });

  const csv = "\uFEFF" +
    [["NIS","Nama","Kelas","Surah Terakhir","Ayat","Status","Tanggal"], ...rows]
      .map(r => r.map(csvCell).join(","))
      .join("\r\n");

  downloadTextFile("bina-tahfidz-setoran-terakhir.csv", csv, "text/csv;charset=utf-8");
  showNotice("Export selesai", `${rows.length} siswa diekspor.`);
}


function buildLatestCatatanMap() {
  latestCatatanByNis = new Map();
  [...catatan]
    .sort((a,b) => {
      const d = String(b.tanggal || "").localeCompare(String(a.tanggal || ""));
      return d || (Number(b.createdAt?.seconds || 0) - Number(a.createdAt?.seconds || 0));
    })
    .forEach(c => {
      const nis = String(c.nis);
      if (!latestCatatanByNis.has(nis)) latestCatatanByNis.set(nis, c);
    });
}

function fillCatatanClassFilter() {
  const sel = document.getElementById("catatanClassFilter");
  if (!sel) return;
  const classes = [...new Set(students.map(s => String(s.kelas || "").trim()).filter(Boolean))].sort();
  const current = sel.value || "ALL";
  sel.innerHTML = '<option value="ALL">Semua kelas</option>' +
    classes.map(k => `<option value="${escAttr(k)}">${esc(k)}</option>`).join("");
  sel.value = classes.includes(current) ? current : "ALL";
}

function renderStudentCatatanGrid() {
  fillCatatanClassFilter();

  const q = document.getElementById("catatanSearch")?.value.toLowerCase().trim() || "";
  const cls = document.getElementById("catatanClassFilter")?.value || "ALL";

  const rows = students
    .filter(s => s.aktif !== false)
    .filter(s => {
      const c = latestCatatanByNis.get(String(s.nis));
      const text = [s.nis,s.nama,s.kelas,c?.pesan || "",c?.saranOrtu || ""].join(" ").toLowerCase();
      return text.includes(q) && (cls === "ALL" || String(s.kelas) === cls);
    })
    .sort((a,b) => String(a.kelas).localeCompare(String(b.kelas)) || String(a.nama).localeCompare(String(b.nama)));

  const tbody = document.getElementById("studentCatatanGrid");
  const mobile = document.getElementById("studentCatatanMobile");

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty">Tidak ada siswa.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(s => {
    const nis = String(s.nis);
    const c = latestCatatanByNis.get(nis);
    const ref = c?.setoranReference || null;

    if (catatanEditMode) {
      const setoranOptions = getSetoranByStudent(nis);
      let refOptions = '<option value="">Tanpa referensi</option>';
      if (setoranOptions.length) {
        refOptions += '<option value="__LATEST__">Setoran terakhir</option>';
        refOptions += setoranOptions.map(p =>
          `<option value="${escAttr(p.id)}" ${String(c?.setoranId || "") === String(p.id) ? "selected" : ""}>
            ${esc(p.tanggal)} · ${esc(p.namaSurah)} · ayat ${esc(p.ayatTerakhir)}
          </option>`
        ).join("");
      }

      const refValue = c?.setoranId ? String(c.setoranId) : (c?.setoranReference ? "__SNAPSHOT__" : "");

      return `
        <tr class="catatan-row-edit" data-catatan-student="${escAttr(nis)}">
          <td class="sticky-col sticky-nis student-nis-cell">${esc(nis)}</td>
          <td class="sticky-col sticky-name student-name-cell">
            <div>${esc(s.nama)}</div>
            <div style="font-size:9px;color:#96a29c;margin-top:2px">${c ? "Catatan terakhir" : "Belum ada catatan"}</div>
          </td>
          <td>${esc(s.kelas)}</td>
          <td class="catatan-edit-cell">
            <textarea class="catatan-inline catatan-inline-textarea" data-field="pesan">${esc(c?.pesan || "")}</textarea>
          </td>
          <td class="catatan-edit-cell">
            <textarea class="catatan-inline catatan-inline-textarea" data-field="saranOrtu">${esc(c?.saranOrtu || "")}</textarea>
          </td>
          <td class="catatan-reference-cell">
            <select class="catatan-inline catatan-inline-select" data-field="setoranId">
              <option value="">Tanpa referensi</option>
              ${setoranOptions.length ? '<option value="__LATEST__">Setoran terakhir</option>' : ""}
              ${setoranOptions.map(p =>
                `<option value="${escAttr(p.id)}" ${String(c?.setoranId || "") === String(p.id) ? "selected" : ""}>
                  ${esc(p.tanggal)} · ${esc(p.namaSurah)} · ayat ${esc(p.ayatTerakhir)} · ${esc(p.status)}
                </option>`
              ).join("")}
            </select>
          </td>
          <td class="catatan-edit-cell">
            <input class="catatan-inline" data-field="tanggal" type="date" value="${escAttr(c?.tanggal || today())}">
          </td>
          <td>
            <div class="actions">
              <button class="btn btn-light" onclick="saveInlineCatatan('${jsq(nis)}')">Simpan</button>
              <button class="btn history-btn" onclick="openStudentCatatanHistory('${jsq(nis)}')">Riwayat</button>
            </div>
          </td>
        </tr>`;
    }

    return `
      <tr class="${c ? "" : "row-no-note"}">
        <td class="sticky-col sticky-nis student-nis-cell">${esc(nis)}</td>
        <td class="sticky-col sticky-name student-name-cell">
          <div>${esc(s.nama)}</div>
          <div style="font-size:9px;color:#96a29c;margin-top:2px">${c ? "Catatan terakhir" : "Belum ada catatan"}</div>
        </td>
        <td>${esc(s.kelas)}</td>
        <td class="note-cell">${c ? esc(c.pesan || "") : '<span style="color:#a2aea8">Belum ada catatan.</span>'}</td>
        <td class="saran-cell">${c ? esc(c.saranOrtu || "") : '<span style="color:#a2aea8">—</span>'}</td>
        <td class="note-related">
          ${ref
            ? `<strong>${esc(ref.namaSurah)}</strong><span>Ayat ${esc(ref.ayatTerakhir)} · ${esc(ref.tanggal)}</span><span>${esc(ref.status)}</span>`
            : '<span>Belum direferensikan ke setoran</span>'}
        </td>
        <td>${esc(c?.tanggal || "—")}</td>
        <td>
          <div class="actions">
            <button class="btn history-btn" onclick="openStudentCatatanHistory('${jsq(nis)}')">Riwayat</button>
            <button class="btn btn-light" onclick="openCatatanModalForStudent('${jsq(nis)}')">${c ? "Catatan Baru" : "Tambah"}</button>
          </div>
        </td>
      </tr>`;
  }).join("");


  if (mobile) {
    mobile.innerHTML = rows.map(s => {
      const nis = String(s.nis);
      const c = latestCatatanByNis.get(nis);
      const ref = c?.setoranReference || null;
      return `<article class="mobile-student-card ${c ? "" : "is-empty"}">
        <div class="mobile-card-head">
          <div><strong>${esc(s.nama)}</strong><span>NIS ${esc(s.nis)} · Kelas ${esc(s.kelas)}</span></div>
          <span class="mobile-note-dot">${c ? "Ada catatan" : "Belum ada"}</span>
        </div>
        <div class="mobile-note-section">
          <div class="mobile-card-label">CATATAN TERAKHIR</div>
          <div class="mobile-note-text">${c ? esc(c.pesan || "—") : "Belum ada catatan."}</div>
        </div>
        <div class="mobile-note-section">
          <div class="mobile-card-label">SARAN ORANG TUA</div>
          <div class="mobile-note-text">${c ? esc(c.saranOrtu || "—") : "—"}</div>
        </div>
        <div class="mobile-note-related">
          <span>Setoran terkait</span>
          <strong>${ref ? `${esc(ref.namaSurah)} · Ayat ${esc(ref.ayatTerakhir)}` : "Belum direferensikan"}</strong>
        </div>
        <div class="mobile-card-meta-line"><span>${esc(c?.tanggal || "—")}</span></div>
        <div class="mobile-card-actions">
          <button type="button" class="btn btn-primary mobile-main-action"
            onclick="${c ? `openCatatanModal('${jsq(c.id)}')` : `openCatatanModalForStudent('${jsq(nis)}')`}">
            ${c ? "✎ Edit Catatan" : "＋ Tambah Catatan"}
          </button>
          <button type="button" class="btn btn-light" onclick="openStudentCatatanHistory('${jsq(nis)}')">Riwayat</button>
        </div>
      </article>`;
    }).join("");
  }

  bindCatatanInlineDirtyHandlers();
}
function toggleCatatanEditMode() {
  catatanEditMode = !catatanEditMode;
  const btn = document.getElementById("catatanEditModeBtn");
  if (btn) {
    btn.textContent = catatanEditMode ? "✓ Selesai Edit" : "✎ Edit Tabel";
    btn.classList.toggle("btn-primary", catatanEditMode);
  }
  renderStudentCatatanGrid();
}

function bindCatatanInlineDirtyHandlers() {
  document.querySelectorAll("#studentCatatanGrid [data-field]").forEach(el => {
    el.addEventListener("input", () => markCatatanRowDirty(el.closest("tr")?.dataset.catatanStudent));
    el.addEventListener("change", () => markCatatanRowDirty(el.closest("tr")?.dataset.catatanStudent));
  });
}

function markCatatanRowDirty(nis) {
  if (!nis) return;
  dirtyCatatanRows.add(String(nis));
  const row = document.querySelector(`[data-catatan-student="${cssEscape(nis)}"]`);
  row?.querySelectorAll("[data-field]").forEach(el => {
    el.classList.add("catatan-dirty");
  });
}

async function saveInlineCatatan(nis) {
  const row = document.querySelector(`[data-catatan-student="${cssEscape(nis)}"]`);
  if (!row) return;

  const pesan = row.querySelector('[data-field="pesan"]')?.value.trim() || "";
  const saranOrtu = row.querySelector('[data-field="saranOrtu"]')?.value.trim() || "";
  const tanggal = row.querySelector('[data-field="tanggal"]')?.value || "";
  const refValue = row.querySelector('[data-field="setoranId"]')?.value || "";
  const existing = latestCatatanByNis.get(String(nis));

  if (!pesan || !tanggal) {
    showNotice("Data belum lengkap", "Catatan dan tanggal wajib diisi.", "warning");
    return;
  }

  let referencedSetoran = null;
  if (refValue === "__LATEST__") {
    referencedSetoran = getSetoranByStudent(nis)[0] || null;
  } else if (refValue) {
    referencedSetoran = setoran.find(p => p.id === refValue) || null;
  }

  const ok = await askConfirm(
    existing ? "Perbarui catatan terakhir?" : "Tambah catatan?",
    existing
      ? `Catatan ${studentByNis(nis)?.nama || nis} akan diperbarui. Riwayat lama tetap aman.`
      : `Catatan baru untuk ${studentByNis(nis)?.nama || nis} akan ditambahkan ke riwayat.`
  );
  if (!ok) return;

  try {
    const payload = {
      nis:String(nis),
      pesan,
      saranOrtu,
      tanggal,
      setoranId:referencedSetoran?.id || null,
      setoranReference:referencedSetoran ? {
        id:referencedSetoran.id,
        tanggal:referencedSetoran.tanggal,
        namaSurah:referencedSetoran.namaSurah,
        juz:referencedSetoran.juz,
        ayatTerakhir:referencedSetoran.ayatTerakhir,
        status:referencedSetoran.status
      } : null,
      updatedBy:currentUser.uid,
      updatedByName:currentUser.displayName || currentUser.email || "",
      updatedAt:serverTimestamp()
    };

    if (existing && String(existing.tanggal) === String(tanggal)) {
      await updateDoc(doc(db,"tahfidz_catatan",existing.id),payload);
      await setDoc(doc(db,"tahfidz_portal",nis,"catatan",existing.id),{
        nis:String(nis),pesan,saranOrtu,tanggal,
        setoranId:payload.setoranId,
        setoranReference:payload.setoranReference
      },{merge:true});
    } else {
      // Same behavior as Setoran: changing the date to a new date creates history.
      const ref = doc(collection(db,"tahfidz_catatan"));
      await setDoc(ref,{
        ...payload,
        createdBy:currentUser.uid,
        createdByName:currentUser.displayName || currentUser.email || "",
        createdAt:serverTimestamp()
      });
      await setDoc(doc(db,"tahfidz_portal",nis,"catatan",ref.id),{
        nis:String(nis),pesan,saranOrtu,tanggal,
        setoranId:payload.setoranId,
        setoranReference:payload.setoranReference
      });
    }

    dirtyCatatanRows.delete(String(nis));
    showNotice("Catatan tersimpan", "Catatan berhasil diperbarui.");
    await loadAll();
  } catch(e) {
    showNotice("Gagal menyimpan",readableFirestoreError(e),"warning");
  }
}

async function saveAllInlineCatatan() {
  if (!dirtyCatatanRows.size) {
    showNotice("Tidak ada perubahan", "Belum ada baris catatan yang diubah.");
    return;
  }

  const rows = [...dirtyCatatanRows];
  const ok = await askConfirm(
    "Simpan perubahan catatan?",
    `${rows.length} siswa memiliki perubahan catatan. Sistem akan memperbarui tanggal yang sama dan membuat riwayat baru bila tanggal berubah.`
  );
  if (!ok) return;

  for (const nis of rows) {
    const row = document.querySelector(`[data-catatan-student="${cssEscape(nis)}"]`);
    if (!row) continue;

    // Reuse the single-row save logic but without opening a second confirmation.
    const pesan = row.querySelector('[data-field="pesan"]')?.value.trim() || "";
    const saranOrtu = row.querySelector('[data-field="saranOrtu"]')?.value.trim() || "";
    const tanggal = row.querySelector('[data-field="tanggal"]')?.value || "";
    const refValue = row.querySelector('[data-field="setoranId"]')?.value || "";
    const existing = latestCatatanByNis.get(String(nis));

    if (!pesan || !tanggal) {
      showNotice("Data belum lengkap", `Catatan ${studentByNis(nis)?.nama || nis} belum lengkap.`, "warning");
      return;
    }

    let referencedSetoran = null;
    if (refValue === "__LATEST__") referencedSetoran = getSetoranByStudent(nis)[0] || null;
    else if (refValue) referencedSetoran = setoran.find(p => p.id === refValue) || null;

    const payload = {
      nis:String(nis),pesan,saranOrtu,tanggal,
      setoranId:referencedSetoran?.id || null,
      setoranReference:referencedSetoran ? {
        id:referencedSetoran.id,
        tanggal:referencedSetoran.tanggal,
        namaSurah:referencedSetoran.namaSurah,
        juz:referencedSetoran.juz,
        ayatTerakhir:referencedSetoran.ayatTerakhir,
        status:referencedSetoran.status
      } : null,
      updatedBy:currentUser.uid,
      updatedByName:currentUser.displayName || currentUser.email || "",
      updatedAt:serverTimestamp()
    };

    if (existing && String(existing.tanggal) === String(tanggal)) {
      await updateDoc(doc(db,"tahfidz_catatan",existing.id),payload);
      await setDoc(doc(db,"tahfidz_portal",nis,"catatan",existing.id),{
        nis:String(nis),pesan,saranOrtu,tanggal,
        setoranId:payload.setoranId,
        setoranReference:payload.setoranReference
      },{merge:true});
    } else {
      const ref = doc(collection(db,"tahfidz_catatan"));
      await setDoc(ref,{
        ...payload,
        createdBy:currentUser.uid,
        createdByName:currentUser.displayName || currentUser.email || "",
        createdAt:serverTimestamp()
      });
      await setDoc(doc(db,"tahfidz_portal",nis,"catatan",ref.id),{
        nis:String(nis),pesan,saranOrtu,tanggal,
        setoranId:payload.setoranId,
        setoranReference:payload.setoranReference
      });
    }
  }

  dirtyCatatanRows.clear();
  showNotice("Perubahan tersimpan", `${rows.length} catatan berhasil diproses.`);
  await loadAll();
}






function getStudentCatatanHistory(nis) {
  return catatan
    .filter(c => String(c.nis) === String(nis))
    .sort((a,b) => {
      const d = String(b.tanggal || "").localeCompare(String(a.tanggal || ""));
      return d || (Number(b.createdAt?.seconds || 0) - Number(a.createdAt?.seconds || 0));
    });
}

function populateCatatanReferenceSelect(nis, selectedId = "") {
  const list = getSetoranByStudent(nis);
  let options = '<option value="">Tanpa referensi setoran</option>';

  if (list.length) {
    options += '<option value="__LATEST__">Setoran terakhir</option>';
    options += list.map(p => `
      <option value="${escAttr(p.id)}" ${String(selectedId) === String(p.id) ? "selected" : ""}>
        ${esc(p.tanggal)} · ${esc(p.namaSurah)} · ayat ${esc(p.ayatTerakhir)} · ${esc(p.status)}
      </option>`).join("");
  }

  const select = document.getElementById("catatanSetoranRef");
  if (!select) return;
  select.innerHTML = options;
  select.value = selectedId ? String(selectedId) : (list.length ? "__LATEST__" : "");
  updateCatatanReferencePreview(nis);
}

function updateCatatanReferencePreview(nis) {
  const value = document.getElementById("catatanSetoranRef")?.value || "";
  let p = null;

  if (value === "__LATEST__") p = getSetoranByStudent(nis)[0] || null;
  else if (value) p = setoran.find(x => x.id === value) || null;

  const box = document.getElementById("catatanReferencePreview");
  if (!box) return;

  box.innerHTML = p
    ? `<strong>Setoran terkait</strong><br>${esc(p.tanggal)} · ${esc(p.namaSurah)} · ayat ${esc(p.ayatTerakhir)} · ${esc(p.status)}`
    : "Catatan ini tidak direferensikan ke setoran tertentu.";
}

function openStudentCatatanHistory(nis) {
  openStudentProgress(nis, "catatan");
}



function initLaporanControls() {
  const yearSelect = document.getElementById("laporanTahun");
  const monthSelect = document.getElementById("laporanBulan");
  const classSelect = document.getElementById("laporanKelas");
  if (!yearSelect || !monthSelect || !classSelect) return;

  const now = new Date();
  const currentYear = now.getFullYear();
  const years = [];
  for (let y = currentYear - 2; y <= currentYear + 1; y++) years.push(y);

  const currentYearValue = yearSelect.value || String(currentYear);
  yearSelect.innerHTML = years.map(y => `<option value="${y}">${y}</option>`).join("");
  yearSelect.value = years.includes(Number(currentYearValue)) ? currentYearValue : String(currentYear);

  const currentMonth = Number(monthSelect.value || now.getMonth() + 1);
  const months = [
    [1,"Januari"],[2,"Februari"],[3,"Maret"],[4,"April"],[5,"Mei"],[6,"Juni"],
    [7,"Juli"],[8,"Agustus"],[9,"September"],[10,"Oktober"],[11,"November"],[12,"Desember"]
  ];
  monthSelect.innerHTML = months.map(([v,n]) => `<option value="${v}">${n}</option>`).join("");
  monthSelect.value = String(currentMonth);

  const classes = [...new Set(students.map(s => String(s.kelas || "").trim()).filter(Boolean))].sort();
  const currentClass = classSelect.value || "ALL";
  classSelect.innerHTML = '<option value="ALL">Semua kelas</option>' +
    classes.map(k => `<option value="${escAttr(k)}">${esc(k)}</option>`).join("");
  classSelect.value = classes.includes(currentClass) ? currentClass : "ALL";
}

function getLaporanPeriod() {
  const mode = document.getElementById("laporanPeriode")?.value || "bulanan";
  const year = Number(document.getElementById("laporanTahun")?.value || new Date().getFullYear());
  const month = Number(document.getElementById("laporanBulan")?.value || (new Date().getMonth() + 1));
  const semester = document.getElementById("laporanSemester")?.value || "1";

  if (mode === "custom") {
    let start = document.getElementById("laporanMulai")?.value || today();
    let end = document.getElementById("laporanSampai")?.value || today();
    if (start > end) [start,end] = [end,start];
    return {mode,start,end,label:`${formatMonitoringDate(start)} — ${formatMonitoringDate(end)}`};
  }

  if (mode === "mingguan") {
    const base = new Date(year, month - 1, 1);
    const start = formatLocalDate(base);
    const end = formatLocalDate(new Date(year, month, 0));
    // For this temporary concept, "mingguan" means 7 hari from the first
    // date selected in the month; subsequent filters remain simple.
    const startDate = document.getElementById("laporanMulai")?.value || start;
    const endDate = addDays(startDate, 6);
    return {mode,start:startDate,end:endDate,label:`${formatMonitoringDate(startDate)} — ${formatMonitoringDate(endDate)}`};
  }

  if (mode === "semester") {
    const startMonth = semester === "2" ? 7 : 1;
    const endMonth = semester === "2" ? 12 : 6;
    const start = `${year}-${String(startMonth).padStart(2,"0")}-01`;
    const end = formatLocalDate(new Date(year, endMonth, 0));
    return {mode,start,end,label:`Semester ${semester} · ${year}`};
  }

  const start = `${year}-${String(month).padStart(2,"0")}-01`;
  const end = formatLocalDate(new Date(year, month, 0));
  return {mode,start,end,label:`${monthsName(month)} ${year}`};
}

function monthsName(month){
  return [
    "","Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ][Number(month)] || "";
}


function initRaporControls() {
  const kelas = document.getElementById("raporKelas");
  const siswa = document.getElementById("raporSiswa");
  if (!kelas || !siswa) return;

  const classes = [...new Set(
    students.filter(s => s.aktif !== false)
      .map(s => String(s.kelas || "").trim()).filter(Boolean)
  )].sort();

  const currentClass = kelas.value || "ALL";
  kelas.innerHTML = '<option value="ALL">Semua kelas</option>' +
    classes.map(k => `<option value="${escAttr(k)}">${esc(k)}</option>`).join("");
  kelas.value = classes.includes(currentClass) ? currentClass : "ALL";

  const currentStudent = siswa.value || "";
  const selectedClass = kelas.value;
  const list = students
    .filter(s => s.aktif !== false)
    .filter(s => selectedClass === "ALL" || String(s.kelas) === selectedClass)
    .sort((a,b) => String(a.kelas).localeCompare(String(b.kelas)) || String(a.nama).localeCompare(String(b.nama)));

  siswa.innerHTML = '<option value="">Pilih siswa</option>' +
    list.map(s => `<option value="${escAttr(s.nis)}">${esc(s.nis)} — ${esc(s.nama)} (${esc(s.kelas)})</option>`).join("");

  if (list.some(s => String(s.nis) === String(currentStudent))) {
    siswa.value = currentStudent;
  }
}

function getRaporPeriod() {
  const mode = document.getElementById("raporPeriode")?.value || "semester1";
  const yearNow = new Date().getFullYear();
  const tp = document.getElementById("raporTahunPelajaran")?.value?.trim() || `${yearNow}/${yearNow+1}`;

  if (mode === "custom") {
    let start = document.getElementById("raporMulai")?.value || today();
    let end = document.getElementById("raporSampai")?.value || today();
    if (start > end) [start,end] = [end,start];
    return {mode, start, end, tp, label:`${formatMonitoringDate(start)} — ${formatMonitoringDate(end)}`};
  }

  // Temporary academic-year assumption; easy to change when official school calendar is known.
  const year = Number(tp.slice(0,4)) || yearNow;
  if (mode === "semester2") {
    return {
      mode,start:`${year}-01-01`,end:`${year}-06-30`,tp,
      label:`Semester 2 · ${tp}`
    };
  }
  return {
    mode,start:`${year}-07-01`,end:`${year+1}-12-31`,tp,
    label:`Semester 1 · ${tp}`
  };
}

function getRaporData(nis) {
  const student = studentByNis(nis);
  if (!student) return null;

  const period = getRaporPeriod();
  const dates = getDateRange(period.start, period.end);

  const rows = setoran
    .filter(p => String(p.nis) === String(nis) && dates.includes(String(p.tanggal)))
    .sort((a,b) => String(b.tanggal).localeCompare(String(a.tanggal)));

  const notes = catatan
    .filter(c => String(c.nis) === String(nis) && dates.includes(String(c.tanggal)))
    .sort((a,b) => String(b.tanggal).localeCompare(String(a.tanggal)));

  const uniqueDates = [...new Set(rows.map(p => p.tanggal))];
  const uniqueSurahs = [...new Set(rows.map(p => String(p.namaSurah || "")))].filter(Boolean);

  // Latest record for each surah in the period.
  const perSurah = new Map();
  rows.slice().reverse().forEach(p => {
    const key = String(p.idSurah || p.namaSurah || "");
    perSurah.set(key, p);
  });

  const latest = rows[0] || null;

  return {
    student, period, rows, notes,
    totalSetoran: rows.length,
    totalHariSetor: uniqueDates.length,
    totalSurah: uniqueSurahs.length,
    lancar: rows.filter(p => p.status === "Lancar").length,
    mengulang: rows.filter(p => p.status === "Mengulang").length,
    latest,
    perSurah: [...perSurah.values()].sort((a,b) => Number(a.idSurah || 0) - Number(b.idSurah || 0)),
    latestNote: notes[0] || null
  };
}

function buildRaporDeskripsi(data) {
  const {student, rows, totalHariSetor, lancar, mengulang, latest, notes} = data;

  if (!rows.length) {
    return `${student.nama} belum memiliki transaksi setoran yang tercatat pada periode ini. Data ini perlu menjadi bahan tindak lanjut pembinaan dan penjadwalan setoran berikutnya.`;
  }

  const first = `${student.nama} mencatat ${rows.length} setoran pada ${totalHariSetor} hari selama periode laporan.`;
  const second = latest
    ? `Setoran terakhir pada ${formatMonitoringDate(latest.tanggal)} mencapai ${latest.namaSurah} ayat ${latest.ayatTerakhir} dengan status ${latest.status}.`
    : "";
  const third = mengulang > lancar
    ? "Sebagian besar setoran pada periode ini berstatus Mengulang sehingga murojaah perlu mendapat perhatian."
    : lancar >= mengulang
      ? "Sebagian besar setoran pada periode ini berstatus Lancar."
      : "Status setoran bervariasi sehingga perkembangan perlu terus dipantau.";
  const fourth = notes.length
    ? `Terdapat ${notes.length} catatan pembinaan guru pada periode ini.`
    : "Belum ada catatan pembinaan guru pada periode ini.";

  return `${first} ${second} ${third} ${fourth}`;
}

function renderRaporPreview() {
  const nis = document.getElementById("raporSiswa")?.value;
  const preview = document.getElementById("raporPreview");
  if (!preview) return;

  if (!nis) {
    preview.innerHTML = '<div class="rapor-preview-empty">Pilih siswa untuk melihat pratinjau rapor.</div>';
    return;
  }

  const data = getRaporData(nis);
  if (!data) {
    preview.innerHTML = '<div class="rapor-preview-empty">Data siswa tidak ditemukan.</div>';
    return;
  }

  const d = data;
  preview.innerHTML = `
    <div class="rapor-paper rapor-paper-${getRaporPaperConfig().key}">
      <div class="rapor-paper-head">
        <div class="rapor-logo-wrap">
          <img class="rapor-logo" src="assets/logo-smpit-alfirdaus.png" alt="Logo SMPIT Al Firdaus Purwodadi">
        </div>
        <div class="rapor-school">SMPIT AL FIRDAUS PURWODADI</div>
        <div class="rapor-title">RAPOR PERKEMBANGAN TAHFIDZ</div>
        <div class="rapor-period">${esc(d.period.label)} · Tahun Pelajaran ${esc(d.period.tp)}</div>
      </div>

      <div class="rapor-identity-grid">
        <div><span>Nama Siswa</span><strong>${esc(d.student.nama)}</strong></div>
        <div><span>NIS</span><strong>${esc(d.student.nis)}</strong></div>
        <div><span>Kelas</span><strong>${esc(d.student.kelas)}</strong></div>
      </div>

      <div class="rapor-section-title">A. Ringkasan Perkembangan</div>
      <div class="rapor-metric-grid">
        <div><span>Total Setoran</span><strong>${d.totalSetoran}</strong></div>
        <div><span>Hari Setor</span><strong>${d.totalHariSetor}</strong></div>
        <div><span>Surah Dipelajari</span><strong>${d.totalSurah}</strong></div>
        <div><span>Lancar / Mengulang</span><strong>${d.lancar} / ${d.mengulang}</strong></div>
      </div>

      <div class="rapor-section-title">B. Capaian Hafalan</div>
      <table class="rapor-mini-table">
        <thead><tr><th>Surah</th><th>Juz</th><th>Ayat Terakhir</th><th>Status</th><th>Tanggal</th></tr></thead>
        <tbody>
          ${d.perSurah.slice(0,12).map(p => `
            <tr>
              <td>${esc(p.namaSurah)}</td>
              <td>${esc(p.juz)}</td>
              <td>${esc(p.ayatTerakhir)}</td>
              <td>${esc(p.status)}</td>
              <td>${esc(p.tanggal)}</td>
            </tr>`).join("") || '<tr><td colspan="5">Belum ada data hafalan pada periode ini.</td></tr>'}
        </tbody>
      </table>

      <div class="rapor-section-title">C. Catatan Pembinaan</div>
      <div class="rapor-notes-box">
        ${d.notes.slice(0,5).map(n => `
          <div class="rapor-note-row">
            <strong>${esc(n.tanggal)}</strong>
            <span>${esc(n.pesan)}</span>
            ${n.saranOrtu ? `<small>Saran orang tua: ${esc(n.saranOrtu)}</small>` : ""}
          </div>`).join("") ||
          '<div class="rapor-empty-line">Belum ada catatan pembinaan pada periode ini.</div>'}
      </div>

      <div class="rapor-section-title">D. Deskripsi Perkembangan</div>
      <div class="rapor-description">${esc(buildRaporDeskripsi(d))}</div>

      <div class="rapor-signature-grid">
        <div><span>Guru Tahfidz</span><div class="rapor-signature-space"></div><strong>________________________</strong></div>
        <div><span>Orang Tua / Wali</span><div class="rapor-signature-space"></div><strong>________________________</strong></div>
      </div>

      <div class="rapor-footer-note">Format sementara — akan disesuaikan setelah format rapor resmi sekolah ditetapkan.</div>
    </div>`;
}

function renderRapor() {
  initRaporControls();

  const mode = document.getElementById("raporPeriode")?.value || "semester1";
  const custom = mode === "custom";
  document.getElementById("raporCustomMulaiWrap")?.classList.toggle("hidden", !custom);
  document.getElementById("raporCustomSampaiWrap")?.classList.toggle("hidden", !custom);

  const period = getRaporPeriod();
  document.getElementById("raporPeriodInfo").innerHTML =
    `<strong>Periode:</strong> ${esc(period.label)}
     <span>· ${esc(period.start)} sampai ${esc(period.end)}</span>`;

  renderRaporPreview();
}

function getRaporStudents(scope) {
  const kelas = document.getElementById("raporKelas")?.value || "ALL";
  const nis = document.getElementById("raporSiswa")?.value || "";

  let list = students.filter(s => s.aktif !== false);

  if (scope === "individu" && nis) {
    list = list.filter(s => String(s.nis) === String(nis));
  } else if (scope === "kelas") {
    list = list.filter(s => kelas === "ALL" || String(s.kelas) === kelas);
  } else if (scope === "semua") {
    // all active students
  }

  return list.sort((a,b) =>
    String(a.kelas).localeCompare(String(b.kelas)) ||
    String(a.nama).localeCompare(String(b.nama))
  );
}


function getRaporPaperConfig() {
  const paper = document.getElementById("raporKertas")?.value || "A4";
  if (paper === "F4") {
    return {
      key: "F4",
      label: "F4",
      width: 215.9,
      height: 330.2
    };
  }
  return {
    key: "A4",
    label: "A4",
    width: 210,
    height: 297
  };
}

let raporLogoDataUrl = null;

async function getRaporLogoDataUrl() {
  if (raporLogoDataUrl) return raporLogoDataUrl;

  const response = await fetch("assets/logo-smpit-alfirdaus.png", { cache: "force-cache" });
  if (!response.ok) throw new Error("Logo SMPIT Al Firdaus Purwodadi tidak dapat dimuat.");

  const blob = await response.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      raporLogoDataUrl = reader.result;
      resolve(raporLogoDataUrl);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}


let raporBatchReviewState = {
  mode: null,
  students: [],
  index: 0
};

function getRaporBatchReviewStudents(mode) {
  return getRaporStudents(mode === "kelas" ? "kelas" : "semua");
}

function openRaporBatchReview(mode) {
  if (mode === "kelas") {
    const kelas = document.getElementById("raporKelas")?.value || "ALL";
    if (kelas === "ALL") {
      showNotice("Kelas belum dipilih", "Pilih kelas tertentu terlebih dahulu untuk meninjau satu kelas.", "warning");
      return;
    }
  }

  const list = getRaporBatchReviewStudents(mode);
  if (!list.length) {
    showNotice("Tidak ada siswa", "Tidak ada siswa yang memenuhi pilihan review.", "warning");
    return;
  }

  raporBatchReviewState = {
    mode,
    students: list,
    index: 0
  };

  const title = document.getElementById("raporBatchReviewTitle");
  if (title) {
    title.textContent = mode === "kelas"
      ? `Review Rapor Kelas ${document.getElementById("raporKelas")?.value || ""}`
      : "Review Semua Rapor";
  }

  const select = document.getElementById("raporBatchStudentSelect");
  if (select) {
    select.innerHTML = list.map((s, i) =>
      `<option value="${i}">${esc(s.nama)} — ${esc(s.nis)} (${esc(s.kelas)})</option>`
    ).join("");
  }

  renderRaporBatchReview();
  openModal("raporBatchReviewModal");
}

function renderRaporBatchReview() {
  const state = raporBatchReviewState;
  const student = state.students[state.index];
  const paper = document.getElementById("raporBatchReviewPaper");
  const meta = document.getElementById("raporBatchReviewMeta");
  const select = document.getElementById("raporBatchStudentSelect");

  if (!student || !paper) return;

  if (select) select.value = String(state.index);

  if (meta) {
    meta.textContent = `${state.index + 1} dari ${state.students.length} siswa`;
  }

  // Reuse the exact same single-student report template so review and PDF
  // remain visually consistent.
  const mainSelect = document.getElementById("raporSiswa");
  const mainPreview = document.getElementById("raporPreview");
  if (mainSelect && mainPreview) {
    mainSelect.value = String(student.nis);
    renderRaporPreview();
    paper.innerHTML = mainPreview.innerHTML;
  }

  const prev = document.querySelector("#raporBatchReviewModal .rapor-batch-controls .btn:nth-child(2)");
  const next = document.querySelector("#raporBatchReviewModal .rapor-batch-controls .btn:nth-child(3)");
  if (prev) prev.disabled = state.index <= 0;
  if (next) next.disabled = state.index >= state.students.length - 1;
}

function reviewRaporBatchStudent(index) {
  if (!Number.isFinite(index)) return;
  if (index < 0) index = 0;
  if (index >= raporBatchReviewState.students.length) {
    index = raporBatchReviewState.students.length - 1;
  }
  raporBatchReviewState.index = index;
  renderRaporBatchReview();
}

function reviewRaporBatchPrevious() {
  reviewRaporBatchStudent(raporBatchReviewState.index - 1);
}

function reviewRaporBatchNext() {
  reviewRaporBatchStudent(raporBatchReviewState.index + 1);
}

async function printCurrentRaporBatchStudent() {
  const student = raporBatchReviewState.students[raporBatchReviewState.index];
  if (!student) return;
  await exportRaporPdf([student], "review-individu");
}

async function printCurrentRaporBatchAll() {
  const state = raporBatchReviewState;
  if (!state.students.length) return;

  const ok = await askConfirm(
    state.mode === "kelas" ? "Cetak semua rapor kelas?" : "Cetak semua rapor?",
    `${state.students.length} rapor dalam daftar review akan dibuat menjadi PDF.`
  );
  if (!ok) return;

  await exportRaporPdf(
    state.students,
    state.mode === "kelas" ? "kelas-review" : "semua-review"
  );
}

async function exportRaporIndividu() {
  const nis = document.getElementById("raporSiswa")?.value;
  if (!nis) {
    showNotice("Siswa belum dipilih","Pilih satu siswa untuk mencetak rapor individu.","warning");
    return;
  }
  await exportRaporPdf([studentByNis(nis)].filter(Boolean), "individu");
}

async function exportRaporKelas() {
  const kelas = document.getElementById("raporKelas")?.value || "ALL";
  if (kelas === "ALL") {
    showNotice("Kelas belum dipilih","Pilih kelas tertentu untuk mencetak satu kelas.","warning");
    return;
  }
  await exportRaporPdf(getRaporStudents("kelas"), "kelas");
}

async function exportRaporSemua() {
  const ok = await askConfirm(
    "Cetak semua rapor?",
    `Rapor akan dibuat untuk ${getRaporStudents("semua").length} siswa aktif.`
  );
  if (!ok) return;
  await exportRaporPdf(getRaporStudents("semua"), "semua");
}

function ensurePdfLibraries() {
  return !!(window.jspdf && window.jspdf.jsPDF);
}

async function exportRaporPdf(studentList, mode) {
  if (!ensurePdfLibraries()) {
    showNotice("PDF belum siap","Library PDF belum berhasil dimuat. Pastikan internet aktif lalu refresh halaman.","warning");
    return;
  }

  if (!studentList.length) {
    showNotice("Tidak ada siswa","Tidak ada siswa yang memenuhi pilihan cetak.","warning");
    return;
  }

  const { jsPDF } = window.jspdf;
  const paper = getRaporPaperConfig();

  let logoDataUrl = null;
  try {
    logoDataUrl = await getRaporLogoDataUrl();
  } catch (e) {
    console.warn("Logo rapor tidak dapat dimuat:", e);
  }

  const format = paper.key === "A4" ? "a4" : [paper.width, paper.height];
  const doc = new jsPDF({orientation:"portrait",unit:"mm",format});
  const margin = paper.key === "F4" ? 17 : 16;
  const pageW = paper.width;
  const pageH = paper.height;
  const contentW = pageW - margin * 2;

  studentList.forEach((student, idx) => {
    if (idx > 0) doc.addPage(format, "portrait");

    const data = getRaporData(student.nis);
    drawPdfRapor(doc,data,margin,contentW,pageW,pageH,logoDataUrl,paper);
  });

  const period = getRaporPeriod();
  const suffix = mode === "individu"
    ? `-${studentList[0].nis}`
    : mode === "kelas"
      ? `-${(document.getElementById("raporKelas")?.value || "kelas")}`
      : "-semua";

  doc.save(`rapor-tahfidz-${period.start}-sd-${period.end}${suffix}.pdf`);

  showNotice(
    "PDF berhasil dibuat",
    `${studentList.length} rapor berhasil dibuat untuk dicetak.`
  );
}

function drawPdfRapor(doc,data,margin,contentW,pageW,pageH,logoDataUrl,paper) {
  const student = data.student;
  const period = data.period;

  // Header + school logo
  const logoSize = 21;
  const logoX = margin;
  const logoY = 12;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", logoX, logoY, logoSize, logoSize);
    } catch (e) {
      console.warn("Logo gagal ditambahkan ke PDF:", e);
    }
  }

  const textX = margin + logoSize + 7;

  doc.setFont("helvetica","bold");
  doc.setFontSize(12);
  doc.setTextColor(21,72,53);
  doc.text("SMPIT AL FIRDAUS PURWODADI", textX, 18);

  doc.setFontSize(15);
  doc.text("RAPOR PERKEMBANGAN TAHFIDZ", textX, 27);

  doc.setFont("helvetica","normal");
  doc.setFontSize(8.5);
  doc.setTextColor(92,106,99);
  doc.text(`${period.label} · Tahun Pelajaran ${period.tp}`, textX, 34);

  doc.setFontSize(7);
  doc.text(`Ukuran kertas: ${paper.label}`, textX, 39);

  doc.setDrawColor(25,91,66);
  doc.setLineWidth(0.6);
  doc.line(margin, 45, margin+contentW, 45);

  // Identity
  doc.setFontSize(9);
  doc.setTextColor(89,103,96);
  doc.text("Nama Siswa",margin,53);
  doc.text("NIS",margin+88,53);
  doc.text("Kelas",margin+139,53);

  doc.setFont("helvetica","bold");
  doc.setTextColor(31,76,59);
  doc.text(String(student.nama),margin,59);
  doc.text(String(student.nis),margin+88,59);
  doc.text(String(student.kelas),margin+139,59);

  // Summary cards
  const cardY = 68;
  const cardW = (contentW - 12) / 4;
  const metrics = [
    ["Setoran",String(data.totalSetoran)],
    ["Hari Setor",String(data.totalHariSetor)],
    ["Surah",String(data.totalSurah)],
    ["Lancar",String(data.lancar)]
  ];
  metrics.forEach((m,i)=>{
    const x=margin+i*(cardW+4);
    doc.setFillColor(246,250,247);
    doc.setDrawColor(223,232,226);
    doc.roundedRect(x,cardY,cardW,20,2.5,2.5,"FD");
    doc.setFont("helvetica","normal");
    doc.setFontSize(7.5);
    doc.setTextColor(102,116,108);
    doc.text(m[0],x+4,cardY+7);
    doc.setFont("helvetica","bold");
    doc.setFontSize(12);
    doc.setTextColor(35,92,68);
    doc.text(m[1],x+4,cardY+15);
  });

  let y = 98;

  doc.setFont("helvetica","bold");
  doc.setFontSize(10);
  doc.setTextColor(38,82,64);
  doc.text("A. Capaian Hafalan",margin,y);
  y += 4;

  const rows = data.perSurah.slice(0,14).map(p => [
    p.namaSurah, p.juz, p.ayatTerakhir, p.status, formatMonitoringDate(p.tanggal)
  ]);
  if (typeof doc.autoTable === "function") {
    doc.autoTable({
      startY:y,
      margin:{left:margin,right:margin},
      head:[["Surah","Juz","Ayat Terakhir","Status","Tanggal"]],
      body:rows.length ? rows : [["Belum ada data","-","-","-","-"]],
      styles:{font:"helvetica",fontSize:8,cellPadding:2.4,textColor:[57,70,63]},
      headStyles:{fillColor:[35,106,76],textColor:[255,255,255],fontStyle:"bold"},
      alternateRowStyles:{fillColor:[248,251,249]},
      theme:"grid",
      tableWidth:contentW
    });
    y = doc.lastAutoTable.finalY + 8;
  } else {
    y += 7;
  }

  // Notes
  doc.setFont("helvetica","bold");
  doc.setFontSize(10);
  doc.setTextColor(38,82,64);
  doc.text("B. Catatan Pembinaan",margin,y);
  y += 5;

  const notes = data.notes.slice(0,5);
  doc.setFont("helvetica","normal");
  doc.setFontSize(8.5);
  doc.setTextColor(69,82,75);

  if (!notes.length) {
    doc.text("Belum ada catatan pembinaan pada periode ini.",margin,y);
    y += 9;
  } else {
    notes.forEach(n=>{
      const ref = n.setoranReference;
      const line = `${formatMonitoringDate(n.tanggal)} — ${n.pesan || ""}`;
      const wrapped = doc.splitTextToSize(line,contentW);
      doc.text(wrapped,margin,y);
      y += wrapped.length*4.2 + 2;
      if (n.saranOrtu) {
        const s = doc.splitTextToSize(`Saran orang tua: ${n.saranOrtu}`,contentW-5);
        doc.setTextColor(98,111,103);
        doc.text(s,margin+4,y);
        y += s.length*4 + 2;
        doc.setTextColor(69,82,75);
      }
      if (ref) {
        const r = doc.splitTextToSize(`Setoran terkait: ${ref.namaSurah} · Ayat ${ref.ayatTerakhir} · ${ref.status}`,contentW-5);
        doc.setTextColor(119,93,51);
        doc.text(r,margin+4,y);
        y += r.length*4 + 2;
        doc.setTextColor(69,82,75);
      }
    });
  }

  // Description
  y += 2;
  doc.setFont("helvetica","bold");
  doc.setTextColor(38,82,64);
  doc.text("C. Deskripsi Perkembangan",margin,y);
  y += 5;

  doc.setFont("helvetica","normal");
  doc.setTextColor(69,82,75);
  const desc = doc.splitTextToSize(buildRaporDeskripsi(data),contentW);
  doc.text(desc,margin,y);
  y += desc.length*4.2 + 12;

  // Signatures
  const sigY = Math.min(Math.max(y, pageH - 42), pageH - 32);
  doc.setFontSize(8);
  doc.setTextColor(91,105,97);
  doc.text("Guru Tahfidz",margin,sigY);
  doc.text("Orang Tua / Wali",margin+115,sigY);
  doc.text("____________________",margin,sigY+24);
  doc.text("____________________",margin+115,sigY+24);

  doc.setFontSize(6.5);
  doc.setTextColor(135,145,140);
  doc.text("Format sementara — menunggu format rapor resmi SMPIT Al Firdaus Purwodadi.",margin,pageH - 7);
}

function renderLaporan() {
  initLaporanControls();

  const mode = document.getElementById("laporanPeriode")?.value || "bulanan";
  const custom = mode === "custom";
  document.getElementById("laporanCustomDateWrap")?.classList.toggle("hidden", !custom);
  document.getElementById("laporanCustomEndWrap")?.classList.toggle("hidden", !custom);

  const period = getLaporanPeriod();
  const classFilter = document.getElementById("laporanKelas")?.value || "ALL";

  const reportStudents = students
    .filter(s => s.aktif !== false)
    .filter(s => classFilter === "ALL" || String(s.kelas) === classFilter)
    .sort((a,b) =>
      String(a.kelas).localeCompare(String(b.kelas)) ||
      String(a.nama).localeCompare(String(b.nama))
    );

  const dates = getDateRange(period.start,period.end);
  const periodSetoran = setoran.filter(p =>
    dates.includes(String(p.tanggal)) &&
    reportStudents.some(s => String(s.nis) === String(p.nis))
  );
  const periodNotes = catatan.filter(c =>
    dates.includes(String(c.tanggal)) &&
    reportStudents.some(s => String(s.nis) === String(c.nis))
  );

  const siswaSetor = new Set(periodSetoran.map(p => String(p.nis)));
  const lancar = periodSetoran.filter(p => p.status === "Lancar").length;
  const mengulang = periodSetoran.filter(p => p.status === "Mengulang").length;
  const total = periodSetoran.length;
  const activeCount = reportStudents.length;
  const activePct = activeCount ? Math.round(siswaSetor.size / activeCount * 100) : 0;
  const lancarPct = total ? Math.round(lancar / total * 100) : 0;
  const mengulangPct = total ? Math.round(mengulang / total * 100) : 0;

  document.getElementById("laporanPeriodInfo").innerHTML =
    `<strong>Periode:</strong> ${esc(period.label)}
     <span>· ${esc(formatMonitoringDate(period.start))} sampai ${esc(formatMonitoringDate(period.end))}</span>`;

  document.getElementById("lapTotalSiswa").textContent = activeCount;
  document.getElementById("lapSiswaSetor").textContent = siswaSetor.size;
  document.getElementById("lapTotalSetoran").textContent = total;
  document.getElementById("lapTotalCatatan").textContent = periodNotes.length;

  document.getElementById("lapPctAktifSetor").textContent = `${activePct}%`;
  document.getElementById("lapBarAktifSetor").style.width = `${activePct}%`;
  document.getElementById("lapPctLancar").textContent = `${lancarPct}%`;
  document.getElementById("lapBarLancar").style.width = `${lancarPct}%`;
  document.getElementById("lapPctMengulang").textContent = `${mengulangPct}%`;
  document.getElementById("lapBarMengulang").style.width = `${mengulangPct}%`;

  const latestInPeriod = new Map();
  periodSetoran
    .slice()
    .sort((a,b) => String(b.tanggal).localeCompare(String(a.tanggal)))
    .forEach(p => {
      const key = String(p.nis);
      if (!latestInPeriod.has(key)) latestInPeriod.set(key,p);
    });

  const noteLatest = new Map();
  periodNotes
    .slice()
    .sort((a,b) => String(b.tanggal).localeCompare(String(a.tanggal)))
    .forEach(c => {
      const key = String(c.nis);
      if (!noteLatest.has(key)) noteLatest.set(key,c);
    });

  document.getElementById("laporanSiswaTable").innerHTML = reportStudents.length
    ? reportStudents.map(s => {
        const p = latestInPeriod.get(String(s.nis));
        const n = noteLatest.get(String(s.nis));
        const count = periodSetoran.filter(x => String(x.nis) === String(s.nis)).length;
        return `<tr>
          <td>${esc(s.nis)}</td>
          <td><strong>${esc(s.nama)}</strong></td>
          <td>${esc(s.kelas)}</td>
          <td>${count}</td>
          <td>${esc(p?.tanggal || "—")}</td>
          <td>${esc(p?.namaSurah || "—")}</td>
          <td>${esc(p?.ayatTerakhir ?? "—")}</td>
          <td>${p ? `<span class="badge ${p.status === "Lancar" ? "badge-green" : "badge-amber"}">${esc(p.status)}</span>` : "—"}</td>
          <td class="lap-note-preview">${esc(n?.pesan || "—")}</td>
        </tr>`;
      }).join("")
    : '<tr><td colspan="9" class="empty">Tidak ada siswa untuk laporan.</td></tr>';

  const classMap = new Map();
  reportStudents.forEach(s => {
    if (!classMap.has(s.kelas)) classMap.set(s.kelas,{siswa:0,setor:new Set(),setoran:0,notes:0});
    classMap.get(s.kelas).siswa++;
  });
  periodSetoran.forEach(p => {
    const s = studentByNis(p.nis);
    if (s && classMap.has(s.kelas)) {
      classMap.get(s.kelas).setor.add(String(p.nis));
      classMap.get(s.kelas).setoran++;
    }
  });
  periodNotes.forEach(c => {
    const s = studentByNis(c.nis);
    if (s && classMap.has(s.kelas)) classMap.get(s.kelas).notes++;
  });

  document.getElementById("laporanKelasList").innerHTML = [...classMap.entries()]
    .sort((a,b)=>String(a[0]).localeCompare(String(b[0])))
    .map(([kelas,x]) => `
      <div class="lap-kelas-item">
        <div class="lap-kelas-top">
          <strong>${esc(kelas)}</strong>
          <span>${x.siswa} siswa</span>
        </div>
        <div class="lap-kelas-line">
          <span>Setor:</span><b>${x.setor.size}</b>
          <span>Total:</span><b>${x.setoran}</b>
          <span>Catatan:</span><b>${x.notes}</b>
        </div>
      </div>`).join("") || '<div class="empty">Belum ada data kelas.</div>';

  const noteStudents = reportStudents.filter(s => noteLatest.has(String(s.nis)));
  document.getElementById("laporanCatatanList").innerHTML = noteStudents.length
    ? noteStudents.slice(0,12).map(s => {
        const n = noteLatest.get(String(s.nis));
        return `<div class="lap-note-item">
          <div class="lap-note-head"><strong>${esc(s.nama)}</strong><span>${esc(n.tanggal)}</span></div>
          <div>${esc(n.pesan)}</div>
          ${n.saranOrtu ? `<small>Saran: ${esc(n.saranOrtu)}</small>` : ""}
        </div>`;
      }).join("")
    : '<div class="empty">Tidak ada catatan pada periode ini.</div>';
}

async function exportLaporanExcel() {
  if (!window.ExcelJS) {
    showNotice("Excel belum siap","Library Excel belum berhasil dimuat.","warning");
    return;
  }

  renderLaporan();

  const period = getLaporanPeriod();
  const classFilter = document.getElementById("laporanKelas")?.value || "ALL";
  const reportStudents = students
    .filter(s => s.aktif !== false)
    .filter(s => classFilter === "ALL" || String(s.kelas) === classFilter)
    .sort((a,b)=>String(a.kelas).localeCompare(String(b.kelas)) || String(a.nama).localeCompare(String(b.nama)));

  const dates = getDateRange(period.start,period.end);
  const periodSetoran = setoran.filter(p => dates.includes(String(p.tanggal)));
  const periodNotes = catatan.filter(c => dates.includes(String(c.tanggal)));

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Bina Tahfidz";
  workbook.created = new Date();

  const summary = workbook.addWorksheet("Laporan");
  summary.addRow(["LAPORAN PERKEMBANGAN TAHFIDZ"]);
  summary.addRow([`Periode: ${period.label}`]);
  summary.addRow([`Kelas: ${classFilter === "ALL" ? "Semua kelas" : classFilter}`]);
  summary.addRow([]);
  summary.addRow(["NIS","Nama Siswa","Kelas","Jumlah Setoran","Setoran Terakhir","Surah","Ayat","Status","Catatan Terakhir"]);

  reportStudents.forEach(s => {
    const sp = periodSetoran.filter(p => String(p.nis) === String(s.nis)).sort((a,b)=>String(b.tanggal).localeCompare(String(a.tanggal)));
    const cp = periodNotes.filter(c => String(c.nis) === String(s.nis)).sort((a,b)=>String(b.tanggal).localeCompare(String(a.tanggal)));
    const p = sp[0];
    const c = cp[0];
    summary.addRow([
      s.nis,s.nama,s.kelas,sp.length,p?.tanggal || "",p?.namaSurah || "",p?.ayatTerakhir ?? "",p?.status || "",c?.pesan || ""
    ]);
  });
  summary.columns = [
    {width:12},{width:28},{width:10},{width:15},{width:16},{width:22},{width:10},{width:15},{width:45}
  ];
  styleReportHeader(summary,5);
  summary.views = [{state:"frozen",ySplit:5}];
  summary.autoFilter = {from:"A5",to:`I${Math.max(5,summary.rowCount)}`};

  const detail = workbook.addWorksheet("Detail Setoran");
  detail.addRow(["Tanggal","NIS","Nama Siswa","Kelas","Surah","Juz","Ayat","Total Ayat","Status"]);
  periodSetoran
    .slice()
    .sort((a,b)=>String(b.tanggal).localeCompare(String(a.tanggal)))
    .forEach(p=>{
      const s=studentByNis(p.nis);
      detail.addRow([p.tanggal,p.nis,s?.nama||"",s?.kelas||"",p.namaSurah,p.juz,p.ayatTerakhir,p.totalAyat||"",p.status]);
    });
  detail.columns=[{width:14},{width:12},{width:28},{width:10},{width:22},{width:8},{width:10},{width:12},{width:15}];
  styleReportHeader(detail,1);
  detail.views=[{state:"frozen",ySplit:1}];
  detail.autoFilter={from:"A1",to:`I${Math.max(1,detail.rowCount)}`};

  const notes = workbook.addWorksheet("Catatan Guru");
  notes.addRow(["Tanggal","NIS","Nama Siswa","Kelas","Catatan","Saran Orang Tua","Referensi Setoran"]);
  periodNotes
    .slice()
    .sort((a,b)=>String(b.tanggal).localeCompare(String(a.tanggal)))
    .forEach(c=>{
      const s=studentByNis(c.nis);
      const r=c.setoranReference;
      notes.addRow([
        c.tanggal,c.nis,s?.nama||"",s?.kelas||"",c.pesan||"",c.saranOrtu||"",
        r ? `${r.tanggal} · ${r.namaSurah} · Ayat ${r.ayatTerakhir} · ${r.status}` : ""
      ]);
    });
  notes.columns=[{width:14},{width:12},{width:28},{width:10},{width:45},{width:40},{width:36}];
  styleReportHeader(notes,1);
  notes.views=[{state:"frozen",ySplit:1}];
  notes.autoFilter={from:"A1",to:`G${Math.max(1,notes.rowCount)}`};

  const info = workbook.addWorksheet("Petunjuk");
  [
    ["KONSEP LAPORAN SEMENTARA"],
    [""],
    ["Laporan ini merupakan format kerja sementara sebelum format resmi sekolah ditetapkan."],
    [`Periode: ${period.label}`],
    ["Laporan utama: ringkasan perkembangan, detail setoran, dan catatan guru."],
    ["Rekap setoran tidak menganggap setiap hari sebagai hari wajib setor."],
    ["Jumlah setoran dihitung dari transaksi yang benar-benar tercatat dalam periode."]
  ].forEach(r=>info.addRow(r));
  info.getColumn(1).width=110;

  const buffer=await workbook.xlsx.writeBuffer();
  const blob=new Blob([buffer],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=`laporan-tahfidz-${period.start}-sd-${period.end}.xlsx`;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);

  showNotice("Laporan Excel siap","Laporan sementara berhasil diekspor.");
}

function styleReportHeader(ws,rowNumber){
  const row=ws.getRow(rowNumber);
  row.font={bold:true,color:{argb:"FFFFFF"}};
  row.fill={type:"pattern",pattern:"solid",fgColor:{argb:"087443"}};
  row.alignment={vertical:"middle",wrapText:true};
}

function fillJuziyahControls() {
  const studentSelect = document.getElementById("juziyahNis");
  const juzSelect = document.getElementById("juziyahJuz");
  const classSelect = document.getElementById("juziyahClassFilter");
  if (!studentSelect || !juzSelect || !classSelect) return;

  const currentStudent = studentSelect.value || "";
  const currentClass = classSelect.value || "ALL";

  const list = students
    .filter(s => s.aktif !== false)
    .sort((a,b) => String(a.kelas).localeCompare(String(b.kelas)) ||
                  String(a.nama).localeCompare(String(b.nama)));

  studentSelect.innerHTML =
    '<option value="">Pilih siswa</option>' +
    list.map(s => `<option value="${escAttr(s.nis)}">${esc(s.nis)} — ${esc(s.nama)} (${esc(s.kelas)})</option>`).join("");

  if (list.some(s => String(s.nis) === String(currentStudent))) {
    studentSelect.value = currentStudent;
  }

  const classes = [...new Set(list.map(s => String(s.kelas || "").trim()).filter(Boolean))].sort();
  classSelect.innerHTML =
    '<option value="ALL">Semua kelas</option>' +
    classes.map(k => `<option value="${escAttr(k)}">${esc(k)}</option>`).join("");
  classSelect.value = classes.includes(currentClass) ? currentClass : "ALL";

  if (!juzSelect.options.length) {
    juzSelect.innerHTML = Array.from({length:30}, (_,i) => {
      const j=i+1;
      return `<option value="${j}">Juz ${j}</option>`;
    }).join("");
  }
}

function getJuziyahForStudent(nis) {
  return juziyah
    .filter(r => String(r.nis) === String(nis))
    .sort((a,b) => String(b.tanggal || "").localeCompare(String(a.tanggal || "")));
}

function renderJuziyah() {
  const tbody = document.getElementById("juziyahTable");
  if (!tbody) return;

  fillJuziyahControls();

  const q = document.getElementById("juziyahSearch")?.value.toLowerCase().trim() || "";
  const kelas = document.getElementById("juziyahClassFilter")?.value || "ALL";
  const hasilFilter = document.getElementById("juziyahStatusFilter")?.value || "ALL";

  const activeStudents = students
    .filter(s => s.aktif !== false)
    .filter(s => {
      const text = `${s.nis} ${s.nama} ${s.kelas}`.toLowerCase();
      return text.includes(q) && (kelas === "ALL" || String(s.kelas) === kelas);
    })
    .sort((a,b) =>
      String(a.kelas).localeCompare(String(b.kelas)) ||
      String(a.nama).localeCompare(String(b.nama))
    );

  // Per student:
  // - one latest overall record (for date/value/result)
  // - one latest record per Juz (so the main table can show all Juz without duplicates)
  const latestOverallByStudent = new Map();
  const latestByStudentJuz = new Map();

  juziyah
    .filter(r => studentByNis(r.nis))
    .slice()
    .sort((a,b) => {
      const d = String(b.tanggal || "").localeCompare(String(a.tanggal || ""));
      if (d !== 0) return d;
      return Number(b.updatedAt?.seconds || b.createdAt?.seconds || 0) -
             Number(a.updatedAt?.seconds || a.createdAt?.seconds || 0);
    })
    .forEach(r => {
      const studentKey = String(r.nis);
      const juzKey = `${studentKey}::${String(r.juz)}`;

      if (!latestOverallByStudent.has(studentKey)) {
        latestOverallByStudent.set(studentKey, r);
      }
      if (!latestByStudentJuz.has(juzKey)) {
        latestByStudentJuz.set(juzKey, r);
      }
    });

  const rows = activeStudents.filter(s => {
    const latest = latestOverallByStudent.get(String(s.nis));
    if (hasilFilter === "ALL") return true;
    return latest ? String(latest.hasil) === hasilFilter : false;
  });

  const allValid = juziyah.filter(r => studentByNis(r.nis));
  const lulus = allValid.filter(r => r.hasil === "Lulus").length;
  const belum = allValid.filter(r => r.hasil !== "Lulus").length;
  const siswaUnik = new Set(allValid.map(r => String(r.nis))).size;

  document.getElementById("jzLulus").textContent = lulus;
  document.getElementById("jzBelumLulus").textContent = belum;
  document.getElementById("jzSiswaDiuji").textContent = siswaUnik;
  document.getElementById("jzSertifikat").textContent = lulus;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="9" class="empty">Tidak ada siswa yang sesuai filter.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(s => {
    const studentKey = String(s.nis);
    const latest = latestOverallByStudent.get(studentKey);
    const history = getJuziyahForStudent(s.nis);

    // Unique Juz for this student, each showing its latest result.
    const juzMap = new Map();
    history.slice().sort((a,b) => {
      const d = String(b.tanggal || "").localeCompare(String(a.tanggal || ""));
      if (d !== 0) return d;
      return Number(b.updatedAt?.seconds || b.createdAt?.seconds || 0) -
             Number(a.updatedAt?.seconds || a.createdAt?.seconds || 0);
    }).forEach(r => {
      const key = String(r.juz);
      if (!juzMap.has(key)) juzMap.set(key, r);
    });

    const juzItems = [...juzMap.entries()]
      .sort((a,b) => Number(a[0]) - Number(b[0]))
      .map(([juz, r]) => `
        <span class="juziyah-juz-chip ${r.hasil === "Lulus" ? "is-lulus" : "is-belum"}"
              title="Juz ${esc(juz)} · ${esc(r.tanggal || "")} · ${esc(r.hasil || "")}">
          <strong>Juz ${esc(juz)}</strong>
          <small>${esc(r.hasil || "")}</small>
        </span>`)
      .join("");

    const badge = latest?.hasil === "Lulus" ? "badge-green" : "badge-amber";

    return `<tr>
      <td>${esc(s.nis)}</td>
      <td>
        <strong>${esc(s.nama)}</strong>
        <div class="juziyah-subline">${history.length ? `${history.length} hasil Juziyah` : "Belum pernah diuji"}</div>
      </td>
      <td>${esc(s.kelas)}</td>
      <td class="juziyah-juz-cell">
        ${juzItems || '<span class="juziyah-empty-text">Belum diuji</span>'}
      </td>
      <td>${esc(latest?.tanggal || "—")}</td>
      <td>${latest?.nilai !== "" && latest?.nilai != null ? esc(latest.nilai) : "—"}</td>
      <td>${latest ? `<span class="badge ${badge}">${esc(latest.hasil)}</span>` : '<span class="juziyah-empty-badge">Belum diuji</span>'}</td>
      <td class="juziyah-note-cell">${esc(latest?.catatan || "—")}</td>
      <td>
        <div class="actions">
          <button class="btn btn-light" onclick="openJuziyahModalForStudent('${jsq(s.nis)}')">＋ Hasil</button>
          <button class="btn btn-light" onclick="openStudentProgress('${jsq(s.nis)}','juziyah')">Riwayat</button>
          ${latest ? `<button class="btn btn-light" onclick="editJuziyah('${jsq(latest.id)}')">Edit</button>` : ""}
          ${history.some(r=>r.hasil==="Lulus") ? `<button class="btn btn-primary-soft" onclick="openCertificateForJuziyah('${jsq(s.nis)}')">Sertifikat</button>` : ""}
        </div>
      </td>
    </tr>`;
  }).join("");
}

function fillJuziyahJuzGrid(selected = []) {
  const grid=document.getElementById("juziyahJuzGrid");
  if(!grid) return;
  const chosen=new Set(selected.map(Number));
  grid.innerHTML=Array.from({length:30},(_,i)=>{
    const j=i+1;
    return `<label class="juziyah-juz-option ${chosen.has(j)?"selected":""}">
      <input type="checkbox" value="${j}" ${chosen.has(j)?"checked":""} onchange="this.parentElement.classList.toggle('selected',this.checked)">
      <span>Juz ${j}</span>
    </label>`;
  }).join("");
}

function getSelectedJuziyahJuz() {
  return [...document.querySelectorAll('#juziyahJuzGrid input[type="checkbox"]:checked')].map(x=>Number(x.value));
}

function openJuziyahModal(id="") {
  fillJuziyahControls();
  const r=juziyah.find(x=>x.id===id);
  const edit=!!r;
  const sessionId=r?.sesiId || "";

  document.getElementById("juziyahModalTitle").textContent=edit ? "Edit Hasil Juziyah" : "Tambah Sesi Juziyah";
  document.getElementById("juziyahId").value=r?.id || "";
  document.getElementById("juziyahSessionId").value=sessionId;
  document.getElementById("juziyahNis").value=r?.nis || "";
  fillJuziyahJuzGrid(edit ? [Number(r.juz)] : []);
  document.getElementById("juziyahTanggal").value=r?.tanggal || today();
  document.getElementById("juziyahNilai").value=r?.nilai ?? "";
  document.getElementById("juziyahHasil").value=r?.hasil || "Lulus";
  document.getElementById("juziyahCatatan").value=r?.catatan || "";

  // Existing record = edit one juz only. New record = multi-juz session.
  document.getElementById("juziyahJuzGrid").classList.toggle("edit-single", edit);
  document.getElementById("juziyahModal").classList.remove("hidden");
}

function openJuziyahModalForStudent(nis) {
  openJuziyahModal("");
  const select = document.getElementById("juziyahNis");
  if (select) select.value = String(nis);
}

function editJuziyah(id) {
  openJuziyahModal(id);
}


function publicJuziyahProjection(r = {}) {
  return {
    nis: r.nis ?? "",
    juz: r.juz ?? "",
    tanggal: r.tanggal ?? "",
    nilai: r.nilai ?? "",
    hasil: r.hasil ?? "",
    catatan: r.catatan ?? "",
    sertifikatEligible: r.sertifikatEligible === true,
    sesiId: r.sesiId ?? r.id ?? "",
    sesiJuzCount: Number(r.sesiJuzCount) || 1,
    sesiJuzList: Array.isArray(r.sesiJuzList) ? r.sesiJuzList : [r.juz].filter(Boolean)
  };
}

async function backfillJuziyahPortalProjection(records = []) {
  if (juziyahPortalBackfillDone || !records.length) return;
  juziyahPortalBackfillDone = true;

  const writes = records.map(d => {
    const r = { id: d.id, ...d.data() };
    if (!r.nis) return Promise.resolve();
    const payload = publicJuziyahProjection(r);
    return setDoc(
      doc(db, "tahfidz_portal", String(r.nis), "juziyah", String(r.id)),
      payload,
      { merge: true }
    );
  });

  try {
    await Promise.all(writes);
  } catch (error) {
    // Do not block the internal app when portal projection migration fails.
    // A future page reload will retry because this flag resets.
    juziyahPortalBackfillDone = false;
    console.warn("Backfill Juziyah ke portal gagal:", error);
  }
}

async function saveJuziyah() {
  const id=document.getElementById("juziyahId").value.trim();
  const nis=document.getElementById("juziyahNis").value.trim();
  const selectedJuz=getSelectedJuziyahJuz();
  const tanggal=document.getElementById("juziyahTanggal").value || today();
  const nilaiRaw=document.getElementById("juziyahNilai").value.trim();
  const nilai=nilaiRaw==="" ? "" : Number(nilaiRaw);
  const hasil=document.getElementById("juziyahHasil").value;
  const catatanText=document.getElementById("juziyahCatatan").value.trim();
  const sessionId=document.getElementById("juziyahSessionId").value.trim();

  if(!studentByNis(nis) || !tanggal || !selectedJuz.length){
    showNotice("Data belum lengkap","Siswa, tanggal, dan minimal satu Juz wajib dipilih.","warning");
    return;
  }
  if(nilai!=="" && (!Number.isFinite(nilai)||nilai<0||nilai>100)){
    showNotice("Nilai tidak valid","Nilai Juziyah harus antara 0 dan 100.","warning"); return;
  }

  const common={
    nis,tanggal,nilai,hasil,catatan:catatanText,
    sertifikatEligible:hasil==="Lulus",
    updatedBy:currentUser?.uid||"",
    updatedByName:currentUser?.displayName||currentUser?.email||"",
    updatedAt:serverTimestamp()
  };

  try{
    if(id){
      const juz=selectedJuz[0];
      const payload={...common,juz,sesiId:sessionId||id,sesiJuzCount:1};
      await updateDoc(doc(db,"tahfidz_juziyah",id),payload);
      await setDoc(
        doc(db,"tahfidz_portal",nis,"juziyah",id),
        publicJuziyahProjection({id,...payload}),
        {merge:true}
      );
    }else{
      const sesiIdNew=crypto.randomUUID ? crypto.randomUUID() : `jz_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      for(const juz of selectedJuz){
        const ref=await addDoc(collection(db,"tahfidz_juziyah"),{
          ...common,
          juz,
          sesiId:sesiIdNew,
          sesiJuzCount:selectedJuz.length,
          sesiJuzList:selectedJuz,
          createdBy:currentUser?.uid||"",
          createdByName:currentUser?.displayName||currentUser?.email||"",
          createdAt:serverTimestamp()
        });
        await setDoc(
          doc(db,"tahfidz_portal",nis,"juziyah",ref.id),
          publicJuziyahProjection({
            id:ref.id,
            ...common,
            juz,
            sesiId:sesiIdNew,
            sesiJuzCount:selectedJuz.length,
            sesiJuzList:selectedJuz
          })
        );
      }
    }
    closeModal("juziyahModal");
    showNotice("Hasil Juziyah tersimpan",
      selectedJuz.length>1
        ? `Satu sesi Juziyah untuk ${selectedJuz.length} Juz berhasil disimpan.`
        : (hasil==="Lulus" ? "Siswa dinyatakan lulus dan sertifikat dapat dicetak." : "Hasil tersimpan untuk pembinaan."));
    await loadAll();
  }catch(e){
    console.error(e);
    showNotice("Gagal menyimpan",readableFirestoreError(e),"warning");
  }
}

async function deleteJuziyah(id) {
  const r = juziyah.find(x => x.id === id);
  if (!r) return;
  const s = studentByNis(r.nis);
  if (!await askConfirm("Hapus hasil Juziyah?", `${s?.nama || r.nis} · Juz ${r.juz} · ${r.tanggal}`)) return;
  try {
    await deleteDoc(doc(db, "tahfidz_juziyah", id));
    await deleteDoc(doc(db, "tahfidz_portal", r.nis, "juziyah", id)).catch(()=>{});
    showNotice("Hasil Juziyah dihapus", "Data berhasil dihapus.");
    await loadAll();
  } catch (e) {
    showNotice("Gagal menghapus", readableFirestoreError(e), "warning");
  }
}

async function exportJuziyahExcel() {
  if (!window.ExcelJS) {
    showNotice("Excel belum siap", "Library Excel belum berhasil dimuat.", "warning");
    return;
  }

  const rows = juziyah
    .map(r => ({r, s: studentByNis(r.nis)}))
    .filter(x => x.s)
    .sort((a,b) => String(a.s.kelas).localeCompare(String(b.s.kelas)) || String(a.s.nama).localeCompare(String(b.s.nama)));

  try {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Juziyah", {views:[{state:"frozen", ySplit:1}]});
    ws.addRow(["NIS","Nama Siswa","Kelas","Juz","Tanggal","Nilai","Hasil","Catatan","Sertifikat"]);
    rows.forEach(({r,s}) => ws.addRow([
      s.nis,s.nama,s.kelas,r.juz,r.tanggal,r.nilai ?? "",r.hasil,r.catatan || "",r.sertifikatEligible ? "Ya" : "Tidak"
    ]));
    ws.columns=[{width:12},{width:28},{width:10},{width:8},{width:14},{width:10},{width:16},{width:45},{width:14}];
    ws.getRow(1).font={bold:true,color:{argb:"FFFFFF"}};
    ws.getRow(1).fill={type:"pattern",pattern:"solid",fgColor:{argb:"087443"}};
    ws.autoFilter={from:"A1",to:`I${Math.max(1,ws.rowCount)}`};

    const buffer=await wb.xlsx.writeBuffer();
    const blob=new Blob([buffer],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download="data-juziyah-bina-tahfidz.xlsx";
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1500);
    showNotice("Export Juziyah selesai", `${rows.length} hasil diekspor.`);
  } catch(e) {
    console.error(e);
    showNotice("Gagal export", e?.message || "Export Excel gagal.", "warning");
  }
}

let juziyahLogoDataUrl = null;
async function getJuziyahLogoDataUrl() {
  if (juziyahLogoDataUrl) return juziyahLogoDataUrl;
  const response = await fetch("assets/logo-smpit-alfirdaus.png", {cache:"force-cache"});
  if (!response.ok) throw new Error("Logo sekolah tidak dapat dimuat.");
  const blob=await response.blob();
  return await new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onloadend=()=>{juziyahLogoDataUrl=reader.result; resolve(juziyahLogoDataUrl);};
    reader.onerror=reject;
    reader.readAsDataURL(blob);
  });
}


function getJuziyahSessions(nis) {
  const grouped=new Map();
  getJuziyahForStudent(nis).forEach(r=>{
    const key=r.sesiId || r.id; // legacy records without sesiId remain individually printable
    if(!grouped.has(key)) grouped.set(key,[]);
    grouped.get(key).push(r);
  });
  return [...grouped.entries()].map(([sesiId,records])=>{
    const sorted=records.slice().sort((a,b)=>Number(a.juz)-Number(b.juz));
    const passed=sorted.filter(r=>r.hasil==="Lulus");
    const date=sorted.map(r=>String(r.tanggal||"")).sort().pop()||"";
    return {sesiId,records:sorted,passed,date};
  }).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
}

let currentJuziyahCertificateSession=null;

function openJuziyahCertificatePicker(nis) {
  const student = studentByNis(nis);
  const modal = document.getElementById("juziyahCertificatePickerModal");
  const box = document.getElementById("juziyahCertificatePickerList");
  if (!student || !modal || !box) return;

  const sessions = getJuziyahSessions(nis).filter(session => session.passed.length);

  box.innerHTML = sessions.length
    ? sessions.map(session => {
        const juzText = session.passed.map(r => `Juz ${r.juz}`).join(" · ");
        return `<button type="button"
          class="juziyah-session-item"
          onclick="reviewJuziyahCertificate('${jsq(session.sesiId)}','${jsq(nis)}')">
          <div>
            <strong>${esc(formatMonitoringDate(session.date))}</strong>
            <span>${esc(juzText)}</span>
          </div>
          <div class="juziyah-session-meta">${session.passed.length} Juz · Lulus</div>
        </button>`;
      }).join("")
    : '<div class="empty">Belum ada sesi Juziyah yang lulus.</div>';

  openModal("juziyahCertificatePickerModal");
  requestAnimationFrame(() => box.querySelector(".juziyah-session-item")?.focus());
}

function findJuziyahSession(nis,sesiId){
  return getJuziyahSessions(nis).find(x=>String(x.sesiId)===String(sesiId))||null;
}

async function reviewJuziyahCertificate(sesiId, nis) {
  const session = findJuziyahSession(nis, sesiId);
  const student = studentByNis(nis);
  const previewModal = document.getElementById("juziyahCertificatePreviewModal");
  const preview = document.getElementById("juziyahCertificatePreview");
  if (!session || !student || !previewModal || !preview) return;

  currentJuziyahCertificateSession = {nis, sesiId, session};
  closeModal("juziyahCertificatePickerModal");

  const juzText = session.passed.map(r => `Juz ${r.juz}`).join(" · ");
  const values = session.passed.filter(r => r.nilai !== "" && r.nilai != null).map(r => Number(r.nilai));
  const avg = values.length ? Math.round(values.reduce((a,b) => a+b, 0) / values.length) : null;

  preview.innerHTML = `
    <div class="juziyah-certificate-paper">
      <img src="assets/logo-smpit-alfirdaus.png" alt="Logo SMPIT Al Firdaus Purwodadi">
      <div class="jcp-school">SMPIT AL FIRDAUS PURWODADI</div>
      <div class="jcp-title">SERTIFIKAT JUZIYAH</div>
      <div class="jcp-sub">Diberikan kepada</div>
      <div class="jcp-name">${esc(student.nama)}</div>
      <div class="jcp-meta">NIS ${esc(student.nis)} · Kelas ${esc(student.kelas)}</div>
      <div class="jcp-sub" style="margin-top:20px">Atas keberhasilan menyelesaikan ujian hafalan dan dinyatakan lulus pada:</div>
      <div class="jcp-juz">${esc(juzText)}</div>
      <div class="jcp-detail">
        Tanggal kelulusan: ${esc(formatMonitoringDate(session.date))}
        ${avg !== null ? ` · Rata-rata nilai: ${avg}` : ""}
      </div>
      ${session.passed.some(r => r.catatan)
        ? `<div class="jcp-note">${esc(session.passed.map(r => r.catatan).filter(Boolean).join(" · "))}</div>`
        : ""}
      <div class="jcp-footer">Format sementara — dapat disesuaikan dengan format resmi sekolah.</div>
      <div class="jcp-sign">
        <span>Guru Tahfidz<br><b>________________</b></span>
        <span>Kepala Sekolah / Pihak Sekolah<br><b>________________</b></span>
      </div>
    </div>`;

  openModal("juziyahCertificatePreviewModal");
}

async function printCurrentJuziyahCertificate(){
  if(!currentJuziyahCertificateSession) return;
  const {nis,session}=currentJuziyahCertificateSession;
  const s=studentByNis(nis);
  if(!s||!session.passed.length) return;
  if(!window.jspdf?.jsPDF){showNotice("PDF belum siap","Library PDF belum berhasil dimuat.","warning");return;}

  try{
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    const logo=await getJuziyahLogoDataUrl().catch(()=>null);
    const W=210,H=297;
    doc.setDrawColor(30,101,73);doc.setLineWidth(1.1);doc.rect(10,10,W-20,H-20);
    doc.setLineWidth(.35);doc.setDrawColor(205,220,211);doc.rect(14,14,W-28,H-28);
    if(logo)doc.addImage(logo,"PNG",W/2-15,24,30,30);
    doc.setFont("helvetica","bold");doc.setTextColor(23,78,57);doc.setFontSize(13);doc.text("SMPIT AL FIRDAUS PURWODADI",W/2,63,{align:"center"});
    doc.setFontSize(22);doc.text("SERTIFIKAT JUZIYAH",W/2,78,{align:"center"});
    doc.setFont("helvetica","normal");doc.setFontSize(10);doc.setTextColor(95,109,101);
    doc.text("Diberikan atas keberhasilan menyelesaikan ujian hafalan",W/2,91,{align:"center"});
    doc.text("dan dinyatakan lulus pada pencapaian berikut:",W/2,97,{align:"center"});
    doc.setFont("helvetica","bold");doc.setTextColor(35,91,67);doc.setFontSize(19);doc.text(String(s.nama),W/2,121,{align:"center"});
    doc.setFont("helvetica","normal");doc.setFontSize(10);doc.setTextColor(91,105,97);doc.text(`NIS ${s.nis} · Kelas ${s.kelas}`,W/2,130,{align:"center"});
    doc.setFont("helvetica","bold");doc.setTextColor(35,91,67);doc.setFontSize(23);
    doc.text(session.passed.map(r=>`JUZ ${r.juz}`).join(" · "),W/2,154,{align:"center"});
    const vals=session.passed.filter(r=>r.nilai!==""&&r.nilai!=null).map(r=>Number(r.nilai));
    if(vals.length)doc.setFont("helvetica","normal"),doc.setFontSize(10),doc.setTextColor(95,109,101),doc.text(`Rata-rata nilai: ${Math.round(vals.reduce((a,b)=>a+b,0)/vals.length)}`,W/2,166,{align:"center"});
    doc.text(`Tanggal kelulusan: ${formatMonitoringDate(session.date)}`,W/2,178,{align:"center"});
    const notes=session.passed.map(r=>r.catatan).filter(Boolean).join(" · ");
    if(notes){doc.setFontSize(9);doc.text(doc.splitTextToSize(`Catatan: ${notes}`,140),W/2,194,{align:"center"});}
    doc.setFontSize(9);doc.setTextColor(110,121,114);doc.text("Format sementara — akan disesuaikan dengan format resmi sekolah.",W/2,258,{align:"center"});
    doc.setTextColor(75,90,82);doc.text("Guru Tahfidz",55,268,{align:"center"});doc.text("Kepala Sekolah / Pihak Sekolah",155,268,{align:"center"});doc.text("____________________",55,288,{align:"center"});doc.text("____________________",155,288,{align:"center"});
    doc.save(`sertifikat-juziyah-${s.nis}-${session.date}-${session.passed.map(r=>r.juz).join("-")}.pdf`);
    closeModal("juziyahCertificatePreviewModal");
    showNotice("Sertifikat berhasil dibuat","PDF A4 siap dicetak.");
  }catch(e){console.error(e);showNotice("Gagal membuat sertifikat",e?.message||"PDF gagal dibuat.","warning");}
}

function openCertificateForJuziyah(nis){
  return openJuziyahCertificatePicker(nis);
}


window.openJuziyahCertificatePicker=openJuziyahCertificatePicker;
window.reviewJuziyahCertificate=reviewJuziyahCertificate;
window.printCurrentJuziyahCertificate=printCurrentJuziyahCertificate;
window.openCertificateForJuziyah=openCertificateForJuziyah;
window.fillJuziyahJuzGrid=fillJuziyahJuzGrid;
window.deleteCatatan=deleteCatatan;
window.deleteSetoran=deleteSetoran;
window.editJuziyah=editJuziyah;
window.ensureSurahMaster=ensureSurahMaster;
window.exportLaporanExcel=exportLaporanExcel;
window.exportMonitoringCurrentDate=exportMonitoringCurrentDate;
window.exportMonitoringRange=exportMonitoringRange;
window.exportRaporIndividu=exportRaporIndividu;
window.exportRaporKelas=exportRaporKelas;
window.exportRaporSemua=exportRaporSemua;
window.openCatatanModal=openCatatanModal;
window.openSetoranModal=openSetoranModal;
window.openSetoranModalForStudent=openSetoranModalForStudent;
window.openStudentModal=openStudentModal;
window.openStudentProgress=openStudentProgress;
window.renderLaporan=renderLaporan;
window.renderMonitoring=renderMonitoring;
window.renderMonitoringRange=renderMonitoringRange;
window.renderRapor=renderRapor;
window.renderRaporPreview=renderRaporPreview;
window.saveSetoran=saveSetoran;
window.saveStudent=saveStudent;
window.switchMonitoringTab=switchMonitoringTab;
window.switchProgressTab=switchProgressTab;
window.toggleStudent=toggleStudent;
window.openJuziyahModal=openJuziyahModal;
window.openJuziyahModalForStudent=openJuziyahModalForStudent;
window.saveJuziyah=saveJuziyah;
window.renderJuziyah=renderJuziyah;
window.exportJuziyahExcel=exportJuziyahExcel;
window.openJuziyahCertificatePicker=openJuziyahCertificatePicker;
window.reviewJuziyahCertificate=reviewJuziyahCertificate;
window.printCurrentJuziyahCertificate=printCurrentJuziyahCertificate;
window.openCertificateForJuziyah=openCertificateForJuziyah;
window.exportJuziyahCertificate=(id)=>{const r=juziyah.find(x=>x.id===id);if(r)openCertificateForJuziyah(r.nis);};

window.openModal = openModal;
window.openCertificateForJuziyah = openCertificateForJuziyah;
window.openJuziyahCertificatePicker = openJuziyahCertificatePicker;
window.reviewJuziyahCertificate = reviewJuziyahCertificate;
window.renderLaporan = renderLaporan;
window.renderRapor = renderRapor;
window.openStudentClassManager=openStudentClassManager;
window.setStudentClassOperation=setStudentClassOperation;
window.applyStudentClassOperation=applyStudentClassOperation;
window.promoteSelectedStudents=promoteSelectedStudents;
window.graduateSelectedStudents=graduateSelectedStudents;
window.openRaporBatchReview=openRaporBatchReview;
window.renderRaporBatchReview=renderRaporBatchReview;
window.reviewRaporBatchStudent=reviewRaporBatchStudent;
window.reviewRaporBatchPrevious=reviewRaporBatchPrevious;
window.reviewRaporBatchNext=reviewRaporBatchNext;
window.printCurrentRaporBatchStudent=printCurrentRaporBatchStudent;
window.printCurrentRaporBatchAll=printCurrentRaporBatchAll;
window.showTeacherMotivation = showTeacherMotivation;
window.closeTeacherMotivation = closeTeacherMotivation;
window.openAccountModal = openAccountModal;
window.changeMyPassword = changeMyPassword;
window.togglePasswordVisibility = togglePasswordVisibility;
