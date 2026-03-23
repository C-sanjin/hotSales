const CrawlerService = require('./src/services/crawler/CrawlerService');

async function testAllCrawlers() {
  console.log('========================================');
  console.log('开始测试所有平台爬虫');
  console.log('========================================\n');
  
  const startTime = Date.now();
  
  try {
    const results = await CrawlerService.runAllCrawlers();
    
    console.log('\n========================================');
    console.log('爬虫测试结果汇总');
    console.log('========================================\n');
    
    let totalProducts = 0;
    let successCount = 0;
    let mockCount = 0;
    
    results.forEach(result => {
      const status = result.usingMock ? '⚠️  使用模拟数据' : '✅ 真实数据';
      console.log(`${result.platform}:`);
      console.log(`  状态: ${status}`);
      console.log(`  数量: ${result.count} 个商品`);
      console.log(`  成功: ${result.success ? '是' : '否'}`);
      if (result.error) {
        console.log(`  错误: ${result.error}`);
      }
      console.log('');
      
      totalProducts += result.count;
      if (result.success && !result.usingMock) successCount++;
      if (result.usingMock) mockCount++;
    });
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('========================================');
    console.log('总体统计');
    console.log('========================================');
    console.log(`总耗时: ${duration} 秒`);
    console.log(`总商品数: ${totalProducts} 个`);
    console.log(`成功爬取真实数据: ${successCount}/4 个平台`);
    console.log(`使用模拟数据: ${mockCount}/4 个平台`);
    console.log('========================================\n');
    
    if (successCount === 4) {
      console.log('🎉 所有平台爬虫都能成功获取真实数据！');
    } else if (successCount > 0) {
      console.log(`⚠️  部分平台成功获取真实数据，${mockCount} 个平台使用模拟数据`);
    } else {
      console.log('❌ 所有平台都使用模拟数据，需要进一步优化');
    }
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testAllCrawlers();
