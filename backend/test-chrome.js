const puppeteer = require('puppeteer-core');

async function testChrome() {
  console.log('=== 测试Chrome浏览器 ===\n');
  
  try {
    console.log('1. 尝试启动Chrome浏览器...');
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    });
    
    console.log('✅ Chrome浏览器启动成功！');
    
    console.log('\n2. 创建新页面...');
    const page = await browser.newPage();
    console.log('✅ 页面创建成功！');
    
    console.log('\n3. 访问百度测试...');
    await page.goto('https://www.baidu.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    console.log('✅ 页面访问成功！');
    
    console.log('\n4. 获取页面标题...');
    const title = await page.title();
    console.log(`页面标题: ${title}`);
    
    console.log('\n5. 关闭浏览器...');
    await browser.close();
    console.log('✅ 浏览器关闭成功！');
    
    console.log('\n=== 测试完成 ===');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

testChrome();
