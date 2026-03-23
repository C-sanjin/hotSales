const AmazonCrawler = require('./AmazonCrawler');
const MockCrawlerService = require('./MockCrawlerService');

class CrawlerService {
  static async runAllCrawlers() {
    console.log('Starting real crawlers at:', new Date().toISOString());
    
    const results = [];
    const platforms = [
      { name: 'Amazon', id: 'amazon', crawler: AmazonCrawler }
    ];

    for (const platform of platforms) {
      try {
        console.log(`\n=== Starting ${platform.name} crawler ===`);
        
        const crawlWithTimeout = Promise.race([
          platform.crawler.crawl(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Crawler timeout')), 120000)
          )
        ]);
        
        const products = await crawlWithTimeout;
        
        if (products.length > 0) {
          console.log(`${platform.name}: Successfully crawled ${products.length} products`);
          
          const DataService = require('../data/DataService');
          await DataService.saveProducts(products);
          
          results.push({ platform: platform.name, count: products.length, success: true });
        } else {
          console.warn(`${platform.name}: No products crawled, using mock data`);
          
          const mockProducts = MockCrawlerService.generateMockProducts(platform.id);
          const DataService = require('../data/DataService');
          await DataService.saveProducts(mockProducts);
          
          results.push({ platform: platform.name, count: mockProducts.length, success: true, usingMock: true });
        }
        
        await this.delay(3000);
      } catch (error) {
        console.error(`Error crawling ${platform.name}:`, error.message);
        console.log(`${platform.name}: Using mock data as fallback`);
        
        const mockProducts = MockCrawlerService.generateMockProducts(platform.id);
        const DataService = require('../data/DataService');
        await DataService.saveProducts(mockProducts);
        
        results.push({ platform: platform.name, count: mockProducts.length, success: false, error: error.message, usingMock: true });
      }
    }

    console.log('\n=== Crawling completed at:', new Date().toISOString());
    console.log('Results:', results);
    
    return results;
  }

  static async saveProducts(products) {
    try {
      const DataService = require('../data/DataService');
      const result = await DataService.saveProducts(products);
      console.log(`Saved ${result.upsertedCount + result.modifiedCount} products`);
      return result;
    } catch (error) {
      console.error('Error saving products:', error);
      throw error;
    }
  }

  static async cleanOldData(daysToKeep = 30) {
    try {
      const ProductSchema = require('../../models/ProductSchema');
      console.log(`开始清理超过 ${daysToKeep} 天的旧数据...`);
      const result = await ProductSchema.cleanOldData(daysToKeep);
      console.log(`旧数据清理完成，删除了 ${result.affectedRows} 条记录`);
      return result;
    } catch (error) {
      console.error('Error cleaning old data:', error);
      throw error;
    }
  }
  
  static async cleanDuplicateData() {
    try {
      const ProductSchema = require('../../models/ProductSchema');
      console.log('开始清理重复数据...');
      const result = await ProductSchema.cleanDuplicateData();
      console.log(`重复数据清理完成，删除了 ${result.affectedRows} 条记录`);
      return result;
    } catch (error) {
      console.error('Error cleaning duplicate data:', error);
      throw error;
    }
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = CrawlerService;
