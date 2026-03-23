const axios = require('axios');

async function testAmazonRobots() {
  console.log('=== 测试Amazon Robots.txt ===\n');
  
  try {
    console.log('1. 获取Amazon robots.txt...');
    const response = await axios.get('https://www.amazon.com/robots.txt', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('✅ robots.txt获取成功！');
    console.log('\n内容预览:');
    console.log(response.data.substring(0, 500));
    
    console.log('\n2. 检查bestsellers路径...');
    const robotsTxt = response.data;
    const lines = robotsTxt.split('\n');
    
    let isDisallowed = false;
    for (const line of lines) {
      if (line.includes('Disallow:') && line.includes('bestseller')) {
        console.log(`⚠️ 发现限制: ${line.trim()}`);
        isDisallowed = true;
      }
    }
    
    if (!isDisallowed) {
      console.log('✅ bestsellers路径没有被明确禁止');
    }
    
    console.log('\n=== 测试完成 ===');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testAmazonRobots();
