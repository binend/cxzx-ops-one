<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">大数据运维</div>

        <nav class="nav-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="['nav-tab', { active: activeSection === tab.key }]"
            @click="handleTabClick(tab.key)"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
const { activeSection } = storeToRefs(appStore)

const tabs = [
  { key: 'overview', label: '大数据总览' },
  { key: 'inventory', label: '大数据库表清单' },
  { key: 'io-analysis', label: '大数据高IO智能分析' }
]

const handleTabClick = (section) => {
  appStore.setActiveSection(section)
}
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  animation: slideDown 0.5s ease-out;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(45deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-tabs {
  display: flex;
  gap: 10px;
}

.nav-tab {
  padding: 12px 24px;
  background: rgba(79, 70, 229, 0.1);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  color: #333;
}

.nav-tab::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.3), transparent);
  transition: left 0.5s ease;
}

.nav-tab:hover::before {
  left: 100%;
}

.nav-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.2);
}

.nav-tab.active {
  background: linear-gradient(45deg, #4f46e5, #7c3aed);
  color: white;
  border-color: transparent;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
  }

  .nav-tabs {
    width: 100%;
    justify-content: center;
  }

  .nav-tab {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>