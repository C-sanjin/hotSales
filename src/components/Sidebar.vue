<script setup>
const props = defineProps({
  currentTimeRange: {
    type: String,
    default: 'today'
  }
})

const emit = defineEmits(['timeRangeChange'])

const timeRanges = [
  { id: 'today', name: '今日', icon: '📅' },
  { id: 'week', name: '近一周', icon: '📆' },
  { id: 'month', name: '近一月', icon: '🗓️' }
]

const handleTimeRangeClick = (timeRangeId) => {
  emit('timeRangeChange', timeRangeId)
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="brand">
        <span class="brand-icon">📊</span>
        <span class="brand-text">Hot Sales</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-section-title">电商平台</div>
        <ul class="nav-list">
          <li class="nav-item platform-item active">
            <span class="nav-icon">🛒</span>
            <span class="nav-text">亚马逊</span>
            <span class="platform-indicator" style="background: #ff9900"></span>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <div class="nav-section-title">时间范围</div>
        <ul class="nav-list time-range-list">
          <li 
            v-for="range in timeRanges" 
            :key="range.id"
            :class="['nav-item', 'time-item', { active: currentTimeRange === range.id }]"
            @click="handleTimeRangeClick(range.id)"
          >
            <span class="nav-icon">{{ range.icon }}</span>
            <span class="nav-text">{{ range.name }}</span>
          </li>
        </ul>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="footer-info">
        <div class="info-item">
          <span class="info-label">版本</span>
          <span class="info-value">v1.0.0</span>
        </div>
        <div class="info-item">
          <span class="info-label">状态</span>
          <span class="info-value status-online">● 在线</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 200;
  overflow-y: auto;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  font-size: 28px;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 12px;
  margin-bottom: 8px;
}

.nav-list {
  list-style: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: 4px;
  position: relative;
}

.nav-item:hover {
  background: var(--bg-tertiary);
}

.nav-item.active {
  background: var(--accent-blue);
  color: white;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: white;
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}

.platform-item {
  position: relative;
}

.platform-indicator {
  position: absolute;
  right: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0.6;
}

.platform-item.active .platform-indicator {
  opacity: 1;
  box-shadow: 0 0 8px currentColor;
}

.time-range-list .time-item {
  padding: 10px 12px;
}

.time-item.active {
  background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-tertiary);
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.info-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.status-online {
  color: var(--accent-green);
}

@media (max-width: 1024px) {
  .sidebar {
    width: var(--sidebar-width);
  }

  .brand-text,
  .nav-text,
  .nav-section-title,
  .footer-info {
    display: none;
  }

  .nav-item {
    justify-content: center;
    padding: 12px;
  }

  .nav-icon {
    font-size: 20px;
  }

  .platform-indicator {
    display: none;
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
