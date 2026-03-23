const axios = require('axios');

async function testNetwork() {
  console.log('=== 测试网络连接 ===\n');
  
  try {
    console.log('1. 测试访问百度...');
    const baiduResponse = await axios.get('https://www.baidu.com', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log(`✅ 百度访问成功！状态码: ${baiduResponse.status}`);
    console.log(`页面大小: ${baiduResponse.data.length} 字符`);
    
    console.log('\n2. 测试访问Amazon...');
    const amazonResponse = await axios.get('https://www.amazon.com', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log(`✅ Amazon访问成功！状态码: ${amazonResponse.status}`);
    console.log(`页面大小: ${amazonResponse.data.length} 字符`);
    
    console.log('\n=== 网络测试完成 ===');
    
  } catch (error) {
    console.error('❌ 网络测试失败:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.log('可能是DNS解析问题');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('连接超时');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('连接被拒绝');
    }
  }
}

testNetwork();
