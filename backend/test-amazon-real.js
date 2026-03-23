const AmazonCrawler = require('./src/services/crawler/AmazonCrawler');

async function testAmazonRealCrawler() {
  console.log('=== 测试Amazon真实爬虫 ===\n');
  
  try {
    console.log('开始爬取Amazon 3C电子热卖商品...\n');
    
    const products = await AmazonCrawler.crawl();
    
    console.log(`\n爬取完成！共获取 ${products.length} 个商品\n`);
    
    if (products.length > 0) {
      console.log('=== 商品列表 ===\n');
      
      products.forEach((product, index) => {
        console.log(`[${index + 1}] ${product.title}`);
        console.log(`    价格: $${product.price.toFixed(2)}`);
        console.log(`    评分: ${product.rating.toFixed(1)} (${product.reviewCount} 评论)`);
        console.log(`    销量: ${product.salesCount.toLocaleString()}`);
        console.log(`    店铺: ${product.shopName}`);
        console.log(`    平台: ${product.platform}`);
        console.log(`    类目: ${product.category}`);
        console.log(`    图片: ${product.image ? '有' : '无'}`);
        console.log(`    链接: ${product.productUrl ? '有' : '无'}`);
        console.log(`    爬取时间: ${new Date(product.crawlDate).toLocaleString('zh-CN')}`);
        console.log('');
      });
      
      console.log('=== 统计信息 ===');
      const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
      const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
      const totalSales = products.reduce((sum, p) => sum + p.salesCount, 0);
      
      console.log(`平均价格: $${avgPrice.toFixed(2)}`);
      console.log(`平均评分: ${avgRating.toFixed(1)}`);
      console.log(`总销量: ${totalSales.toLocaleString()}`);
    } else {
      console.log('⚠️ 没有爬取到任何商品');
      console.log('可能原因：');
      console.log('1. Chrome浏览器未安装或路径不正确');
      console.log('2. Amazon页面结构发生变化');
      console.log('3. 网络连接问题');
      console.log('4. Amazon反爬机制');
    }
    
  } catch (error) {
    console.error('测试失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

testAmazonRealCrawler();
