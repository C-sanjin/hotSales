const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-core');

class CrawlerUtils {
  static userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
  ];

  static viewports = [
    { width: 1920, height: 1080 },
    { width: 1680, height: 1050 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1536, height: 864 }
  ];

  static getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  static getRandomViewport() {
    return this.viewports[Math.floor(Math.random() * this.viewports.length)];
  }

  static async checkRobotsTxt(url) {
    try {
      const baseUrl = url.split('/').slice(0, 3).join('/');
      const robotsUrl = `${baseUrl}/robots.txt`;
      
      const response = await axios.get(robotsUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': this.getRandomUserAgent()
        }
      });
      
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch robots.txt:', error.message);
      return null;
    }
  }

  static isAllowedToCrawl(robotsTxt, userAgent, url) {
    if (!robotsTxt) return true;
    
    const lines = robotsTxt.split('\n');
    let currentUserAgent = '*';
    let disallowed = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('User-agent:')) {
        currentUserAgent = trimmedLine.split(':')[1].trim();
      } else if (trimmedLine.startsWith('Disallow:')) {
        if (currentUserAgent === '*' || currentUserAgent.includes(userAgent)) {
          const path = trimmedLine.split(':')[1].trim();
          if (path) {
            disallowed.push(path);
          }
        }
      }
    }
    
    for (const path of disallowed) {
      if (url.includes(path)) {
        return false;
      }
    }
    
    return true;
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.delay(delay);
  }

  static async fetchPage(url) {
    try {
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching page:', error.message);
      throw error;
    }
  }

  static async createBrowser() {
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920,1080',
          '--disable-blink-features=AutomationControlled',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--allow-running-insecure-content',
          '--disable-infobars',
          '--disable-extensions',
          '--disable-plugins',
          '--disable-images',
          '--disable-javascript-harmony-shipping',
          '--no-first-run',
          '--enable-automation=false',
          '--password-store=basic',
          '--use-mock-keychain',
          '--disable-logging',
          '--disable-permissions-api',
          '--disable-notifications',
          '--disable-translate',
          '--disable-default-apps',
          '--disable-sync'
        ]
      });
      return browser;
    } catch (error) {
      console.error('Error creating browser:', error.message);
      
      const possiblePaths = [
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
      ];
      
      for (const path of possiblePaths) {
        try {
          const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: path,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--disable-gpu',
              '--window-size=1920,1080',
              '--disable-blink-features=AutomationControlled',
              '--disable-web-security',
              '--disable-features=IsolateOrigins,site-per-process'
            ]
          });
          console.log(`Browser created using: ${path}`);
          return browser;
        } catch (err) {
          console.log(`Failed to launch browser from ${path}`);
          continue;
        }
      }
      
      throw new Error('Could not find Chrome browser. Please install Google Chrome.');
    }
  }

  static async setupPage(page) {
    const userAgent = this.getRandomUserAgent();
    const viewport = this.getRandomViewport();
    
    await page.setUserAgent(userAgent);
    await page.setViewport(viewport);
    
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive'
    });
    
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false
      });
      
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5]
      });
      
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en']
      });
      
      window.chrome = {
        runtime: {}
      };
      
      Object.defineProperty(navigator, 'permissions', {
        get: () => ({
          query: () => Promise.resolve({ state: 'granted' })
        })
      });
      
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
      
      Object.defineProperty(navigator, 'platform', {
        get: () => 'Win32'
      });
      
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => 8
      });
      
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => 8
      });
    });
    
    return { userAgent, viewport };
  }

  static async simulateHumanBehavior(page) {
    await this.randomDelay(1000, 3000);
    
    await page.mouse.move(
      Math.floor(Math.random() * 800) + 100,
      Math.floor(Math.random() * 600) + 100
    );
    
    await this.randomDelay(500, 1500);
    
    await page.mouse.move(
      Math.floor(Math.random() * 800) + 100,
      Math.floor(Math.random() * 600) + 100
    );
    
    await this.randomDelay(500, 1500);
  }

  static async slowScroll(page, times = 3) {
    for (let i = 0; i < times; i++) {
      await page.evaluate(() => {
        window.scrollBy({
          top: Math.floor(Math.random() * 500) + 200,
          behavior: 'smooth'
        });
      });
      await this.randomDelay(2000, 4000);
    }
  }

  static extractPrice(text) {
    const priceMatch = text.match(/\$([\d,.]+)/);
    if (priceMatch) {
      return parseFloat(priceMatch[1].replace(',', ''));
    }
    return null;
  }

  static extractRating(text) {
    const ratingMatch = text.match(/([\d.]+)/);
    if (ratingMatch) {
      return parseFloat(ratingMatch[1]);
    }
    return 0;
  }

  static extractSales(text) {
    const salesMatch = text.match(/(\d+,?\d*)/);
    if (salesMatch) {
      return parseInt(salesMatch[1].replace(',', ''));
    }
    return 0;
  }

  static generateId(platform, title) {
    const crypto = require('crypto');
    const hash = crypto.createHash('md5')
      .update(`${platform}-${title}`)
      .digest('hex');
    return `${platform}-${hash.slice(0, 8)}`;
  }
}

module.exports = CrawlerUtils;
