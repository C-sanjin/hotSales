const CrawlerService = require('./src/services/crawler/CrawlerService');
const DataService = require('./src/services/data/DataService');

async function triggerCrawler() {
  console.log('=== 手动触发爬虫 ===\n');
  
  try {
    // 运行爬虫
    console.log('1. 启动爬虫...');
    const results = await CrawlerService.runAllCrawlers();
    
    console.log('\n爬虫执行结果:');
    results.forEach(result => {
      console.log(`${result.platform}: ${result.count} 条数据 (${result.usingMock ? '模拟数据' : '真实数据'})`);
    });
    
    // 验证数据
    console.log('\n2. 验证数据存储...');
    const amazonData = await DataService.getProducts('amazon', 'today', {}, 1, 5);
    console.log(`Amazon数据: ${amazonData.total} 条`);
    
    if (amazonData.products.length > 0) {
      console.log('\n数据示例:');
      amazonData.products.forEach((product, index) => {
        console.log(`\n[${index + 1}] ${product.title}`);
        console.log(`    价格: $${product.price.toFixed(2)}`);
        console.log(`    评分: ${product.rating.toFixed(1)} (${product.reviewCount} 评论)`);
        console.log(`    销量: ${product.salesCount.toLocaleString()}`);
      });
    }
    
    console.log('\n=== 爬虫触发完成 ===');
    
  } catch (error) {
    console.error('触发失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

triggerCrawler();
