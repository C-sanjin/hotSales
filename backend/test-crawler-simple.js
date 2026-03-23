const TikTokCrawler = require('./src/services/crawler/TikTokCrawler');
const ShopeeCrawler = require('./src/services/crawler/ShopeeCrawler');
const LazadaCrawler = require('./src/services/crawler/LazadaCrawler');

async function testCrawlers() {
  console.log('=== 简单测试爬虫 ===\n');
  
  // 测试TikTok Shop
  console.log('1. 测试TikTok Shop爬虫...');
  try {
    const tiktokProducts = await TikTokCrawler.crawl();
    console.log(`TikTok Shop: 爬取到 ${tiktokProducts.length} 个商品\n`);
  } catch (error) {
    console.error('TikTok Shop 错误:', error.message);
  }
  
  // 测试Shopee
  console.log('2. 测试Shopee爬虫...');
  try {
    const shopeeProducts = await ShopeeCrawler.crawl();
    console.log(`Shopee: 爬取到 ${shopeeProducts.length} 个商品\n`);
  } catch (error) {
    console.error('Shopee 错误:', error.message);
  }
  
  // 测试Lazada
  console.log('3. 测试Lazada爬虫...');
  try {
    const lazadaProducts = await LazadaCrawler.crawl();
    console.log(`Lazada: 爬取到 ${lazadaProducts.length} 个商品\n`);
  } catch (error) {
    console.error('Lazada 错误:', error.message);
  }
  
  console.log('=== 测试完成 ===');
  process.exit(0);
}

testCrawlers();
