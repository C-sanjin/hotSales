<script setup>
import { ref, onMounted, computed } from 'vue'
import DashboardHeader from './components/DashboardHeader.vue'
import Sidebar from './components/Sidebar.vue'
import StatsCards from './components/StatsCards.vue'
import ProductTable from './components/ProductTable.vue'
import SearchBar from './components/SearchBar.vue'
import FilterPanel from './components/FilterPanel.vue'
import { fetchProducts } from './api/products'

const currentPlatform = ref('amazon')
const currentTimeRange = ref('today')
const products = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const filters = ref({
  priceRange: 'all',
  ratingRange: 'all',
  salesRange: 'all'
})
const lastUpdateTime = ref('')

const stats = computed(() => {
  const totalSales = products.value.reduce((sum, p) => sum + p.salesCount, 0)
  const totalRevenue = products.value.reduce((sum, p) => sum + p.price * p.salesCount, 0)
  const avgRating = products.value.length > 0 
    ? products.value.reduce((sum, p) => sum + p.rating, 0) / products.value.length 
    : 0
  
  return {
    totalSales,
    totalRevenue: Math.round(totalRevenue),
    avgRating,
    productCount: products.value.length,
    platformCount: 1,
    salesTrend: 15,
    revenueTrend: 8,
    ratingTrend: 2,
    productTrend: 12
  }
})

const loadProducts = async () => {
  loading.value = true
  try {
    const data = await fetchProducts(currentPlatform.value, {
      keyword: searchKeyword.value,
      timeRange: currentTimeRange.value,
      ...filters.value
    })
    products.value = data.products
    lastUpdateTime.value = data.lastUpdateTime
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
}

const handleTimeRangeChange = (timeRange) => {
  currentTimeRange.value = timeRange
  loadProducts()
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
  loadProducts()
}

const handleFilterChange = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters }
  loadProducts()
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="dashboard-layout">
    <Sidebar 
      :current-time-range="currentTimeRange"
      @timeRangeChange="handleTimeRangeChange"
    />

    <main class="dashboard-main">
      <DashboardHeader />

      <div class="dashboard-content">
        <StatsCards :stats="stats" />

        <div class="content-section">
          <div class="section-header">
            <h2 class="section-title">商品数据分析</h2>
            <div class="section-actions">
              <SearchBar @search="handleSearch" />
              <FilterPanel @filter="handleFilterChange" />
            </div>
          </div>

          <ProductTable 
            :products="products" 
            :loading="loading"
            :platform="currentPlatform"
          />
        </div>

        <footer class="dashboard-footer">
          <p>数据更新于：{{ lastUpdateTime || '加载中...' }}</p>
          <p>© 2026 跨境电商3C电子热卖情报看板 - 数据仪表盘</p>
        </footer>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

.dashboard-main {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding-top: var(--header-height);
  background: var(--bg-primary);
}

.dashboard-content {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

.content-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.section-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.dashboard-footer {
  margin-top: 40px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  text-align: center;
}

.dashboard-footer p {
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 4px 0;
}

.dashboard-footer p:first-child {
  color: var(--text-secondary);
  font-weight: 500;
}

@media (max-width: 1024px) {
  .dashboard-content {
    padding: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .dashboard-main {
    margin-left: 0;
  }

  .dashboard-content {
    padding: 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .section-actions {
    width: 100%;
  }
}
</style>
