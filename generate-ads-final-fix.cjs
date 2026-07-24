const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const express = require('express');

const BRAND = {
  paper: '#fef8e1',
  black: '#000000',
  white: '#ffffff',
  mocha: '#5d4037'
};

const OUTPUT_DIR = path.join(__dirname, 'client/public/images/ads');
const ASSETS_DIR = path.join(__dirname, 'client/public');
const PORT = 3008;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function baseStyles() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Outfit:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@300;400;600;700;900&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px; height: 1350px;
      background: ${BRAND.paper};
      overflow: hidden; position: relative;
    }
    
    /* Perfect Typography Balance */
    .heading-en { 
      font-family: 'Fraunces', serif; 
      font-size: 80px; 
      font-weight: 900; 
      line-height: 1; 
      letter-spacing: -0.04em;
      direction: ltr;
    }
    .heading-ar { 
      font-family: 'Noto Kufi Arabic', sans-serif; 
      font-size: 64px; 
      font-weight: 900; 
      line-height: 1.2;
      direction: rtl;
    }
    .sub-en { 
      font-family: 'Outfit', sans-serif; 
      font-size: 24px; 
      font-weight: 600; 
      letter-spacing: 0.1em;
      direction: ltr;
      text-transform: uppercase;
    }
    
    /* Full Bleed Canvas - Freedom from Borders */
    .full-bleed {
      position: absolute; inset: 0;
      background-size: cover; 
      background-position: center;
      z-index: 1;
    }
    
    /* Consistent Logo Header */
    .logo-header {
      position: absolute; top: 50px; left: 50px;
      display: flex; align-items: center; gap: 12px;
      z-index: 100;
    }
    .logo-header img { width: 44px; height: 44px; }
    .logo-header span {
      font-family: 'Fraunces', serif;
      font-weight: 900;
      font-size: 48px;
      letter-spacing: -2px;
      line-height: 1;
    }
    
    /* Advanced Physical Depth for Real Parts (No Flat Clip-Art) */
    .product-part {
      position: absolute;
      filter: drop-shadow(0 30px 50px rgba(0,0,0,0.15)) drop-shadow(0 5px 15px rgba(0,0,0,0.1));
      transition: all 0.3s ease;
    }
  `;
}

const slides = [
  // =====================================================
  // SLIDE 1: THE HOOK
  // Full-bleed photography. Arabic anchor.
  // =====================================================
  {
    name: 'final_1_hook',
    html: () => `
      <style>${baseStyles()}</style>
      <div class="full-bleed" style="background-image: url('/images/models/daydream/_HTM4179.JPEG'); background-position: center 30%;"></div>
      
      <!-- Gradient for natural text legibility without ugly shadows -->
      <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 40%; background: linear-gradient(to top, rgba(254, 248, 225, 1) 0%, rgba(254, 248, 225, 0) 100%); z-index: 2;"></div>
      
      <div class="logo-header" style="color: ${BRAND.mocha};">
        <img src="/images/starfish-black.png" />
        <span>moony</span>
      </div>
      
      <div style="position: absolute; bottom: 80px; left: 60px; right: 60px; z-index: 10; display: flex; flex-direction: column; gap: 15px;">
        <div class="heading-ar" style="color: ${BRAND.mocha};">تغطية لا تساوم.</div>
        <div class="sub-en" style="color: ${BRAND.mocha};">Uncompromising coverage. Total freedom.</div>
      </div>
    `
  },

  // =====================================================
  // SLIDE 2: THE CONTEXT (Zero Cling)
  // Full-bleed. Extreme Brand Clarity.
  // =====================================================
  {
    name: 'final_2_context',
    html: () => `
      <style>${baseStyles()}</style>
      <div class="full-bleed" style="background-image: url('/images/models/aquaglow/_HTM3828.JPEG'); background-position: center 30%;"></div>
      
      <div class="logo-header" style="color: ${BRAND.white};">
        <img src="/images/starfish-black.png" style="filter: invert(1);" />
        <span>moony</span>
      </div>
      
      <!-- Text placed in natural dark water -->
      <div style="position: absolute; bottom: 80px; right: 60px; z-index: 10; text-align: right;">
        <div class="heading-en" style="color: ${BRAND.white}; font-size: 110px;">Zero Cling.</div>
        <div class="heading-ar" style="color: ${BRAND.white}; font-size: 42px; margin-top: 15px;">نسيج مبتكر لا يلتصق.</div>
      </div>
    `
  },

  // =====================================================
  // SLIDE 3: ANATOMY 1 (The Fix for 'Biology Textbook')
  // Dynamic scaling, massive overlapping depth.
  // =====================================================
  {
    name: 'final_3_anatomy1',
    html: () => `
      <style>${baseStyles()}</style>
      <div class="logo-header" style="color: ${BRAND.black};">
        <img src="/images/starfish-black.png" />
        <span>moony</span>
      </div>
      
      <div style="position: absolute; top: 180px; left: 60px; z-index: 10;">
        <div class="heading-en" style="font-size: 64px; color: ${BRAND.mocha};">The Core Set</div>
      </div>
      
      <!-- High-fashion dynamic layout. Pieces overlap beautifully. -->
      <!-- Top -->
      <img class="product-part" src="/images/pieces/aqua-1.png" style="width: 700px; top: 250px; left: 300px; z-index: 1;" />
      
      <!-- Turban -->
      <img class="product-part" src="/images/pieces/aqua-2.png" style="width: 300px; top: 300px; left: 80px; z-index: 3;" />
      
      <!-- Leggings -->
      <img class="product-part" src="/images/pieces/aqua-4.png" style="width: 450px; bottom: -50px; left: 150px; z-index: 2;" />
      
      <!-- Elegant Margin Typography (No ugly pointer lines) -->
      <div style="position: absolute; bottom: 60px; right: 60px; text-align: right;">
        <div class="sub-en" style="color: ${BRAND.black};">Long-Sleeve Top</div>
        <div class="sub-en" style="color: ${BRAND.black}; margin-top: 10px;">Matching Turban</div>
        <div class="sub-en" style="color: ${BRAND.black}; margin-top: 10px;">Swim Leggings</div>
      </div>
    `
  },

  // =====================================================
  // SLIDE 4: ANATOMY 2
  // =====================================================
  {
    name: 'final_4_anatomy2',
    html: () => `
      <style>${baseStyles()}</style>
      <div class="logo-header" style="color: ${BRAND.black};">
        <img src="/images/starfish-black.png" />
        <span>moony</span>
      </div>
      
      <div style="position: absolute; top: 180px; left: 60px; z-index: 10;">
        <div class="heading-en" style="font-size: 64px; color: ${BRAND.mocha};">The Adaptation</div>
      </div>
      
      <!-- Long Pareo -->
      <img class="product-part" src="/images/pieces/aqua-5.png" style="width: 550px; top: 100px; left: 350px; z-index: 1;" />
      
      <!-- Short Skirt -->
      <img class="product-part" src="/images/pieces/aqua-3.png" style="width: 450px; bottom: 80px; left: 50px; z-index: 2;" />
      
      <!-- Elegant Margin Typography -->
      <div style="position: absolute; bottom: 60px; right: 60px; text-align: right;">
        <div class="sub-en" style="color: ${BRAND.black};">Long Pareo</div>
        <div class="sub-en" style="color: ${BRAND.black}; margin-top: 10px;">Short Coverup</div>
      </div>
    `
  },

  // =====================================================
  // SLIDE 5: THE LEGACY CTA
  // Full-bleed. Unapologetic URL.
  // =====================================================
  {
    name: 'final_5_cta',
    html: () => `
      <style>${baseStyles()}</style>
      <div class="full-bleed" style="background-image: url('/images/models/daydream/_HTM4610.JPEG'); background-position: top;"></div>
      
      <!-- Subtle top gradient for logo -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 30%; background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%); z-index: 2;"></div>
      
      <div class="logo-header" style="color: ${BRAND.white};">
        <img src="/images/starfish-black.png" style="filter: invert(1);" />
        <span>moony</span>
      </div>
      
      <div style="position: absolute; bottom: 60px; left: 0; right: 0; display: flex; justify-content: center; z-index: 10;">
        <div class="heading-en" style="font-size: 32px; color: ${BRAND.white}; letter-spacing: 0.2em; text-transform: uppercase;">MOONYSWIM.COM</div>
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
