const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PUB = path.join(__dirname, 'client/public');
const OUT = path.join(PUB, 'images/ads');

function b64(filePath) {
  const data = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${data.toString('base64')}`;
}

const starBlack = b64(path.join(PUB, 'images/starfish-black.png'));
const starCoral = b64(path.join(PUB, 'images/starfish-coral.png'));
const starTeal  = b64(path.join(PUB, 'images/starfish-teal.png'));  // blue starfish
const modelDay1  = b64(path.join(PUB, 'images/models/daydream/_HTM3935.JPEG'));
const modelDay2  = b64(path.join(PUB, 'images/models/daydream/_HTM4179.JPEG'));
const modelAqua1 = b64(path.join(PUB, 'images/models/aquaglow/_HTM3828.JPEG'));
// Website uses aqua-1 through aqua-5 for pieces (NOT the generic piece images)
const pieceTop   = b64(path.join(PUB, 'images/pieces/aqua-1.png'));   // Top
const pieceTurban= b64(path.join(PUB, 'images/pieces/aqua-2.png'));   // Turban
const pieceShort = b64(path.join(PUB, 'images/pieces/aqua-3.png'));   // Short Coverup
const pieceLeg   = b64(path.join(PUB, 'images/pieces/aqua-4.png'));   // Leggings
const pieceWhole = b64(path.join(PUB, 'images/pieces/aqua-5.png'));   // Whole Coverup

const PAPER = '#fef8e1';
const CORAL = '#e5815c';
const BLUE  = '#0077B6';
const TEAL  = '#6bb7b3'; // brand wave teal from canvas-wave.tsx
const BLACK = '#1a1a1a';

function stars(list) {
  return list.map(c =>
    `<img src="${c.src}" style="position:absolute;width:${c.size}px;height:${c.size}px;top:${c.top};left:${c.left};opacity:${c.op};transform:rotate(${c.r}deg);pointer-events:none;z-index:3;" />`
  ).join('');
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Playfair+Display:ital,wght@0,700;1,400&family=Inter:wght@600;700&display=swap" rel="stylesheet">`;

const BASE_CSS = `
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1080px; height:1350px; overflow:hidden; }
.ar { font-family:'Cairo',Arial,sans-serif; direction:rtl; }
.en { font-family:'Playfair Display',Georgia,serif; }
.logo-wrap { display:flex; align-items:center; gap:14px; }
.logo-star { width:46px; height:46px; }
.logo-word { font-family:'Playfair Display',Georgia,serif; font-size:50px; font-weight:700; letter-spacing:-1px; }
`;

// Wave canvas — static snapshot rendered via canvas API in a <script>
// Since Puppeteer runs JS, this will actually execute and draw the wave
const WAVE_SCRIPT = `
<canvas id="wv" style="position:absolute;bottom:0;left:0;width:1080px;height:450px;z-index:2;"></canvas>
<script>
(function(){
  var c=document.getElementById('wv');
  c.width=1080; c.height=450;
  var ctx=c.getContext('2d');
  var amplitude=38, frequency=0.012, time=2.4;
  ctx.fillStyle='${TEAL}';
  ctx.beginPath();
  for(var x=0;x<=1080;x+=2){
    var y=(c.height*0.18)+Math.sin(x*frequency+time)*amplitude;
    if(x===0){ctx.moveTo(x,y);}else{ctx.lineTo(x,y);}
  }
  ctx.lineTo(1080,450);ctx.lineTo(0,450);ctx.closePath();ctx.fill();
  ctx.lineWidth=5;ctx.strokeStyle='#000';ctx.stroke();
})();
</script>
`;

const ads = [

// POST 1 — Fix: more line spacing on Arabic text
{ name:'moony_v4_1_freedom', html:`<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>
${BASE_CSS}
body{background:${PAPER};}
.wrap{width:1080px;height:1350px;position:relative;}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;}
.fade{position:absolute;inset:0;background:linear-gradient(to top,${PAPER} 0%,${PAPER}f0 32%,${PAPER}99 52%,transparent 68%);}
.bottom{position:absolute;bottom:0;left:0;right:0;padding:60px 90px 95px;display:flex;flex-direction:column;align-items:center;gap:32px;}
h1{font-size:88px;font-weight:900;color:${BLACK};line-height:1.55;text-align:center;letter-spacing:0.06em;word-spacing:0.1em;}
.sub{font-size:30px;font-style:italic;color:${BLACK};opacity:0.62;text-align:center;line-height:1.6;}
.stripe{width:70px;height:5px;background:${CORAL};border-radius:3px;}
.logo-word{color:${BLACK};}
</style></head><body><div class="wrap">
<img class="bg" src="${modelDay1}"/>
<div class="fade"></div>
${stars([
  {src:starCoral,size:72,top:'6%', left:'5%', op:0.85,r:15},
  {src:starTeal, size:58,top:'10%',left:'80%',op:0.80,r:-22},
  {src:starBlack,size:50,top:'22%',left:'74%',op:0.70,r:40},
  {src:starCoral,size:64,top:'28%',left:'6%', op:0.80,r:-10},
  {src:starTeal, size:46,top:'42%',left:'84%',op:0.75,r:55},
  {src:starBlack,size:54,top:'48%',left:'3%', op:0.65,r:-38},
])}
<div class="bottom">
  <div class="stripe"></div>
  <h1 class="ar">الراحة اللي تمنحك<br/><span style="color:${CORAL};">حرية أكثر</span></h1>
  <p class="sub en">The comfort that gives you more freedom.</p>
  <div class="logo-wrap">
    <img class="logo-star" src="${starBlack}" style="opacity:0.9;"/>
    <span class="logo-word">moony</span>
  </div>
</div>
</div></body></html>`},

// POST 2 — Fix: card only 36% height so more swimsuit shows
{ name:'moony_v4_2_imagine', html:`<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>
${BASE_CSS}
body{background:${PAPER};}
.wrap{width:1080px;height:1350px;position:relative;}
.photo{position:absolute;top:0;left:0;right:0;height:100%;overflow:hidden;}
.photo img{width:100%;height:100%;object-fit:cover;object-position:top center;}
.card{position:absolute;bottom:0;left:0;right:0;height:38%;background:${PAPER};border-radius:56px 56px 0 0;padding:52px 90px 76px;display:flex;flex-direction:column;justify-content:center;gap:24px;}
.card h1{font-size:80px;font-weight:900;color:${BLACK};line-height:1.45;}
.card .sub{font-size:28px;font-style:italic;color:${BLACK};opacity:0.55;line-height:1.5;} .sea-breeze-fix{display:none;}
.stripe{width:60px;height:5px;background:${CORAL};border-radius:3px;}
.logo-word{color:${BLACK};}
</style></head><body><div class="wrap">
<div class="photo"><img src="${modelDay2}"/></div>
${stars([
  {src:starCoral,size:70,top:'4%', left:'5%', op:0.85,r:18},
  {src:starTeal, size:55,top:'8%', left:'83%',op:0.80,r:-28},
  {src:starBlack,size:62,top:'18%',left:'76%',op:0.72,r:45},
  {src:starCoral,size:48,top:'25%',left:'8%', op:0.78,r:-8},
  {src:starTeal, size:52,top:'36%',left:'87%',op:0.75,r:62},
  {src:starBlack,size:44,top:'46%',left:'4%', op:0.65,r:-42},
])}
<div class="card">
  <div class="logo-wrap">
    <img class="logo-star" src="${starBlack}" style="opacity:0.9;"/>
    <span class="logo-word">moony</span>
  </div>
  <div class="stripe"></div>
  <h1 class="ar">تخيلي نفسك…<br/>خفيفة كنسمة البحر</h1>
  <p class="sub en">Imagine feeling as light as the sea breeze.</p>
</div>
</div></body></html>`},

// POST 3 — Fix: add brand blue to 2 boxes
{ name:'moony_v4_3_features', html:`<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>
${BASE_CSS}
body{background:${PAPER};}
.wrap{width:1080px;height:1350px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px;gap:44px;}
.header{display:flex;flex-direction:column;align-items:center;gap:20px;}
.header h1{font-size:68px;font-weight:900;color:${BLACK};text-align:center;line-height:1.35;}
.header p{font-size:26px;font-style:italic;color:${BLACK};opacity:0.50;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:30px;width:100%;}
.box{background:#fff;border-radius:36px;padding:54px 48px;display:flex;flex-direction:column;align-items:flex-end;gap:18px;box-shadow:0 4px 30px rgba(0,0,0,0.07);}
.box-star{width:54px;height:54px;}
.box h2{font-size:50px;font-weight:900;color:${BLACK};line-height:1.25;text-align:right;}
.box p{font-size:24px;color:${BLACK};opacity:0.40;font-style:italic;text-align:right;}
.bar{width:100%;height:7px;border-radius:4px;margin-bottom:6px;}
.logo-word{color:${BLACK};}
</style></head><body><div class="wrap">
${stars([
  {src:starCoral,size:72,top:'2%', left:'4%', op:0.82,r:15},
  {src:starBlack,size:58,top:'3%', left:'86%',op:0.65,r:-28},
  {src:starCoral,size:50,top:'88%',left:'6%', op:0.82,r:-12},
  {src:starBlack,size:64,top:'90%',left:'82%',op:0.65,r:30},
  {src:starCoral,size:46,top:'92%',left:'48%',op:0.72,r:-50},
])}
<div class="header">
  <div class="logo-wrap">
    <img class="logo-star" src="${starBlack}" style="opacity:0.9;width:50px;height:50px;"/>
    <span class="logo-word" style="font-size:54px;">moony</span>
  </div>
  <h1 class="ar">مصممة لتعيشين اللحظة</h1>
  <p class="en">Every comfort. Every freedom.</p>
</div>
<div class="grid">
  <div class="box">
    <div class="bar" style="background:${CORAL};"></div>
    <img class="box-star" src="${starCoral}"/>
    <h2 class="ar">حماية +UPF 50</h2>
    <p class="en">Sun Protection</p>
  </div>
  <div class="box">
    <div class="bar" style="background:${BLACK};opacity:0.12;"></div>
    <img class="box-star" src="${starBlack}" style="opacity:0.75;"/>
    <h2 class="ar">راحة بدون التصاق</h2>
    <p class="en">Non-Clingy Fabric</p>
  </div>
  <div class="box">
    <div class="bar" style="background:${BLACK};opacity:0.12;"></div>
    <img class="box-star" src="${starBlack}" style="opacity:0.75;"/>
    <h2 class="ar">سريع الجفاف</h2>
    <p class="en">Quick-Dry</p>
  </div>
  <div class="box">
    <div class="bar" style="background:${CORAL};"></div>
    <img class="box-star" src="${starCoral}"/>
    <h2 class="ar">خفيف الوزن</h2>
    <p class="en">Lightweight</p>
  </div>
</div>
</div></body></html>`},

// POST 4 — Fix: correct aqua piece images, paper bg, brand wave, all 3 star colors
{ name:'moony_v4_4_pieces', html:`<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>
${BASE_CSS}
body{background:${PAPER};}
.wrap{width:1080px;height:1350px;position:relative;display:flex;flex-direction:column;align-items:center;padding:60px 50px 460px;gap:36px;}
.header{display:flex;flex-direction:column;align-items:center;gap:16px;z-index:20;position:relative;}
.header h1{font-size:76px;font-weight:900;color:${BLACK};text-align:center;line-height:1.25;}
.header p{font-size:26px;font-style:italic;color:${BLACK};opacity:0.45;}
.stripe{width:70px;height:5px;background:${CORAL};border-radius:3px;}
.pieces{display:flex;align-items:flex-end;justify-content:center;gap:20px;width:100%;z-index:20;position:relative;}
.piece{display:flex;flex-direction:column;align-items:center;gap:12px;}
.piece img{object-fit:contain;filter:drop-shadow(0 6px 16px rgba(0,0,0,0.15));}
.pname{font-size:22px;font-weight:900;color:${BLACK};text-align:center;line-height:1.3;}
.pen{font-size:16px;color:${CORAL};text-align:center;font-style:italic;font-family:'Playfair Display',serif;}
.logo-word{color:${BLACK};}
</style></head><body><div class="wrap">
${stars([
  {src:starCoral,size:60,top:'55%',left:'3%', op:0.82,r:20},
  {src:starTeal, size:50,top:'58%',left:'88%',op:0.78,r:-25},
  {src:starBlack,size:44,top:'60%',left:'50%',op:0.55,r:55},
  {src:starCoral,size:54,top:'82%',left:'8%', op:0.70,r:-15},
  {src:starBlack,size:48,top:'84%',left:'80%',op:0.60,r:35},
  {src:starTeal, size:42,top:'86%',left:'42%',op:0.65,r:-40},
])}
<div class="header">
  <div class="logo-wrap">
    <img class="logo-star" src="${starBlack}" style="opacity:0.9;width:50px;height:50px;"/>
    <span class="logo-word" style="font-size:54px;">moony</span>
  </div>
  <div class="stripe"></div>
  <h1 class="ar" style="font-size:54px;">٥ قطع تمنحك خيارات تناسب كل طلعة بحر</h1>
  <p class="en">Mix, match & own the sea.</p>
</div>
<div class="pieces">
  <div class="piece">
    <img src="${pieceTurban}" style="height:140px;width:auto;"/>
    <div class="pname ar">توربان</div>
    <div class="pen en">Turban</div>
  </div>
  <div class="piece">
    <img src="${pieceShort}" style="height:240px;width:auto;"/>
    <div class="pname ar">تنوره قصيره</div>
    <div class="pen en">Short Coverup</div>
  </div>
  <div class="piece">
    <img src="${pieceTop}" style="height:340px;width:auto;"/>
    <div class="pname ar">التوب</div>
    <div class="pen en">Top</div>
  </div>
  <div class="piece">
    <img src="${pieceLeg}" style="height:300px;width:auto;"/>
    <div class="pname ar">ليقنز</div>
    <div class="pen en">Leggings</div>
  </div>
  <div class="piece">
    <img src="${pieceWhole}" style="height:360px;width:auto;"/>
    <div class="pname ar">كاش مايو</div>
    <div class="pen en">Whole Coverup</div>
  </div>
</div>
${WAVE_SCRIPT}
</div></body></html>`},

// POST 5 — تنفّسي بعمق
{ name:'moony_v4_5_breathe', html:`<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>
${BASE_CSS}
body{background:${BLACK};}
.wrap{width:1080px;height:1350px;position:relative;}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,26,26,0.94) 0%,rgba(26,26,26,0.60) 40%,rgba(26,26,26,0.10) 70%);}
.bottom{position:absolute;bottom:0;left:0;right:0;padding:65px 90px 100px;display:flex;flex-direction:column;align-items:center;gap:30px;}
h1{font-size:90px;font-weight:900;color:#fff;line-height:1.45;text-align:center;}
.sub{font-size:30px;font-style:italic;color:#fff;opacity:0.58;text-align:center;line-height:1.5;}
.cta{background:${CORAL};color:#fff;font-family:'Noto Kufi Arabic',Arial,sans-serif;font-size:32px;font-weight:700;padding:22px 72px;border-radius:100px;direction:rtl;}
.logo-word{color:#fff;}
</style></head><body><div class="wrap">
<img class="bg" src="${modelAqua1}"/>
<div class="overlay"></div>
${stars([
  {src:starCoral,size:72,top:'6%', left:'5%', op:0.90,r:18},
  {src:starTeal, size:58,top:'10%',left:'83%',op:0.85,r:-25},
  {src:starBlack,size:50,top:'20%',left:'76%',op:0.72,r:48},
  {src:starCoral,size:62,top:'28%',left:'8%', op:0.85,r:-12},
  {src:starTeal, size:54,top:'40%',left:'87%',op:0.80,r:60},
  {src:starBlack,size:46,top:'50%',left:'4%', op:0.68,r:-44},
  {src:starCoral,size:58,top:'56%',left:'76%',op:0.78,r:10},
])}
<div class="bottom">
  <h1 class="ar">تنفّسي بعمق…<br/>واستمتعي باللحظة</h1>
  <p class="sub en">Breathe deep. Live the moment.</p>
  <div class="cta">اطلبي الآن على moonyswim.com ✦</div>
  <div class="logo-wrap" style="margin-top:8px;">
    <img class="logo-star" src="${starCoral}" style="opacity:1;"/>
    <span class="logo-word">moony</span>
  </div>
</div>
</div></body></html>`},
];

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox','--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width:1080, height:1350, deviceScaleFactor:2 });

  for (const ad of ads) {
    console.log(`Rendering ${ad.name}...`);
    await page.setContent(ad.html, { waitUntil:'domcontentloaded', timeout:60000 });
    await new Promise(r => setTimeout(r, 5000));
    const outPath = path.join(OUT, `${ad.name}.jpg`);
    await page.screenshot({ path:outPath, type:'jpeg', quality:95 });
    console.log(`  ✓ ${outPath}`);
  }

  await browser.close();
  console.log('All 5 done!');
})();
