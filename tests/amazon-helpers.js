// amazon-helpers.js

exports.runAmazonTest = async function runAmazonTest(page, searchQuery) {
    console.log(`Navigating to Amazon.in`);
    await page.goto('https://www.amazon.in', { waitUntil: 'domcontentloaded' });
  
    console.log(`Searching for "${searchQuery}"`);
    await page.waitForSelector('#twotabsearchtextbox');
    await page.fill('#twotabsearchtextbox', searchQuery);
    await page.click('#nav-search-submit-button');
  
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(500);
    }
  
    await page.waitForSelector('.s-main-slot .s-result-item[data-asin]', { timeout: 20000 });
    const cards = page.locator('.s-main-slot .s-result-item[data-asin]');
    const count = await cards.count();
    console.log('20: ', count)
    let productFound = false;
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const link = card.locator('a.a-link-normal.s-line-clamp-2');
      if (await link.count() === 0) continue;
  
      const titleSpan = link.locator('h2 span');
      const title = (await titleSpan.textContent())?.trim() || '';
      const price = await card.locator('.a-price .a-offscreen').first().textContent().catch(() => null);
      if (!price || !title.toLowerCase().includes(searchQuery.toLowerCase())) continue;
      if (/case|cover|charger|screen protector/i.test(title.toLowerCase())) continue;

  
      const href = await link.first().getAttribute('href');
      const productUrl = `https://www.amazon.in${href?.split('?')[0]}`;
      console.log(`Opening product: ${title}`);
      await page.goto(productUrl, { waitUntil: 'domcontentloaded' });
      productFound = true;
      break;
    }
  
    if (!productFound) {
      console.error('❌ No matching product found!');
      return;
    }
  
    const addToCartBtn = page.locator('input#add-to-cart-button[type="submit"]');
    await addToCartBtn.waitFor({ timeout: 15000 }).catch(() => {
      console.error('❌ Add to Cart button not found or product unavailable.');
      return;
    });
    await addToCartBtn.click();
  
    await page.waitForTimeout(3000);
    await page.waitForSelector('#productTitle', { timeout: 10000 });
    const productTitleRaw = await page.locator('span#productTitle').textContent().catch(() => 'N/A');
    const productPriceRaw = await page.locator('.a-price .a-offscreen').first().textContent().catch(() => 'N/A');

    const productTitle = productTitleRaw?.trim() || 'N/A';
    const productPrice = productPriceRaw?.trim() || 'N/A';
  
    console.log(`Added to Cart`);
    console.log(`Product Title: ${productTitle?.trim()}`);
    console.log(`₹ Product Price: ${productPrice?.trim()}`);
  };
  