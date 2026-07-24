const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const express = require('express');

const BRAND = {
  paper: '#fef8e1',
  black: '#000000',
  white: '#ffffff',
};

const OUTPUT_DIR = path.join(__dirname, 'client/public/images/ads');
const ASSETS_DIR = path.join(__dirname, 'client/public');
const PORT = 3007;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function baseStyles() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Outfit:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@300;400;600;700;900&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px; height: 1350px;
      background: ${BRAND.paper};
      overflow: hidden; position: relative;
      padding: 40px;
      display: flex; flex-direction: column;
    }
    
    /* Strict Typography - 1 Font Size System */
    .heading-en { 
      font-family: 'Fraunces', serif; 
      font-size: 80px; 
      font-weight: 900; 
      color: ${BRAND.black}; 
      line-height: 1; 
      letter-spacing: -0.04em;
      direction: ltr;
    }
    .heading-ar { 
      font-family: 'Noto Kufi Arabic', sans-serif; 
      font-size: 80px; 
      font-weight: 900; 
      color: ${BRAND.black}; 
      line-height: 1.2;
      direction: rtl;
    }
    .sub-en { 
      font-family: 'Outfit', sans-serif; 
      font-size: 28px; 
      font-weight: 600; 
      color: ${BRAND.black}; 
      direction: ltr;
    }
    .sub-ar { 
      font-family: 'Noto Kufi Arabic', sans-serif; 
      font-size: 28px; 
      font-weight: 600; 
      color: ${BRAND.black}; 
      direction: rtl;
    }
    
    /* Strict Layout Rules - ZERO Shadows, Black Outlines */
    .strict-border {
      border: 3px solid ${BRAND.black};
      border-radius: 30px;
      box-shadow: none !important; /* Zero shadows as requested */
    }
    
    /* Consistent Logo */
    .logo-header {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 30px;
    }
    .logo-header img { width: 44px; height: 44px; }
    .logo-header span {
      font-family: 'Fraunces', serif;
      font-weight: 900;
      font-size: 48px;
      color: ${BRAND.black};
      letter-spacing: -2px;
      line-height: 1;
    }
    
    /* Hero Image Container */
    .hero-image {
      flex: 1;
      background-size: cover; 
      background-position: center;
      width: 100%;
      position: relative;
      overflow: hidden;
      /* No heavy blocks covering it. It is the star. */
    }
  `;
}

const slides = [
  // =====================================================
  // SLIDE 1: THE HOOK
  // Proper RTL Arabic, LTR English. Black Outline. No shadows.
  // =====================================================
  {
    name: 'strict_1_hook',
    html: () => `
      <style>${baseStyles()}</style>
      <div class="logo-header">
        <img src="/images/starfish-black.png" />
        <span>moony</span>
      </div>
      
      <div class="hero-image strict-border" style="background-image: url('/images/models/daydream/_HTM4179.JPEG'); background-position: center 30%;"></div>
      
      <div style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">
        <div class="heading-ar">تغطية لا تساوم.</div>
        <div class="sub-en">Uncompromising coverage. Total freedom.</div>
      </div>
    `
  },

  // =====================================================
  // SLIDE 2: THE CONTEXT (Zero Cling)
  // Proper RTL Arabic, LTR English. Black Outline.
  // =====================================================
  {
    name: 'strict_2_context',
    html: () => `
      <style>${baseStyles()}</style>
      <div class="logo-header">
        <img src="/images/starfish-black.png" />
        <span>moony</span>
      </div>
      
      <div class="hero-image strict-border" style="background-image: url('/images/models/aquaglow/_HTM3828.JPEG'); background-position: center 30%;"></div>
      
      <div style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">
        <div class="heading-en">Zero Cling.</div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div class="sub-en" style="max-width: 50%;">Engineered fabric that never sticks to the body.</div>
          <div class="sub-ar" style="max-width: 50%; text-align: left;">نسيج مبتكر لا يلتصق بالجسم أبدًا.</div>
        </div>
      </div>
    `
  },

  // =====================================================
  // SLIDE 3: ANATOMY 1
  // Real parts, black outlines, zero shadows.
  // =====================================================
  {
    name: 'strict_3_anatomy1',
    html: () => `
      <style>${baseStyles()}
        .anatomy-container {
          flex: 1; position: relative; width: 100%;
        }
        .real-part { position: absolute; box-shadow: none !important; filter: none !important; }
        .pointer-line { position: absolute; background: ${BRAND.black}; }
        .pointer-text-en { position: absolute; font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; color: ${BRAND.black}; direction: ltr;}
        .pointer-text-ar { position: absolute; font-family: 'Noto Kufi Arabic', sans-serif; font-size: 22px; font-weight: 700; color: ${BRAND.black}; direction: rtl;}
      </style>
      <div class="logo-header">
        <img src="/images/starfish-black.png" />
        <span>moony</span>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div class="heading-en" style="font-size: 64px;">The Core Set</div>
      </div>
      
      <div class="anatomy-container strict-border" style="background: ${BRAND.white};">
        <!-- TOP -->
        <img class="real-part" src="/images/pieces/aqua-1.png" style="width: 500px; top: 150px; right: 50px;" />
        <div class="pointer-line" style="width: 150px; height: 2px; top: 350px; left: 300px;"></div>
        <div class="pointer-text-en" style="top: 320px; left: 100px;">Long-Sleeve Top</div>
        <div class="pointer-text-ar" style="top: 360px; left: 180px;">بلوزة بأكمام</div>

        <!-- TURBAN -->
        <img class="real-part" src="/images/pieces/aqua-2.png" style="width: 250px; top: 100px; left: 100px;" />
        <div class="pointer-line" style="width: 2px; height: 100px; top: 350px; left: 220px;"></div>
        <div class="pointer-text-en" style="top: 460px; left: 180px;">Turban</div>
        <div class="pointer-text-ar" style="top: 490px; left: 195px;">توربان</div>
        
        <!-- LEGGINGS -->
        <img class="real-part" src="/images/pieces/aqua-4.png" style="width: 400px; bottom: 50px; left: 300px;" />
        <div class="pointer-line" style="width: 150px; height: 2px; bottom: 250px; left: 100px;"></div>
        <div class="pointer-text-en" style="bottom: 260px; left: 100px;">Swim Leggings</div>
        <div class="pointer-text-ar" style="bottom: 220px; left: 150px;">ليقنز سباحة</div>
      </div>
    `
  },

  // =====================================================
  // SLIDE 4: ANATOMY 2
  // Real parts, black outlines, zero shadows.
  // =====================================================
  {
    name: 'strict_4_anatomy2',
    html: () => `
      <style>${baseStyles()}
        .anatomy-container {
          flex: 1; position: relative; width: 100%;
        }
        .real-part { position: absolute; box-shadow: none !important; filter: none !important; }
        .pointer-line { position: absolute; background: ${BRAND.black}; }
        .pointer-text-en { position: absolute; font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; color: ${BRAND.black}; direction: ltr;}
        .pointer-text-ar { position: absolute; font-family: 'Noto Kufi Arabic', sans-serif; font-size: 22px; font-weight: 700; color: ${BRAND.black}; direction: rtl;}
      </style>
      <div class="logo-header">
        <img src="/images/starfish-black.png" />
        <span>moony</span>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div class="heading-en" style="font-size: 64px;">The Adaptation</div>
      </div>
      
      <div class="anatomy-container strict-border" style="background: ${BRAND.white};">
        <!-- SHORT SKIRT -->
        <img class="real-part" src="/images/pieces/aqua-3.png" style="width: 400px; top: 150px; left: 50px;" />
        <div class="pointer-line" style="width: 100px; height: 2px; top: 350px; right: 400px;"></div>
        <div class="pointer-text-en" style="top: 320px; right: 250px;">Short Coverup</div>
        <div class="pointer-text-ar" style="top: 360px; right: 310px;">تنورة قصيرة</div>

        <!-- LONG PAREO -->
        <img class="real-part" src="/images/pieces/aqua-5.png" style="width: 500px; bottom: 50px; right: 50px;" />
        <div class="pointer-line" style="width: 150px; height: 2px; bottom: 350px; left: 300px;"></div>
        <div class="pointer-text-en" style="bottom: 360px; left: 100px;">Long Pareo</div>
        <div class="pointer-text-ar" style="bottom: 320px; left: 130px;">تنورة طويلة</div>
      </div>
    `
  },

  // =====================================================
  // SLIDE 5: THE ACTION
  // No heavy block CTA. Just clean text below the image.
  // =====================================================
  {
    name: 'strict_5_cta',
    html: () => `
      <style>${baseStyles()}</style>
      <div class="logo-header">
        <img src="/images/starfish-black.png" />
        <span>moony</span>
      </div>
      
      <div class="hero-image strict-border" style="background-image: url('/images/models/daydream/_HTM4610.JPEG'); background-position: top;"></div>
      
      <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div class="heading-en" style="font-size: 48px;">Experience the freedom.</div>
          <div class="sub-en" style="text-transform: uppercase; letter-spacing: 0.1em; margin-top: 10px;">MOONYSWIM.COM</div>
        </div>
        <div class="sub-ar" style="font-size: 32px;">اكتشفي الحرية.</div>
      </div>
    `
  }
];

async function main() {
  const app = express();
  app.use(express.static(ASSETS_DIR));
  const server = app.listen(PORT, async () => {
    console.log('Server running on port ' + PORT);
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    for (const slide of slides) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
      app.get('/' + slide.name, (req, res) => {
        res.send('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + slide.html() + '</body></html>');
      });
      await page.goto('http://localhost:' + PORT + '/' + slide.name, { waitUntil: 'networkidle0', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));
      const out = path.join(OUTPUT_DIR, slide.name + '.jpg');
      await page.screenshot({ path: out, type: 'jpeg', quality: 95 });
      console.log('✅ ' + slide.name + '.jpg');
      await page.close();
    }
    await browser.close();
    server.close();
  });
}
main().catch(console.error);
