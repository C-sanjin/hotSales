const CrawlerService = require('./src/services/crawler/CrawlerService');
const DataService = require('./src/services/data/DataService');

async function testAllCrawlers() {
  console.log('=== 测试所有平台爬虫 ===\n');
  
  // 设置内存存储模式
  await DataService.setMongoConnected(false);
  
  try {
    const results = await CrawlerService.runAllCrawlers();
    
    console.log('\n=== 爬虫结果汇总 ===');
    results.forEach(result => {
      console.log(`${result.platform}: ${result.count} 个商品 ${result.success ? '✅' : '❌'} ${result.usingMock ? '(使用模拟数据)' : ''}`);
    });
    
    // 测试API
    console.log('\n=== 测试API数据 ===');
    const platforms = ['amazon', 'tiktok', 'shopee', 'lazada'];
    
    for (const platform of platforms) {
      const data = await DataService.getProducts(platform, 'today', {}, 1, 10);
      console.log(`${platform}: ${data.products.length} 个商品在内存中`);
    }
    
  } catch (error) {
    console.error('测试失败:', error);
  }
  
  console.log('\n=== 测试完成 ===');
  process.exit(0);
}

testAllCrawlers();
