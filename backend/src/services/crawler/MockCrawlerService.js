const DataService = require('../data/DataService');

class MockCrawlerService {
  static async runAllCrawlers() {
    console.log('Starting mock crawlers at:', new Date().toISOString());
    
    const results = [];
    const platforms = [
      { name: 'Amazon', id: 'amazon' },
      { name: 'TikTok Shop', id: 'tiktok' },
      { name: 'Shopee', id: 'shopee' },
      { name: 'Lazada', id: 'lazada' }
    ];

    for (const platform of platforms) {
      try {
        console.log(`Generating mock data for ${platform.name}...`);
        const products = this.generateMockProducts(platform.id);
        results.push({ platform: platform.name, count: products.length, success: true });
        
        // 存储数据
        if (products.length > 0) {
          await DataService.saveProducts(products);
        }
        
        // 爬虫间隔
        await this.delay(1000);
      } catch (error) {
        console.error(`Error generating mock data for ${platform.name}:`, error);
        results.push({ platform: platform.name, count: 0, success: false, error: error.message });
      }
    }

    console.log('Mock data generation completed at:', new Date().toISOString());
    console.log('Results:', results);
    
    return results;
  }

  static async cleanOldData(daysToKeep = 30) {
    try {
      const instance = DataService.getInstance();
      
      if (!instance.isMongoConnected) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        const beforeCount = instance.memoryStorage.length;
        instance.memoryStorage = instance.memoryStorage.filter(p => new Date(p.crawlDate) >= cutoffDate);
        const afterCount = instance.memoryStorage.length;
        
        console.log(`Cleaned ${beforeCount - afterCount} old products from memory`);
        return { deletedCount: beforeCount - afterCount };
      }
      
      const Product = require('../../models/Product');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const result = await Product.deleteMany({ crawlDate: { $lt: cutoffDate } });
      console.log(`Cleaned ${result.deletedCount} old products`);
      
      return result;
    } catch (error) {
      console.error('Error cleaning old data:', error);
      throw error;
    }
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static generateMockProducts(platform) {
    const products = [];
    const categories = ['Electronics', 'Audio', 'Phone', 'Charger', 'Smart Home', 'Computer'];
    
    for (let i = 0; i < 20; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const price = Math.floor(Math.random() * 200) + 10;
      const rating = (Math.random() * 2 + 3).toFixed(1);
      const reviewCount = Math.floor(Math.random() * 10000) + 100;
      const salesCount = Math.floor(Math.random() * 50000) + 1000;
      const isNew = Math.random() > 0.8;
      const salesTrend = Math.random() > 0.5 ? 'up' : (Math.random() > 0.5 ? 'down' : 'stable');
      
      products.push({
        id: `${platform}-${Date.now()}-${i}`,
        title: `${category} Product ${i + 1} - ${['Premium', 'Pro', 'Max', 'Ultra', 'Lite'][Math.floor(Math.random() * 5)]} Edition`,
        image: `https://via.placeholder.com/400x400/667eea/ffffff?text=${encodeURIComponent(category)}+${i}`,
        price,
        originalPrice: price * (Math.random() > 0.7 ? 1.2 : 1),
        currency: 'USD',
        rating: parseFloat(rating),
        reviewCount,
        salesCount,
        shopName: `${platform} Official Store`,
        platform,
        productUrl: `https://example.com/${platform}/product/${i}`,
        isNew,
        salesTrend,
        category,
        listedDate: new Date(),
        crawlDate: new Date()
      });
    }
    
    return products;
  }
}

module.exports = MockCrawlerService;
