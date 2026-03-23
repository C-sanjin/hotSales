const mysql = require('mysql2/promise');

async function testMySQLConnection() {
  console.log('Testing MySQL connection...');
  
  try {
    // 尝试连接MySQL
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'hot_sales'
    });
    
    console.log('✅ MySQL connection successful!');
    
    // 测试创建数据库
    try {
      await connection.query('CREATE DATABASE IF NOT EXISTS hot_sales CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
      console.log('✅ Database created or already exists');
    } catch (error) {
      console.log('⚠️  Database creation error:', error.message);
    }
    
    // 切换到hot_sales数据库
    await connection.query('USE hot_sales');
    console.log('✅ Switched to hot_sales database');
    
    // 测试创建表
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
      console.log('✅ Table created or already exists');
    } catch (error) {
      console.log('⚠️  Table creation error:', error.message);
    }
    
    // 测试插入数据
    try {
      const testProduct = {
        id: 'test-123',
        title: 'Test Product',
        image: 'https://example.com/image.jpg',
        price: 99.99,
        rating: 4.5,
        reviewCount: 100,
        salesCount: 50,
        shopName: 'Test Shop',
        platform: 'amazon',
        productUrl: 'https://example.com/product',
        currency: 'USD',
        category: 'electronics',
        isNew: true,
        salesTrend: 'up',
        listedDate: new Date(),
        crawlDate: new Date()
      };
      
      const [result] = await connection.query(
        `INSERT INTO products (id, title, image, price, rating, reviewCount, salesCount, shopName, platform, productUrl, currency, category, isNew, salesTrend, listedDate, crawlDate) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
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
         crawlDate = VALUES(crawlDate)`,
        [
          testProduct.id,
          testProduct.title,
          testProduct.image,
          testProduct.price,
          testProduct.rating,
          testProduct.reviewCount,
          testProduct.salesCount,
          testProduct.shopName,
          testProduct.platform,
          testProduct.productUrl,
          testProduct.currency,
          testProduct.category,
          testProduct.isNew,
          testProduct.salesTrend,
          testProduct.listedDate,
          testProduct.crawlDate
        ]
      );
      
      console.log('✅ Data inserted successfully:', result.affectedRows, 'rows affected');
    } catch (error) {
      console.log('⚠️  Data insertion error:', error.message);
    }
    
    // 测试查询数据
    try {
      const [rows] = await connection.query('SELECT * FROM products LIMIT 5');
      console.log('✅ Data retrieved successfully:', rows.length, 'rows found');
      console.log('Sample data:', rows);
    } catch (error) {
      console.log('⚠️  Data retrieval error:', error.message);
    }
    
    await connection.end();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.log('❌ MySQL connection failed:', error.message);
    
    // 尝试不使用数据库名连接
    try {
      console.log('Trying to connect without database...');
      const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || 3306,
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || ''
      });
      
      console.log('✅ Connected without database');
      await connection.end();
    } catch (error2) {
      console.log('❌ Connection without database also failed:', error2.message);
    }
  }
}

// 加载环境变量
require('dotenv').config();

testMySQLConnection();
