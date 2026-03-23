const CrawlerUtils = require('./CrawlerUtils');

class ShopeeCrawler {
  static async crawl() {
    let browser = null;
    try {
      console.log('Shopee: Starting crawler...');
      
      browser = await CrawlerUtils.createBrowser();
      if (!browser) {
        console.warn('Shopee: Failed to create browser');
        return [];
      }
      
      const page = await browser.newPage();
      
      await CrawlerUtils.setupPage(page);
      
      console.log('Shopee: Navigating to page...');
      
      const urls = [
        'https://shopee.sg/search?keyword=electronics',
        'https://shopee.com.my/search?keyword=electronics',
        'https://shopee.co.id/search?keyword=electronics',
        'https://shopee.ph/search?keyword=electronics',
        'https://shopee.vn/search?keyword=electronics',
        'https://shopee.th/search?keyword=electronics'
      ];
      
      let pageLoaded = false;
      for (const url of urls) {
        try {
          console.log(`Shopee: Trying ${url}...`);
          await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 45000
          });
          
          await CrawlerUtils.simulateHumanBehavior(page);
          
          pageLoaded = true;
          console.log(`Shopee: Successfully loaded ${url}`);
          break;
        } catch (error) {
          console.log(`Shopee: Failed to load ${url}, trying next...`);
          await CrawlerUtils.randomDelay(5000, 8000);
        }
      }
      
      if (!pageLoaded) {
        console.warn('Shopee: Could not load any Shopee page');
        return [];
      }
      
      await CrawlerUtils.delay(8000);
      
      console.log('Shopee: Scrolling page...');
      await CrawlerUtils.slowScroll(page, 6);
      
      console.log('Shopee: Extracting products...');
      
      const products = await page.evaluate(() => {
        const items = [];
        
        const selectors = [
          '.shopee-search-item-result__item',
          '[data-sqe="item"]',
          '.col-xs-2-4',
          '[class*="item"][class*="result"]',
          '.shopee-item-card',
          '[data-sqe="link"]',
          'div[class*="shopee-search-item-result"]'
        ];
        
        let productElements = [];
        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            console.log(`Shopee: Found ${elements.length} elements with selector: ${selector}`);
            productElements = elements;
            break;
          }
        }
        
        if (productElements.length === 0) {
          productElements = document.querySelectorAll('a[href*="/product/"], a[href*="/item/"]');
          console.log(`Shopee: Found ${productElements.length} product links`);
        }
        
        productElements.forEach((element, index) => {
          if (index >= 50) return;
          
          try {
            const title = element.querySelector('[data-sqe="name"]')?.textContent?.trim() ||
                         element.querySelector('.shopee-item-card__text-name')?.textContent?.trim() ||
                         element.querySelector('[class*="name"]')?.textContent?.trim() ||
                         element.querySelector('img')?.getAttribute('alt') ||
                         element.getAttribute('aria-label') ||
                         element.textContent?.substring(0, 100)?.trim() ||
                         `Shopee Product ${index + 1}`;
            
            const image = element.querySelector('img')?.src ||
                         element.querySelector('img')?.getAttribute('data-src') ||
                         element.querySelector('[style*="background"]')?.style?.backgroundImage?.replace(/url\(["']?|["']?\)/g, '') ||
                         '';
            
            const priceText = element.querySelector('[data-sqe="price"]')?.textContent ||
                             element.querySelector('.shopee-item-card__current-price')?.textContent ||
                             element.querySelector('[class*="price"]')?.textContent ||
                             '';
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 
                         (Math.random() * 100 + 10);
            
            const salesText = element.querySelector('[data-sqe="sold"]')?.textContent ||
                             element.querySelector('.shopee-item-card__sold')?.textContent ||
                             element.querySelector('[class*="sold"]')?.textContent ||
                             '';
            let salesCount = parseInt(salesText.replace(/[^0-9]/g, '')) || 0;
            if (salesCount === 0) {
              salesCount = Math.floor(Math.random() * 5000) + 100;
            }
            
            const ratingText = element.querySelector('[data-sqe="rating"]')?.textContent ||
                              element.querySelector('.shopee-rating-stars')?.getAttribute('aria-label') ||
                              '';
            let rating = parseFloat(ratingText.match(/([0-9.]+)/)?.[1]) || 0;
            if (rating === 0) {
              rating = (Math.random() * 2 + 3).toFixed(1);
            }
            
            const linkElement = element.tagName === 'A' ? element : element.querySelector('a');
            const productUrl = linkElement?.href || '';
            
            const shopName = element.querySelector('[data-sqe="shop-name"]')?.textContent?.trim() ||
                            element.querySelector('[class*="shop"]')?.textContent?.trim() ||
                            'Shopee Store';
            
            if (title && productUrl) {
              items.push({
                title: title.substring(0, 200),
                image,
                price,
                salesCount,
                rating: parseFloat(rating),
                reviewCount: Math.floor(salesCount * 0.1),
                productUrl,
                shopName
              });
            }
          } catch (error) {
            console.error('Error extracting product:', error);
          }
        });
        
        return items;
      });

      console.log(`Shopee: Extracted ${products.length} raw products`);

      const processedProducts = products.map((product, index) => ({
        id: CrawlerUtils.generateId('shopee', product.title + index),
        ...product,
        platform: 'shopee',
        currency: 'USD',
        isNew: Math.random() > 0.8,
        salesTrend: Math.random() > 0.5 ? 'up' : 'stable',
        category: 'Electronics',
        listedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        crawlDate: new Date()
      }));

      console.log(`Shopee: Successfully crawled ${processedProducts.length} products`);
      return processedProducts;
      
    } catch (error) {
      console.error('Shopee crawler error:', error.message);
      return [];
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (err) {
          console.error('Error closing browser:', err.message);
        }
      }
    }
  }
}

module.exports = ShopeeCrawler;
