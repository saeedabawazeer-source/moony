import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

async function main() {
  console.log("Starting dev server...");
  const dev = spawn('npm', ['run', 'dev'], { 
    env: { ...process.env, PORT: '5001' },
    stdio: 'inherit' 
  });
  
  await new Promise(r => setTimeout(r, 5000)); // wait for dev server

  console.log("Launching puppeteer...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // 600x600 mobile viewport, scale 1.8 = 1080x1080 output
  await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 1.8 });

  const hideElements = async () => {
    await page.evaluate(() => {
      // Hide buttons (cart etc.)
      document.querySelectorAll('button').forEach(b => b.style.display = 'none');
      
      // Hide EN / AR language links
      document.querySelectorAll('a').forEach(a => {
        const t = (a.textContent || '').trim();
        if (t === 'EN' || t === 'ع' || t === 'AR') a.style.display = 'none';
      });

      // Hide down arrow
      const downArrow = document.querySelector('a[href="#carousel-section"]');
      if (downArrow) downArrow.style.display = 'none';

      // Center logo — force the full header row to center
      const header = document.querySelector('.sticky > div');
      if (header) {
        header.style.display = 'flex';
        header.style.justifyContent = 'center';
        header.style.alignItems = 'center';
        // Hide all non-logo siblings
        Array.from(header.children).forEach(child => {
          if (!child.querySelector('img[alt="Moony Logo"]')) {
            child.style.visibility = 'hidden';
            child.style.width = '0';
            child.style.overflow = 'hidden';
          }
        });
      }

      // Make logo icon bigger
      const logoImg = document.querySelector('img[alt="Moony Logo"]');
      if (logoImg) {
        logoImg.style.width = '56px';
        logoImg.style.height = '56px';
      }

      // Make logo text bigger
      const logoWrap = document.querySelector('img[alt="Moony Logo"]')?.closest('a, div');
      if (logoWrap) {
        const span = logoWrap.querySelector('span');
        if (span) {
          span.style.fontSize = '34px';
          span.style.fontWeight = '900';
        }
      }
    });
  };

  console.log("Capturing English OG...");
  await page.goto('http://localhost:5001/', { waitUntil: 'networkidle0' });
  await hideElements();
  await new Promise(r => setTimeout(r, 3000)); // wait for wave animation to draw
  await page.screenshot({ path: 'client/public/images/og-en.png', clip: { x: 0, y: 0, width: 600, height: 600 } });

  console.log("Capturing Arabic OG...");
  await page.goto('http://localhost:5001/ar', { waitUntil: 'networkidle0' });
  await hideElements();
  await new Promise(r => setTimeout(r, 3000)); // wait for wave animation to draw
  await page.screenshot({ path: 'client/public/images/og-ar.png', clip: { x: 0, y: 0, width: 600, height: 600 } });

  await browser.close();
  dev.kill();
  console.log("Done!");
  process.exit(0);
}
main().catch(e => {
  console.error(e);
  process.exit(1);
});
