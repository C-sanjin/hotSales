const mockProducts = {
  amazon: [
    {
      id: 'amz-001',
      title: 'Apple AirPods Pro (2nd Generation) with MagSafe Charging Case - Active Noise Cancellation',
      image: 'https://via.placeholder.com/400x400/667eea/ffffff?text=AirPods+Pro',
      price: 249.00,
      originalPrice: 279.00,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 123456,
      salesCount: 56789,
      shopName: 'Apple Store',
      platform: 'amazon',
      productUrl: 'https://www.amazon.com/dp/B0BDJH6L9W',
      isNew: false,
      salesTrend: 'up',
      category: 'Audio',
      listedDate: '2024-01-15',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'amz-002',
      title: 'Anker PowerCore 10000 Portable Charger, 10000mAh Power Bank with PowerIQ and VoltageBoost',
      image: 'https://via.placeholder.com/400x400/764ba2/ffffff?text=Anker+PowerCore',
      price: 29.99,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 45678,
      salesCount: 23456,
      shopName: 'Anker Direct',
      platform: 'amazon',
      productUrl: 'https://www.amazon.com/dp/B01LY5I9S6',
      isNew: false,
      salesTrend: 'stable',
      category: 'Charger',
      listedDate: '2023-06-20',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'amz-003',
      title: 'JBL Flip 6 Portable Bluetooth Speaker, Waterproof, Durable, Wireless',
      image: 'https://via.placeholder.com/400x400/ff6b6b/ffffff?text=JBL+Flip+6',
      price: 99.95,
      originalPrice: 129.95,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 23456,
      salesCount: 12345,
      shopName: 'JBL Official',
      platform: 'amazon',
      productUrl: 'https://www.amazon.com/dp/B096JKPQHK',
      isNew: true,
      salesTrend: 'up',
      category: 'Audio',
      listedDate: '2026-03-10',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'amz-004',
      title: 'Samsung Galaxy S23 Ultra 5G Unlocked Android Smartphone, 256GB, Phantom Black',
      image: 'https://via.placeholder.com/400x400/4ecdc4/ffffff?text=Galaxy+S23',
      price: 1199.00,
      currency: 'USD',
      rating: 4.9,
      reviewCount: 8765,
      salesCount: 5432,
      shopName: 'Samsung Store',
      platform: 'amazon',
      productUrl: 'https://www.amazon.com/dp/B0BQ3WQZ7X',
      isNew: false,
      salesTrend: 'stable',
      category: 'Phone',
      listedDate: '2023-02-17',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'amz-005',
      title: 'USB-C Fast Charger, 65W PD Wall Charger for iPhone 15/14/13, MacBook, iPad',
      image: 'https://via.placeholder.com/400x400/ffe66d/333333?text=USB-C+Charger',
      price: 19.99,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 34567,
      salesCount: 18765,
      shopName: 'Tech Accessories',
      platform: 'amazon',
      productUrl: 'https://www.amazon.com/dp/B08X4P5J4K',
      isNew: false,
      salesTrend: 'up',
      category: 'Charger',
      listedDate: '2023-09-05',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'amz-006',
      title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones, Over-Ear',
      image: 'https://via.placeholder.com/400x400/95e1d3/333333?text=Sony+XM5',
      price: 348.00,
      originalPrice: 399.99,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 15678,
      salesCount: 8765,
      shopName: 'Sony Official',
      platform: 'amazon',
      productUrl: 'https://www.amazon.com/dp/B09XS7JWHH',
      isNew: false,
      salesTrend: 'stable',
      category: 'Audio',
      listedDate: '2022-05-12',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'amz-007',
      title: 'Ring Video Doorbell (2nd Gen) - Improved motion detection, easy installation',
      image: 'https://via.placeholder.com/400x400/f38181/ffffff?text=Ring+Doorbell',
      price: 59.99,
      originalPrice: 99.99,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 456789,
      salesCount: 234567,
      shopName: 'Ring Official',
      platform: 'amazon',
      productUrl: 'https://www.amazon.com/dp/B08X4P5J4K',
      isNew: false,
      salesTrend: 'down',
      category: 'Smart Home',
      listedDate: '2021-06-15',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'amz-008',
      title: 'Logitech MX Master 3S Performance Wireless Mouse, Ergonomic Design',
      image: 'https://via.placeholder.com/400x400/a8e6cf/333333?text=MX+Master+3S',
      price: 99.99,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 12345,
      salesCount: 6789,
      shopName: 'Logitech Official',
      platform: 'amazon',
      productUrl: 'https://www.amazon.com/dp/B09ZKJZ7XQ',
      isNew: false,
      salesTrend: 'stable',
      category: 'Computer Accessories',
      listedDate: '2023-03-20',
      updatedAt: '2026-03-14T02:00:00Z'
    }
  ],
  tiktok: [
    {
      id: 'tik-001',
      title: 'Wireless Bluetooth Earbuds with LED Display, True Wireless Stereo',
      image: 'https://via.placeholder.com/400x400/ff9f43/ffffff?text=Wireless+Earbuds',
      price: 12.99,
      currency: 'USD',
      rating: 4.3,
      reviewCount: 5678,
      salesCount: 34567,
      shopName: 'TechDeal Store',
      platform: 'tiktok',
      productUrl: 'https://shop.tiktok.com/view/product/123456',
      isNew: true,
      salesTrend: 'up',
      category: 'Audio',
      listedDate: '2026-03-12',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'tik-002',
      title: 'Mini Portable Fan USB Rechargeable, Handheld Pocket Fan',
      image: 'https://via.placeholder.com/400x400/54a0ff/ffffff?text=Mini+Fan',
      price: 8.99,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 8765,
      salesCount: 45678,
      shopName: 'Cool Gadgets',
      platform: 'tiktok',
      productUrl: 'https://shop.tiktok.com/view/product/234567',
      isNew: false,
      salesTrend: 'up',
      category: 'Accessories',
      listedDate: '2025-12-10',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'tik-003',
      title: 'LED Strip Lights RGB, 50ft Smart WiFi LED Lights',
      image: 'https://via.placeholder.com/400x400/5f27cd/ffffff?text=LED+Strip',
      price: 15.99,
      currency: 'USD',
      rating: 4.4,
      reviewCount: 3456,
      salesCount: 23456,
      shopName: 'Home Decor',
      platform: 'tiktok',
      productUrl: 'https://shop.tiktok.com/view/product/345678',
      isNew: false,
      salesTrend: 'stable',
      category: 'Smart Home',
      listedDate: '2025-11-20',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'tik-004',
      title: 'Phone Stand Holder, Adjustable Desktop Cell Phone Stand',
      image: 'https://via.placeholder.com/400x400/00d2d3/333333?text=Phone+Stand',
      price: 9.99,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 2345,
      salesCount: 12345,
      shopName: 'Mobile Accessories',
      platform: 'tiktok',
      productUrl: 'https://shop.tiktok.com/view/product/456789',
      isNew: false,
      salesTrend: 'up',
      category: 'Accessories',
      listedDate: '2025-10-15',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'tik-005',
      title: 'Smart Watch Fitness Tracker, Heart Rate Monitor, Waterproof',
      image: 'https://via.placeholder.com/400x400/ff6b6b/ffffff?text=Smart+Watch',
      price: 29.99,
      currency: 'USD',
      rating: 4.2,
      reviewCount: 1234,
      salesCount: 8765,
      shopName: 'Wearable Tech',
      platform: 'tiktok',
      productUrl: 'https://shop.tiktok.com/view/product/567890',
      isNew: true,
      salesTrend: 'up',
      category: 'Wearable',
      listedDate: '2026-03-08',
      updatedAt: '2026-03-14T02:00:00Z'
    }
  ],
  shopee: [
    {
      id: 'shp-001',
      title: 'USB C Cable Fast Charging 3A Nylon Braided Cord',
      image: 'https://via.placeholder.com/400x400/ee5a24/ffffff?text=USB-C+Cable',
      price: 2.99,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 123456,
      salesCount: 345678,
      shopName: 'Cable World',
      platform: 'shopee',
      productUrl: 'https://shopee.com/product/123456',
      isNew: false,
      salesTrend: 'stable',
      category: 'Cable',
      listedDate: '2024-01-01',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'shp-002',
      title: 'Wireless Mouse 2.4G Silent Click Optical Mouse for Laptop',
      image: 'https://via.placeholder.com/400x400/009432/ffffff?text=Wireless+Mouse',
      price: 5.99,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 67890,
      salesCount: 123456,
      shopName: 'Computer Store',
      platform: 'shopee',
      productUrl: 'https://shopee.com/product/234567',
      isNew: false,
      salesTrend: 'up',
      category: 'Computer Accessories',
      listedDate: '2023-08-15',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'shp-003',
      title: 'Phone Case for iPhone 15 Pro Max, Shockproof Protective Cover',
      image: 'https://via.placeholder.com/400x400/0652DD/ffffff?text=iPhone+Case',
      price: 3.99,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 45678,
      salesCount: 89012,
      shopName: 'Phone Accessories',
      platform: 'shopee',
      productUrl: 'https://shopee.com/product/345678',
      isNew: true,
      salesTrend: 'up',
      category: 'Phone Case',
      listedDate: '2026-03-05',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'shp-004',
      title: 'Bluetooth Speaker Portable Waterproof Outdoor Speaker',
      image: 'https://via.placeholder.com/400x400/9c88ff/ffffff?text=Bluetooth+Speaker',
      price: 12.99,
      currency: 'USD',
      rating: 4.4,
      reviewCount: 23456,
      salesCount: 56789,
      shopName: 'Audio Shop',
      platform: 'shopee',
      productUrl: 'https://shopee.com/product/456789',
      isNew: false,
      salesTrend: 'stable',
      category: 'Audio',
      listedDate: '2023-12-01',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'shp-005',
      title: 'Power Bank 20000mAh Fast Charging Portable Charger',
      image: 'https://via.placeholder.com/400x400/00d2d3/333333?text=Power+Bank',
      price: 18.99,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 34567,
      salesCount: 78901,
      shopName: 'Power Store',
      platform: 'shopee',
      productUrl: 'https://shopee.com/product/567890',
      isNew: false,
      salesTrend: 'up',
      category: 'Power Bank',
      listedDate: '2024-02-10',
      updatedAt: '2026-03-14T02:00:00Z'
    }
  ],
  lazada: [
    {
      id: 'lzd-001',
      title: 'TWS Bluetooth Earbuds Wireless Headphones with Charging Case',
      image: 'https://via.placeholder.com/400x400/ff9ff3/333333?text=TWS+Earbuds',
      price: 14.99,
      currency: 'USD',
      rating: 4.4,
      reviewCount: 8765,
      salesCount: 23456,
      shopName: 'Audio Master',
      platform: 'lazada',
      productUrl: 'https://lazada.com/products/123456',
      isNew: false,
      salesTrend: 'stable',
      category: 'Audio',
      listedDate: '2024-01-20',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'lzd-002',
      title: 'Smart LED Light Bulb WiFi RGB Color Changing Voice Control',
      image: 'https://via.placeholder.com/400x400/feca57/333333?text=Smart+Bulb',
      price: 7.99,
      currency: 'USD',
      rating: 4.3,
      reviewCount: 5432,
      salesCount: 12345,
      shopName: 'Smart Home Hub',
      platform: 'lazada',
      productUrl: 'https://lazada.com/products/234567',
      isNew: true,
      salesTrend: 'up',
      category: 'Smart Home',
      listedDate: '2026-03-11',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'lzd-003',
      title: 'Phone Ring Holder Stand 360° Rotation Universal Grip',
      image: 'https://via.placeholder.com/400x400/54a0ff/ffffff?text=Phone+Ring',
      price: 1.99,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 23456,
      salesCount: 67890,
      shopName: 'Mobile World',
      platform: 'lazada',
      productUrl: 'https://lazada.com/products/345678',
      isNew: false,
      salesTrend: 'stable',
      category: 'Accessories',
      listedDate: '2023-11-25',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'lzd-004',
      title: 'Wireless Keyboard and Mouse Combo 2.4G USB Receiver',
      image: 'https://via.placeholder.com/400x400/5f27cd/ffffff?text=Keyboard+Mouse',
      price: 16.99,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 3456,
      salesCount: 8765,
      shopName: 'Computer Plus',
      platform: 'lazada',
      productUrl: 'https://lazada.com/products/456789',
      isNew: false,
      salesTrend: 'up',
      category: 'Computer Accessories',
      listedDate: '2024-02-28',
      updatedAt: '2026-03-14T02:00:00Z'
    },
    {
      id: 'lzd-005',
      title: 'Car Phone Mount Holder Dashboard Windshield Universal',
      image: 'https://via.placeholder.com/400x400/ff6b6b/ffffff?text=Car+Mount',
      price: 6.99,
      currency: 'USD',
      rating: 4.4,
      reviewCount: 6789,
      salesCount: 15678,
      shopName: 'Car Accessories',
      platform: 'lazada',
      productUrl: 'https://lazada.com/products/567890',
      isNew: false,
      salesTrend: 'stable',
      category: 'Accessories',
      listedDate: '2023-10-30',
      updatedAt: '2026-03-14T02:00:00Z'
    }
  ]
}

export function getMockProducts(platform, timeRange = 'today') {
  const baseProducts = mockProducts[platform] || []
  
  // 根据时间范围返回不同的数据
  if (timeRange === 'today') {
    return baseProducts
  } else if (timeRange === 'week') {
    // 近一周数据 - 模拟销量增长
    return baseProducts.map(product => ({
      ...product,
      salesCount: Math.floor(product.salesCount * 1.2),
      salesTrend: 'up'
    }))
  } else if (timeRange === 'month') {
    // 近一个月数据 - 模拟更多销量增长
    return baseProducts.map(product => ({
      ...product,
      salesCount: Math.floor(product.salesCount * 1.5),
      salesTrend: 'up'
    }))
  }
  
  return baseProducts
}

export function filterProducts(products, filters) {
  let filtered = [...products]

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(keyword) || 
      p.shopName.toLowerCase().includes(keyword)
    )
  }

  if (filters.priceRange && filters.priceRange !== 'all') {
    filtered = filtered.filter(p => {
      if (filters.priceRange === '0-20') return p.price < 20
      if (filters.priceRange === '20-50') return p.price >= 20 && p.price < 50
      if (filters.priceRange === '50-100') return p.price >= 50 && p.price < 100
      if (filters.priceRange === '100+') return p.price >= 100
      return true
    })
  }

  if (filters.ratingRange && filters.ratingRange !== 'all') {
    const minRating = parseFloat(filters.ratingRange)
    filtered = filtered.filter(p => p.rating >= minRating)
  }

  if (filters.salesRange && filters.salesRange !== 'all') {
    const minSales = parseInt(filters.salesRange)
    filtered = filtered.filter(p => p.salesCount >= minSales)
  }

  return filtered
}
