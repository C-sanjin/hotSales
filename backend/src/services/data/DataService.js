const ProductSchema = require('../../models/ProductSchema');

class DataService {
  constructor() {
    this.memoryStorage = [];
    this.isMySQLConnected = false;
  }

  static async getProducts(platform, timeRange = 'today', filters = {}, page = 1, limit = 20) {
    try {
      const instance = DataService.getInstance();
      
      // 今日数据从内存读取，近一周和近一个月从数据库读取
      if (timeRange === 'today') {
        const memoryResult = instance.getProductsFromMemory(platform, timeRange, filters, page, limit);
        // 如果内存没有数据，从数据库获取最新数据
        if (memoryResult.products.length === 0 && instance.isMySQLConnected) {
          console.log('No data in memory, fetching from database');
          return instance.getProductsFromMySQL(platform, timeRange, filters, page, limit);
        }
        return memoryResult;
      } else if (instance.isMySQLConnected) {
        return instance.getProductsFromMySQL(platform, timeRange, filters, page, limit);
      } else {
        // 如果MySQL未连接，回退到内存读取
        return instance.getProductsFromMemory(platform, timeRange, filters, page, limit);
      }
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  static async getProductById(id) {
    try {
      const instance = DataService.getInstance();
      
      if (!instance.isMySQLConnected) {
        return instance.getProductFromMemory(id);
      }
      
      const product = await ProductSchema.getProductById(id);
      return product;
    } catch (error) {
      console.error('Error getting product by id:', error);
      throw error;
    }
  }

  static async saveProducts(products) {
    try {
      const instance = DataService.getInstance();
      
      const cleanedProducts = instance.cleanProducts(products);
      
      if (!instance.isMySQLConnected) {
        return instance.saveProductsToMemory(cleanedProducts);
      }
      
      const result = await ProductSchema.insertProducts(cleanedProducts);
      console.log(`Saved ${result.affectedRows} products to MySQL`);
      
      return result;
    } catch (error) {
      console.error('Error saving products:', error);
      throw error;
    }
  }
  
  cleanProducts(products) {
    const cleaned = [];
    const seen = new Set();
    
    for (const product of products) {
      if (!product.id || !product.title || !product.platform) {
        console.warn('Skipping invalid product:', product);
        continue;
      }
      
      const key = `${product.platform}-${product.id}`;
      if (seen.has(key)) {
        console.warn('Skipping duplicate product:', product.id);
        continue;
      }
      
      seen.add(key);
      
      cleaned.push({
        id: product.id,
        title: product.title.trim(),
        image: product.image || '',
        price: parseFloat(product.price) || 0,
        rating: parseFloat(product.rating) || 0,
        reviewCount: parseInt(product.reviewCount) || 0,
        salesCount: parseInt(product.salesCount) || 0,
        shopName: product.shopName || '',
        platform: product.platform,
        productUrl: product.productUrl || '',
        currency: product.currency || 'USD',
        category: product.category || '',
        isNew: Boolean(product.isNew),
        salesTrend: product.salesTrend || 'stable',
        listedDate: product.listedDate || null,
        crawlDate: product.crawlDate || new Date()
      });
    }
    
    console.log(`Cleaned ${products.length} products, removed ${products.length - cleaned.length} invalid/duplicate entries`);
    return cleaned;
  }

  static async setMySQLConnected(connected) {
    const instance = DataService.getInstance();
    instance.isMySQLConnected = connected;
  }

  static getInstance() {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  getProductsFromMemory(platform, timeRange = 'today', filters = {}, page = 1, limit = 20) {
    let filteredProducts = this.memoryStorage.filter(p => p.platform === platform);

    const now = new Date();
    if (timeRange === 'today') {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      filteredProducts = filteredProducts.filter(p => new Date(p.crawlDate) >= startOfDay);
    } else if (timeRange === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      filteredProducts = filteredProducts.filter(p => new Date(p.crawlDate) >= startOfWeek);
    } else if (timeRange === 'month') {
      const startOfMonth = new Date(now);
      startOfMonth.setMonth(now.getMonth() - 1);
      filteredProducts = filteredProducts.filter(p => new Date(p.crawlDate) >= startOfMonth);
    }

    if (filters.priceRange) {
      if (filters.priceRange === '0-20') {
        filteredProducts = filteredProducts.filter(p => p.price < 20);
      } else if (filters.priceRange === '20-50') {
        filteredProducts = filteredProducts.filter(p => p.price >= 20 && p.price < 50);
      } else if (filters.priceRange === '50-100') {
        filteredProducts = filteredProducts.filter(p => p.price >= 50 && p.price < 100);
      } else if (filters.priceRange === '100+') {
        filteredProducts = filteredProducts.filter(p => p.price >= 100);
      }
    }

    if (filters.ratingRange) {
      const minRating = parseFloat(filters.ratingRange);
      filteredProducts = filteredProducts.filter(p => p.rating >= minRating);
    }

    if (filters.salesRange) {
      const minSales = parseInt(filters.salesRange);
      filteredProducts = filteredProducts.filter(p => p.salesCount >= minSales);
    }

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(keyword) || 
        p.shopName.toLowerCase().includes(keyword)
      );
    }

    filteredProducts.sort((a, b) => b.salesCount - a.salesCount);

    const total = filteredProducts.length;
    const skip = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(skip, skip + limit);

    const lastUpdate = paginatedProducts.length > 0 ? 
      paginatedProducts[0].crawlDate : new Date();

    return {
      products: paginatedProducts,
      total,
      page,
      limit,
      lastUpdateTime: new Date(lastUpdate).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    };
  }

  getProductFromMemory(id) {
    return this.memoryStorage.find(p => p.id === id);
  }

  saveProductsToMemory(products) {
    for (const product of products) {
      const existingIndex = this.memoryStorage.findIndex(p => p.id === product.id);
      if (existingIndex >= 0) {
        this.memoryStorage[existingIndex] = product;
      } else {
        this.memoryStorage.push(product);
      }
    }
    console.log(`Saved ${products.length} products to memory storage`);
    return { upsertedCount: products.length, modifiedCount: 0 };
  }

  getProductsFromMySQL(platform, timeRange = 'today', filters = {}, page = 1, limit = 20) {
    return ProductSchema.getProducts(platform, timeRange, filters, page, limit);
  }

  static async getPlatformStats(platform) {
    try {
      const instance = DataService.getInstance();
      
      if (!instance.isMySQLConnected) {
        return instance.getPlatformStatsFromMemory(platform);
      }
      
      const db = require('../../config/database').getPool();
      const connection = await db.getConnection();
      
      try {
        const [stats] = await connection.query(`
          SELECT 
            COUNT(*) as totalProducts,
            AVG(price) as avgPrice,
            AVG(rating) as avgRating,
            SUM(salesCount) as totalSales
          FROM products 
          WHERE platform = ?
        `, [platform]);
        
        return {
          totalProducts: stats[0].totalProducts || 0,
          avgPrice: Math.round((stats[0].avgPrice || 0) * 100) / 100,
          avgRating: Math.round((stats[0].avgRating || 0) * 10) / 10,
          totalSales: stats[0].totalSales || 0
        };
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error getting platform stats:', error);
      throw error;
    }
  }

  getPlatformStatsFromMemory(platform) {
    const products = this.memoryStorage.filter(p => p.platform === platform);
    
    if (products.length === 0) {
      return {
        totalProducts: 0,
        avgPrice: 0,
        avgRating: 0,
        totalSales: 0
      };
    }

    const totalProducts = products.length;
    const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts;
    const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / totalProducts;
    const totalSales = products.reduce((sum, p) => sum + p.salesCount, 0);

    return {
      totalProducts,
      avgPrice: Math.round(avgPrice * 100) / 100,
      avgRating: Math.round(avgRating * 10) / 10,
      totalSales
    };
  }
}

DataService.instance = null;

module.exports = DataService;
