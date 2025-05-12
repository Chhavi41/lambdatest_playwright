const { test } = require('@playwright/test');
const { runAmazonTest } = require('./amazon-helpers');

test('Add Galaxy device to cart and print price', async ({ browser }) => {
  const context = await browser.newContext({
    headless: false,
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  await runAmazonTest(page, 'Galaxy S23');
  await context.close();
});
