const { chromium } = require('../backend/node_modules/playwright');
const path = require('path');

const BASE_URL = 'https://edu-track-blond-eta.vercel.app';
const OUT_DIR = path.join(__dirname, 'screenshots');

async function login(page, email, password) {
  await page.goto(BASE_URL);
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
}

async function shot(page, name) {
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`), fullPage: false });
  console.log(`  saved: ${name}.png`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Login page
  console.log('1. Login page...');
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await shot(page, '01-login');

  // 2. Login as student and go to course catalog
  console.log('2. Course catalog (student)...');
  await login(page, 'felippe@example.com', '123456');
  await page.waitForLoadState('networkidle');
  await shot(page, '02-courses-catalog');

  // 3. Click on the first course card
  console.log('3. Course detail (student)...');
  try {
    const card = page.locator('[class*="card"]').first();
    await card.waitFor({ timeout: 10000 });
    await card.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await shot(page, '03-course-detail-student');

    // Save current URL for later
    const courseUrl = page.url();
    console.log('   Course URL:', courseUrl);

    // 4. Click on first lesson
    console.log('4. Lesson player...');
    try {
      const lessonRow = page.locator('[class*="lessonRow"][class*="lessonClickable"]').first();
      await lessonRow.waitFor({ timeout: 10000 });
      await lessonRow.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await shot(page, '04-lesson-player');
    } catch (e) {
      console.log('   Lesson row not found, trying lessonRow selector...');
      const lessonRow = page.locator('[class*="lessonRow"]').first();
      await lessonRow.waitFor({ timeout: 5000 });
      await lessonRow.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await shot(page, '04-lesson-player');
    }
  } catch (e) {
    console.log('   ERROR:', e.message.split('\n')[0]);
  }

  // 5. Dashboard
  console.log('5. Dashboard...');
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await shot(page, '05-dashboard');

  // 6. Certificates page
  console.log('6. Certificates...');
  await page.goto(`${BASE_URL}/certificates`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await shot(page, '06-certificates');

  // 7. Instructor Panel
  console.log('7. Instructor panel...');
  await login(page, 'prof@example.com', '123456');
  await page.goto(`${BASE_URL}/instructor`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await shot(page, '07-instructor-panel');

  // 8. Course detail (instructor view)
  console.log('8. Course detail (instructor)...');
  try {
    const card = page.locator('[class*="card"]').first();
    await card.waitFor({ timeout: 10000 });
    await card.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await shot(page, '08-course-detail-instructor');
  } catch (e) {
    console.log('   ERROR:', e.message.split('\n')[0]);
  }

  await browser.close();
  console.log('\nDone! Screenshots saved to docs/screenshots/');
})();
