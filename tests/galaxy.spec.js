const fs = require('fs');
const { test } = require('@playwright/test');

test('Search any galaxy product on Amazon and print first available price', async ({ browser }) => {
  test.setTimeout(60000);

  const context = await browser.newContext({
    headless: false,
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  console.log(' Navigating to Amazon.in');
  await page.goto('https://www.amazon.in', { waitUntil: 'domcontentloaded' });

  console.log('Waiting for the search box');
  await page.waitForSelector('#twotabsearchtextbox', { timeout: 15000 });

  console.log('✏️ Typing "samsung galaxy"');
  await page.fill('#twotabsearchtextbox', 'samsung galaxy');

  console.log('Clicking Search');
  await page.click('#nav-search-submit-button');

  // Scroll down a little to ensure lazy-loaded results are in DOM
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(500);
  }

  console.log('Waiting for search results to appear');
  await page.waitForSelector('.s-main-slot .s-result-item[data-asin]', { timeout: 20000 });

  // Grab all result items that have a valid ASIN
  const cards = page.locator('.s-main-slot .s-result-item[data-asin]');
  const count = await cards.count();
  console.log(`Found ${count} result cards`);

  // Loop until we find the first card whose link contains "/dp/" and has both title + price
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);

    const link = card.locator('a.a-link-normal[href*="/dp/"]');
    if (await link.count() === 0) {
      console.log(`Card ${i + 1} has no product link`);
      continue;
    }

    // Title is inside that link: <a …><h2>…<span>Title</span></h2></a>
    const titleSpan = link.locator('h2 span');
    if (!await titleSpan.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log(`Card ${i + 1} link has no visible title`);
      continue;
    }
    const title = await titleSpan.innerText();

    // Price lives anywhere under the card in a .a-price .a-offscreen
    const priceOffscreen = await card.locator('.a-price .a-offscreen').first().textContent({ timeout: 3000 });

    if (!priceOffscreen) {
      console.log(` here Card ${i + 1} "${title}" has no visible price`);
      continue;
    }
    const price = priceOffscreen

    // Success!
    console.log(`Found product #${i + 1}:`);
    console.log(`Title: ${title}`);
    console.log(`modified   Price: ${price}`);

    // Dump full HTML of this card for debugging
    const snippet = (await card.innerHTML()).slice(0, 500);
    fs.writeFileSync('/tmp/amazon-first-result.html', snippet, 'utf8');
    break;
  }

  await context.close();
});
