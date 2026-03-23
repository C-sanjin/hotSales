console.log('测试数据流...');

const DataService = require('./src/services/data/DataService');
const MockCrawlerService = require('./src/services/crawler/MockCrawlerService');

async function test() {
  try {
    console.log('1. 运行爬虫...');
    const results = await MockCrawlerService.runAllCrawlers();
    console.log('爬虫完成:', results);
    
    console.log('2. 查询数据...');
    const data = await DataService.getProducts('amazon', 'today', {}, 1, 5);
    console.log('查询结果:', data.total, '条记录');
    
    if (data.products.length > 0) {
      console.log('3. 商品示例:', data.products[0].title);
    }
    
    console.log('测试完成！');
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

test();
