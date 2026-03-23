const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

dotenv.config();

const routes = require('./routes');
const DataService = require('./services/data/DataService');
const SchedulerService = require('./services/scheduler/SchedulerService');
const CrawlerService = require('./services/crawler/CrawlerService');
const database = require('./config/database');
const ProductSchema = require('./models/ProductSchema');

console.log('Starting backend server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT || 3001);
console.log('MySQL Host:', process.env.MYSQL_HOST || 'localhost');
console.log('MySQL Database:', process.env.MYSQL_DATABASE || 'hot_sales');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Service is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const startServer = async () => {
  await DataService.setMySQLConnected(false);
  
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API documentation: http://localhost:${PORT}/api`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Storage mode: In-Memory`);
    
    console.log('Starting scheduler...');
    const scheduler = SchedulerService.start();
    console.log('Scheduler started:', scheduler ? 'Success' : 'Failed');
    
    console.log('Running initial crawler...');
    CrawlerService.runAllCrawlers()
      .then(results => {
        console.log('Initial crawler completed');
        console.log('Results:', results);
      })
      .catch(error => {
        console.error('Initial crawler error:', error.message);
      });
  });
  
  server.on('error', (error) => {
    console.error('Server error:', error);
  });
  
  setTimeout(async () => {
    try {
      console.log('Attempting to connect to MySQL in background...');
      await database.createConnection();
      
      const isConnected = await database.testConnection();
      if (isConnected) {
        console.log('MySQL connected successfully');
        await ProductSchema.createTables();
        await DataService.setMySQLConnected(true);
        console.log('Storage mode: MySQL');
      } else {
        console.log('MySQL not available, continuing with in-memory storage');
      }
    } catch (error) {
      console.log('MySQL not available, continuing with in-memory storage');
      console.log('Error:', error.message);
    }
  }, 1000);
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;
