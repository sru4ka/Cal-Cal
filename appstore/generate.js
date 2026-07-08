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
  },
  {
    n: 2, frame: 'f_3.0.png', pad: '#3a3a30',
    headline: 'Just snap<br>your food',
    sub: 'The AI food scanner reads your plate — any dish, any cuisine',
  },
  {
    n: 3, frame: 'f_6.4.png', pad: '#EDEDEE',
    headline: 'Calories & macros<br>in seconds',
    sub: 'Protein, carbs & fat — fix anything with a tap',
  },
  {
    n: 4, frame: 'f_0.5.png', pad: '#7E8E86',
    headline: 'Six ways to log<br>any food',
    sub: 'Photo scan · barcode · describe it · saved meals · manual · exercise',
  },
  {
    n: 5, frame: 'f_8.4.png', pad: '#CEE9DC',
    headline: 'Your AI<br>nutrition coach',
    sub: 'Knows what’s left in your day — and tells you what to eat next',
    coachZoom: true,
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
  .scene{position:absolute;left:50%;transform:translateX(-50%);bottom:-8px;}
  .phone{width:1054px;background:#0d0f0e;border-radius:120px;padding:22px;
         box-shadow:0 60px 140px rgba(10,40,25,.30);}
  .screen{border-radius:100px;overflow:hidden;position:relative;background:#F5F5F7;}
  .screen .pad{height:118px;background:var(--pad);}
  .screen img{width:100%;display:block;}
  .notch{position:absolute;top:26px;left:50%;transform:translateX(-50%);width:290px;height:72px;
         background:#0d0f0e;border-radius:44px;}
  .coach-callout{position:absolute;left:50%;transform:translateX(-50%) rotate(-2deg);top:1210px;width:1060px;background:#fff;border-radius:56px;
        box-shadow:0 50px 120px rgba(0,0,0,.28);padding:44px 52px;display:flex;gap:36px;align-items:flex-start;
        border:3px solid #E5E8EA;}
  .coach-callout img.av{width:150px;height:150px;flex:none;}
  .coach-callout .t{font-size:50px;line-height:1.35;color:#121714;font-weight:600;}
  .coach-callout .t b{display:block;color:#0D9E52;font-size:38px;font-weight:800;letter-spacing:.04em;margin-bottom:10px;}
  </style></head><body style="--pad:${p.pad || '#F5F5F7'}">
  <div class="glow"></div>
  <div class="head">
    <h1>${p.headline}</h1>
    ${p.pill ? `<div class="pill">${p.pill}</div>` : ''}
    ${p.sub ? `<div class="sub">${p.sub}</div>` : ''}
  </div>
  <div class="scene">
    <div class="phone"><div class="screen">
      <div class="pad"></div>
      <img src="file://${S}/frames/${p.frame}">
      <div class="notch"></div>
    </div></div>
    ${p.coachZoom ? `
    <div class="coach-callout">
      <img class="av" src="file:///home/user/Cal-Cal/img/coach.png">
      <div class="t"><b>COACH</b>You’re 104g protein short. Add chicken, Greek yogurt, or a shake.</div>
    </div>` : ''}
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
