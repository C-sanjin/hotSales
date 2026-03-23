const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'hot_sales'
    });
    
    console.log('========================================');
    console.log('数据库数据统计');
    console.log('========================================\n');
    
    const [countResult] = await connection.query('SELECT COUNT(*) as total FROM products');
    console.log(`总商品数: ${countResult[0].total} 个\n`);
    
    const [platformResult] = await connection.query(`
      SELECT platform, COUNT(*) as count 
      FROM products 
      GROUP BY platform
    `);
    
    console.log('各平台商品数:');
    platformResult.forEach(row => {
      console.log(`  ${row.platform}: ${row.count} 个`);
    });
    
    console.log('\n示例商品（前5个）:');
    const [sampleProducts] = await connection.query(`
      SELECT title, platform, price, salesCount, rating 
      FROM products 
      LIMIT 5
    `);
    
    sampleProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.title.substring(0, 50)}...`);
      console.log(`   平台: ${product.platform}`);
      console.log(`   价格: $${product.price}`);
      console.log(`   销量: ${product.salesCount}`);
      console.log(`   评分: ${product.rating}`);
    });
    
    await connection.end();
    console.log('\n========================================');
  } catch (error) {
    console.error('查询失败:', error.message);
  }
}

checkDatabase();
