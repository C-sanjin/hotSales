const database = require('../config/database');

async function createTables() {
  try {
    const db = database.getPool();
    if (!db) {
      throw new Error('数据库连接池未初始化');
    }
    
    const connection = await db.getConnection();
    
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(255) PRIMARY KEY,
          title TEXT NOT NULL,
          image TEXT,
          price DECIMAL(10, 2) NOT NULL,
          rating DECIMAL(3, 1) DEFAULT 0,
          reviewCount INT DEFAULT 0,
          salesCount INT DEFAULT 0,
          shopName VARCHAR(255),
          platform VARCHAR(50) NOT NULL,
          productUrl TEXT,
          currency VARCHAR(10) DEFAULT 'USD',
          category VARCHAR(100),
          isNew BOOLEAN DEFAULT FALSE,
          salesTrend VARCHAR(20) DEFAULT 'stable',
          listedDate DATETIME,
          crawlDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_platform (platform),
          INDEX idx_crawlDate (crawlDate),
          INDEX idx_salesCount (salesCount)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      console.log('products表创建成功');
    } catch (error) {
      console.error('创建products表失败:', error.message);
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('获取数据库连接失败:', error.message);
    throw error;
  }
}

async function insertProduct(product) {
  try {
    const db = database.getPool();
    if (!db) {
      throw new Error('数据库连接池未初始化');
    }
    
    const connection = await db.getConnection();
    
    try {
      const sql = `
        INSERT INTO products (
          id, title, image, price, rating, reviewCount, 
          salesCount, shopName, platform, productUrl, 
          currency, category, isNew, salesTrend, 
          listedDate, crawlDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          image = VALUES(image),
          price = VALUES(price),
          rating = VALUES(rating),
          reviewCount = VALUES(reviewCount),
          salesCount = VALUES(salesCount),
          shopName = VALUES(shopName),
          productUrl = VALUES(productUrl),
          currency = VALUES(currency),
          category = VALUES(category),
          isNew = VALUES(isNew),
          salesTrend = VALUES(salesTrend),
          listedDate = VALUES(listedDate),
          crawlDate = VALUES(crawlDate)
      `;
      
      const values = [
        product.id,
        product.title,
        product.image,
        product.price,
        product.rating,
        product.reviewCount,
        product.salesCount,
        product.shopName,
        product.platform,
        product.productUrl,
        product.currency,
        product.category,
        product.isNew,
        product.salesTrend,
        product.listedDate,
        product.crawlDate
      ];
      
      await connection.query(sql, values);
      return product;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('插入商品失败:', error.message);
    throw error;
  }
}

async function insertProducts(products) {
  if (!products || products.length === 0) {
    return { affectedRows: 0 };
  }
  
  try {
    const db = database.getPool();
    if (!db) {
      throw new Error('数据库连接池未初始化');
    }
    
    const connection = await db.getConnection();
    
    try {
      let sql = `
        INSERT INTO products (
          id, title, image, price, rating, reviewCount, 
          salesCount, shopName, platform, productUrl, 
          currency, category, isNew, salesTrend, 
          listedDate, crawlDate
        ) VALUES 
      `;
      
      const values = products.map(product => [
        product.id,
        product.title,
        product.image,
        product.price,
        product.rating,
        product.reviewCount,
        product.salesCount,
        product.shopName,
        product.platform,
        product.productUrl,
        product.currency,
        product.category,
        product.isNew,
        product.salesTrend,
        product.listedDate,
        product.crawlDate
      ]);
      
      const placeholders = products.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
      sql += placeholders;
      
      sql += `
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          image = VALUES(image),
          price = VALUES(price),
          rating = VALUES(rating),
          reviewCount = VALUES(reviewCount),
          salesCount = VALUES(salesCount),
          shopName = VALUES(shopName),
          productUrl = VALUES(productUrl),
          currency = VALUES(currency),
          category = VALUES(category),
          isNew = VALUES(isNew),
          salesTrend = VALUES(salesTrend),
          listedDate = VALUES(listedDate),
          crawlDate = VALUES(crawlDate)
      `;
      
      const flatValues = values.flat();
      const [result] = await connection.query(sql, flatValues);
      return result;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('批量插入商品失败:', error.message);
    throw error;
  }
}

async function getProducts(platform, timeRange, filters, page = 1, limit = 20) {
  try {
    const db = database.getPool();
    if (!db) {
      throw new Error('数据库连接池未初始化');
    }
    
    const connection = await db.getConnection();
    
    try {
      let whereConditions = ['platform = ?'];
      let params = [platform];
      
      if (timeRange === 'today') {
        whereConditions.push('DATE(crawlDate) = CURDATE()');
      } else if (timeRange === 'week') {
        whereConditions.push('crawlDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)');
      } else if (timeRange === 'month') {
        whereConditions.push('crawlDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)');
      }
      
      if (filters.keyword) {
        whereConditions.push('(title LIKE ? OR shopName LIKE ?)');
        params.push(`%${filters.keyword}%`, `%${filters.keyword}%`);
      }
      
      if (filters.priceRange && filters.priceRange !== 'all') {
        if (filters.priceRange === '0-20') {
          whereConditions.push('price BETWEEN 0 AND 20');
        } else if (filters.priceRange === '20-50') {
          whereConditions.push('price BETWEEN 20 AND 50');
        } else if (filters.priceRange === '50-100') {
          whereConditions.push('price BETWEEN 50 AND 100');
        } else if (filters.priceRange === '100+') {
          whereConditions.push('price >= 100');
        }
      }
      
      if (filters.ratingRange && filters.ratingRange !== 'all') {
        if (filters.ratingRange === '4.0+') {
          whereConditions.push('rating >= 4.0');
        } else if (filters.ratingRange === '4.5+') {
          whereConditions.push('rating >= 4.5');
        } else if (filters.ratingRange === '4.8+') {
          whereConditions.push('rating >= 4.8');
        }
      }
      
      if (filters.salesRange && filters.salesRange !== 'all') {
        if (filters.salesRange === '100+') {
          whereConditions.push('salesCount >= 100');
        } else if (filters.salesRange === '500+') {
          whereConditions.push('salesCount >= 500');
        } else if (filters.salesRange === '1000+') {
          whereConditions.push('salesCount >= 1000');
        }
      }
      
      const offset = (page - 1) * limit;
      
      const countSql = `SELECT COUNT(*) as total FROM products WHERE ${whereConditions.join(' AND ')}`;
      const [countResult] = await connection.query(countSql, params);
      const total = countResult[0].total;
      
      const dataSql = `
        SELECT * FROM products 
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY salesCount DESC 
        LIMIT ? OFFSET ?
      `;
      const [products] = await connection.query(dataSql, [...params, limit, offset]);
      
      // 转换数据类型
      const formattedProducts = products.map(product => ({
        ...product,
        price: parseFloat(product.price),
        rating: parseFloat(product.rating),
        reviewCount: parseInt(product.reviewCount),
        salesCount: parseInt(product.salesCount),
        isNew: Boolean(product.isNew)
      }));
      
      return {
        products: formattedProducts,
        total,
        lastUpdateTime: new Date().toLocaleString('zh-CN')
      };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('查询商品失败:', error.message);
    throw error;
  }
}

async function getProductById(id) {
  try {
    const db = database.getPool();
    if (!db) {
      throw new Error('数据库连接池未初始化');
    }
    
    const connection = await db.getConnection();
    
    try {
      const [products] = await connection.query(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );
      return products[0] || null;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('查询商品失败:', error.message);
    throw error;
  }
}

async function cleanOldData(daysToKeep = 30) {
  try {
    const db = database.getPool();
    if (!db) {
      throw new Error('数据库连接池未初始化');
    }
    
    const connection = await db.getConnection();
    
    try {
      const sql = 'DELETE FROM products WHERE crawlDate < DATE_SUB(CURDATE(), INTERVAL ? DAY)';
      const [result] = await connection.query(sql, [daysToKeep]);
      console.log(`清理了 ${result.affectedRows} 条超过 ${daysToKeep} 天的旧数据`);
      return result;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('清理旧数据失败:', error.message);
    throw error;
  }
}

async function cleanDuplicateData() {
  try {
    const db = database.getPool();
    if (!db) {
      throw new Error('数据库连接池未初始化');
    }
    
    const connection = await db.getConnection();
    
    try {
      const sql = `
        DELETE p1 FROM products p1
        INNER JOIN products p2
        WHERE p1.id = p2.id
        AND p1.crawlDate < p2.crawlDate
      `;
      const [result] = await connection.query(sql);
      console.log(`清理了 ${result.affectedRows} 条重复数据`);
      return result;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('清理重复数据失败:', error.message);
    throw error;
  }
}

async function getLatestCrawlDate(platform) {
  try {
    const db = database.getPool();
    if (!db) {
      throw new Error('数据库连接池未初始化');
    }
    
    const connection = await db.getConnection();
    
    try {
      const [result] = await connection.query(
        'SELECT MAX(crawlDate) as latestDate FROM products WHERE platform = ?',
        [platform]
      );
      return result[0].latestDate;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('获取最新爬取日期失败:', error.message);
    throw error;
  }
}

module.exports = {
  createTables,
  insertProduct,
  insertProducts,
  getProducts,
  getProductById,
  cleanOldData,
  cleanDuplicateData,
  getLatestCrawlDate
};
