<script setup>
import { ref } from 'vue'

const emit = defineEmits(['filter'])

const showPanel = ref(false)

const filters = ref({
  priceRange: 'all',
  ratingRange: 'all',
  salesRange: 'all'
})

const priceRanges = [
  { value: 'all', label: '全部' },
  { value: '0-20', label: '$0-$20' },
  { value: '20-50', label: '$20-$50' },
  { value: '50-100', label: '$50-$100' },
  { value: '100+', label: '$100+' }
]

const ratingRanges = [
  { value: 'all', label: '全部' },
  { value: '4.0', label: '4.0+' },
  { value: '4.5', label: '4.5+' },
  { value: '4.8', label: '4.8+' }
]

const salesRanges = [
  { value: 'all', label: '全部' },
  { value: '100', label: '100+' },
  { value: '500', label: '500+' },
  { value: '1000', label: '1000+' }
]

const togglePanel = () => {
  showPanel.value = !showPanel.value
}

const applyFilters = () => {
  emit('filter', filters.value)
  showPanel.value = false
}

const resetFilters = () => {
  filters.value = {
    priceRange: 'all',
    ratingRange: 'all',
    salesRange: 'all'
  }
  emit('filter', filters.value)
  showPanel.value = false
}
</script>

<template>
  <div class="filter-panel">
    <button class="filter-toggle" @click="togglePanel">
      🔧 筛选
    </button>

    <div v-if="showPanel" class="filter-dropdown">
      <div class="filter-section">
        <h4>价格区间</h4>
        <div class="filter-options">
          <label v-for="range in priceRanges" :key="range.value" class="filter-option">
            <input
              v-model="filters.priceRange"
              type="radio"
              :value="range.value"
            />
            <span>{{ range.label }}</span>
          </label>
        </div>
      </div>

      <div class="filter-section">
        <h4>评分</h4>
        <div class="filter-options">
          <label v-for="range in ratingRanges" :key="range.value" class="filter-option">
            <input
              v-model="filters.ratingRange"
              type="radio"
              :value="range.value"
            />
            <span>{{ range.label }}</span>
          </label>
        </div>
      </div>

      <div class="filter-section">
        <h4>销量</h4>
        <div class="filter-options">
          <label v-for="range in salesRanges" :key="range.value" class="filter-option">
            <input
              v-model="filters.salesRange"
              type="radio"
              :value="range.value"
            />
            <span>{{ range.label }}</span>
          </label>
        </div>
      </div>

      <div class="filter-actions">
        <button class="btn-reset" @click="resetFilters">重置</button>
        <button class="btn-apply" @click="applyFilters">应用</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  position: relative;
}

.filter-toggle {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-toggle:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  min-width: 280px;
  z-index: 1000;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.75rem 0;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #666;
}

.filter-option input[type="radio"] {
  cursor: pointer;
}

.filter-option:hover {
  color: #667eea;
}

.filter-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.btn-reset,
.btn-apply {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset {
  background: #f5f5f5;
  color: #666;
}

.btn-reset:hover {
  background: #e0e0e0;
}

.btn-apply {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-apply:hover {
  transform: scale(1.02);
}

@media (max-width: 768px) {
  .filter-dropdown {
    right: -1rem;
    min-width: 260px;
  }
}
</style>
