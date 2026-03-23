const API_BASE_URL = '/api';

export async function fetchProducts(platform, filters = {}) {
  try {
    const params = new URLSearchParams({
      platform,
      timeRange: filters.timeRange || 'today',
      page: 1,
      limit: 100
    });

    if (filters.keyword) {
      params.append('keyword', filters.keyword);
    }

    if (filters.priceRange && filters.priceRange !== 'all') {
      params.append('priceRange', filters.priceRange);
    }

    if (filters.ratingRange && filters.ratingRange !== 'all') {
      params.append('ratingRange', filters.ratingRange);
    }

    if (filters.salesRange && filters.salesRange !== 'all') {
      params.append('salesRange', filters.salesRange);
    }

    const response = await fetch(`${API_BASE_URL}/products?${params}`);
    const data = await response.json();

    if (data.success) {
      return {
        products: data.data.products,
        lastUpdateTime: data.lastUpdateTime,
        total: data.data.total
      };
    } else {
      throw new Error(data.message || 'Failed to fetch products');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    //  fallback to mock data if API fails
    const { getMockProducts, filterProducts } = await import('./mockData.js');
    const products = getMockProducts(platform, filters.timeRange);
    const filteredProducts = filterProducts(products, filters);

    const lastUpdateTime = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return {
      products: filteredProducts,
      lastUpdateTime: lastUpdateTime,
      total: filteredProducts.length
    };
  }
}

export async function fetchProductById(platform, productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch product');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    //  fallback to mock data if API fails
    const { getMockProducts } = await import('./mockData.js');
    const products = getMockProducts(platform);
    return products.find(p => p.id === productId);
  }
}
