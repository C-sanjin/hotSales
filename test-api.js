const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API...');
    const response = await axios.get('http://localhost:3006/api/products', {
      params: {
        platform: 'amazon',
        timeRange: 'today'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    console.log('Products count:', response.data.data.products.length);
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAPI();
