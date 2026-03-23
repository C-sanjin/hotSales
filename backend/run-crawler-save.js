const CrawlerService = require('./src/services/crawler/CrawlerService');

async function runCrawlerAndSave() {
  console.log('========================================');
  console.log('开始运行爬虫并保存数据到数据库');
  console.log('========================================\n');
  
  try {
    const results = await CrawlerService.runAllCrawlers();
    
    console.log('\n========================================');
    console.log('爬虫运行结果');
    console.log('========================================\n');
    
    results.forEach(result => {
      const status = result.usingMock ? '⚠️  模拟数据' : '✅ 真实数据';
      console.log(`${result.platform}: ${status} (${result.count}个商品)`);
    });
    
    console.log('\n✅ 数据已保存到数据库！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 运行失败:', error.message);
    process.exit(1);
  }
}

runCrawlerAndSave();
