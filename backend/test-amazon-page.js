const axios = require('axios');

async function testAmazonPage() {
  console.log('=== 测试Amazon Bestsellers页面 ===\n');
  
  try {
    console.log('1. 访问Amazon Bestsellers页面...');
    const response = await axios.get('https://www.amazon.com/bestsellers/electronics', {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    
    console.log(`✅ 页面访问成功！状态码: ${response.status}`);
    console.log(`页面大小: ${response.data.length} 字符`);
    
    // 检查页面内容
    const html = response.data;
    
    console.log('\n2. 检查页面内容...');
    
    // 检查是否包含商品数据
    const hasProducts = html.includes('data-asin') || html.includes('zg-item');
    console.log(`包含商品数据: ${hasProducts ? '是' : '否'}`);
    
    // 检查是否包含验证页面
    const hasCaptcha = html.includes('CAPTCHA') || html.includes('captcha') || html.includes('Robot');
    console.log(`包含验证页面: ${hasCaptcha ? '是' : '否'}`);
    
    // 检查是否包含登录页面
    const hasLogin = html.includes('sign-in') || html.includes('login');
    console.log(`包含登录页面: ${hasLogin ? '是' : '否'}`);
    
    // 保存HTML以便检查
    const fs = require('fs');
    fs.writeFileSync('amazon-bestsellers.html', html);
    console.log('\n✅ HTML已保存到 amazon-bestsellers.html');
    
    console.log('\n=== 测试完成 ===');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.response) {
      console.log(`状态码: ${error.response.status}`);
      console.log(`响应头:`, error.response.headers);
    }
  }
}

testAmazonPage();
