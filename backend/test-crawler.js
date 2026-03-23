const MockCrawlerService = require('./src/services/crawler/MockCrawlerService');
const DataService = require('./src/services/data/DataService');

async function testCrawler() {
  console.log('=== 开始测试爬虫功能 ===\n');
  
  try {
    // 1. 运行爬虫
    console.log('1. 启动模拟爬虫...');
    const results = await MockCrawlerService.runAllCrawlers();
    console.log('\n爬虫执行结果:');
    console.log(JSON.stringify(results, null, 2));
    
    // 2. 查询各平台数据
    console.log('\n2. 查询各平台数据:');
    const platforms = ['amazon', 'tiktok', 'shopee', 'lazada'];
    
    for (const platform of platforms) {
      console.log(`\n--- ${platform.toUpperCase()} 平台 ---`);
      
      // 查询今日数据
      const todayData = await DataService.getProducts(platform, 'today', {}, 1, 3);
      console.log(`今日数据: ${todayData.total} 条`);
      
      if (todayData.products.length > 0) {
        console.log('\n商品示例:');
        todayData.products.forEach((product, index) => {
          console.log(`\n[${index + 1}] ${product.title}`);
          console.log(`    价格: $${product.price.toFixed(2)}`);
          console.log(`    评分: ${product.rating.toFixed(1)} (${product.reviewCount} 评论)`);
          console.log(`    销量: ${product.salesCount.toLocaleString()}`);
          console.log(`    店铺: ${product.shopName}`);
          console.log(`    新品: ${product.isNew ? '是' : '否'}`);
          console.log(`    趋势: ${product.salesTrend}`);
          console.log(`    类目: ${product.category}`);
          console.log(`    爬取时间: ${new Date(product.crawlDate).toLocaleString('zh-CN')}`);
        });
      }
    }
    
    // 3. 测试筛选功能
    console.log('\n3. 测试筛选功能:');
    const filteredData = await DataService.getProducts('amazon', 'today', {
      priceRange: '50-100',
      ratingRange: '4.5'
    }, 1, 5);
    console.log(`价格 $50-$100 且评分 4.5+ 的商品: ${filteredData.total} 条`);
    
    if (filteredData.products.length > 0) {
      console.log('\n筛选结果:');
      filteredData.products.forEach((product, index) => {
        console.log(`[${index + 1}] ${product.title} - $${product.price.toFixed(2)} - ${product.rating.toFixed(1)}⭐`);
      });
    }
    
    // 4. 测试搜索功能
    console.log('\n4. 测试搜索功能:');
    const searchData = await DataService.getProducts('amazon', 'today', {
      keyword: 'Electronics'
    }, 1, 5);
    console.log(`包含 "Electronics" 的商品: ${searchData.total} 条`);
    
    if (searchData.products.length > 0) {
      console.log('\n搜索结果:');
      searchData.products.forEach((product, index) => {
        console.log(`[${index + 1}] ${product.title}`);
      });
    }
    
    // 5. 测试历史数据查询
    console.log('\n5. 测试历史数据查询:');
    const weekData = await DataService.getProducts('amazon', 'week', {}, 1, 3);
    console.log(`近一周数据: ${weekData.total} 条`);
    
    const monthData = await DataService.getProducts('amazon', 'month', {}, 1, 3);
    console.log(`近一个月数据: ${monthData.total} 条`);
    
    // 6. 统计信息
    console.log('\n6. 数据统计:');
    const stats = await DataService.getPlatformStats('amazon');
    console.log(`亚马逊平台统计:`);
    console.log(`    总商品数: ${stats.totalProducts}`);
    console.log(`    平均价格: $${stats.avgPrice.toFixed(2)}`);
    console.log(`    平均评分: ${stats.avgRating.toFixed(1)}`);
    console.log(`    总销量: ${stats.totalSales.toLocaleString()}`);
    
    console.log('\n=== 爬虫测试完成 ===');
    
  } catch (error) {
    console.error('测试失败:', error);
    console.error('错误堆栈:', error.stack);
  }
}

testCrawler();
