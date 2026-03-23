const DataService = require('../services/data/DataService');
const SchedulerService = require('../services/scheduler/SchedulerService');

class ProductController {
  static async getProducts(req, res) {
    try {
      const { platform, timeRange = 'today', page = 1, limit = 20, keyword, priceRange, ratingRange, salesRange } = req.query;

      if (!platform) {
        return res.status(400).json({
          success: false,
          message: 'Platform is required'
        });
      }

      const filters = {
        keyword,
        priceRange,
        ratingRange,
        salesRange
      };

      const result = await DataService.getProducts(
        platform,
        timeRange,
        filters,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: {
          products: result.products,
          total: result.total
        },
        lastUpdateTime: result.lastUpdateTime
      });
    } catch (error) {
      console.error('Error in getProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await DataService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error in getProductById:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async runCrawler(req, res) {
    try {
      const results = await SchedulerService.runManual();
      
      res.json({
        success: true,
        message: 'Crawler started',
        data: results
      });
    } catch (error) {
      console.error('Error in runCrawler:', error);
      res.status(500).json({
        success: false,
        message: 'Crawler failed',
        error: error.message
      });
    }
  }

  static async getCrawlerStatus(req, res) {
    try {
      // 这里可以添加更详细的状态信息
      res.json({
        success: true,
        data: {
          lastRun: new Date().toLocaleString('zh-CN'),
          nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
          status: 'idle',
          stats: {
            totalProducts: 0,
            successfulPlatforms: 0,
            failedPlatforms: 0
          }
        }
      });
    } catch (error) {
      console.error('Error in getCrawlerStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ProductController;
