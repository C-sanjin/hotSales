<script setup>
const props = defineProps({
  platforms: {
    type: Array,
    required: true
  },
  currentPlatform: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['change'])

const handleTabClick = (platform) => {
  emit('change', platform.id)
}
</script>

<template>
  <div class="platform-tabs">
    <div class="tabs-container">
      <button
        v-for="platform in platforms"
        :key="platform.id"
        :class="['tab', { active: currentPlatform === platform.id }]"
        @click="handleTabClick(platform)"
      >
        {{ platform.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.platform-tabs {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.tabs-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 0.5rem;
  padding: 1rem 2rem;
  overflow-x: auto;
}

.tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab:hover {
  border-color: #667eea;
  color: #667eea;
}

.tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

@media (max-width: 768px) {
  .tabs-container {
    padding: 1rem;
  }

  .tab {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
