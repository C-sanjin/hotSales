<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])

const keyword = ref('')

const handleSearch = () => {
  emit('search', keyword.value)
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索商品关键词..."
        class="search-input"
        @keypress="handleKeyPress"
      />
      <button class="search-button" @click="handleSearch">
        🔍
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  flex: 1;
  min-width: 300px;
}

.search-input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.search-button:hover {
  transform: scale(1.05);
}

.search-button:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .search-bar {
    min-width: 100%;
  }

  .search-input {
    font-size: 0.8rem;
  }

  .search-button {
    padding: 0.75rem 1rem;
  }
}
</style>
