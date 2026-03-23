<script setup>
import { ref } from 'vue'

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

const sortField = ref('salesCount')
const sortOrder = ref('desc')
const currentPage = ref(1)
const pageSize = ref(10)

const sortedProducts = computed(() => {
  const sorted = [...props.products].sort((a, b) => {
    const aVal = a[sortField.value]
    const bVal = b[sortField.value]
    return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
  })
  return sorted
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(props.products.length / pageSize.value)
})

const handleSort = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
}

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

const getTrendClass = (trend) => {
  if (trend === 'up') return 'trend-up'
  if (trend === 'down') return 'trend-down'
  return 'trend-stable'
}

const getTrendIcon = (trend) => {
  if (trend === 'up') return '↑'
  if (trend === 'down') return '↓'
  return '→'
}

import { computed } from 'vue'
</script>

<template>
  <div class="product-table-container">
    <div class="table-header">
      <h3 class="table-title">商品列表</h3>
      <div class="table-actions">
        <span class="product-count">共 {{ products.length }} 件商品</span>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="products.length === 0" class="empty-state">
      <span class="empty-icon">📦</span>
      <p>暂无商品数据</p>
    </div>

    <div v-else class="table-wrapper">
      <table class="product-table">
        <thead>
          <tr>
            <th class="col-image">图片</th>
            <th class="col-title">商品名称</th>
            <th class="sortable" @click="handleSort('price')">
              价格
              <span class="sort-icon" v-if="sortField === 'price'">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th class="sortable" @click="handleSort('salesCount')">
              销量
              <span class="sort-icon" v-if="sortField === 'salesCount'">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th class="sortable" @click="handleSort('rating')">
              评分
              <span class="sort-icon" v-if="sortField === 'rating'">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th class="col-trend">趋势</th>
            <th class="col-platform">平台</th>
            <th class="col-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(product, index) in paginatedProducts" 
            :key="product.id"
            class="product-row fade-in"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <td class="col-image">
              <div class="product-image">
                <img :src="product.image" :alt="product.title" loading="lazy" />
                <span v-if="product.isNew" class="new-badge">NEW</span>
              </div>
            </td>
            <td class="col-title">
              <div class="product-info">
                <h4 class="product-title">{{ product.title }}</h4>
                <p class="product-shop">🏪 {{ product.shopName }}</p>
              </div>
            </td>
            <td class="col-price">
              <span class="price">${{ product.price.toFixed(2) }}</span>
            </td>
            <td class="col-sales">
              <div class="sales-info">
                <span class="sales-count">{{ product.salesCount.toLocaleString() }}</span>
                <div class="sales-bar">
                  <div 
                    class="sales-fill" 
                    :style="{ width: `${Math.min((product.salesCount / 10000) * 100, 100)}%` }"
                  ></div>
                </div>
              </div>
            </td>
            <td class="col-rating">
              <div class="rating-info">
                <span class="stars">⭐</span>
                <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
                <span class="review-count">({{ product.reviewCount }})</span>
              </div>
            </td>
            <td class="col-trend">
              <span :class="['trend-badge', getTrendClass(product.salesTrend)]">
                {{ getTrendIcon(product.salesTrend) }}
              </span>
            </td>
            <td class="col-platform">
              <span class="platform-tag">{{ getPlatformName(product.platform) }}</span>
            </td>
            <td class="col-actions">
              <button class="action-btn" @click="openProductUrl(product.productUrl)">
                查看
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="products.length > 0" class="pagination">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        ← 上一页
      </button>
      <div class="page-info">
        <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
      </div>
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        下一页 →
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-table-container {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.product-count {
  font-size: 14px;
  color: var(--text-secondary);
}

.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--bg-tertiary);
  border-top-color: var(--accent-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.table-wrapper {
  overflow-x: auto;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table thead {
  background: var(--bg-tertiary);
}

.product-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color);
}

.product-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: color var(--transition-fast);
}

.product-table th.sortable:hover {
  color: var(--accent-blue);
}

.sort-icon {
  margin-left: 4px;
  font-size: 10px;
}

.product-row {
  transition: background var(--transition-fast);
}

.product-row:hover {
  background: var(--bg-tertiary);
}

.product-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.col-image {
  width: 80px;
}

.product-image {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 2px 6px;
  background: var(--accent-green);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;
}

.col-title {
  max-width: 300px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-shop {
  font-size: 12px;
  color: var(--text-tertiary);
}

.price {
  font-size: 16px;
  font-weight: 700;
  color: var(--accent-blue);
}

.sales-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sales-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.sales-bar {
  width: 100%;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.sales-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
  border-radius: 2px;
  transition: width var(--transition-slow);
}

.rating-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stars {
  font-size: 14px;
}

.rating-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.review-count {
  font-size: 12px;
  color: var(--text-tertiary);
}

.trend-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
}

.trend-badge.trend-up {
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent-green);
}

.trend-badge.trend-down {
  background: rgba(239, 68, 68, 0.1);
  color: var(--accent-red);
}

.trend-badge.trend-stable {
  background: rgba(245, 158, 11, 0.1);
  color: var(--accent-yellow);
}

.platform-tag {
  display: inline-block;
  padding: 6px 12px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.action-btn {
  padding: 8px 16px;
  background: var(--accent-blue);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--accent-blue-light);
  transform: translateY(-1px);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.page-btn {
  padding: 10px 20px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled) {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: var(--text-secondary);
}

@media (max-width: 1024px) {
  .product-table {
    font-size: 13px;
  }

  .product-table th,
  .product-table td {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .product-table th,
  .product-table td {
    padding: 10px 8px;
  }

  .col-image {
    width: 60px;
  }

  .product-image {
    width: 50px;
    height: 50px;
  }

  .col-title {
    max-width: 200px;
  }

  .pagination {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
