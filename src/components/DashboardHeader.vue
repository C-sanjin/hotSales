<script setup>
import { computed } from 'vue'

const currentDate = new Date()

const formattedDate = computed(() => {
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekDay = weekDays[currentDate.getDay()]
  return `${year}-${month}-${day} ${weekDay}`
})
</script>

<template>
  <header class="dashboard-header">
    <div class="header-left"></div>

    <div class="header-center">
      <div class="logo">
        <span class="logo-icon">📊</span>
        <span class="logo-text">跨境电商3C电子热卖情报看板</span>
      </div>
    </div>

    <div class="header-right">
      <div class="date-display">
        <span class="date-value">{{ formattedDate }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);
  height: var(--header-height);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-left {
  flex: 0 0 150px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 26px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  white-space: nowrap;
}

.header-right {
  flex: 0 0 150px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.date-display {
  display: flex;
  align-items: center;
}

.date-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-blue);
  font-family: 'Courier New', monospace;
}

@media (max-width: 1024px) {
  .dashboard-header {
    left: var(--sidebar-width);
    padding: 0 16px;
  }

  .logo-text {
    font-size: 16px;
    letter-spacing: 0;
  }

  .logo-icon {
    font-size: 22px;
  }

  .header-left,
  .header-right {
    flex: 0 0 100px;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    left: 0;
    padding: 0 12px;
  }

  .logo-text {
    font-size: 14px;
    letter-spacing: 0;
  }

  .logo-icon {
    font-size: 20px;
  }

  .header-left,
  .header-right {
    flex: 0 0 60px;
  }

  .date-display {
    display: none;
  }
}
</style>
