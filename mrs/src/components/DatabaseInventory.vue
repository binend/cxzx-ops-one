<template>
  <div class="inventory">
    <div class="container">
      <div class="inventory-layout">
        <!-- 数据库类型选择 -->
        <div class="db-type-selector">
          <div class="card">
            <h3>数据库类型</h3>
            <div class="db-type-list">
              <button
                v-for="dbType in dbTypes"
                :key="dbType.key"
                :class="['db-type-btn', { active: currentDBType === dbType.key }]"
                @click="selectDBType(dbType.key)"
              >
                <span class="db-name">{{ dbType.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 数据库列表 -->
        <div class="database-list">
          <div class="card">
            <div class="section-header">
              <h3>数据库</h3>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索数据库..."
                class="search-input"
              />
            </div>
            <div class="database-items">
              <button
                v-for="database in filteredDatabases"
                :key="database"
                :class="['database-item', { active: currentDatabase === database }]"
                @click="selectDatabase(database)"
              >
                {{ database }}
                <span class="table-count">{{ getTableCount(database) }} 表</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 表列表 -->
        <div class="table-list">
          <div class="card">
            <div class="section-header">
              <h3>表列表</h3>
              <span v-if="currentDatabase" class="database-indicator">
                {{ currentDatabase }}
              </span>
            </div>
            <div class="table-items">
              <button
                v-for="table in currentTables"
                :key="table"
                :class="['table-item', { active: currentTable === table }]"
                @click="selectTable(table)"
              >
                <div class="table-info">
                  <div class="table-name">{{ table }}</div>
                  <div class="table-type">{{ getTableType(table) }}</div>
                </div>
                <div class="table-meta">
                  <span class="table-size">{{ getTableSize(table) }}</span>
                  <span class="table-rows">{{ getTableRowCount(table) }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- 表详情 -->
        <div class="table-details">
          <div class="card">
            <div class="section-header">
              <h3>表详情</h3>
              <span v-if="currentTable" class="table-indicator">
                {{ currentTable }}
              </span>
            </div>
            <div v-if="currentTableData" class="table-details-content">
              <div class="detail-section">
                <h4>基本信息</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">表名</span>
                    <span class="info-value">{{ currentTableData.tableName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">行数</span>
                    <span class="info-value">{{ currentTableData.rowCount.toLocaleString() }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">大小</span>
                    <span class="info-value">{{ currentTableData.size }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">最后更新</span>
                    <span class="info-value">{{ currentTableData.lastUpdated }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4>字段信息</h4>
                <div class="fields-table">
                  <div class="table-header">
                    <div>字段名</div>
                    <div>类型</div>
                    <div>可空</div>
                    <div>备注</div>
                  </div>
                  <div class="table-body">
                    <div
                      v-for="field in currentTableData.fields"
                      :key="field.name"
                      class="field-row"
                      @click="showFieldDetails(field)"
                    >
                      <div class="field-name">{{ field.name }}</div>
                      <div class="field-type">{{ field.type }}</div>
                      <div class="field-nullable">
                        <span :class="['status-badge', field.nullable ? 'warning' : 'success']">
                          {{ field.nullable ? 'YES' : 'NO' }}
                        </span>
                      </div>
                      <div class="field-comment">{{ field.comment }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <div class="empty-icon">📊</div>
              <p>选择一个表查看详细信息</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
const {
  currentDBType,
  currentDatabase,
  currentTable,
  getCurrentDatabaseList,
  getCurrentTableList,
  getCurrentTableData
} = storeToRefs(appStore)

const searchQuery = ref('')

const dbTypes = [
  { key: 'hive', name: 'Hive' },
  { key: 'clickhouse', name: 'ClickHouse' },
  { key: 'elasticsearch', name: 'ElasticSearch' },
  { key: 'dws', name: 'DWS' }
]

const filteredDatabases = computed(() => {
  if (!searchQuery.value) return getCurrentDatabaseList.value
  return getCurrentDatabaseList.value.filter(db =>
    db.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const currentTables = computed(() => getCurrentTableList.value)

const currentTableData = computed(() => getCurrentTableData.value)

function selectDBType(dbType) {
  appStore.setDBType(dbType)
  searchQuery.value = ''
}

function selectDatabase(database) {
  appStore.setDatabase(database)
}

function selectTable(table) {
  appStore.setTable(table)
}

function getTableCount(database) {
  const dbConfig = appStore.databaseConfig[currentDBType.value]?.[database]
  return dbConfig ? Object.keys(dbConfig).length : 0
}

function getTableType(table) {
  if (table.startsWith('dim_')) return '维度表'
  if (table.startsWith('fact_')) return '事实表'
  if (table.startsWith('dws_')) return '汇总表'
  return '业务表'
}

function getTableSize(table) {
  const sizes = ['120 MB', '890 MB', '2.3 GB', '15.6 GB']
  return sizes[Math.floor(Math.random() * sizes.length)]
}

function getTableRowCount(table) {
  const count = Math.floor(Math.random() * 1000000) + 10000
  return `${(count / 1000).toFixed(0)}K`
}

function showFieldDetails(field) {
  appStore.showFieldModal(field)
}
</script>

<style scoped>
.inventory {
  padding: 40px 0;
}

.inventory-layout {
  display: grid;
  grid-template-columns: 200px 1fr 1fr 1.5fr;
  gap: 20px;
  min-height: 600px;
}

.db-type-selector h3,
.database-list h3,
.table-list h3,
.table-details h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
}

.db-type-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.db-type-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: rgba(79, 70, 229, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.db-type-btn:hover {
  background: rgba(79, 70, 229, 0.1);
}

.db-type-btn.active {
  background: rgba(79, 70, 229, 0.15);
  border-color: #4f46e5;
}

.db-name {
  font-size: 14px;
  font-weight: 500;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  max-width: 200px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

.database-indicator,
.table-indicator {
  font-size: 12px;
  color: #6b7280;
  background: rgba(79, 70, 229, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
}

.database-items,
.table-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 500px;
  overflow-y: auto;
}

.database-item,
.table-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.database-item:hover,
.table-item:hover {
  background: rgba(79, 70, 229, 0.05);
}

.database-item.active,
.table-item.active {
  background: rgba(79, 70, 229, 0.1);
  border-color: #4f46e5;
}

.table-count {
  font-size: 12px;
  color: #6b7280;
}

.table-info {
  flex: 1;
}

.table-name {
  font-weight: 500;
  color: #1f2937;
}

.table-type {
  font-size: 12px;
  color: #6b7280;
}

.table-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.table-size,
.table-rows {
  font-size: 12px;
  color: #6b7280;
}

.table-details-content {
  max-height: 500px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.fields-table {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 80px 2fr;
  background: #f9fafb;
  padding: 12px;
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
}

.field-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 80px 2fr;
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.field-row:hover {
  background: #f9fafb;
}

.field-row:last-child {
  border-bottom: none;
}

.field-name {
  font-weight: 500;
  color: #1f2937;
}

.field-type {
  color: #6b7280;
  font-size: 14px;
}

.field-comment {
  color: #6b7280;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

@media (max-width: 1024px) {
  .inventory-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .db-type-list {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .db-type-btn {
    flex: 1;
    min-width: 120px;
  }
}
</style>