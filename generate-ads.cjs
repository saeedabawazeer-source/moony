const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BRAND = {
  beige: '#fef8e1',
  teal: '#6bb7b3',
  coral: '#e5815c',
  brown: '#5d4037',
  black: '#000000',
  white: '#ffffff',
};

const OUTPUT_DIR = path.join(__dirname, 'client/public/images/ads');
const ASSETS = path.resolve(__dirname, 'client/public');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function baseStyles() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Inter:wght@400;600;700;800;900&family=Noto+Kufi+Arabic:wght@400;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px; height: 1350px;
      overflow: hidden; position: relative;
    }
  `;
}

const slides = [

  // =====================================================
  // SLIDE 1: THE SCROLL STOPPER
  // Pure typography. No images. Gut-punch line.
  // This is the one that makes her thumb STOP.
  // =====================================================
  {
    name: 'slide-1-hook',
    html: () => `
      <style>${baseStyles()}
        body {
          background: ${BRAND.black};
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 80px;
        }
        .line {
          font-family: 'Noto Kufi Arabic', sans-serif;
          font-weight: 900; color: ${BRAND.white};
          text-align: center; direction: rtl;
        }
        .line-1 {
          font-size: 82px; line-height: 1.4;
          margin-bottom: 40px;
        }
        .line-highlight {
          color: ${BRAND.teal};
        }
        .line-2 {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-style: italic;
          font-size: 36px; color: rgba(255,255,255,0.5);
          direction: ltr; text-align: center;
          margin-bottom: 60px;
        }
        .bottom-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 8px; background: ${BRAND.teal};
        }
        .logo-bottom {
          position: absolute; bottom: 40px;
          display: flex; align-items: center; gap: 10px;
        }
        .logo-bottom img { width: 28px; height: 28px; }
        .logo-bottom span {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 28px; color: rgba(255,255,255,0.3);
          letter-spacing: -1px;
        }
      </style>
      <div class="line line-1">
        كل لبس سباحة<br>
        <span class="line-highlight">خذلني.</span><br>
        إلا واحد.
      </div>
      <div class="line-2">Every swimwear let me down. Except one.</div>
      <div class="logo-bottom">
        <img src="file://${ASSETS}/images/starfish-coral.png" />
        <span>moony</span>
      </div>
      <div class="bottom-bar"></div>
    `
  },

  // =====================================================
  // SLIDE 2: THE REVEAL
  // Full-bleed model photo. Almost no text.
  // Let the product speak for itself.
  // =====================================================
  {
    name: 'slide-2-reveal',
    html: () => `
      <style>${baseStyles()}
        body {
          background-image: url('file://${ASSETS}/images/models/daydream/_HTM3935.JPEG');
          background-size: cover; background-position: center 20%;
        }
        .gradient {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom,
            transparent 0%,
            transparent 60%,
            rgba(0,0,0,0.7) 100%
          );
        }
        .text-bottom {
          position: absolute; bottom: 60px; left: 60px; right: 60px;
          z-index: 2;
        }
        .reveal-text {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 48px;
          color: ${BRAND.white};
          letter-spacing: -1px; line-height: 1.2;
          margin-bottom: 8px;
        }
        .reveal-sub {
          font-family: 'Inter', sans-serif;
          font-weight: 600; font-size: 20px;
          color: ${BRAND.teal};
          letter-spacing: 3px; text-transform: uppercase;
        }
      </style>
      <div class="gradient"></div>
      <div class="text-bottom">
        <div class="reveal-sub">MOONY SWIMWEAR</div>
        <div class="reveal-text">This is the one.</div>
      </div>
    `
  },

  // =====================================================
  // SLIDE 3: THE ONE THING
  // Not 4 bullet points. ONE differentiator.
  // The thing that makes Moony different from everything
  // else she's tried. Big, bold, undeniable.
  // =====================================================
  {
    name: 'slide-3-differentiator',
    html: () => `
      <style>${baseStyles()}
        body {
          background: ${BRAND.beige};
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 100px 80px;
          text-align: center;
        }
        .icon-row {
          display: flex; gap: 20px; margin-bottom: 50px;
        }
        .icon-row img { width: 40px; height: 40px; }
        .big-claim {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 72px;
          color: ${BRAND.black}; line-height: 1.15;
          letter-spacing: -2px; margin-bottom: 30px;
        }
        .big-claim em { color: ${BRAND.teal}; font-style: italic; }
        .claim-ar {
          font-family: 'Noto Kufi Arabic', sans-serif;
          font-weight: 900; font-size: 52px;
          color: ${BRAND.brown}; direction: rtl;
          line-height: 1.5; margin-bottom: 40px;
        }
        .proof {
          font-family: 'Inter', sans-serif;
          font-weight: 700; font-size: 22px;
          color: ${BRAND.brown}; opacity: 0.6;
          letter-spacing: 2px; text-transform: uppercase;
        }
        .teal-line {
          width: 120px; height: 6px; background: ${BRAND.teal};
          border-radius: 3px; margin: 30px auto;
        }
        .wave-accent {
          position: absolute; bottom: 0; left: 0; right: 0; height: 100px;
          background: ${BRAND.teal};
          clip-path: path('M0,50 C180,15 360,85 540,50 C720,15 900,85 1080,50 L1080,200 L0,200 Z');
        }
      </style>
      <div class="icon-row">
        <img src="file://${ASSETS}/images/starfish-teal.png" />
        <img src="file://${ASSETS}/images/starfish-coral.png" />
        <img src="file://${ASSETS}/images/starfish-teal.png" />
      </div>
      <div class="big-claim">It doesn't <em>cling.</em><br>Even when wet.</div>
      <div class="teal-line"></div>
      <div class="claim-ar">ما يلصق.<br>حتى وهو مبلول.</div>
      <div class="proof">UPF 50+ · QUICK-DRY · 5 PIECES</div>
      <div class="wave-accent"></div>
    `
  },

  // =====================================================
  // SLIDE 4: THE PROOF
  // Real model in action, different photo.
  // Show her LIVING in it, not posing.
  // One line that anchors the emotion.
  // =====================================================
  {
    name: 'slide-4-proof',
    html: () => `
      <style>${baseStyles()}
        body {
          background-image: url('file://${ASSETS}/images/models/aquaglow/_HTM3856.JPEG');
          background-size: cover; background-position: center;
        }
        .gradient {
          position: absolute; inset: 0;
          background: linear-gradient(to top,
            rgba(254,248,225,0.95) 0%,
            rgba(254,248,225,0.6) 25%,
            transparent 50%
          );
        }
        .content {
          position: absolute; bottom: 60px; left: 60px; right: 60px;
          z-index: 2;
        }
        .quote-ar {
          font-family: 'Noto Kufi Arabic', sans-serif;
          font-weight: 900; font-size: 46px;
          color: ${BRAND.black}; direction: rtl;
          text-align: right; line-height: 1.6;
          margin-bottom: 16px;
        }
        .quote-en {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-style: italic;
          font-size: 28px; color: ${BRAND.brown};
        }
        .stars {
          display: flex; gap: 8px; margin-bottom: 16px;
          justify-content: flex-end;
        }
        .stars span {
          font-size: 24px; color: ${BRAND.coral};
        }
      </style>
      <div class="gradient"></div>
      <div class="content">
        <div class="stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
        <div class="quote-ar">"أخيراً لقيت لبس سباحة<br>ما أفكر فيه مرتين."</div>
        <div class="quote-en">"Finally found swimwear I don't think twice about."</div>
      </div>
    `
  },

  // =====================================================
  // SLIDE 5: THE CLOSE
  // Simple. Branded. One action.
  // Don't overcomplicate. She's already interested.
  // =====================================================
  {
    name: 'slide-5-cta',
    html: () => `
      <style>${baseStyles()}
        body {
          background: ${BRAND.black};
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 80px; text-align: center;
        }
        .logo-big {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 60px;
        }
        .logo-big img { width: 60px; height: 60px; }
        .logo-big span {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 64px;
          color: ${BRAND.white}; letter-spacing: -1px;
        }
        .cta-button {
          background: ${BRAND.teal}; color: ${BRAND.black};
          font-family: 'Inter', sans-serif; font-weight: 900;
          font-size: 30px; padding: 28px 70px;
          border-radius: 60px; letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 30px;
          border: 3px solid rgba(255,255,255,0.15);
        }
        .url {
          font-family: 'Inter', sans-serif; font-weight: 700;
          font-size: 26px; color: rgba(255,255,255,0.4);
          letter-spacing: 2px; margin-bottom: 50px;
        }
        .delivery-ar {
          font-family: 'Noto Kufi Arabic', sans-serif;
          font-weight: 700; font-size: 28px;
          color: ${BRAND.coral}; direction: rtl;
          margin-bottom: 8px;
        }
        .delivery-en {
          font-family: 'Inter', sans-serif; font-weight: 600;
          font-size: 20px; color: rgba(255,255,255,0.35);
        }
        .price {
          font-family: 'Playfair Display', serif; font-weight: 900;
          font-size: 32px; color: ${BRAND.white};
          margin-bottom: 40px; letter-spacing: -1px;
        }
        .teal-line-top {
          position: absolute; top: 0; left: 0; right: 0;
          height: 6px; background: ${BRAND.teal};
        }
        .teal-line-bottom {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 6px; background: ${BRAND.teal};
        }
      </style>
      <div class="teal-line-top"></div>
      <div class="logo-big">
        <img src="file://${ASSETS}/images/starfish-coral.png" />
        <span>moony</span>
      </div>
      <div class="price">From 425 SAR · تبدأ من ٤٢٥ ريال</div>
      <div class="cta-button">SHOP NOW</div>
      <div class="url">moonyswim.com</div>
      <div class="delivery-ar">توصيل نفس اليوم في جدة ⭐</div>
      <div class="delivery-en">Same-day delivery in Jeddah</div>
      <div class="teal-line-bottom"></div>
    `
  },

  // =====================================================
  // STATIC AD: THE ONE-LINER
  // Her best photo. One devastating line.
  // =====================================================
  {
    name: 'static-ad',
    html: () => `
      <style>${baseStyles()}
        body { display: flex; }
        .photo-side {
          width: 55%; height: 100%;
          background-image: url('file://${ASSETS}/images/models/daydream/_HTM4179.JPEG');
          background-size: cover; background-position: center 25%;
          position: relative;
        }
        .photo-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(to right, transparent 60%, ${BRAND.black} 100%);
        }
        .text-side {
          width: 45%; height: 100%;
          background: ${BRAND.black};
          display: flex; flex-direction: column;
          justify-content: center; padding: 50px 50px 50px 30px;
          position: relative;
        }
        .text-logo {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 50px;
        }
        .text-logo img { width: 30px; height: 30px; }
        .text-logo span {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 30px;
          color: rgba(255,255,255,0.4); letter-spacing: -1px;
        }
        .oneliner-ar {
          font-family: 'Noto Kufi Arabic', sans-serif;
          font-weight: 900; font-size: 40px;
          color: ${BRAND.white}; direction: rtl;
          text-align: right; line-height: 1.6;
          margin-bottom: 20px;
        }
        .oneliner-ar em {
          color: ${BRAND.teal}; font-style: normal;
        }
        .oneliner-en {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-style: italic;
          font-size: 24px; color: rgba(255,255,255,0.5);
          margin-bottom: 50px;
        }
        .static-price {
          font-family: 'Inter', sans-serif; font-weight: 900;
          font-size: 22px; color: ${BRAND.teal};
          margin-bottom: 8px;
        }
        .static-url {
          font-family: 'Inter', sans-serif; font-weight: 600;
          font-size: 18px; color: rgba(255,255,255,0.3);
        }
        .teal-accent {
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 5px; background: ${BRAND.teal};
        }
      </style>
      <div class="photo-side"><div class="photo-gradient"></div></div>
      <div class="text-side">
        <div class="teal-accent"></div>
        <div class="text-logo">
          <img src="file://${ASSETS}/images/starfish-coral.png" />
          <span>moony</span>
        </div>
        <div class="oneliner-ar">أخيراً لقيت لبس سباحة<br><em>ما أستحي منه.</em></div>
        <div class="oneliner-en">Finally. Swimwear that<br>actually gets it.</div>
        <div class="static-price">From 425 SAR</div>
        <div class="static-url">moonyswim.com</div>
      </div>
    `
  },
];

// ============================================================
async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files']
  });

  for (const slide of slides) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
    await page.setContent(slide.html(), { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 800));
    const out = path.join(OUTPUT_DIR, slide.name + '.png');
    await page.screenshot({ path: out, type: 'png' });
    console.log('✅ ' + slide.name + '.png');
    await page.close();
  }

  await browser.close();
  console.log('\\nDone! Saved to: ' + OUTPUT_DIR);
}

main().catch(console.error);
