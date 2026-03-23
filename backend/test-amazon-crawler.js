const CrawlerUtils = require('./src/services/crawler/CrawlerUtils');
const cheerio = require('cheerio');

async function testAmazonCrawler() {
  console.log('=== 测试Amazon爬虫 ===\n');
  
  try {
    // 1. 检查robots.txt
    console.log('1. 检查robots.txt...');
    const robotsTxt = await CrawlerUtils.checkRobotsTxt('https://www.amazon.com');
    console.log('Robots.txt获取:', robotsTxt ? '成功' : '失败');
    
    if (robotsTxt) {
      const isAllowed = CrawlerUtils.isAllowedToCrawl(
        robotsTxt, 
        'Mozilla/5.0', 
        'https://www.amazon.com/bestsellers/electronics'
      );
      console.log('是否允许爬取:', isAllowed);
      
      if (!isAllowed) {
        console.warn('Amazon: Crawling not allowed by robots.txt');
        return;
      }
    }
    
    // 2. 获取页面HTML
    console.log('\n2. 获取页面HTML...');
    const html = await CrawlerUtils.fetchPage('https://www.amazon.com/bestsellers/electronics');
    console.log('页面获取:', html ? '成功' : '失败');
    console.log('HTML长度:', html ? html.length : 0);
    
    if (!html) {
      console.error('无法获取页面HTML');
      return;
    }
    
    // 3. 解析HTML
    console.log('\n3. 解析HTML...');
    const $ = cheerio.load(html);
    
    // 检查选择器
    const selector = '.zg-item-immersion';
    const elements = $(selector);
    console.log(`找到元素: ${elements.length} 个`);
    
    if (elements.length === 0) {
      console.log('选择器没有找到元素，尝试其他选择器...');
      
      // 尝试其他可能的选择器
      const alternativeSelectors = [
        '.p13n-sc-truncate',
        '.s-result-item',
        '[data-component-type="s-search-result"]',
        '.sg-col-inner'
      ];
      
      for (const altSelector of alternativeSelectors) {
        const altElements = $(altSelector);
        console.log(`选择器 "${altSelector}": ${altElements.length} 个元素`);
      }
    }
    
    // 4. 提取商品数据
    console.log('\n4. 提取商品数据...');
    const products = [];
    $(selector).each((index, element) => {
      if (index >= 5) return; // 只取前5个测试
        
      try {
        const title = $(element).find('.p13n-sc-truncate-desktop-type2, .a-size-base-plus').text().trim() || '';
        const image = $(element).find('img').attr('src') || '';
        
        const priceText = $(element).find('.p13n-sc-price, .a-price-whole, .a-offscreen').text() || '';
        const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
        
        const ratingText = $(element).find('.a-icon-alt').attr('aria-label') || '';
        const rating = parseFloat(ratingText.match(/([0-9.]+)/)?.[1]) || 0;
        
        const reviewCountText = $(element).find('.a-size-small').text() || '';
        const reviewCount = parseInt(reviewCountText.replace(/[^0-9]/g, '')) || 0;
        
        const productUrl = $(element).find('a').attr('href') || '';
        
        console.log(`\n商品 ${index + 1}:`);
        console.log(`  标题: ${title}`);
        console.log(`  图片: ${image ? '有' : '无'}`);
        console.log(`  价格: ${price}`);
        console.log(`  评分: ${rating}`);
        console.log(`  评论数: ${reviewCount}`);
        console.log(`  URL: ${productUrl ? '有' : '无'}`);
        
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
    
    console.log(`\n成功提取 ${products.length} 个商品`);
    
  } catch (error) {
    console.error('Amazon爬虫测试失败:', error);
    console.error('错误堆栈:', error.stack);
  }
}

testAmazonCrawler();
