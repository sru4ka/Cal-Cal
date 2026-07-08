// App Store screenshot panel generator — 1320x2868 (6.9" iPhone)
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const S = __dirname;
const OUT = path.join(S, 'appstore');
fs.mkdirSync(OUT, { recursive: true });

const PANELS = [
  {
    n: 1, frame: 'f_8.4.png', pad: '#CEE9DC',
    headline: 'Track calories<br>with a photo',
    pill: 'AI CALORIE TRACKER & MACRO COUNTER',
    overlay: `<div class="pop" style="top:880px;width:1000px;transform:translateX(-50%) rotate(-2deg)"><div class="cap">MACROS TODAY</div><div class="ringrow"><div class="ringcell">
        <div class="cring"><div style="width:190px;height:190px;border-radius:50%;background:conic-gradient(#F2596B 0 276deg,#F8DEE1 276deg 360deg)"></div>
        <div class="in"><span style="font-size:44px">104g</span><span style="font-size:26px;color:#858C8A;font-weight:700">/136</span></div></div>
        <div class="lbl" style="color:#F2596B">Protein</div>
      </div><div class="ringcell">
        <div class="cring"><div style="width:190px;height:190px;border-radius:50%;background:conic-gradient(#F7A32E 0 336deg,#FBEBD2 336deg 360deg)"></div>
        <div class="in"><span style="font-size:44px">254g</span><span style="font-size:26px;color:#858C8A;font-weight:700">/272</span></div></div>
        <div class="lbl" style="color:#F7A32E">Carbs</div>
      </div><div class="ringcell">
        <div class="cring"><div style="width:190px;height:190px;border-radius:50%;background:conic-gradient(#4D8FF2 0 305deg,#DCE8FB 305deg 360deg)"></div>
        <div class="in"><span style="font-size:44px">60g</span><span style="font-size:26px;color:#858C8A;font-weight:700">/71</span></div></div>
        <div class="lbl" style="color:#4D8FF2">Fat</div>
      </div></div></div>`,
  },
  {
    n: 2, frame: 'gen_scan.png', noPad: true,
    headline: 'Just snap<br>your food',
    sub: 'The AI food scanner reads your plate. Any dish, any cuisine',
  },
  {
    n: 3, frame: 'gen_result.png', noPad: true,
    headline: 'Calories & macros<br>in seconds',
    sub: 'Protein, carbs & fat. Fix anything with a tap',
    overlay: `<div class="pop" style="top:1030px;width:1010px;transform:translateX(-50%) rotate(2deg);padding:38px 42px"><div class="cap">FULL MACRO BREAKDOWN</div><div style="display:flex;gap:20px"><div style="flex:1;text-align:center;background:#FDF1F2;color:#F2596B;border-radius:26px;padding:34px 0;font-size:38px;font-weight:800">🍗 38g<br><span style="font-size:24px;letter-spacing:.06em">PROTEIN</span></div><div style="flex:1;text-align:center;background:#FEF6EA;color:#D98A18;border-radius:26px;padding:34px 0;font-size:38px;font-weight:800">🌾 32g<br><span style="font-size:24px;letter-spacing:.06em">CARBS</span></div><div style="flex:1;text-align:center;background:#EEF4FE;color:#4D8FF2;border-radius:26px;padding:34px 0;font-size:38px;font-weight:800">💧 26g<br><span style="font-size:24px;letter-spacing:.06em">FAT</span></div></div></div>`,
  },
  {
    n: 4, frame: 'gen_fridge.png', pad: '#CEE9DC',
    headline: 'Turn your fridge<br>into dinner',
    sub: 'Snap your fridge. AI suggests meals that fit your remaining calories',
  },
  {
    n: 5, frame: 'f_8.4.png', pad: '#CEE9DC',
    headline: 'Your AI<br>nutrition coach',
    sub: 'It knows what’s left in your day and tells you what to eat next',
    coachZoom: true,
  },
  {
    n: 6, frame: 'gen_progress.png', pad: '#CEE9DC',
    headline: 'Watch the weight<br>come off',
    sub: 'Weight trend, streaks and charts, synced with Apple Health',
  },
  {
    n: 7, frame: 'gen_plan.png', pad: '#F5F5F7',
    headline: 'A calorie plan<br>built for you',
    sub: 'Answer a few questions to get your daily calories, macros & goal date',
  },
  {
    n: 8, frame: 'gen_barcode2.png', noPad: true,
    headline: 'Instant barcode<br>scanner',
    sub: 'Millions of packaged foods. Exact nutrition in one scan',
  },
  {
    n: 9, frame: 'gen_health.png', pad: '#CEE9DC',
    headline: 'More than<br>calories',
    sub: 'Water, steps, workouts & a daily health score',
    overlay: `<div class="pop" style="top:1060px;width:1010px;transform:translateX(-50%) rotate(-2deg);padding:40px 44px"><div class="cap" style="color:#3D9BD6">WATER · 1,500 / 2,000 ML</div><div style="display:flex;gap:16px"><div style="flex:1;aspect-ratio:.84;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:52px;background:linear-gradient(180deg,#DFF1FB,#BFE3F7);border:3px solid #A8D8F2">💧</div><div style="flex:1;aspect-ratio:.84;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:52px;background:linear-gradient(180deg,#DFF1FB,#BFE3F7);border:3px solid #A8D8F2">💧</div><div style="flex:1;aspect-ratio:.84;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:52px;background:linear-gradient(180deg,#DFF1FB,#BFE3F7);border:3px solid #A8D8F2">💧</div><div style="flex:1;aspect-ratio:.84;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:52px;background:linear-gradient(180deg,#DFF1FB,#BFE3F7);border:3px solid #A8D8F2">💧</div><div style="flex:1;aspect-ratio:.84;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:52px;background:linear-gradient(180deg,#DFF1FB,#BFE3F7);border:3px solid #A8D8F2">💧</div><div style="flex:1;aspect-ratio:.84;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:52px;background:linear-gradient(180deg,#DFF1FB,#BFE3F7);border:3px solid #A8D8F2">💧</div><div style="flex:1;aspect-ratio:.84;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:52px;background:#F5F7F8;border:3px dashed #D5DBDE;opacity:.55">💧</div><div style="flex:1;aspect-ratio:.84;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:52px;background:#F5F7F8;border:3px dashed #D5DBDE;opacity:.55">💧</div></div><div style="text-align:center;font-size:28px;font-weight:700;color:#858C8A;margin-top:24px">6 of 8 cups. Tap a cup to log</div></div>`,
  },
  {
    n: 10, frame: 'gen_milestones.png', pad: '#CEE9DC',
    headline: 'Stay consistent,<br>hit your goal',
    sub: 'Streaks, badges & milestones keep you motivated',
  },
  {
    n: 11, frame: 'f_0.5.png', pad: '#7E8E86',
    headline: 'Add food<br>your way',
    sub: 'Scan a meal, search food, saved & recent, or log exercise. Six ways to log in total',
  },
];

function html(p) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  @font-face { font-family:'Inter'; src:url('file://${S}/Inter.ttf'); font-weight:100 900; }
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1320px;height:2868px;font-family:'Inter',sans-serif;position:relative;overflow:hidden;
       background:#F5F5F7;}
  .glow{position:absolute;width:1800px;height:1800px;border-radius:50%;left:50%;top:-600px;transform:translateX(-50%);
        background:radial-gradient(closest-side, rgba(25,204,107,.07), transparent);}
  .head{position:relative;text-align:center;padding:150px 80px 0;}
  h1{font-size:128px;font-weight:800;letter-spacing:-.025em;line-height:1.06;color:#121714;}
  .pill{display:inline-block;margin-top:56px;background:linear-gradient(135deg,#19CC6B,#0D9E52);color:#fff;
        font-size:44px;font-weight:800;letter-spacing:.06em;padding:26px 60px;border-radius:80px;
        box-shadow:0 20px 50px rgba(25,204,107,.35);}
  .sub{margin-top:44px;font-size:52px;font-weight:500;color:#6a7370;line-height:1.35;padding:0 60px;}
  .scene{position:absolute;left:50%;transform:translateX(-50%);bottom:96px;}
  .phone{width:920px;background:#0d0f0e;border-radius:120px;padding:22px;
         box-shadow:0 60px 140px rgba(10,40,25,.30);}
  .screen{border-radius:92px;overflow:hidden;position:relative;background:#F5F5F7;height:1925px;}
  .screen .pad{height:118px;background:var(--pad);}
  .screen img{width:100%;display:block;} .screen.nopad img{width:100%;height:100%;object-fit:cover;}
  .notch{position:absolute;top:26px;left:50%;transform:translateX(-50%);width:290px;height:72px;
         background:#0d0f0e;border-radius:44px;}
  .coach-callout{position:absolute;left:50%;transform:translateX(-50%) rotate(-2deg);top:1120px;width:930px;background:#fff;border-radius:56px;
        box-shadow:0 50px 120px rgba(0,0,0,.28);padding:44px 52px;display:flex;gap:36px;align-items:flex-start;
        border:3px solid #E5E8EA;}
  .coach-callout img.av{width:130px;height:130px;flex:none;}
  .coach-callout .t{font-size:44px;line-height:1.35;color:#121714;font-weight:600;}
  .coach-callout .t b{display:block;color:#0D9E52;font-size:38px;font-weight:800;letter-spacing:.04em;margin-bottom:10px;}
  .pop{position:absolute;left:50%;background:#fff;border-radius:52px;box-shadow:0 50px 120px rgba(0,0,0,.30);
       border:3px solid #E5E8EA;padding:44px 50px;}
  .pop .cap{font-size:34px;font-weight:800;letter-spacing:.08em;color:#0D9E52;margin-bottom:26px;text-align:center;}
  .ringrow{display:flex;gap:44px;justify-content:center;}
  .ringcell{text-align:center;}
  .ringcell .lbl{font-size:30px;font-weight:800;margin-top:14px;}
  .cring{position:relative;width:190px;height:190px;margin:0 auto;}
  .cring .in{position:absolute;inset:20px;border-radius:50%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800;}
  </style></head><body style="--pad:${p.pad || '#F5F5F7'}">
  <div class="glow"></div>
  <div class="head">
    <h1>${p.headline}</h1>
    ${p.pill ? `<div class="pill">${p.pill}</div>` : ''}
    ${p.sub ? `<div class="sub">${p.sub}</div>` : ''}
  </div>
  <div class="scene">
    <div class="phone"><div class="screen ${p.noPad ? 'nopad' : ''}">
      ${p.noPad ? '' : '<div class=\"pad\"></div>'}
      <img src="file://${S}/frames/${p.frame}">
      <div class="notch"></div>
    </div></div>
    ${p.coachZoom ? `
    <div class="coach-callout">
      <img class="av" src="file:///home/user/Cal-Cal/img/coach.png">
      <div class="t"><b>COACH</b>You’re 104g protein short. Add chicken, Greek yogurt, or a shake.</div>
    </div>` : ''}
    ${p.overlay || ''}
  </div>
  </body></html>`;
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1320, height: 2868 } });
  for (const p of PANELS) {
    const f = path.join(S, `panel_${p.n}.html`);
    fs.writeFileSync(f, html(p));
    await page.goto('file://' + f);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, `calcal_${p.n}.png`) });
    console.log('rendered', p.n);
  }
  await browser.close();
})();
