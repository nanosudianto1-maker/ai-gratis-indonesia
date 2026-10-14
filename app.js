const $ = (id) => document.getElementById(id);
const state = { view: "chat", chats: [], current: [], chatId: 0 };
const welcome = $("welcome"), messages = $("messages"), composerWrap = $("composerWrap");
const promptView = $("promptView"), imageView = $("imageView"), toast = $("toast");

function notify(message) {
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}
function showView(view) {
  state.view = view;
  welcome.classList.toggle("hidden", view !== "chat" || state.current.length > 0);
  messages.classList.toggle("hidden", view !== "chat");
  composerWrap.classList.toggle("hidden", view !== "chat");
  promptView.classList.toggle("hidden", view !== "prompt");
  imageView.classList.toggle("hidden", view !== "image");
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  $("sidebar").classList.remove("open");
}
function renderMessages() {
  messages.innerHTML = "";
  state.current.forEach(item => {
    const row = document.createElement("div"); row.className = "message " + item.role;
    const avatar = document.createElement("div"); avatar.className = "avatar"; avatar.textContent = item.role === "user" ? "●" : "✳";
    const body = document.createElement("div"); body.className = "message-body";
    const name = document.createElement("div"); name.className = "message-name"; name.textContent = item.role === "user" ? "Kamu" : "AI Gratis Indonesia";
    const content = document.createElement("div"); content.className = "message-text"; content.textContent = item.text;
    body.append(name, content); row.append(avatar, body); messages.append(row);
  });
  welcome.classList.toggle("hidden", state.current.length > 0);
  messages.scrollIntoView({block:"end", behavior:"smooth"});
}
function renderHistory() {
  const box = $("history"); box.innerHTML = "";
  if (!state.chats.length) { const p=document.createElement("p");p.className="muted small";p.textContent="Percakapanmu akan muncul di sini.";box.append(p);return; }
  state.chats.slice().reverse().forEach(chat => {
    const b=document.createElement("button");b.className="history-item";b.textContent=chat.title;
    b.onclick=()=>{state.current=chat.messages.map(x=>({...x}));state.chatId=chat.id;showView("chat");renderMessages();};box.append(b);
  });
}
function saveChat() {
  if (!state.current.length) return;
  const title = (state.current.find(x=>x.role==="user")?.text || "Percakapan").slice(0,34);
  const existing = state.chats.find(c=>c.id===state.chatId);
  if(existing){existing.messages=state.current.map(x=>({...x}));existing.title=title;}
  else {state.chatId=Date.now();state.chats.push({id:state.chatId,title,messages:state.current.map(x=>({...x}))});}
  try { localStorage.setItem("aig-chats",JSON.stringify(state.chats)); } catch(e) {}
  renderHistory();
}
function addMessage(role,text){state.current.push({role,text});renderMessages();saveChat();}
function localDemoAnswer(text) {
  const t=text.toLowerCase();
  if(/prompt|gambar|foto|video/.test(t)) return "Aku bisa bantu menyusun prompt. Contoh struktur: subjek utama + lokasi + pencahayaan + gaya visual + sudut kamera + detail kualitas.\n\nContoh: “Rumah tradisional Indonesia di tepi sawah saat matahari terbit, cahaya keemasan lembut, fotografi sinematik realistis, sudut kamera lebar, detail kayu alami, komposisi profesional.”\n\nCatatan: ini jawaban demo lokal, bukan respons dari model AI online.";
  if(/belajar|rencana|jadwal/.test(t)) return "Berikut contoh rencana awal:\n1. Tentukan tujuan yang ingin dicapai.\n2. Pelajari konsep dasar selama 20–30 menit per hari.\n3. Praktikkan satu tugas kecil.\n4. Catat hasil dan pertanyaan yang belum terjawab.\n5. Evaluasi kemajuan setiap akhir pekan.\n\nIni contoh jawaban demo. Hubungkan penyedia AI untuk percakapan otomatis yang lebih fleksibel.";
  return "Mode demo aktif. Situs ini belum terhubung ke penyedia model AI, jadi aku belum bisa memberikan jawaban AI online yang sesungguhnya.\n\nKamu tetap bisa memakai Pembuat Prompt dan menyiapkan prompt gambar. Untuk mengaktifkan chat online, konfigurasi endpoint penyedia AI yang memiliki kuota gratis di app.js atau buat backend aman. Jangan menaruh API key rahasia di JavaScript publik.";
}
$("chatForm").addEventListener("submit",e=>{
  e.preventDefault(); const input=$("chatInput"); const text=input.value.trim(); if(!text)return;
  showView("chat"); addMessage("user",text); input.value="";input.style.height="auto";
  setTimeout(()=>addMessage("assistant",localDemoAnswer(text)),180);
});
$("chatInput").addEventListener("input",e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,180)+"px";});
$("newChat").onclick=()=>{state.current=[];state.chatId=0;showView("chat");renderMessages();$("chatInput").focus();};
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll(".suggestion").forEach(b=>b.addEventListener("click",()=>{$("chatInput").value=b.dataset.prompt;showView("chat");$("chatInput").focus();}));
$("menuBtn").onclick=()=>$("sidebar").classList.toggle("open");
$("themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("aig-theme",document.body.classList.contains("light")?"light":"dark");};
if(localStorage.getItem("aig-theme")==="light")document.body.classList.add("light");
try { state.chats=JSON.parse(localStorage.getItem("aig-chats")||"[]"); } catch(e) { state.chats=[]; }
renderHistory(); renderMessages();

function makePrompt(subject,type,style){
  const clean=subject.trim();
  if(!clean)return "";
  const typeLine = type==="Video AI" ? "video, gerakan subjek alami, pergerakan kamera halus, durasi dan transisi konsisten" : type==="Konten media sosial" ? "konten media sosial, pembuka yang menarik, pesan jelas, ajakan bertindak yang relevan" : type==="Foto produk" ? "fotografi produk komersial, produk menjadi fokus utama, latar bersih, pencahayaan terkontrol" : "komposisi visual kuat, detail tajam, tekstur realistis";
  return `${clean}. Gaya: ${style}. Detail: ${typeLine}. Perhatikan komposisi, pencahayaan, warna yang harmonis, subjek jelas, dan hasil profesional. Hindari teks acak, anatomi tidak wajar, artefak visual, serta watermark.`;
}
$("makePrompt").onclick=()=>{
  const result=makePrompt($("promptSubject").value,$("promptType").value,$("promptStyle").value);
  if(!result){notify("Tulis ide terlebih dahulu.");return;}
  $("promptOutput").textContent=result;$("promptResult").classList.remove("hidden");
};
$("copyPrompt").onclick=()=>copyText($("promptOutput").textContent);
$("prepareImage").onclick=()=>{
  const subject=$("imagePrompt").value.trim();if(!subject){notify("Tulis deskripsi gambar terlebih dahulu.");return;}
  $("imageOutput").textContent=makePrompt(subject,"Gambar AI","Sinematik realistis");$("imageResult").classList.remove("hidden");
};
$("copyImage").onclick=()=>copyText($("imageOutput").textContent);
async function copyText(text){try{await navigator.clipboard.writeText(text);notify("Berhasil disalin.");}catch(e){const area=document.createElement("textarea");area.value=text;document.body.append(area);area.select();document.execCommand("copy");area.remove();notify("Berhasil disalin.");}}
