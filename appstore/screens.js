// Recreate 5 app screens in HTML at 1080x2228 (540x1114 @2x), faithful to the app's design
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const S = __dirname;

const CSS = `
@font-face { font-family:'Inter'; src:url('file://${S}/Inter.ttf'); font-weight:100 900; }
*{margin:0;padding:0;box-sizing:border-box}
body{width:540px;height:1114px;font-family:'Inter',sans-serif;background:#F5F5F7;color:#121714;overflow:hidden;position:relative}
body.mint{background:linear-gradient(#CEE9DC, #EDF4EF 120px, #F5F5F7 240px)}
.page{padding:14px 16px 0}
.apphead{display:flex;align-items:center;justify-content:space-between;padding:6px 2px 10px}
.apphead .l{display:flex;gap:10px;align-items:center}
.apphead img{width:40px;height:40px}
.apphead .t{font-size:21px;font-weight:800;letter-spacing:-.02em}
.apphead .t small{display:block;font-size:12px;font-weight:600;color:#6a7370}
.flamepill{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.85);border:1px solid #E5E8EA;border-radius:999px;padding:6px 13px;font-size:15px;font-weight:800}
.flamepill img{width:18px;height:18px}
.card{background:#fff;border:1px solid #E9ECEE;border-radius:22px;box-shadow:0 3px 10px rgba(0,0,0,.035);padding:16px;margin-bottom:12px}
.h{font-size:16px;font-weight:700}
.sub2{font-size:12.5px;color:#858C8A;font-weight:500}
.row{display:flex;align-items:center;justify-content:space-between}
.grid2{display:flex;gap:12px;margin-bottom:12px}
.grid2 .card{flex:1;margin-bottom:0}
.big{font-size:30px;font-weight:800;letter-spacing:-.02em}
.tabbar{position:absolute;left:12px;right:12px;bottom:14px;height:64px;background:rgba(255,255,255,.96);border:1px solid #E9ECEE;border-radius:32px;display:flex;align-items:center;justify-content:space-around;box-shadow:0 8px 26px rgba(0,0,0,.08)}
.tab{font-size:9.5px;font-weight:600;color:#9aa39f;text-align:center;width:64px}
.tab svg{width:22px;height:22px;margin:0 auto 2px;display:block}
.tab.on{color:#0D9E52}
.plus{width:46px;height:46px;border-radius:50%;background:#121714;display:flex;align-items:center;justify-content:center;color:#fff;font-size:26px;margin-top:-2px}
.screentitle{font-size:26px;font-weight:800;letter-spacing:-.02em;padding:8px 2px 14px}
.greenbtn{background:#19CC6B;color:#fff;border-radius:16px;height:52px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700}
`;

const TABBAR = (active) => `
<div class="tabbar">
  <div class="tab ${active==='home'?'on':''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V21H3z"/></svg>Home</div>
  <div class="tab ${active==='progress'?'on':''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>Progress</div>
  <div class="plus">+</div>
  <div class="tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 10h12M10 6.5h.01M10 13.5h.01"/></svg>Fridge</div>
  <div class="tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-3.6 4.5-5.5 8-5.5s6.5 1.9 8 5.5"/></svg>Profile</div>
</div>`;

const APPHEAD = `
<div class="apphead">
  <div class="l"><img src="file://${S}/assets/app_icon_bright.png" style="border-radius:11px">
    <div class="t">Cal Cal<small>Sunday, Jul 5</small></div></div>
  <div class="flamepill"><img src="file://${S}/assets/streak_flame.png"> 4</div>
</div>`;

const SCREENS = {

// ============ 6. PROGRESS TAB ============
progress: { bodyClass:'mint', html: `
<div class="page">
${APPHEAD}
<div class="screentitle">Progress</div>
<div class="grid2">
  <div class="card" style="text-align:center">
    <img src="file://${S}/assets/streak_flame.png" style="width:34px;margin-bottom:4px">
    <div class="big">4</div><div class="sub2">Day Streak</div>
  </div>
  <div class="card" style="text-align:center">
    <div style="font-size:30px;margin-bottom:4px">🏅</div>
    <div class="big">6</div><div class="sub2">Badges Earned</div>
  </div>
</div>
<div class="card">
  <div class="sub2" style="font-weight:600">Current Weight</div>
  <div class="row" style="margin-top:4px">
    <div class="big" style="font-size:38px">196.6 <span style="font-size:19px;color:#858C8A">lb</span></div>
    <div style="background:rgba(25,204,107,.12);color:#0D9E52;font-weight:800;font-size:13.5px;padding:7px 13px;border-radius:999px">▼ 15.4 lb</div>
  </div>
  <div class="sub2" style="margin-top:6px">Logged Sunday, Jul 5 · was 198.2 lb on Jun 28</div>
  <div class="row" style="margin-top:12px;font-size:12.5px;color:#858C8A;font-weight:600">
    <span>Start: 212 lb</span><span>Goal: 185 lb</span>
  </div>
  <div style="height:8px;background:#EEF1F0;border-radius:99px;margin-top:8px;position:relative">
    <div style="position:absolute;inset:0;width:57%;background:linear-gradient(90deg,#19CC6B,#0D9E52);border-radius:99px"></div>
  </div>
  <div style="display:flex;gap:8px;align-items:center;margin-top:12px;background:#F2FBF6;border:1px solid #D6F2E2;border-radius:14px;padding:10px 13px;font-size:13px;font-weight:600">
    🎯 At this pace, you'll hit 185 lb around Oct 12
  </div>
</div>
<div class="card">
  <div class="row"><div class="h">Weight Progress</div>
  <div style="background:rgba(25,204,107,.12);color:#0D9E52;font-weight:800;font-size:12.5px;padding:6px 11px;border-radius:999px">57% of goal</div></div>
  <svg viewBox="0 0 480 190" style="width:100%;margin-top:10px">
    <line x1="0" y1="168" x2="480" y2="168" stroke="#E5E8EA" stroke-width="1.5" stroke-dasharray="6 5"/>
    <text x="474" y="160" font-size="12" fill="#858C8A" text-anchor="end" font-family="Inter">Goal 185</text>
    <line x1="0" y1="120" x2="480" y2="120" stroke="#F0F2F3" stroke-width="1"/>
    <line x1="0" y1="70" x2="480" y2="70" stroke="#F0F2F3" stroke-width="1"/>
    <path d="M10,26 L60,34 L110,30 L160,48 L210,44 L260,62 L310,58 L360,76 L410,84 L460,92"
          fill="none" stroke="#19CC6B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,26 L60,34 L110,30 L160,48 L210,44 L260,62 L310,58 L360,76 L410,84 L460,92 L460,168 L10,168 Z"
          fill="rgba(25,204,107,.09)" stroke="none"/>
    <circle cx="460" cy="92" r="7" fill="#fff" stroke="#0D9E52" stroke-width="3.5"/>
    <text x="24" y="186" font-size="11.5" fill="#858C8A" font-family="Inter">May</text>
    <text x="230" y="186" font-size="11.5" fill="#858C8A" font-family="Inter">Jun</text>
    <text x="440" y="186" font-size="11.5" fill="#858C8A" font-family="Inter">Jul</text>
  </svg>
</div>
<div class="card">
  <div class="row"><div class="h">Your Transformation</div>
  <div style="background:rgba(25,204,107,.12);color:#0D9E52;font-weight:800;font-size:12.5px;padding:6px 11px;border-radius:999px">▼ 15.4 lb so far</div></div>
  <div style="display:flex;gap:10px;margin-top:12px">
    <div style="flex:1;background:linear-gradient(180deg,#F3F6F4,#E9EFEA);border-radius:18px;padding:12px 8px;text-align:center">
      <svg viewBox="0 0 100 150" style="height:120px"><circle cx="50" cy="22" r="15" fill="#B9C8BF"/><path d="M50 40 C16 40 20 70 20 95 L28 148 L72 148 L80 95 C80 70 84 40 50 40 Z" fill="#B9C8BF"/></svg>
      <div style="font-size:16px;font-weight:800;margin-top:6px">212 lb</div>
      <div class="sub2">Before · Mar 2</div>
    </div>
    <div style="display:flex;align-items:center;font-size:22px;color:#0D9E52;font-weight:800">→</div>
    <div style="flex:1;background:linear-gradient(180deg,#EAF9F0,#DCF3E5);border-radius:18px;padding:12px 8px;text-align:center;border:2px solid #19CC6B">
      <svg viewBox="0 0 100 150" style="height:120px"><circle cx="50" cy="22" r="15" fill="#B9C8BF"/><path d="M50 40 C28 40 32 70 32 95 L37 148 L63 148 L68 95 C68 70 72 40 50 40 Z" fill="#B9C8BF"/></svg>
      <div style="font-size:16px;font-weight:800;margin-top:6px;color:#0D9E52">196.6 lb</div>
      <div class="sub2">Today · Jul 5</div>
    </div>
  </div>
</div>
</div>
${TABBAR('progress')}`},

// ============ 7. PLAN REVEAL ============
plan: { bodyClass:'', html: `
<div style="position:absolute;inset:0;background:linear-gradient(180deg,#DFF4E7, #F5F5F7 340px)"></div>
${[[40,90,'#19CC6B'],[500,60,'#F7A32E'],[80,240,'#4D8FF2'],[470,210,'#F2596B'],[260,40,'#F7A32E'],[180,120,'#19CC6B'],[420,140,'#19CC6B'],[330,80,'#F2596B']].map(c=>
  `<div style="position:absolute;left:${c[0]}px;top:${c[1]}px;width:10px;height:10px;border-radius:3px;background:${c[2]};opacity:.55;transform:rotate(${(c[0]*7)%80}deg)"></div>`).join('')}
<div class="page" style="position:relative;padding-top:26px">
<div style="text-align:center">
  <img src="file://${S}/assets/coach.png" style="width:92px;margin-bottom:8px">
  <div style="display:inline-block;background:rgba(25,204,107,.15);color:#0D9E52;font-size:12px;font-weight:800;letter-spacing:.08em;padding:6px 14px;border-radius:999px;margin-bottom:8px">YOUR PLAN IS READY 🎉</div>
  <div style="font-size:27px;font-weight:800;letter-spacing:-.02em;line-height:1.12">Your daily<br>recommendation</div>
</div>

<div class="card" style="margin-top:16px;padding:18px">
  <div style="display:flex;align-items:center;gap:16px">
    <div style="position:relative;width:118px;height:118px;flex:none">
      <div style="width:118px;height:118px;border-radius:50%;background:conic-gradient(#19CC6B 0 270deg,#E2EFE7 270deg 360deg)"></div>
      <div style="position:absolute;inset:11px;border-radius:50%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div style="font-size:25px;font-weight:800;letter-spacing:-.02em">3,405</div>
        <div style="font-size:10.5px;color:#858C8A;font-weight:700">KCAL / DAY</div>
      </div>
    </div>
    <div style="flex:1">
      <div style="font-size:15px;font-weight:800">Calories to build muscle</div>
      <div class="sub2" style="margin-top:3px">Based on your goal, body and activity. Edit anytime.</div>
      <div style="display:flex;gap:6px;margin-top:9px">
        <div style="background:#F3F5F4;border-radius:999px;padding:5px 10px;font-size:11px;font-weight:700">28 yrs</div>
        <div style="background:#F3F5F4;border-radius:999px;padding:5px 10px;font-size:11px;font-weight:700">6'1"</div>
        <div style="background:#F3F5F4;border-radius:999px;padding:5px 10px;font-size:11px;font-weight:700">Very active</div>
      </div>
    </div>
  </div>
  <div style="display:flex;gap:9px;margin-top:16px">
    ${[['Protein','136g','#F2596B','76'],['Carbs','272g','#F7A32E','93'],['Fat','71g','#4D8FF2','85']].map(m=>`
    <div style="flex:1;background:#F8FAF9;border:1px solid #EDF0EE;border-radius:16px;padding:11px 6px;text-align:center">
      <div style="position:relative;width:56px;height:56px;margin:0 auto">
        <div style="width:56px;height:56px;border-radius:50%;background:conic-gradient(${m[2]} 0 ${Math.round(m[3]*3.6)}deg,#E9EDEB ${Math.round(m[3]*3.6)}deg 360deg)"></div>
        <div style="position:absolute;inset:6px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:13.5px;font-weight:800">${m[1]}</div>
      </div>
      <div style="font-size:11.5px;font-weight:800;color:${m[2]};margin-top:5px">${m[0]}</div>
    </div>`).join('')}
  </div>
</div>

<div class="card">
  <div class="row"><div class="h" style="font-size:15px">Your journey to 185 lb</div>
  <div style="background:rgba(25,204,107,.12);color:#0D9E52;font-size:11.5px;font-weight:800;padding:5px 10px;border-radius:999px">14 weeks</div></div>
  <svg viewBox="0 0 480 150" style="width:100%;margin-top:8px">
    <path d="M20,30 C140,34 260,70 460,118" fill="none" stroke="#19CC6B" stroke-width="5" stroke-linecap="round"/>
    <path d="M20,30 C140,34 260,70 460,118 L460,150 L20,150 Z" fill="rgba(25,204,107,.10)"/>
    <circle cx="20" cy="30" r="9" fill="#fff" stroke="#B9C8BF" stroke-width="4"/>
    <circle cx="460" cy="118" r="10" fill="#fff" stroke="#0D9E52" stroke-width="5"/>
    <text x="20" y="66" font-size="15" font-weight="800" fill="#121714" font-family="Inter">212 lb</text>
    <text x="20" y="84" font-size="11" fill="#858C8A" font-family="Inter">Today</text>
    <text x="460" y="88" font-size="15" font-weight="800" fill="#0D9E52" text-anchor="end" font-family="Inter">185 lb</text>
    <text x="460" y="106" font-size="11" fill="#858C8A" text-anchor="end" font-family="Inter">Oct 12</text>
  </svg>
</div>

<div class="card" style="background:#F2FBF6;border-color:#D6F2E2;display:flex;gap:12px;align-items:center;padding:14px 16px">
  <div style="font-size:24px">🎯</div>
  <div style="font-size:14.5px;font-weight:700;line-height:1.4">You should reach <span style="color:#0D9E52">185 lb by October 12</span> at a healthy, sustainable pace</div>
</div>

<div class="greenbtn" style="box-shadow:0 12px 28px rgba(25,204,107,.4)">Let's get started</div>
<div class="sub2" style="text-align:center;margin-top:8px">You can adjust everything later in Settings</div>
</div>`},

// ============ 8. BARCODE ============
barcode: { bodyClass:'', html: `
<div style="position:absolute;inset:0;background:
  radial-gradient(120% 70% at 50% 0%, #3a4038, #232622 55%, #171916);"></div>
<div style="position:absolute;top:22px;left:22px;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px">✕</div>
<div style="position:absolute;top:30px;left:0;right:0;text-align:center;color:#fff;font-weight:700;font-size:16px">Log lunch ▾</div>

<div style="position:absolute;top:170px;left:50%;transform:translateX(-50%);width:400px;height:400px">
  <div style="position:absolute;inset:0;border-radius:36px;box-shadow:0 0 0 2000px rgba(0,0,0,.25)"></div>
  <div style="position:absolute;top:-3px;left:-3px;width:70px;height:70px;border-top:5px solid #fff;border-left:5px solid #fff;border-top-left-radius:36px"></div>
  <div style="position:absolute;top:-3px;right:-3px;width:70px;height:70px;border-top:5px solid #fff;border-right:5px solid #fff;border-top-right-radius:36px"></div>
  <div style="position:absolute;bottom:-3px;left:-3px;width:70px;height:70px;border-bottom:5px solid #fff;border-left:5px solid #fff;border-bottom-left-radius:36px"></div>
  <div style="position:absolute;bottom:-3px;right:-3px;width:70px;height:70px;border-bottom:5px solid #fff;border-right:5px solid #fff;border-bottom-right-radius:36px"></div>
  <div style="position:absolute;left:24px;right:24px;top:110px;background:#f5efe2;border-radius:18px;padding:26px 30px;box-shadow:0 16px 40px rgba(0,0,0,.4);transform:rotate(-3deg)">
    <div style="font-size:13px;font-weight:800;color:#6b5d40;letter-spacing:.08em;margin-bottom:12px">PROTEIN BAR · VANILLA</div>
    <svg viewBox="0 0 300 80" style="width:100%">
      ${Array.from({length:44},(_,i)=>{const w=[2,4,2,6,3,2,5,2,3,4][i%10];const x=6+i*6.6;return `<rect x="${x}" y="0" width="${w*0.8}" height="62" fill="#221d14"/>`}).join('')}
      <text x="150" y="78" font-size="13" fill="#221d14" text-anchor="middle" font-family="Inter" font-weight="600">0 41220 88472 5</text>
    </svg>
  </div>
  <div style="position:absolute;left:14px;right:14px;top:198px;height:3px;background:linear-gradient(90deg,transparent,#19CC6B,transparent);box-shadow:0 0 18px #19CC6B"></div>
</div>

<div style="position:absolute;left:20px;right:20px;bottom:210px;background:#fff;border-radius:24px;padding:18px 20px;box-shadow:0 24px 60px rgba(0,0,0,.45)">
  <div class="row">
    <div>
      <div style="font-size:17px;font-weight:800">Vanilla Protein Bar</div>
      <div class="sub2" style="margin-top:2px">Found instantly · 1 bar (52 g)</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:22px;font-weight:800;color:#0D9E52">210</div>
      <div class="sub2">cal</div>
    </div>
  </div>
  <div style="display:flex;gap:8px;margin-top:12px">
    <div style="flex:1;text-align:center;background:#FDF1F2;border-radius:12px;padding:8px 0;font-size:13px;font-weight:700;color:#F2596B">20g protein</div>
    <div style="flex:1;text-align:center;background:#FEF6EA;border-radius:12px;padding:8px 0;font-size:13px;font-weight:700;color:#D98A18">18g carbs</div>
    <div style="flex:1;text-align:center;background:#EEF4FE;border-radius:12px;padding:8px 0;font-size:13px;font-weight:700;color:#4D8FF2">7g fat</div>
  </div>
  <div class="greenbtn" style="margin-top:14px;height:48px">Log This Food</div>
</div>

<div style="position:absolute;bottom:120px;left:0;right:0;display:flex;justify-content:center;gap:10px">
  <div style="color:#cfd6d0;font-size:14px;font-weight:600;padding:10px 18px">Scan Food</div>
  <div style="background:#fff;color:#121714;font-size:14px;font-weight:800;padding:10px 18px;border-radius:999px">Barcode</div>
  <div style="color:#cfd6d0;font-size:14px;font-weight:600;padding:10px 18px">Food label</div>
</div>
<div style="position:absolute;bottom:34px;left:50%;transform:translateX(-50%);width:64px;height:64px;border-radius:50%;background:#fff;box-shadow:0 0 0 5px rgba(255,255,255,.35)"></div>`},

// ============ 9. WATER & HEALTH ============
health: { bodyClass:'mint', html: `
<div class="page">
${APPHEAD}
<div class="card" style="display:flex;align-items:center;gap:16px">
  <svg width="92" height="92" viewBox="0 0 92 92" style="flex:none;transform:rotate(-90deg)">
    <circle cx="46" cy="46" r="38" fill="none" stroke="#EEF1F0" stroke-width="10"/>
    <circle cx="46" cy="46" r="38" fill="none" stroke="#19CC6B" stroke-width="10" stroke-linecap="round" stroke-dasharray="239" stroke-dashoffset="48"/>
  </svg>
  <div style="flex:1">
    <div class="row"><div class="h">Health Score</div><div style="font-size:17px;font-weight:800;color:#0D9E52">8/10</div></div>
    <div class="sub2" style="margin-top:4px;line-height:1.45">Great protein and hydration today. A short walk would make it a 9.</div>
  </div>
</div>
<div class="card">
  <div class="row">
    <div style="display:flex;gap:10px;align-items:center">
      <div style="width:38px;height:38px;border-radius:12px;background:#FDF1F2;display:flex;align-items:center;justify-content:center;font-size:19px">❤️</div>
      <div><div class="h" style="font-size:15px">Apple Health</div><div class="sub2">Connected · syncing steps &amp; workouts</div></div>
    </div>
    <div style="color:#0D9E52;font-size:19px">✓</div>
  </div>
  <div style="display:flex;gap:10px;margin-top:14px">
    <div style="flex:1;background:#F7F9F8;border-radius:14px;padding:12px;text-align:center">
      <div style="font-size:22px;font-weight:800">8,432</div><div class="sub2">steps</div>
    </div>
    <div style="flex:1;background:#F7F9F8;border-radius:14px;padding:12px;text-align:center">
      <div style="font-size:22px;font-weight:800">412</div><div class="sub2">active cal</div>
    </div>
    <div style="flex:1;background:#F7F9F8;border-radius:14px;padding:12px;text-align:center">
      <div style="font-size:22px;font-weight:800">+280</div><div class="sub2">earned back</div>
    </div>
  </div>
</div>
<div class="card">
  <div class="row"><div class="h">Water</div><div class="sub2" style="font-weight:700">1,500 / 2,000 ml</div></div>
  <div style="display:flex;gap:9px;margin-top:14px">
    ${Array.from({length:8},(_,i)=>`
    <div style="flex:1;aspect-ratio:.82;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:21px;
      ${i<6?'background:linear-gradient(180deg,#DFF1FB,#BFE3F7);border:1.5px solid #A8D8F2':'background:#F5F7F8;border:1.5px dashed #D5DBDE;opacity:.6'}">💧</div>`).join('')}
  </div>
  <div class="sub2" style="margin-top:10px">6 of 8 cups. Tap a cup to log</div>
</div>
<div class="card">
  <div class="row">
    <div style="display:flex;gap:10px;align-items:center">
      <div style="width:38px;height:38px;border-radius:12px;background:#EAF7EE;display:flex;align-items:center;justify-content:center;font-size:19px">🏃</div>
      <div><div class="h" style="font-size:15px">Evening Run</div><div class="sub2">25 min · logged 6:40 PM</div></div>
    </div>
    <div style="font-size:15px;font-weight:800;color:#0D9E52">280 cal</div>
  </div>
</div>
</div>
${TABBAR('home')}`},

// ============ 10. MILESTONES ============
milestones: { bodyClass:'mint', html: `
<div class="page">
${APPHEAD}
<div class="row" style="padding:6px 2px 12px">
  <div class="screentitle" style="padding:0">Milestones</div>
  <div style="background:#fff;border:1px solid #E9ECEE;border-radius:999px;padding:8px 14px;font-size:13.5px;font-weight:800">6<span style="color:#858C8A">/24</span> earned</div>
</div>
${(() => {
  const cell = (img, title, detail, locked) => `
    <div style="background:#fff;border:1px solid #E9ECEE;border-radius:18px;padding:12px 6px 10px;text-align:center;${locked?'opacity:.5':''}">
      <img src="file://${S}/assets/${img}.png" style="width:78px;height:78px;${locked?'filter:grayscale(1)':''}">
      <div style="font-size:12px;font-weight:800;margin-top:6px">${title}</div>
      <div style="font-size:10.5px;color:#858C8A;font-weight:600;margin-top:1px">${detail}</div>
    </div>`;
  const rows = [
    [ ['badge_s3','Rookie','3-day streak',0], ['badge_m1','First Bite','Log 1 meal',0], ['badge_photo','Say Cheese','First photo scan',0] ],
    [ ['badge_m5','Forking Around','Log 5 meals',0], ['badge_m10','Snack Attack','Log 10 meals',0], ['badge_w1','Step on the Scale','Log weight once',0] ],
    [ ['badge_locked','On a Roll','7-day streak',1], ['badge_locked','Getting Serious','10-day streak',1], ['badge_locked','Quarter Century','Log 25 meals',1] ],
    [ ['badge_locked','Trend Setter','Log weight 5x',1], ['badge_locked','First Drop','Log water once',1], ['badge_locked','Committed','21-day streak',1] ],
  ];
  return rows.map(r=>`<div style="display:flex;gap:9px;margin-bottom:9px">${r.map(c=>`<div style="flex:1">${cell(...c)}</div>`).join('')}</div>`).join('');
})()}
</div>
${TABBAR('progress')}`},
};

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 540, height: 1114 }, deviceScaleFactor: 2 });
  for (const [name, s] of Object.entries(SCREENS)) {
    const f = path.join(S, `screen_${name}.html`);
    fs.writeFileSync(f, `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body class="${s.bodyClass}">${s.html}</body></html>`);
    await page.goto('file://' + f);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(S, 'frames', `gen_${name}.png`) });
    console.log('screen', name);
  }
  await browser.close();
})();
