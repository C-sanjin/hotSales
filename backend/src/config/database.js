const mysql = require('mysql2/promise');

let pool = null;

async function createConnection() {
  try {
    // 先尝试不带数据库名连接
    const tempConnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || ''
    });
    
    // 创建数据库
    const databaseName = process.env.MYSQL_DATABASE || 'hot_sales';
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('数据库创建成功');
    
    // 关闭临时连接
    await tempConnection.end();
    
    // 创建带数据库名的连接池
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: databaseName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });

    console.log('MySQL连接池创建成功');
    return pool;
  } catch (error) {
    console.error('MySQL连接失败:', error.message);
    return null;
  }
}

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('MySQL连接测试成功');
    return true;
  } catch (error) {
    console.error('MySQL连接测试失败:', error.message);
    return false;
  }
}

async function closeConnection() {
  if (pool) {
    try {
      await pool.end();
      console.log('MySQL连接池已关闭');
    } catch (error) {
      console.error('关闭MySQL连接池失败:', error.message);
    }
  }
}

function getPool() {
  return pool;
}

module.exports = {
  createConnection,
  testConnection,
  closeConnection,
  getPool
};
