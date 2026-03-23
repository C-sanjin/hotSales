<script setup>
const props = defineProps({
  currentRange: {
    type: String,
    default: 'today'
  }
})

const emit = defineEmits(['change'])

const timeRanges = [
  { value: 'today', label: '今日' },
  { value: 'week', label: '近一周' },
  { value: 'month', label: '近一个月' }
]

const handleRangeChange = (range) => {
  emit('change', range)
}
</script>

<template>
  <div class="time-range-selector">
    <button
      v-for="range in timeRanges"
      :key="range.value"
      :class="['time-button', { active: currentRange === range.value }]"
      @click="handleRangeChange(range.value)"
    >
      {{ range.label }}
    </button>
  </div>
</template>

<style scoped>
.time-range-selector {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.time-button {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
}

.time-button:hover {
  border-color: #667eea;
  color: #667eea;
}

.time-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

@media (max-width: 768px) {
  .time-range-selector {
    padding: 1rem;
  }

  .time-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    margin-right: 0.3rem;
  }
}
</style>
