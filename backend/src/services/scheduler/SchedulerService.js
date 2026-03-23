const cron = require('node-cron');
const CrawlerService = require('../crawler/CrawlerService');

class SchedulerService {
  constructor() {
    this.lastCrawlDate = null;
    this.isCrawling = false;
  }

  static start() {
    try {
      const instance = SchedulerService.getInstance();
      
      // 启动时立即运行一次爬虫
      console.log('Running initial crawler job...');
      instance.runCrawler().catch(error => {
        console.error('Initial crawler job failed:', error);
      });

      // 每天23:59执行爬虫
      const job = cron.schedule('59 23 * * *', async () => {
        console.log('Scheduled crawler job started:', new Date().toISOString());
        
        try {
          await instance.runCrawler();
        } catch (error) {
          console.error('Scheduled crawler job failed:', error);
        }
      }, {
        scheduled: true,
        timezone: 'Asia/Shanghai'
      });

      console.log('Scheduler started successfully. Daily crawl scheduled for 23:59');
      return job;
    } catch (error) {
      console.error('Failed to start scheduler:', error);
      return null;
    }
  }

  async runCrawler() {
    const instance = SchedulerService.getInstance();
    
    // 检查今天是否已经爬取过
    const today = new Date().toDateString();
    if (instance.lastCrawlDate === today) {
      console.log('Already crawled today, skipping...');
      return;
    }
    
    // 检查是否正在爬取
    if (instance.isCrawling) {
      console.log('Crawler is already running, skipping...');
      return;
    }
    
    instance.isCrawling = true;
    
    try {
      console.log('Starting crawler at:', new Date().toISOString());
      
      // 运行爬虫
      const results = await CrawlerService.runAllCrawlers();
      
      // 清理重复数据
      await CrawlerService.cleanDuplicateData();
      
      // 清理30天前的旧数据
      await CrawlerService.cleanOldData(30);
      
      // 更新最后爬取日期
      instance.lastCrawlDate = today;
      
      console.log('Crawler completed successfully at:', new Date().toISOString());
      console.log('Results:', results);
      
      return results;
    } catch (error) {
      console.error('Crawler failed:', error);
      throw error;
    } finally {
      instance.isCrawling = false;
    }
  }

  static async runManual() {
    console.log('Manual crawler job started:', new Date().toISOString());
    
    try {
      const instance = SchedulerService.getInstance();
      const results = await instance.runCrawler();
      return results;
    } catch (error) {
      console.error('Manual crawler job failed:', error);
      throw error;
    }
  }

  static getInstance() {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService();
    }
    return SchedulerService.instance;
  }
}

SchedulerService.instance = null;

module.exports = SchedulerService;