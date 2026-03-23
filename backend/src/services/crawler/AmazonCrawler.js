const CrawlerUtils = require('./CrawlerUtils');
const cheerio = require('cheerio');

class AmazonCrawler {
  static async crawl() {
    try {
      // 检查robots.txt
      const robotsTxt = await CrawlerUtils.checkRobotsTxt('https://www.amazon.com');
      const isAllowed = CrawlerUtils.isAllowedToCrawl(
        robotsTxt, 
        'Mozilla/5.0', 
        'https://www.amazon.com/bestsellers/electronics'
      );
      
      if (!isAllowed) {
        console.warn('Amazon: Crawling not allowed by robots.txt');
        return [];
      }

      // 获取页面HTML
      console.log('Amazon: Fetching bestsellers page...');
      const html = await CrawlerUtils.fetchPage('https://www.amazon.com/bestsellers/electronics');
      const $ = cheerio.load(html);

      // 提取商品数据
      const products = [];
      
      // 尝试多个可能的选择器
      const selectors = [
        '[data-asin]',
        '._cDEzb_grid-column_2hIsc',
        '.zg-item-immersion',
        '[role="listitem"]'
      ];
      
      let productElements = [];
      for (const selector of selectors) {
        productElements = $(selector);
        if (productElements.length > 0) {
          console.log(`Amazon: Using selector "${selector}", found ${productElements.length} elements`);
          break;
        }
      }
      
      productElements.each((index, element) => {
        if (index >= 100) return; // 只取前100个
        
        try {
          const $element = $(element);
          
          // 提取标题
          const titleSelectors = [
            '._cDEzb_p13n-sc-css-line-clamp-3_g3dy1',
            '._cDEzb_p13n-sc-css-line-clamp-1_1Fn1y',
            '.p13n-sc-truncate',
            'h2 a span',
            'a span'
          ];
          
          let title = '';
          for (const titleSelector of titleSelectors) {
            title = $element.find(titleSelector).first().text().trim();
            if (title) break;
          }
          
          // 提取图片
          const imageSelectors = [
            'img',
            '.s-image',
            '.product-image'
          ];
          
          let image = '';
          for (const imageSelector of imageSelectors) {
            const imgElement = $element.find(imageSelector).first();
            image = imgElement.attr('src') || imgElement.attr('data-src') || '';
            if (image) break;
          }
          
          // 提取价格
          const priceSelectors = [
            '._cDEzb_p13n-sc-price_3mJ9Z',
            '.a-price .a-offscreen',
            '.a-price-whole',
            '.p13n-sc-price'
          ];
          
          let price = 0;
          for (const priceSelector of priceSelectors) {
            const priceText = $element.find(priceSelector).first().text();
            if (priceText) {
              const priceMatch = priceText.match(/[\d,.]+/);
              if (priceMatch) {
                price = parseFloat(priceMatch[0].replace(',', ''));
                break;
              }
            }
          }
          
          // 提取评分
          const ratingSelectors = [
            '.a-icon-alt',
            '[aria-label*="stars"]'
          ];
          
          let rating = 0;
          for (const ratingSelector of ratingSelectors) {
            const ratingText = $element.find(ratingSelector).first().attr('aria-label') || '';
            if (ratingText) {
              const ratingMatch = ratingText.match(/([\d.]+)/);
              if (ratingMatch) {
                rating = parseFloat(ratingMatch[1]);
                break;
              }
            }
          }
          
          // 提取评论数
          const reviewSelectors = [
            '.a-size-small',
            '[aria-label*="ratings"]'
          ];
          
          let reviewCount = 0;
          for (const reviewSelector of reviewSelectors) {
            const reviewText = $element.find(reviewSelector).first().text() || 
                              $element.find(reviewSelector).first().attr('aria-label') || '';
            if (reviewText) {
              const reviewMatch = reviewText.match(/(\d+,?\d*)/);
              if (reviewMatch) {
                reviewCount = parseInt(reviewMatch[1].replace(',', ''));
                break;
              }
            }
          }
          
          // 提取链接
          const linkSelectors = [
            'a.a-link-normal',
            'a[href*="/dp/"]'
          ];
          
          let productUrl = '';
          for (const linkSelector of linkSelectors) {
            const href = $element.find(linkSelector).first().attr('href');
            if (href) {
              productUrl = href.startsWith('http') ? href : `https://www.amazon.com${href}`;
              break;
            }
          }
          
          if (title && image && productUrl) {
            products.push({
              title,
              image,
              price,
              rating,
              reviewCount,
              productUrl,
              shopName: 'Amazon'
            });
          }
        } catch (error) {
          console.error('Error extracting product:', error);
        }
      });

      // 处理数据
      const processedProducts = products.map(product => ({
        id: CrawlerUtils.generateId('amazon', product.title),
        ...product,
        platform: 'amazon',
        currency: 'USD',
        salesCount: product.reviewCount * 10, // 估算销量
        isNew: false,
        salesTrend: 'stable',
        category: 'Electronics',
        listedDate: new Date(),
        crawlDate: new Date()
      }));

      console.log(`Amazon: Successfully crawled ${processedProducts.length} products`);
      return processedProducts;
      
    } catch (error) {
      console.error('Amazon crawler error:', error.message);
      console.error('Error details:', error);
      return [];
    }
  }
}

module.exports = AmazonCrawler;
