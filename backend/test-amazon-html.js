const CrawlerUtils = require('./src/services/crawler/CrawlerUtils');

async function testAmazonHTML() {
  console.log('=== 测试Amazon HTML内容 ===\n');
  
  try {
    // 获取页面HTML
    console.log('获取页面HTML...');
    const html = await CrawlerUtils.fetchPage('https://www.amazon.com/bestsellers/electronics');
    console.log('HTML长度:', html.length);
    
    // 检查是否包含验证页面
    if (html.includes('CAPTCHA') || html.includes('captcha') || html.includes('Robot')) {
      console.log('\n⚠️ Amazon返回了验证页面（CAPTCHA）');
      console.log('这是Amazon的反爬机制');
    }
    
    // 检查是否包含商品相关关键词
    const keywords = ['bestseller', 'product', 'price', 'rating', 'review'];
    console.log('\n检查HTML中的关键词:');
    keywords.forEach(keyword => {
      const count = (html.match(new RegExp(keyword, 'gi')) || []).length;
      console.log(`  "${keyword}": ${count} 次`);
    });
    
    // 检查是否有JavaScript渲染的内容
    if (html.includes('data-client-side-rendering') || html.includes('window.P')) {
      console.log('\n⚠️ 页面使用了客户端JavaScript渲染');
      console.log('Cheerio无法处理JavaScript渲染的内容');
    }
    
    // 检查是否包含常见的选择器
    console.log('\n检查常见的选择器:');
    const selectors = [
      'data-asin',
      'data-component-type',
      'class="a-price"',
      'class="a-icon-alt"'
    ];
    selectors.forEach(selector => {
      const count = (html.match(new RegExp(selector, 'gi')) || []).length;
      console.log(`  "${selector}": ${count} 次`);
    });
    
    // 保存HTML到文件以便检查
    const fs = require('fs');
    const path = require('path');
    const htmlPath = path.join(__dirname, 'amazon-page.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`\nHTML已保存到: ${htmlPath}`);
    console.log('您可以打开文件查看实际的HTML结构');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testAmazonHTML();
