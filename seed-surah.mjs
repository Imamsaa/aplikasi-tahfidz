import fs from "node:fs";
import admin from "firebase-admin";

const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if(!credentialPath){
  console.error("Set GOOGLE_APPLICATION_CREDENTIALS ke Service Account JSON.");
  process.exit(1);
}
const sa = JSON.parse(fs.readFileSync(credentialPath,"utf8"));
admin.initializeApp({credential:admin.credential.cert(sa),projectId:sa.project_id});
const db = admin.firestore();
const surahs = JSON.parse(fs.readFileSync(new URL("./data/surah.json", import.meta.url)));

for(let i=0;i<surahs.length;i+=400){
  const batch=db.batch();
  surahs.slice(i,i+400).forEach(s=>{
    batch.set(db.collection("tahfidz_surah").doc(String(s.id)),{
      id:Number(s.id),nama:s.nama,juz:Number(s.juz),ayat:Number(s.ayat),
      updatedAt:admin.firestore.FieldValue.serverTimestamp()
    });
  });
  await batch.commit();
}
console.log(`Imported ${surahs.length} surah.`);
