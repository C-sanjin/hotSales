const axios = require('axios');

async function testAPI() {
  console.log('=== 测试API数据 ===\n');
  
  try {
    console.log('1. 测试Amazon平台API...');
    const response = await axios.get('http://localhost:3006/api/products', {
      params: {
        platform: 'amazon',
        timeRange: 'today',
        page: 1,
        limit: 10
      }
    });
    
    console.log(`状态码: ${response.status}`);
    console.log(`成功: ${response.data.success}`);
    console.log(`总数据: ${response.data.data.total} 条`);
    
    if (response.data.data.products.length > 0) {
      console.log('\n商品示例:');
      response.data.data.products.slice(0, 3).forEach((product, index) => {
        console.log(`\n[${index + 1}] ${product.title}`);
        console.log(`    价格: $${product.price.toFixed(2)}`);
        console.log(`    评分: ${product.rating.toFixed(1)} (${product.reviewCount} 评论)`);
        console.log(`    销量: ${product.salesCount.toLocaleString()}`);
        console.log(`    店铺: ${product.shopName}`);
        console.log(`    爬取时间: ${new Date(product.crawlDate).toLocaleString('zh-CN')}`);
      });
    }
    
    const sampleProduct = response.data.data.products[0];
    if (sampleProduct) {
      const isRealData = !sampleProduct.title.includes('Product') && 
                         !sampleProduct.title.includes('Edition') &&
                         sampleProduct.price > 0 &&
                         sampleProduct.rating > 0;
      
      console.log('\n=== 数据验证 ===');
      console.log(`数据来源: ${isRealData ? '✅ 真实爬取' : '⚠️ 可能是模拟数据'}`);
      console.log(`商品标题: ${sampleProduct.title}`);
      console.log(`是否包含真实品牌: ${sampleProduct.title.includes('Apple') || sampleProduct.title.includes('Amazon') || sampleProduct.title.includes('Samsung') ? '是' : '否'}`);
    }
    
  } catch (error) {
    console.error('API测试失败:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', error.response.data);
    }
  }
}

testAPI();
