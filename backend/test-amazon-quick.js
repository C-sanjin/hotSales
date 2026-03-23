const AmazonCrawler = require('./src/services/crawler/AmazonCrawler');

async function testAmazon() {
  console.log('测试Amazon爬虫...\n');
  const startTime = Date.now();
  
  try {
    const products = await AmazonCrawler.crawl();
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`\n✅ Amazon爬虫测试完成`);
    console.log(`耗时: ${duration} 秒`);
    console.log(`获取商品数: ${products.length} 个`);
    
    if (products.length > 0) {
      console.log('\n示例商品:');
      console.log(`- ${products[0].title}`);
      console.log(`  价格: $${products[0].price}`);
      console.log(`  销量: ${products[0].salesCount}`);
      console.log(`  评分: ${products[0].rating}`);
    }
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

testAmazon();
