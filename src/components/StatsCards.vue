<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      totalSales: 0,
      totalRevenue: 0,
      avgRating: 0,
      productCount: 0,
      salesTrend: 0,
      revenueTrend: 0,
      ratingTrend: 0,
      productTrend: 0
    })
  }
})

const cards = computed(() => [
  {
    id: 'sales',
    title: '今日销量',
    value: props.stats.totalSales.toLocaleString(),
    trend: props.stats.salesTrend,
    icon: '📈',
    color: 'var(--accent-blue)',
    bgColor: 'rgba(59, 130, 246, 0.1)'
  },
  {
    id: 'revenue',
    title: '总销售额',
    value: `$${props.stats.totalRevenue.toLocaleString()}`,
    trend: props.stats.revenueTrend,
    icon: '💰',
    color: 'var(--accent-green)',
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  {
    id: 'rating',
    title: '平均评分',
    value: props.stats.avgRating.toFixed(1),
    trend: props.stats.ratingTrend,
    icon: '⭐',
    color: 'var(--accent-yellow)',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  },
  {
    id: 'products',
    title: '商品数量',
    value: props.stats.productCount.toLocaleString(),
    trend: props.stats.productTrend,
    icon: '📦',
    color: 'var(--accent-purple)',
    bgColor: 'rgba(139, 92, 246, 0.1)'
  }
])

const getTrendClass = (trend) => {
  if (trend > 0) return 'trend-up'
  if (trend < 0) return 'trend-down'
  return 'trend-stable'
}

const getTrendIcon = (trend) => {
  if (trend > 0) return '↑'
  if (trend < 0) return '↓'
  return '→'
}
</script>

<template>
  <div class="stats-cards">
    <div 
      v-for="card in cards" 
      :key="card.id"
      class="stat-card fade-in"
      :style="{ animationDelay: `${cards.indexOf(card) * 0.1}s` }"
    >
      <div class="card-header">
        <div class="card-icon" :style="{ background: card.bgColor }">
          <span>{{ card.icon }}</span>
        </div>
        <div class="card-title">{{ card.title }}</div>
      </div>
      
      <div class="card-body">
        <div class="card-value" :style="{ color: card.color }">
          {{ card.value }}
        </div>
        <div class="card-trend" :class="getTrendClass(card.trend)">
          <span class="trend-icon">{{ getTrendIcon(card.trend) }}</span>
          <span class="trend-value">{{ Math.abs(card.trend) }}%</span>
        </div>
      </div>

      <div class="card-footer">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ 
              width: `${Math.min(Math.abs(card.trend), 100)}%`,
              background: card.color 
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 20px;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--border-light);
}

.stat-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.card-body {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.card-trend.trend-up {
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent-green);
}

.card-trend.trend-down {
  background: rgba(239, 68, 68, 0.1);
  color: var(--accent-red);
}

.card-trend.trend-stable {
  background: rgba(245, 158, 11, 0.1);
  color: var(--accent-yellow);
}

.trend-icon {
  font-size: 14px;
}

.card-footer {
  margin-top: auto;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width var(--transition-slow);
}

@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    padding: 16px;
  }

  .card-value {
    font-size: 28px;
  }
}
</style>
