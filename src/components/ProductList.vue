<script setup>
const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  platform: {
    type: String,
    required: true
  }
})

const openProductUrl = (url) => {
  window.open(url, '_blank')
}

const getPlatformName = (platform) => {
  const names = {
    amazon: '亚马逊',
    tiktok: 'TikTok Shop',
    shopee: 'Shopee',
    lazada: 'Lazada'
  }
  return names[platform] || platform
}
</script>

<template>
  <div class="product-list">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="products.length === 0" class="empty">
      <p>暂无商品数据</p>
    </div>

    <div v-else class="products-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="openProductUrl(product.productUrl)"
      >
        <div class="product-image">
          <img :src="product.image" :alt="product.title" loading="lazy" />
          <div class="badges">
            <span v-if="product.isNew" class="badge badge-new">NEW</span>
            <span v-if="product.salesTrend === 'up'" class="badge badge-trend-up">↑</span>
            <span v-if="product.salesTrend === 'down'" class="badge badge-trend-down">↓</span>
          </div>
        </div>

        <div class="product-info">
          <h3 class="product-title">{{ product.title }}</h3>
          
          <div class="product-price">
            <span class="current-price">${{ product.price.toFixed(2) }}</span>
            <span v-if="product.originalPrice" class="original-price">
              ${{ product.originalPrice.toFixed(2) }}
            </span>
          </div>

          <div class="product-rating">
            <span class="stars">⭐</span>
            <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
            <span class="review-count">({{ product.reviewCount }})</span>
          </div>

          <div class="product-sales">
            <span class="sales-icon">🔥</span>
            <span>销量: {{ product.salesCount.toLocaleString() }}</span>
          </div>

          <div class="product-shop">
            <span class="shop-icon">🏪</span>
            <span>{{ product.shopName }}</span>
          </div>

          <div class="product-platform">
            <span class="platform-tag">{{ getPlatformName(product.platform) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list {
  min-height: 400px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #999;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #f5f5f5;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-new {
  background: #4caf50;
  color: white;
}

.badge-trend-up {
  background: #ff9800;
  color: white;
}

.badge-trend-down {
  background: #f44336;
  color: white;
}

.product-info {
  padding: 1rem;
}

.product-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.product-price {
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
}

.original-price {
  font-size: 0.875rem;
  color: #999;
  text-decoration: line-through;
  margin-left: 0.5rem;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.stars {
  color: #ffc107;
}

.rating-value {
  font-weight: 600;
}

.review-count {
  color: #999;
}

.product-sales {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.product-shop {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.product-platform {
  margin-top: 0.5rem;
}

.platform-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #f5f5f5;
  color: #666;
  border-radius: 4px;
  font-size: 0.75rem;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .product-info {
    padding: 0.75rem;
  }

  .product-title {
    font-size: 0.8rem;
  }

  .current-price {
    font-size: 1.125rem;
  }
}
</style>
