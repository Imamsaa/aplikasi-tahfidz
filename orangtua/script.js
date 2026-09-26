
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore, doc, getDoc, collection, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const DEFAULT_TENANT_CONFIG = {
  productName:"Bina Tahfidz",
  schoolName:"Sekolah",
  schoolShortName:"Sekolah",
  portalName:"Portal Wali Murid",
  parentTagline:"Pantau setoran dan catatan pembinaan hafalan siswa.",
  footerText:"Bina Tahfidz",
  logo:"../assets/tenant-logo.png"
};

async function loadJson(path,fallback){
  try{
    const response=await fetch(path,{cache:"no-store"});
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    return {...fallback,...await response.json()};
  }catch(error){
    console.warn(`White-label fallback ${path}`,error);
    return fallback;
  }
}

const APP_CONFIG=await loadJson("../data/tenant-config.json",DEFAULT_TENANT_CONFIG);
const FIREBASE_CONFIG=await loadJson("../data/firebase-config.json",{});
const app=initializeApp(FIREBASE_CONFIG);
const db=getFirestore(app);

let parentData={
  student:null,
  setoran:[],
  catatan:[],
  juziyah:[]
};

const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

function fmtDate(v){
  if(!v) return "—";
  const s=String(v);
  const m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(m){
    const d=new Date(Number(m[1]),Number(m[2])-1,Number(m[3]));
    return d.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"});
  }
  return s;
}
function badge(status){
  const cls=status==="Lancar"?"badge-green":"badge-amber";
  return `<span class="badge ${cls}">${esc(status||"—")}</span>`;
}
function applyBrand(){
  document.title=`${APP_CONFIG.portalName||APP_CONFIG.productName} · ${APP_CONFIG.schoolName||"Sekolah"}`;
  document.querySelectorAll("[data-brand-logo]").forEach(el=>{
    el.src=APP_CONFIG.logo||"../assets/tenant-logo.png";
    el.alt=`Logo ${APP_CONFIG.schoolName||"Sekolah"}`;
  });
  document.querySelectorAll("[data-brand-product]").forEach(el=>el.textContent=APP_CONFIG.productName||"Bina Tahfidz");
  document.querySelectorAll("[data-brand-school]").forEach(el=>el.textContent=APP_CONFIG.schoolName||"Sekolah");
  document.querySelectorAll("[data-brand-parent-tagline]").forEach(el=>el.textContent=APP_CONFIG.parentTagline||"");
  document.querySelectorAll("[data-brand-footer]").forEach(el=>el.textContent=APP_CONFIG.footerText||APP_CONFIG.productName||"");
}
applyBrand();

function setLoading(show){
  $("loadingOverlay").classList.toggle("hidden",!show);
}
function showError(message){
  $("searchError").textContent=`⚠ ${message}`;
  $("searchError").classList.remove("hidden");
}
function hideError(){ $("searchError").classList.add("hidden"); }

function sortDateDesc(a,b){
  return String(b.tanggal||"").localeCompare(String(a.tanggal||""));
}

async function readStudent(nis){
  // Primary lookup: the current architecture uses the NIS as the portal
  // document ID. Keep this fast path first.
  const normalized = String(nis ?? "").trim();
  const directRef = doc(db,"tahfidz_portal",normalized);
  let studentSnap = await getDoc(directRef);
  let portalRef = directRef;

  // Compatibility fallback: older/imported portal data may have a different
  // document ID while keeping the NIS in the `nis` field.
  if(!studentSnap.exists()){
    let fallbackSnap = await getDocs(query(
      collection(db,"tahfidz_portal"),
      where("nis","==",normalized)
    ));

    // Some imported Firestore data stores NIS as a number instead of a string.
    if(fallbackSnap.empty && /^\d+$/.test(normalized)){
      fallbackSnap = await getDocs(query(
        collection(db,"tahfidz_portal"),
        where("nis","==",Number(normalized))
      ));
    }

    if(!fallbackSnap.empty){
      studentSnap = fallbackSnap.docs[0];
      portalRef = studentSnap.ref;
    }
  }

  if(!studentSnap.exists()){
    throw new Error(`Data siswa dengan NIS ${normalized} tidak ditemukan di portal orang tua.`);
  }

  const student=studentSnap.data();
  if(student.aktif===false) throw new Error("Data siswa sedang tidak aktif.");

  const [setoranSnap,catatanSnap,juziyahSnap]=await Promise.all([
    getDocs(collection(portalRef,"setoran")),
    getDocs(collection(portalRef,"catatan")),
    getDocs(collection(portalRef,"juziyah")).catch(()=>null)
  ]);

  const setoran=setoranSnap.docs.map(d=>({id:d.id,...d.data()})).sort(sortDateDesc);
  const catatan=catatanSnap.docs.map(d=>({id:d.id,...d.data()})).sort(sortDateDesc);
  const juziyah=juziyahSnap ? juziyahSnap.docs.map(d=>({id:d.id,...d.data()})).sort(sortDateDesc) : [];

  return {student,setoran,catatan,juziyah};
}

function statValues(){
  const p=parentData.setoran;
  const dates=new Set(p.map(x=>x.tanggal).filter(Boolean));
  const surahs=new Set(p.map(x=>x.namaSurah).filter(Boolean));
  const latest=p[0]||null;
  return {total:p.length,days:dates.size,surahCount:surahs.size,latest};
}

function renderShellInfo(){
  const s=parentData.student||{};
  $("sideNama").textContent=s.nama||"—";
  $("sideMeta").textContent=`NIS ${s.nis||"—"} · Kelas ${s.kelas||"—"}`;
}

function renderPages(){
  const s=parentData.student||{};
  const stats=statValues();
  const latest=stats.latest;
  const notes=parentData.catatan;
  const juziyah=parentData.juziyah.filter(x=>x.hasil==="Lulus"||x.sertifikatEligible===true);
  const recent=parentData.setoran.slice(0,6);

  $("page-beranda").innerHTML=`
    <div class="page-intro">
      <div class="page-kicker">MONITORING HAFALAN</div>
      <h1 class="page-title">Perkembangan ${esc(s.nama||"Siswa")}</h1>
      <div class="page-sub">Kelas ${esc(s.kelas||"—")} · NIS ${esc(s.nis||"—")}</div>
    </div>

    <section class="hero-panel">
      <div class="hero-copy">
        <small>ASSALAMUALAIKUM, AYAH/BUNDA</small>
        <h2>Pantau perjalanan hafalan anak</h2>
        <p>Data setoran dan catatan pembinaan yang dibagikan guru untuk mendampingi hafalan di rumah.</p>
      </div>
    </section>

    <section class="stat-grid">
      <div class="stat-card"><span>TOTAL SETORAN</span><strong>${stats.total}</strong><small>seluruh riwayat</small></div>
      <div class="stat-card"><span>HARI SETOR</span><strong>${stats.days}</strong><small>hari berbeda</small></div>
      <div class="stat-card"><span>SURAH</span><strong>${stats.surahCount}</strong><small>pernah disetor</small></div>
      <div class="stat-card"><span>JUZIYAH LULUS</span><strong>${juziyah.length}</strong><small>hasil ujian</small></div>
    </section>

    <div class="grid-2">
      <section class="card">
        <div class="card-head"><div><div class="card-title">Setoran Terakhir</div><div class="card-sub">Perkembangan hafalan terbaru yang dicatat guru.</div></div></div>
        ${latest ? `<div class="latest-setoran">
          <div><div class="surah">${esc(latest.namaSurah||"—")}</div><div class="meta">Ayat terakhir ${esc(latest.ayatTerakhir??"—")} · Juz ${esc(latest.juz??"—")} · ${esc(fmtDate(latest.tanggal))}</div></div>
          <div>${badge(latest.status)}</div>
        </div>` : `<div class="empty-state">Belum ada setoran yang tercatat.</div>`}
      </section>

      <section class="card">
        <div class="card-head"><div><div class="card-title">Catatan Guru Terbaru</div><div class="card-sub">Pesan yang perlu diperhatikan di rumah.</div></div></div>
        ${notes[0] ? renderNote(notes[0]) : `<div class="empty-state">Belum ada catatan guru.</div>`}
      </section>
    </div>

    <div class="grid-2">
      <section class="card">
        <div class="card-head"><div><div class="card-title">Setoran Terbaru</div><div class="card-sub">Enam setoran terakhir.</div></div><button class="btn btn-light" data-go="setoran">Lihat semua</button></div>
        ${recent.length ? `<div class="list">${recent.map(renderSetoranRow).join("")}</div>` : `<div class="empty-state">Belum ada setoran.</div>`}
      </section>

      <section class="card">
        <div class="card-head"><div><div class="card-title">Juziyah</div><div class="card-sub">Hasil ujian yang sudah lulus.</div></div><button class="btn btn-light" data-go="juziyah">Lihat</button></div>
        ${juziyah.length ? `<div class="list">${juziyah.slice(0,4).map(renderJuziyahRow).join("")}</div>` : `<div class="empty-state">Belum ada hasil Juziyah lulus.</div>`}
      </section>
    </div>

    <div class="info-strip">Gunakan menu <strong>Perkembangan</strong> untuk melihat riwayat setoran, Juziyah, dan catatan pembinaan secara lebih lengkap.</div>
  `;

  $("page-setoran").innerHTML=`
    <div class="page-intro"><div class="page-kicker">RIWAYAT HAFALAN</div><h1 class="page-title">Setoran Hafalan</h1><div class="page-sub">Seluruh riwayat setoran yang dibagikan guru.</div></div>
    <section class="card">
      ${parentData.setoran.length ? `<div class="timeline">${parentData.setoran.map(renderSetoranTimeline).join("")}</div>` : `<div class="empty-state">Belum ada data setoran.</div>`}
    </section>
  `;

  $("page-perkembangan").innerHTML=`
    <div class="page-intro"><div class="page-kicker">PERKEMBANGAN SISWA</div><h1 class="page-title">Profil Perkembangan</h1><div class="page-sub">Ringkasan perkembangan hafalan ${esc(s.nama||"siswa")}.</div></div>
    <section class="stat-grid">
      <div class="stat-card"><span>TOTAL SETORAN</span><strong>${stats.total}</strong><small>semua riwayat</small></div>
      <div class="stat-card"><span>HARI SETOR</span><strong>${stats.days}</strong><small>hari berbeda</small></div>
      <div class="stat-card"><span>SURAH</span><strong>${stats.surahCount}</strong><small>surah tercatat</small></div>
      <div class="stat-card"><span>CATATAN GURU</span><strong>${notes.length}</strong><small>evaluasi pembinaan</small></div>
    </section>
    <section class="card" style="margin-top:10px">
      <div class="card-head"><div><div class="card-title">Perjalanan Setoran</div><div class="card-sub">Urutan setoran terbaru hingga terdahulu.</div></div></div>
      ${parentData.setoran.length ? `<div class="timeline">${parentData.setoran.map(renderSetoranTimeline).join("")}</div>` : `<div class="empty-state">Belum ada riwayat.</div>`}
    </section>
    <section class="card" style="margin-top:10px">
      <div class="card-head"><div><div class="card-title">Juziyah & Capaian</div><div class="card-sub">Hasil ujian Juziyah yang tersedia di portal.</div></div></div>
      ${juziyah.length ? `<div class="juz-grid">${juziyah.map(renderJuziyahCard).join("")}</div>` : `<div class="empty-state">Belum ada hasil Juziyah yang tampil.</div>`}
    </section>
  `;

  $("page-catatan").innerHTML=`
    <div class="page-intro"><div class="page-kicker">PEMBINAAN</div><h1 class="page-title">Catatan Guru</h1><div class="page-sub">Evaluasi dan saran yang dapat membantu pendampingan di rumah.</div></div>
    <section class="card">
      ${notes.length ? notes.map(renderNote).join("") : `<div class="empty-state">Belum ada catatan guru.</div>`}
    </section>
  `;

  $("page-juziyah").innerHTML=`
    <div class="page-intro"><div class="page-kicker">UJIAN HAFALAN</div><h1 class="page-title">Juziyah</h1><div class="page-sub">Riwayat hasil ujian Juziyah yang telah tersedia untuk orang tua.</div></div>
    <section class="card">
      ${juziyah.length ? `<div class="juz-grid">${juziyah.map(renderJuziyahCard).join("")}</div>` : `<div class="empty-state">Belum ada hasil Juziyah yang dinyatakan lulus.</div>`}
    </section>
    <div class="info-strip">Sertifikat Juziyah yang diterbitkan sekolah dapat diberikan melalui guru atau pihak sekolah. Portal ini menampilkan informasi capaian yang aman untuk dipantau orang tua.</div>
  `;

  document.querySelectorAll("[data-go]").forEach(btn=>btn.addEventListener("click",()=>switchPage(btn.dataset.go)));
}

function renderSetoranRow(p){
  return `<div class="list-row"><div class="list-row-main"><div><strong>${esc(p.namaSurah||"—")}</strong><small>Ayat ${esc(p.ayatTerakhir??"—")} · Juz ${esc(p.juz??"—")} · ${esc(fmtDate(p.tanggal))}</small></div>${badge(p.status)}</div></div>`;
}
function renderSetoranTimeline(p){
  return `<div class="timeline-row"><div class="timeline-date">${esc(fmtDate(p.tanggal))}</div><div class="timeline-main"><strong>${esc(p.namaSurah||"—")}</strong><small>Ayat terakhir ${esc(p.ayatTerakhir??"—")} · Juz ${esc(p.juz??"—")}</small></div><div class="timeline-status">${badge(p.status)}</div></div>`;
}
function renderNote(c){
  return `<div class="note-card"><div class="note-date">${esc(fmtDate(c.tanggal))}</div><div class="note-title">Evaluasi Guru</div><div class="note-text">${esc(c.pesan||"—")}</div>${c.saranOrtu?`<div class="note-advice"><strong>Saran untuk Orang Tua</strong><br>${esc(c.saranOrtu)}</div>`:""}</div>`;
}
function renderJuziyahRow(r){
  const juz=Number(r.juz);
  return `<div class="list-row"><div class="list-row-main"><div><strong>Juz ${Number.isFinite(juz)?juz:esc(r.juz)}</strong><small>${esc(fmtDate(r.tanggal))}${r.nilai!==""&&r.nilai!=null?` · Nilai ${esc(r.nilai)}`:""}</small></div><span class="badge badge-green">Lulus</span></div></div>`;
}
function renderJuziyahCard(r){
  const juz=Number(r.juz);
  return `<div class="juz-card"><strong>Juz ${Number.isFinite(juz)?juz:esc(r.juz)}</strong><small>${esc(fmtDate(r.tanggal))}${r.nilai!==""&&r.nilai!=null?` · Nilai ${esc(r.nilai)}`:""}</small><em>LULUS</em></div>`;
}

function switchPage(name){
  document.querySelectorAll(".parent-page").forEach(el=>el.classList.remove("active"));
  document.getElementById(`page-${name}`)?.classList.add("active");
  document.querySelectorAll(".side-nav-item,.mobile-nav-item").forEach(btn=>btn.classList.toggle("active",btn.dataset.page===name));
  window.scrollTo({top:0,behavior:"smooth"});
}

async function loadStudentByNis(nis){
  hideError();
  setLoading(true);
  try{
    parentData=await readStudent(nis);
    renderShellInfo();
    renderPages();
    $("searchScreen").classList.add("hidden");
    $("appScreen").classList.remove("hidden");
    switchPage("beranda");
  }catch(error){
    console.error(error);
    $("appScreen").classList.add("hidden");
    showError(error.message||"Data siswa tidak dapat dimuat.");
  }finally{
    setLoading(false);
  }
}

function logoutParent(){
  parentData={student:null,setoran:[],catatan:[],juziyah:[]};
  $("nisInput").value="";
  $("appScreen").classList.add("hidden");
  $("searchScreen").classList.remove("hidden");
  window.scrollTo({top:0});
}

async function refreshParent(){
  const nis=parentData.student?.nis;
  if(!nis) return;
  await loadStudentByNis(String(nis));
}

$("searchBtn").addEventListener("click",()=>{
  const nis=$("nisInput").value.trim();
  if(!nis){showError("Masukkan NIS siswa terlebih dahulu.");return;}
  loadStudentByNis(nis);
});
$("nisInput").addEventListener("keydown",e=>{if(e.key==="Enter") $("searchBtn").click()});
$("changeStudentBtn").addEventListener("click",logoutParent);
$("refreshBtn").addEventListener("click",refreshParent);
document.querySelectorAll(".side-nav-item,.mobile-nav-item").forEach(btn=>btn.addEventListener("click",()=>switchPage(btn.dataset.page)));
