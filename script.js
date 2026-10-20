/* ================= CẤU HÌNH – SỬA Ở ĐÂY ================= */
const CONFIG = {
  name: "Trinh",
  sender: "Một người luôn để ý đến chị 🐾",   // đổi thành tên của bạn nếu muốn lộ diện
  // Cách để chị liên lạc lại. Ví dụ: "https://zalo.me/0123456789" hoặc "sms:0123456789" hoặc "https://m.me/ten_fb". Để rỗng = không hiện nút.
  replyLink: "",
  letter: [
    "Hôm nay là 20/10, em chỉ muốn nói một điều thật đơn giản thôi:",
    "Em có gửi kèm một bé thỏ bông 🐰 – bé sẽ thay em ở bên cạnh chị những lúc chị cần một cái ôm nhỏ.",
    "Cảm ơn chị vì đã là một người dễ thương theo cách rất riêng của chị. Có những người chỉ cần xuất hiện thôi là ngày hôm đó đã nhẹ nhàng hơn rồi 🌷",
    "Chúc chị luôn được vui, được thương, và được là chính mình nhé.",
  ]
};
/* ========================================================== */

const DPR = Math.min(window.devicePixelRatio||1, 1.5);   // giới hạn độ phân giải canvas cho nhẹ
const $ = s => document.querySelector(s);
const stage = $('#stage');
const sleep = ms => new Promise(r => setTimeout(r, ms));
let muted = false;

/* ---------- nền: icon nhỏ bay lên ---------- */
(function(){
  const bg = $('#bg'), em = ['🌸','💗','✨','🌷','🫧','🦋','⭐'];
  for(let i=0;i<8;i++){
    const s = document.createElement('div'); s.className='float-bg';
    s.textContent = em[i%em.length];
    s.style.left = Math.random()*100+'vw'; s.style.top = (100+Math.random()*30)+'vh';
    s.style.animationDuration = (14+Math.random()*16)+'s';
    s.style.animationDelay = (-Math.random()*20)+'s';
    s.style.fontSize = (16+Math.random()*20)+'px';
    bg.appendChild(s);
  }
})();

/* ---------- nhạc hộp: tự tạo bằng WebAudio, không cần file ---------- */
let ac, master, musicTimer;
const bgm = new Audio('music.m4a'); bgm.loop = true; bgm.preload = 'auto'; bgm.volume = .8;
function playBgm(){
  const p = bgm.play();
  if(p) p.then(()=>{ $('#hint').textContent=''; }).catch(()=>{ $('#hint').textContent='🎵 Chạm hoặc vuốt để bật nhạc nhé'; });
}
addEventListener('DOMContentLoaded', playBgm); playBgm();  // thử tự phát ngay khi mở trang (một số trình duyệt cho phép)
['pointerdown','touchstart','click','keydown'].forEach(ev =>      // trình duyệt chặn thì phát ở lần chạm đầu tiên
  addEventListener(ev, function f(){ playBgm(); if(!bgm.paused) ['pointerdown','touchstart','click','keydown'].forEach(e=>removeEventListener(e,f)); }, {passive:true}));
document.addEventListener('visibilitychange',()=>{ if(document.hidden) bgm.pause(); else if(!muted) bgm.play().catch(()=>{}); });
function startMusic(){
  playBgm();
  if(ac){ if(ac.state==='suspended') ac.resume(); return; }
  try{ ac = new (window.AudioContext||window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = .5; master.connect(ac.destination); }catch(e){}
}
function note(freq, t, dur, vol, type='sine'){
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.01);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+.05);
}
function chime(){ if(!ac||muted) return; if(ac.state==='suspended') ac.resume(); const t=ac.currentTime; [0,4,7,12,16].forEach((n,k)=>note(523.25*Math.pow(2,n/12),t+k*.08,.8,.15)); }
$('#mute').onclick = () => { muted=!muted; bgm.muted = muted; if(master) master.gain.value = muted?0:.5; $('#mute').textContent = muted?'🔇':'🔊'; };

/* ---------- hiệu ứng: cánh hoa + pháo giấy ---------- */
const cv = $('#fx'), cx = cv.getContext('2d');
let W,H,parts=[];
const resize = () => { W=cv.width=innerWidth*DPR; H=cv.height=innerHeight*DPR; };
resize(); addEventListener('resize',resize);
const COL = ['#ff8fb1','#ffc2d6','#cdb4f6','#bfeee0','#ffe08a','#ffb199','#a9d4ff'];
function burst(x=.5,y=.5,n=120,kind='confetti'){
  n = Math.min(Math.round(n*.55), 400-parts.length); if(n<=0) return;
  for(let i=0;i<n;i++){
    const a = Math.random()*Math.PI*2, sp = (3+Math.random()*9)*DPR;
    parts.push({x:x*W,y:y*H,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-4*DPR,g:.18*DPR,
      s:(5+Math.random()*7)*DPR,c:COL[i%COL.length],r:Math.random()*6,vr:(Math.random()-.5)*.3,life:160+Math.random()*80,kind});
  }
}
function petalRain(on){ petalRain.on=on; }
setInterval(()=>{ if(petalRain.on && parts.length<260) parts.push({x:Math.random()*W,y:-20,vx:(Math.random()-.5)*1.5*DPR,vy:(1.2+Math.random()*1.6)*DPR,
  g:0,s:(8+Math.random()*8)*DPR,c:COL[Math.random()*3|0],r:Math.random()*6,vr:(Math.random()-.5)*.1,life:900,kind:'petal',sw:Math.random()*6}); },140);
const HEART = document.createElement('canvas'); HEART.width=HEART.height=48;
{ const h=HEART.getContext('2d'); h.font='40px serif'; h.textBaseline='middle'; h.textAlign='center'; h.fillText('💗',24,26); }
let wasEmpty=true;
(function loop(){
  if(!parts.length){ if(!wasEmpty){ cx.clearRect(0,0,W,H); wasEmpty=true; } return requestAnimationFrame(loop); }
  wasEmpty=false; cx.clearRect(0,0,W,H);
  parts = parts.filter(p=>p.life>0 && p.y<H+40);
  for(const p of parts){
    p.life--; p.x+=p.vx + (p.sw!==undefined?Math.sin(p.life/20+p.sw)*.8*DPR:0); p.y+=p.vy; p.vy+=p.g; p.vx*=.995; p.r+=p.vr;
    cx.save(); cx.translate(p.x,p.y); cx.rotate(p.r); cx.globalAlpha=Math.min(1,p.life/40); cx.fillStyle=p.c;
    if(p.kind==='petal'){ cx.beginPath(); cx.ellipse(0,0,p.s,p.s*.55,0,0,7); cx.fill(); }
    else if(p.kind==='heart'){ cx.drawImage(HEART,-p.s,-p.s,p.s*2,p.s*2); }
    else cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);
    cx.restore();
  }
  requestAnimationFrame(loop);
})();

/* ---------- bạn đồng hành chạy qua chạy lại ---------- */
function addPal(emoji, top, dur, delay){
  const d = document.createElement('div'); d.className='pal';
  d.style.cssText = `top:${top}vh;left:${Math.random()*70+5}vw;--d:${dur}s;--b:${delay}s`;
  d.innerHTML = `<span>${emoji}</span>`; $('#crew').appendChild(d);
}

/* ---------- helper dựng cảnh ---------- */
function clear(){ stage.innerHTML=''; }
function hero(emoji, cls='bounce'){ const h=document.createElement('div'); h.className='hero '+cls; h.textContent=emoji; stage.appendChild(h); return h; }
async function say(text, hold=1400){
  let b = stage.querySelector('.bubble');
  if(!b){ b=document.createElement('div'); b.className='bubble pop'; stage.appendChild(b); }
  b.textContent=''; b.classList.add('cursor');
  for(const ch of text){ b.textContent+=ch; await sleep(/[,.!?…]/.test(ch)?170:42); }
  b.classList.remove('cursor'); await sleep(hold);
}
function btn(label, cls=''){ return new Promise(res=>{ const b=document.createElement('button'); b.textContent=label; b.className=cls;
  b.onclick=()=>{ chime(); b.remove(); res(); }; stage.appendChild(b); }); }

/* ================== KỊCH BẢN ================== */
/* ---------- màn hình đầu: vuốt sang phải để mở bất ngờ ---------- */
async function gate(){
  clear();
  const h = hero('🎁','wobble');
  const t = document.createElement('div'); t.className='bubble pop';
  t.innerHTML = `Chị ${CONFIG.name} ơi,<br>có một bất ngờ dành cho chị 💌`; stage.appendChild(t);
  const sl = document.createElement('div'); sl.className='slider pop';
  sl.innerHTML = '<div class="fill"></div><div class="label">Vuốt sang phải để mở <span class="arrows">›››</span></div><div class="knob">🐰</div>';
  stage.appendChild(sl);
  const knob = sl.querySelector('.knob'), fill = sl.querySelector('.fill'), label = sl.querySelector('.label');
  await new Promise(done=>{
    let drag=false, sx=0, x=0, max=0;
    const set = v => { x=Math.max(0,Math.min(max,v)); knob.style.transform=`translateX(${x}px) rotate(${x/6}deg)`; fill.style.width=(x+30)+'px'; label.style.opacity=1-x/max*1.3; };
    knob.addEventListener('pointerdown', e=>{ drag=true; sx=e.clientX-x; max=sl.clientWidth-knob.clientWidth-8; knob.setPointerCapture(e.pointerId); knob.style.transition='none'; fill.style.transition='none'; });
    knob.addEventListener('pointermove', e=>{ if(drag) set(e.clientX-sx); });
    const end = () => { if(!drag) return; drag=false; knob.style.transition=fill.style.transition='all .35s cubic-bezier(.2,1.4,.4,1)';
      if(x>max*.82){ set(max); startMusic(); chime(); navigator.vibrate&&navigator.vibrate(50); setTimeout(done,250); } else set(0); };
    knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end);
  });
  sl.classList.add('out'); t.classList.add('out'); burst(.5,.5,160); burst(.5,.5,40,'heart');
  h.className='hero pop'; await sleep(1100);
}

async function scene1(){
  startMusic(); $('#mute').style.display='block';
  const g = stage.querySelector('.hero'); g.className='hero out'; await sleep(450);
  clear(); burst(.5,.4,90);
  hero('🐰','bounce'); chime();
  addPal('🐻',78,6,.1); addPal('🐱',86,8,.4); addPal('🐥',70,7,.7);
  await say(`Xin chào chị ${CONFIG.name}! 🌸`);
  await say('Hôm nay là 20/10 đó chị biết không?');
  await say('Có một người nhờ em gửi chị món quà này nè 🎀', 1500);
  await say('Em là thỏ đại diện, còn bé thỏ bông thật đang đợi chị ở ngoài kia đó 🐰💗', 2200);
}

/* ---------- phép màu: hàng trăm hạt sáng tự xếp thành chữ & trái tim ---------- */
const pt = $('#pt'), pc = pt.getContext('2d');
let dots = [], magicOn = false;
function sizePt(){ pt.width = innerWidth*DPR; pt.height = innerHeight*DPR; }
sizePt(); addEventListener('resize', sizePt);
function targetsFor(draw){
  const w = pt.width, h = pt.height, o = document.createElement('canvas'); o.width=w; o.height=h;
  const c = o.getContext('2d'); c.fillStyle='#000'; draw(c,w,h);
  const d = c.getImageData(0,0,w,h).data, step = Math.max(6, Math.round(w/85)), out=[];
  for(let y=0;y<h;y+=step) for(let x=0;x<w;x+=step) if(d[(y*w+x)*4+3]>128) out.push([x,y]);
  return out;
}
const DCOL = ['#ff6fa3','#ff8fb1','#b794f6','#7cc4ff','#ffb347','#6fe0c0'];
let solid = null;                              // lớp chữ/tim đặc hiện lên sau khi hạt đã xếp xong
const paintGrad = (c,w) => { const g=c.createLinearGradient(w*.15,0,w*.85,0); g.addColorStop(0,'#ff6fa3'); g.addColorStop(.5,'#c084fc'); g.addColorStop(1,'#6bb8ff'); return g; };
const FONT = 'Quicksand,"Arial Rounded MT Bold",Arial';
const textShape = (txt, k=1) => (c,w,h,solid) => {
  const portrait = h>w*1.1 && txt.includes(' ');
  const lines = portrait ? txt.split(' ') : [txt];
  let fs = w*(portrait?.34:.3)*k; const fit = () => { c.font=`700 ${fs}px ${FONT}`; return Math.max(...lines.map(l=>c.measureText(l).width)); };
  while(fit()>w*.84) fs*=.92;
  c.textAlign='center'; c.textBaseline='middle'; c.lineJoin='round';
  const y0 = h*.45 - (lines.length-1)*fs*.6;
  if(solid){ c.lineWidth=fs*.09; c.strokeStyle='#fff'; lines.forEach((l,i)=>c.strokeText(l,w/2,y0+i*fs*1.2)); c.fillStyle=paintGrad(c,w); }
  lines.forEach((l,i)=>c.fillText(l,w/2,y0+i*fs*1.2)); };
const heartShape = (c,w,h,solid) => { const s=Math.min(w,h)*.026; c.beginPath();
  for(let t=0;t<Math.PI*2;t+=.02){ const x=16*Math.sin(t)**3, y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
    t?c.lineTo(w/2+x*s*1.5, h*.45+y*s*1.5):c.moveTo(w/2+x*s*1.5, h*.45+y*s*1.5); }
  if(solid){ c.lineJoin='round'; c.lineWidth=s*3; c.strokeStyle='#fff'; c.stroke(); c.fillStyle=paintGrad(c,w); } c.fill(); };
function formShape(draw){
  solid = null;
  const T = targetsFor(draw);
  while(dots.length < T.length) dots.push({x:Math.random()*pt.width,y:pt.height+Math.random()*80,vx:0,vy:0,c:DCOL[dots.length%DCOL.length],r:(2.2+Math.random()*2)*DPR});
  dots.forEach((p,i)=>{ const t = T[i % T.length]; p.tx=t[0]; p.ty=t[1]; });
  setTimeout(()=>{ solid = {draw, a:0}; }, 1500);       // sau 1.5s: chữ đặc mờ dần hiện lên cho thật rõ
}
function explodeDots(){ solid=null; dots.forEach(p=>{ const a=Math.random()*6.28, v=(6+Math.random()*14)*DPR; p.vx=Math.cos(a)*v; p.vy=Math.sin(a)*v; p.free=1; }); setTimeout(()=>dots.forEach(p=>p.free=0),500); }
let ptDirty=false;
(function pLoop(){
  if(!magicOn){ if(ptDirty){ pc.clearRect(0,0,pt.width,pt.height); ptDirty=false; } return requestAnimationFrame(pLoop); }
  ptDirty=true; pc.clearRect(0,0,pt.width,pt.height);
  for(const p of dots){
    if(p.free){ p.x+=p.vx; p.y+=p.vy; p.vx*=.96; p.vy*=.96; }
    else { p.vx=(p.vx+(p.tx-p.x)*.012)*.88; p.vy=(p.vy+(p.ty-p.y)*.012)*.88; p.x+=p.vx; p.y+=p.vy; }
    pc.fillStyle=p.c; pc.beginPath(); pc.arc(p.x,p.y,p.r,0,6.3); pc.fill();
  }
  if(solid){ solid.a=Math.min(1,solid.a+.035); pc.globalAlpha=solid.a; solid.draw(pc,pt.width,pt.height,true); pc.globalAlpha=1; }
  requestAnimationFrame(pLoop);
})();

async function scene2(){
  clear(); chime(); magicOn=true; dots=[];
  const cap = document.createElement('div'); cap.className='bubble pop'; cap.style.cssText='position:absolute;bottom:9vh'; stage.appendChild(cap);
  const say2 = t => { cap.textContent=t; };
  say2('Nhìn lên trời một chút nhé… ✨'); await sleep(1200);
  formShape(textShape('20.10')); say2('Hôm nay là ngày của những người con gái đặc biệt'); await sleep(3400);
  explodeDots(); await sleep(700);
  formShape(textShape(`Chị ${CONFIG.name}`, .9)); chime(); say2('Và đặc biệt nhất với em… là chị 🌷'); await sleep(3800);
  explodeDots(); await sleep(700);
  formShape(heartShape); chime(); burst(.5,.4,120,'heart'); say2('Chúc chị một ngày thật dịu dàng 💗'); await sleep(4200);
  explodeDots(); await sleep(900); magicOn=false; solid=null; petalRain(true);
}

async function scene3(){
  clear();
  hero('🦋','sway').style.fontSize='min(22vw,100px)';
  const w = document.createElement('div'); w.className='wishes'; stage.appendChild(w);
  const list = [['✨','Luôn rạng rỡ và thật xinh'],['😊','Cười thật nhiều mỗi ngày'],['🌷','Mọi điều dễ thương đều tìm đến chị'],['💗','Được yêu thương đúng cách']];
  for(const [e,t] of list){
    const d=document.createElement('div'); d.className='wish'; d.innerHTML=`<i>${e}</i><span>${t}</span>`; w.appendChild(d);
    chime(); burst(.5,.55,25); await sleep(1500);
  }
  await sleep(1200);
}

async function sceneWake(){
  clear();
  const h = hero('🐰','floaty'); h.style.opacity='.9';
  const z = document.createElement('div'); z.textContent='💤'; z.style.cssText='font-size:44px;position:absolute;margin:-110px -110px 0 0';
  z.className='floaty'; stage.appendChild(z);
  const b = document.createElement('div'); b.className='bubble pop'; b.textContent='Shhh… bé thỏ bông đang ngủ. Chị chạm vào bé để đánh thức nhé 🥺'; stage.appendChild(b);
  await new Promise(r=>{ h.style.cursor='pointer'; h.onclick=r; setTimeout(()=>{ if(!h.dataset.done) r(); }, 12000); }); h.dataset.done=1;
  z.remove(); chime(); h.className='hero bounce'; h.style.opacity=1; burst(.5,.4,160); burst(.5,.4,40,'heart');
  navigator.vibrate && navigator.vibrate([60,40,60]);
  await say('Chào chị!! Em là bé thỏ bông của chị nè 🐰', 1200);
  await say('Người ấy dặn em: phải ôm chị thật chặt thay cho người ấy 🤗', 1800);
  await say('Chị nhớ đưa em về nhà nha, đừng bỏ em lại đó 🥹💗', 2200);
}

async function scene4(){
  clear();
  hero('💌','wobble').style.fontSize='min(30vw,140px)';
  const b = document.createElement('div'); b.className='bubble pop'; b.textContent='Còn một lá thư nhỏ nữa nè…'; stage.appendChild(b);
  await btn('Mở thư 💗','alt');
  clear(); burst(.5,.5,100,'heart');
  const L = document.createElement('div'); L.className='letter';
  L.innerHTML = `<p>Gửi chị ${CONFIG.name},</p>` + CONFIG.letter.map(p=>`<p>${p}</p>`).join('') + `<p class="sign">— ${CONFIG.sender}</p>`;
  stage.appendChild(L);
  await sleep(2500);
  if(CONFIG.replyLink){
    const a = document.createElement('button'); a.textContent='Nhắn lại cho người gửi 🐾'; a.onclick=()=>{ chime(); location.href=CONFIG.replyLink; }; stage.appendChild(a);
  }
  const again = document.createElement('div'); again.style.cssText='margin-top:14px;font-size:30px;display:flex;gap:10px';
  again.innerHTML = '<span class="bounce">🐰</span><span class="bounce" style="animation-delay:.15s">🐻</span><span class="bounce" style="animation-delay:.3s">🐱</span><span class="bounce" style="animation-delay:.45s">🐥</span>';
  stage.appendChild(again);
  for(let i=0;i<6;i++){ burst(Math.random(),Math.random()*.5,60); await sleep(900); }
  $('#hint').textContent = 'Chạm vào màn hình để rải thêm hoa 🌸';
}

/* chạm đâu rải hoa/tim đó */
addEventListener('pointerdown', e=>{ if(e.target.tagName==='BUTTON') return; burst(e.clientX/innerWidth, e.clientY/innerHeight, 22, Math.random()<.4?'heart':'confetti'); });

(async()=>{ await gate(); await scene1(); await scene2(); await scene3(); await sceneWake(); await scene4(); })();