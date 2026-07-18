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
  
  // Use 900x900 (mobile layout so we get rounded corners) x 1.2 = 1080x1080 PNG (1:1 aspect ratio)
  await page.setViewport({ width: 900, height: 900, deviceScaleFactor: 1.2 });

  const hideElements = async () => {
    await page.evaluate(() => {
      // Hide buttons (cart)
      const buttons = document.querySelectorAll('button');
      buttons.forEach(b => b.style.display = 'none');
      
      // Hide EN / AR links
      const links = Array.from(document.querySelectorAll('a'));
      links.forEach(a => {
        if (a.textContent === 'EN' || a.textContent === 'ع') {
           a.style.display = 'none';
        }
      });
      
      // Center the logo in the header
      const headerInner = document.querySelector('.sticky > div');
      if (headerInner) {
         headerInner.style.justifyContent = 'center';
      }
      
      // hide the down arrow link
      const downArrow = document.querySelector('a[href="#carousel-section"]');
      if (downArrow) downArrow.style.display = 'none';
      
      // hide the collection switcher (the pills)
      const pills = document.querySelectorAll('.rounded-full.backdrop-blur-md');
      pills.forEach(p => p.style.display = 'none');
    });
  };

  console.log("Capturing English OG...");
  await page.goto('http://localhost:5001/', { waitUntil: 'networkidle0' });
  await hideElements();
  await page.screenshot({ path: 'client/public/images/og-en.png', clip: { x: 0, y: 0, width: 900, height: 900 } });

  console.log("Capturing Arabic OG...");
  await page.goto('http://localhost:5001/ar', { waitUntil: 'networkidle0' });
  await hideElements();
  await page.screenshot({ path: 'client/public/images/og-ar.png', clip: { x: 0, y: 0, width: 900, height: 900 } });

  await browser.close();
  dev.kill();
  console.log("Done!");
  process.exit(0);
}
main().catch(e => {
  console.error(e);
  process.exit(1);
});
