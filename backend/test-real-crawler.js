const CrawlerService = require('./src/services/crawler/CrawlerService');
const DataService = require('./src/services/data/DataService');

async function testRealCrawler() {
  console.log('=== 测试真实爬虫功能 ===\n');
  
  try {
    // 1. 运行真实爬虫
    console.log('1. 启动真实爬虫...');
    console.log('注意：真实爬虫可能会因为网络、反爬机制等原因失败\n');
    
    const results = await CrawlerService.runAllCrawlers();
    console.log('\n爬虫执行结果:');
    console.log(JSON.stringify(results, null, 2));
    
    // 2. 查询各平台数据
    console.log('\n2. 查询各平台数据:');
    const platforms = ['amazon', 'tiktok', 'shopee', 'lazada'];
    
    for (const platform of platforms) {
      console.log(`\n--- ${platform.toUpperCase()} 平台 ---`);
      
      const todayData = await DataService.getProducts(platform, 'today', {}, 1, 3);
      console.log(`今日数据: ${todayData.total} 条`);
      
      if (todayData.products.length > 0) {
        console.log('\n商品示例:');
        todayData.products.forEach((product, index) => {
          const dataSource = product.title.includes('Product') ? '模拟数据' : '真实爬取';
          console.log(`\n[${index + 1}] ${product.title}`);
          console.log(`    价格: $${product.price.toFixed(2)}`);
          console.log(`    评分: ${product.rating.toFixed(1)} (${product.reviewCount} 评论)`);
          console.log(`    销量: ${product.salesCount.toLocaleString()}`);
          console.log(`    店铺: ${product.shopName}`);
          console.log(`    新品: ${product.isNew ? '是' : '否'}`);
          console.log(`    趋势: ${product.salesTrend}`);
          console.log(`    类目: ${product.category}`);
          console.log(`    数据来源: ${dataSource}`);
          console.log(`    爬取时间: ${new Date(product.crawlDate).toLocaleString('zh-CN')}`);
        });
      }
    }
    
    // 3. 统计真实爬取vs模拟数据
    console.log('\n3. 数据来源统计:');
    let realCount = 0;
    let mockCount = 0;
    
    results.forEach(result => {
      if (result.usingMock) {
        mockCount += result.count;
        console.log(`${result.platform}: 模拟数据 (${result.count}条)`);
      } else {
        realCount += result.count;
        console.log(`${result.platform}: 真实爬取 (${result.count}条)`);
      }
    });
    
    console.log(`\n总计: 真实爬取 ${realCount} 条，模拟数据 ${mockCount} 条`);
    
    console.log('\n=== 真实爬虫测试完成 ===');
    
  } catch (error) {
    console.error('测试失败:', error);
    console.error('错误堆栈:', error.stack);
  }
}

testRealCrawler();
