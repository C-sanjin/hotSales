const DataService = require('./src/services/data/DataService');
const MockCrawlerService = require('./src/services/crawler/MockCrawlerService');

async function testDataFlow() {
  console.log('=== 测试数据流 ===');
  console.log('1. 启动模拟爬虫...');
  
  try {
    const results = await MockCrawlerService.runAllCrawlers();
    console.log('爬虫结果:', results);
    
    console.log('\n2. 测试数据查询...');
    const amazonProducts = await DataService.getProducts('amazon', 'today', {}, 1, 10);
    console.log('亚马逊商品数量:', amazonProducts.total);
    console.log('返回商品数:', amazonProducts.products.length);
    
    if (amazonProducts.products.length > 0) {
      console.log('\n3. 查看第一个商品数据:');
      console.log(JSON.stringify(amazonProducts.products[0], null, 2));
    }
    
    console.log('\n4. 测试筛选功能...');
    const filteredProducts = await DataService.getProducts('amazon', 'today', { priceRange: '50-100' }, 1, 5);
    console.log('价格筛选结果数量:', filteredProducts.total);
    
    console.log('\n5. 测试搜索功能...');
    const searchedProducts = await DataService.getProducts('amazon', 'today', { keyword: 'Electronics' }, 1, 5);
    console.log('搜索结果数量:', searchedProducts.total);
    
    console.log('\n=== 数据流测试完成 ===');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testDataFlow();
