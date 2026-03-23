const mysql = require('mysql2/promise');
require('dotenv').config();

async function clearDatabase() {
  console.log('开始清空数据库表...');
  
  try {
    // 连接到MySQL数据库
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'hot_sales'
    });
    
    console.log('成功连接到数据库');
    
    // 清空products表
    const [result] = await connection.query('TRUNCATE TABLE products');
    console.log(`成功清空products表，影响行数: ${result.affectedRows}`);
    
    // 关闭连接
    await connection.end();
    console.log('数据库连接已关闭');
    
  } catch (error) {
    console.error('清空数据库失败:', error.message);
    throw error;
  }
}

// 运行脚本
if (require.main === module) {
  clearDatabase()
    .then(() => {
      console.log('数据库清空完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('操作失败:', error);
      process.exit(1);
    });
}

module.exports = clearDatabase;