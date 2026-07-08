// Scan / result / bright-barcode screens (540x1114 @2x = 1080x2228)
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const S = __dirname;

const CSS = `
@font-face { font-family:'Inter'; src:url('file://${S}/Inter.ttf'); font-weight:100 900; }
*{margin:0;padding:0;box-sizing:border-box}
body{width:540px;height:1114px;font-family:'Inter',sans-serif;background:#F5F5F7;color:#121714;overflow:hidden;position:relative}
.row{display:flex;align-items:center;justify-content:space-between}
.greenbtn{background:#19CC6B;color:#fff;border-radius:16px;height:52px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700}
.callout{position:absolute;background:#fff;border-radius:999px;padding:9px 17px;font-size:14.5px;font-weight:700;
         box-shadow:0 8px 26px rgba(0,0,0,.30);white-space:nowrap;z-index:3}
.dot{position:absolute;width:11px;height:11px;border-radius:50%;background:#fff;box-shadow:0 0 0 3.5px rgba(255,255,255,.45);z-index:2}
.line{position:absolute;background:#fff;height:2.5px;transform-origin:0 50%;z-index:2;box-shadow:0 1px 5px rgba(0,0,0,.25)}
.chip{border-radius:12px;padding:8px 0;font-size:13px;font-weight:700;flex:1;text-align:center}
`;

const SCREENS = {

// ============ SCAN — bright photo + AI callouts ============
scan: `
<div style="position:absolute;inset:0;background:url('file://${S}/assets/food_scan.jpg') center/cover"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.42),transparent 20%,transparent 62%,rgba(0,0,0,.55) 88%)"></div>

<div style="position:absolute;top:20px;left:18px;width:38px;height:38px;border-radius:50%;background:rgba(20,22,20,.45);color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px;backdrop-filter:blur(4px)">✕</div>
<div style="position:absolute;top:20px;right:18px;width:38px;height:38px;border-radius:50%;background:rgba(20,22,20,.45);color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700;backdrop-filter:blur(4px)">?</div>
<div style="position:absolute;top:28px;left:0;right:0;text-align:center;color:#fff;font-weight:800;font-size:17px;text-shadow:0 1px 8px rgba(0,0,0,.5)">🥑 Cal Cal</div>

<!-- scan frame corners -->
<div style="position:absolute;top:200px;left:60px;right:60px;bottom:420px">
  <div style="position:absolute;top:0;left:0;width:56px;height:56px;border-top:5px solid #fff;border-left:5px solid #fff;border-top-left-radius:26px;opacity:.95"></div>
  <div style="position:absolute;top:0;right:0;width:56px;height:56px;border-top:5px solid #fff;border-right:5px solid #fff;border-top-right-radius:26px;opacity:.95"></div>
  <div style="position:absolute;bottom:0;left:0;width:56px;height:56px;border-bottom:5px solid #fff;border-left:5px solid #fff;border-bottom-left-radius:26px;opacity:.95"></div>
  <div style="position:absolute;bottom:0;right:0;width:56px;height:56px;border-bottom:5px solid #fff;border-right:5px solid #fff;border-bottom-right-radius:26px;opacity:.95"></div>
</div>

<!-- AI ingredient callouts (Cal AI style) -->
<div class="dot" style="top:340px;left:195px"></div>
<div class="line" style="top:344px;left:200px;width:92px;transform:rotate(-42deg)"></div>
<div class="callout" style="top:252px;left:252px">Avocado</div>

<div class="dot" style="top:560px;left:258px"></div>
<div class="line" style="top:564px;left:140px;width:118px;transform:rotate(12deg)"></div>
<div class="callout" style="top:566px;left:16px">Teriyaki Salmon</div>

<div class="dot" style="top:318px;left:400px"></div>
<div class="line" style="top:322px;left:404px;width:64px;transform:rotate(38deg)"></div>
<div class="callout" style="top:362px;left:408px">Carrots</div>

<div class="dot" style="top:648px;left:118px"></div>
<div class="line" style="top:652px;left:123px;width:74px;transform:rotate(40deg)"></div>
<div class="callout" style="top:696px;left:140px">Red Cabbage</div>

<div class="dot" style="top:478px;left:452px"></div>
<div class="line" style="top:482px;left:396px;width:56px;transform:rotate(-28deg)"></div>
<div class="callout" style="top:494px;left:344px">Lime</div>

<!-- zoom chips -->
<div style="position:absolute;bottom:296px;left:0;right:0;display:flex;justify-content:center;gap:8px;align-items:center">
  <div style="color:#e8ece9;font-size:12px;font-weight:700;background:rgba(20,22,20,.4);border-radius:999px;padding:7px 12px">.5x</div>
  <div style="background:#fff;color:#121714;font-size:13px;font-weight:800;border-radius:999px;padding:9px 15px">1x</div>
  <div style="color:#e8ece9;font-size:12px;font-weight:700;background:rgba(20,22,20,.4);border-radius:999px;padding:7px 12px">2x</div>
</div>

<!-- mode toggles -->
<div style="position:absolute;bottom:212px;left:0;right:0;display:flex;justify-content:center;gap:10px">
  <div style="background:#fff;color:#121714;font-size:17px;font-weight:800;padding:15px 26px;border-radius:17px;display:flex;gap:8px;align-items:center">⌞⌝ Scan Food</div>
  <div style="background:rgba(20,22,20,.5);color:#f2f5f3;font-size:17px;font-weight:700;padding:15px 26px;border-radius:17px;backdrop-filter:blur(4px)">Barcode</div>
  <div style="background:rgba(20,22,20,.5);color:#f2f5f3;font-size:17px;font-weight:700;padding:15px 26px;border-radius:17px;backdrop-filter:blur(4px)">Food label</div>
</div>

<!-- shutter row -->
<div style="position:absolute;bottom:64px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:64px">
  <div style="width:44px;height:44px;border-radius:50%;background:rgba(20,22,20,.45);color:#fff;display:flex;align-items:center;justify-content:center;font-size:19px">⚡︎</div>
  <div style="width:78px;height:78px;border-radius:50%;background:#fff;box-shadow:0 0 0 6px rgba(255,255,255,.35)"></div>
  <div style="width:44px;height:44px;border-radius:50%;background:rgba(20,22,20,.45);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px">🖼️</div>
</div>`,

// ============ RESULT — photo top + floating calories card ============
result: `
<div style="position:absolute;top:0;left:0;right:0;height:400px;background:url('file://${S}/assets/food_top.jpg') center/cover"></div>
<div style="position:absolute;top:0;left:0;right:0;height:110px;background:linear-gradient(rgba(0,0,0,.38),transparent)"></div>
<div style="position:absolute;top:20px;left:18px;width:38px;height:38px;border-radius:50%;background:rgba(20,22,20,.45);color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px">←</div>
<div style="position:absolute;top:28px;left:0;right:0;text-align:center;color:#fff;font-weight:800;font-size:17px;text-shadow:0 1px 8px rgba(0,0,0,.5)">Nutrition</div>
<div style="position:absolute;top:20px;right:18px;width:38px;height:38px;border-radius:50%;background:rgba(20,22,20,.45);color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px">⋯</div>

<div style="position:absolute;top:368px;left:0;right:0;bottom:0;background:#F5F5F7;border-radius:34px 34px 0 0"></div>
<div style="position:absolute;top:392px;left:20px;right:20px">
  <div style="background:#fff;border:1px solid #E9ECEE;border-radius:22px;padding:16px;box-shadow:0 6px 18px rgba(0,0,0,.06)">
    <div style="font-size:11.5px;font-weight:700;color:#858C8A;background:#F5F5F7;display:inline-block;padding:5px 10px;border-radius:8px">🔖 12:40 PM · Lunch</div>
    <div class="row" style="margin-top:10px">
      <div style="font-size:21px;font-weight:800;letter-spacing:-.01em">Teriyaki Salmon Bowl</div>
      <div style="display:flex;gap:12px;align-items:center;border:1px solid #E5E8EA;border-radius:999px;padding:7px 14px;font-size:15px;font-weight:700"><span style="color:#858C8A">−</span> 1 <span style="color:#858C8A">+</span></div>
    </div>
  </div>

  <div style="background:#fff;border:1px solid #E9ECEE;border-radius:22px;padding:16px;margin-top:12px;display:flex;align-items:center;gap:14px;box-shadow:0 14px 34px rgba(0,0,0,.10)">
    <div style="width:52px;height:52px;border-radius:16px;background:#EAF9F0;display:flex;align-items:center;justify-content:center;font-size:24px">🔥</div>
    <div><div style="font-size:12.5px;font-weight:600;color:#858C8A">Calories</div>
    <div style="font-size:34px;font-weight:800;letter-spacing:-.02em">512</div></div>
    <div style="margin-left:auto;background:rgba(25,204,107,.12);color:#0D9E52;font-size:12.5px;font-weight:800;padding:8px 13px;border-radius:999px">96% confident</div>
  </div>

  <div style="display:flex;gap:9px;margin-top:12px">
    <div class="chip" style="background:#FDF1F2;color:#F2596B">🍗 Protein 38g</div>
    <div class="chip" style="background:#FEF6EA;color:#D98A18">🌾 Carbs 32g</div>
    <div class="chip" style="background:#EEF4FE;color:#4D8FF2">💧 Fat 26g</div>
  </div>

  <div style="background:#fff;border:1px solid #E9ECEE;border-radius:22px;padding:16px;margin-top:12px">
    <div class="row"><div style="font-size:15px;font-weight:800">Ingredients</div>
      <div style="color:#0D9E52;font-size:13px;font-weight:800">+ Add More</div></div>
    ${[
      ['Teriyaki Salmon','280 cal','140 g'],
      ['Avocado','120 cal','75 g'],
      ['Arugula & Greens','18 cal','45 g'],
      ['Shredded Carrots','16 cal','35 g'],
      ['Red Cabbage','12 cal','30 g'],
      ['Teriyaki Glaze','66 cal','2 tbsp'],
    ].map(r=>`
    <div class="row" style="padding:10px 0;border-bottom:1px solid #F0F2F3">
      <div><div style="font-size:14px;font-weight:700">${r[0]}</div><div style="font-size:11.5px;color:#858C8A;font-weight:600">${r[1]}</div></div>
      <div style="background:#EAF9F0;color:#0D9E52;font-size:12px;font-weight:800;padding:6px 11px;border-radius:999px">${r[2]}</div>
    </div>`).join('')}
  </div>

  <div style="display:flex;gap:10px;margin-top:14px">
    <div style="flex:1;background:#EAF9F0;color:#0D9E52;border-radius:16px;height:52px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800">✨ Fix with AI</div>
    <div class="greenbtn" style="flex:1.4">Log This Meal</div>
  </div>
</div>`,

// ============ BARCODE — bright, MyNetDiary-style ============
barcode2: `
<div style="position:absolute;inset:0;background:
  radial-gradient(140% 90% at 50% 10%, #efeeea, #dcdad4 60%, #cfccc5);"></div>
<div style="position:absolute;inset:0;opacity:.35;background:
  repeating-radial-gradient(circle at 30% 20%, transparent 0 12px, rgba(120,115,105,.05) 12px 13px)"></div>

<div style="position:absolute;top:20px;left:18px;width:38px;height:38px;border-radius:50%;background:rgba(20,22,20,.35);color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px">✕</div>
<div style="position:absolute;top:28px;left:0;right:0;text-align:center;color:#3a3d3a;font-weight:800;font-size:17px">Log lunch ▾</div>

<!-- scan corners -->
<div style="position:absolute;top:130px;left:52px;right:52px;height:470px">
  <div style="position:absolute;top:0;left:0;width:62px;height:62px;border-top:6px solid #fff;border-left:6px solid #fff;border-top-left-radius:28px;filter:drop-shadow(0 3px 8px rgba(0,0,0,.18))"></div>
  <div style="position:absolute;top:0;right:0;width:62px;height:62px;border-top:6px solid #fff;border-right:6px solid #fff;border-top-right-radius:28px;filter:drop-shadow(0 3px 8px rgba(0,0,0,.18))"></div>
  <div style="position:absolute;bottom:0;left:0;width:62px;height:62px;border-bottom:6px solid #fff;border-left:6px solid #fff;border-bottom-left-radius:28px;filter:drop-shadow(0 3px 8px rgba(0,0,0,.18))"></div>
  <div style="position:absolute;bottom:0;right:0;width:62px;height:62px;border-bottom:6px solid #fff;border-right:6px solid #fff;border-bottom-right-radius:28px;filter:drop-shadow(0 3px 8px rgba(0,0,0,.18))"></div>

  <!-- sealed protein bar wrapper (photoreal) -->
  <div style="position:absolute;left:34px;right:34px;top:88px;height:296px;transform:rotate(-4deg);filter:drop-shadow(0 34px 40px rgba(70,50,20,.38))">
    <svg width="0" height="0"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.14"/></feComponentTransfer><feComposite operator="over" in2="SourceGraphic"/></filter></svg>
    <!-- crimped ends -->
    <div style="position:absolute;left:-14px;top:26px;bottom:26px;width:34px;background:repeating-linear-gradient(180deg,#5A3B23 0 9px,#7A5433 9px 18px);border-radius:8px 0 0 8px;transform:skewY(-3deg)"></div>
    <div style="position:absolute;right:-14px;top:26px;bottom:26px;width:34px;background:repeating-linear-gradient(180deg,#5A3B23 0 9px,#7A5433 9px 18px);border-radius:0 8px 8px 0;transform:skewY(3deg)"></div>
    <!-- wrapper body with cylindrical shading + bar ridges -->
    <div style="position:absolute;left:12px;right:12px;top:0;bottom:0;border-radius:22px;overflow:hidden;
      background:
        linear-gradient(180deg, rgba(0,0,0,.32) 0%, rgba(255,255,255,.16) 9%, rgba(255,255,255,0) 22%, rgba(0,0,0,0) 74%, rgba(0,0,0,.30) 96%),
        repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 3px, rgba(255,255,255,.04) 3px 6px),
        linear-gradient(160deg,#6B4226 0%,#7E5230 30%,#5C3820 65%,#4A2C17 100%);
      box-shadow: inset 0 4px 14px rgba(255,255,255,.28), inset 0 -8px 18px rgba(0,0,0,.42);">
      <!-- specular sweep -->
      <div style="position:absolute;left:14%;top:-40px;bottom:-40px;width:120px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.34),transparent);transform:rotate(14deg)"></div>
      <div style="position:absolute;left:64%;top:-40px;bottom:-40px;width:46px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);transform:rotate(14deg)"></div>
      <!-- matte film noise -->
      <div style="position:absolute;inset:0;filter:url(#noise)"></div>
      <!-- printed design -->
      <div style="position:absolute;left:0;right:0;top:34px;text-align:center">
        <div style="display:inline-flex;align-items:center;gap:8px;color:#F6E7C8;font-size:14px;font-weight:900;letter-spacing:.26em">🥑 CAL PRO</div>
        <div style="color:#fff;font-size:30px;font-weight:900;letter-spacing:.04em;margin-top:6px;text-shadow:0 2px 6px rgba(0,0,0,.4)">PROTEIN BAR</div>
        <div style="display:inline-block;background:#F3B33C;color:#4A2C17;font-size:12.5px;font-weight:900;letter-spacing:.14em;padding:6px 16px;border-radius:999px;margin-top:9px;box-shadow:0 3px 8px rgba(0,0,0,.3)">CHOCOLATE CHIP · 20G PROTEIN</div>
      </div>
      <!-- printed barcode, bottom right of the wrapper -->
      <div style="position:absolute;right:24px;bottom:20px;background:#F4EFE6;border-radius:8px;padding:9px 12px 5px;box-shadow:0 2px 8px rgba(0,0,0,.35)">
        <svg viewBox="0 0 190 52" style="width:158px;display:block">
          <rect x="4.0" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="8.6" y="0" width="2.4000000000000004" height="38" fill="#241c12"/><rect x="13.2" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="17.799999999999997" y="0" width="3.5200000000000005" height="38" fill="#241c12"/><rect x="22.4" y="0" width="1.7600000000000002" height="38" fill="#241c12"/><rect x="27.0" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="31.599999999999998" y="0" width="2.8800000000000003" height="38" fill="#241c12"/><rect x="36.199999999999996" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="40.8" y="0" width="1.7600000000000002" height="38" fill="#241c12"/><rect x="45.4" y="0" width="2.4000000000000004" height="38" fill="#241c12"/><rect x="50.0" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="54.599999999999994" y="0" width="2.4000000000000004" height="38" fill="#241c12"/><rect x="59.199999999999996" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="63.8" y="0" width="3.5200000000000005" height="38" fill="#241c12"/><rect x="68.39999999999999" y="0" width="1.7600000000000002" height="38" fill="#241c12"/><rect x="73.0" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="77.6" y="0" width="2.8800000000000003" height="38" fill="#241c12"/><rect x="82.19999999999999" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="86.8" y="0" width="1.7600000000000002" height="38" fill="#241c12"/><rect x="91.39999999999999" y="0" width="2.4000000000000004" height="38" fill="#241c12"/><rect x="96.0" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="100.6" y="0" width="2.4000000000000004" height="38" fill="#241c12"/><rect x="105.19999999999999" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="109.8" y="0" width="3.5200000000000005" height="38" fill="#241c12"/><rect x="114.39999999999999" y="0" width="1.7600000000000002" height="38" fill="#241c12"/><rect x="118.99999999999999" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="123.6" y="0" width="2.8800000000000003" height="38" fill="#241c12"/><rect x="128.2" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="132.79999999999998" y="0" width="1.7600000000000002" height="38" fill="#241c12"/><rect x="137.39999999999998" y="0" width="2.4000000000000004" height="38" fill="#241c12"/><rect x="142.0" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="146.6" y="0" width="2.4000000000000004" height="38" fill="#241c12"/><rect x="151.2" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="155.79999999999998" y="0" width="3.5200000000000005" height="38" fill="#241c12"/><rect x="160.39999999999998" y="0" width="1.7600000000000002" height="38" fill="#241c12"/><rect x="165.0" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="169.6" y="0" width="2.8800000000000003" height="38" fill="#241c12"/><rect x="174.2" y="0" width="1.2800000000000002" height="38" fill="#241c12"/><rect x="178.79999999999998" y="0" width="1.7600000000000002" height="38" fill="#241c12"/><rect x="183.39999999999998" y="0" width="2.4000000000000004" height="38" fill="#241c12"/>
          <text x="95" y="50" font-size="11" fill="#241c12" text-anchor="middle" font-family="Inter" font-weight="700">7 290111 84205 3</text>
        </svg>
      </div>
      <div style="position:absolute;left:24px;bottom:22px;color:rgba(255,255,255,.75);font-size:10.5px;font-weight:700;letter-spacing:.08em">NET WT 52g</div>
    </div>
  </div>
  <!-- scan beam -->
  <div style="position:absolute;right:30px;width:230px;top:322px;height:4px;background:linear-gradient(90deg,transparent,#19CC6B 20%,#19CC6B 80%,transparent);box-shadow:0 0 24px 5px rgba(25,204,107,.6);border-radius:99px;transform:rotate(-4deg)"></div>
</div>

<!-- popping found pill -->
<div style="position:absolute;top:576px;left:50%;transform:translateX(-50%) rotate(-2deg);background:linear-gradient(135deg,#19CC6B,#0D9E52);color:#fff;font-size:16px;font-weight:900;letter-spacing:.03em;padding:13px 26px;border-radius:999px;box-shadow:0 16px 38px rgba(13,158,82,.45);z-index:4">✓ FOUND IN 1 SECOND</div>

<!-- result card -->
<div style="position:absolute;left:20px;right:20px;top:640px;background:#fff;border-radius:26px;padding:20px;box-shadow:0 30px 70px rgba(60,55,40,.28)">
  <div class="row">
    <div>
      <div style="font-size:19px;font-weight:800">Chocolate Chip Protein Bar</div>
      <div style="font-size:12.5px;color:#858C8A;font-weight:600;margin-top:2px">1 bar (52 g) · verified nutrition</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:28px;font-weight:800;color:#0D9E52">210</div>
      <div style="font-size:11.5px;color:#858C8A;font-weight:700">CAL</div>
    </div>
  </div>
  <div style="display:flex;gap:9px;margin-top:14px">
    <div class="chip" style="background:#FDF1F2;color:#F2596B">20g protein</div>
    <div class="chip" style="background:#FEF6EA;color:#D98A18">18g carbs</div>
    <div class="chip" style="background:#EEF4FE;color:#4D8FF2">7g fat</div>
  </div>
  <div class="greenbtn" style="margin-top:14px;height:50px">Add to Diary</div>
</div>

<!-- toggles + shutter -->
<div style="position:absolute;bottom:118px;left:0;right:0;display:flex;justify-content:center;gap:9px">
  <div style="background:rgba(20,22,20,.12);color:#4a4d4a;font-size:14px;font-weight:600;padding:11px 20px;border-radius:14px">Scan Food</div>
  <div style="background:#121714;color:#fff;font-size:14px;font-weight:800;padding:11px 20px;border-radius:14px">㆔ Barcode</div>
  <div style="background:rgba(20,22,20,.12);color:#4a4d4a;font-size:14px;font-weight:600;padding:11px 20px;border-radius:14px">Food label</div>
</div>
<div style="position:absolute;bottom:30px;left:50%;transform:translateX(-50%);width:70px;height:70px;border-radius:50%;background:#fff;box-shadow:0 0 0 6px rgba(255,255,255,.5), 0 10px 26px rgba(0,0,0,.18)"></div>`,
};

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 540, height: 1114 }, deviceScaleFactor: 2 });
  for (const [name, body] of Object.entries(SCREENS)) {
    const f = path.join(S, `screen_${name}.html`);
    fs.writeFileSync(f, `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`);
    await page.goto('file://' + f);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(S, 'frames', `gen_${name}.png`) });
    console.log('screen', name);
  }
  await browser.close();
})();
