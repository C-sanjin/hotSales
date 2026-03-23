const AmazonCrawler = require('./src/services/crawler/AmazonCrawler');
const ShopeeCrawler = require('./src/services/crawler/ShopeeCrawler');
const LazadaCrawler = require('./src/services/crawler/LazadaCrawler');
const DataService = require('./src/services/data/DataService');

async function testCrawlers() {
  console.log('========================================');
  console.log('测试爬虫 (跳过TikTok Shop)');
  console.log('========================================\n');
  
  const allProducts = [];
  
  console.log('1. 测试Amazon爬虫...');
  try {
    const amazonProducts = await AmazonCrawler.crawl();
    console.log(`   ✅ Amazon: ${amazonProducts.length} 个商品`);
    allProducts.push(...amazonProducts);
  } catch (error) {
    console.log(`   ❌ Amazon失败: ${error.message}`);
  }
  
  console.log('\n2. 测试Shopee爬虫...');
  try {
    const shopeeProducts = await ShopeeCrawler.crawl();
    console.log(`   ✅ Shopee: ${shopeeProducts.length} 个商品`);
    allProducts.push(...shopeeProducts);
  } catch (error) {
    console.log(`   ❌ Shopee失败: ${error.message}`);
  }
  
  console.log('\n3. 测试Lazada爬虫...');
  try {
    const lazadaProducts = await LazadaCrawler.crawl();
    console.log(`   ✅ Lazada: ${lazadaProducts.length} 个商品`);
    allProducts.push(...lazadaProducts);
  } catch (error) {
    console.log(`   ❌ Lazada失败: ${error.message}`);
  }
  
  console.log(`\n========================================`);
  console.log(`总共获取: ${allProducts.length} 个商品`);
  console.log(`========================================\n`);
  
  if (allProducts.length > 0) {
    console.log('保存到数据库...');
    try {
      await DataService.saveProducts(allProducts);
      console.log('✅ 数据保存成功！');
    } catch (error) {
      console.log(`❌ 保存失败: ${error.message}`);
    }
  }
}

testCrawlers().catch(console.error);
