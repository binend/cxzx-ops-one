import { defineStore } from 'pinia'
import { generateDatabaseConfig, generateTableData } from '../composables/useData'

export const useAppStore = defineStore('app', {
  state: () => ({
    activeSection: 'overview',
    loading: false,
    currentDBType: 'hive',
    currentDatabase: '',
    currentTable: '',
    selectedField: null,
    showModal: false,
    databaseConfig: generateDatabaseConfig(),
    tableData: {},
    ioMetrics: {
      read: 0,
      write: 0,
      cpu: 0,
      memory: 0
    }
  }),

  getters: {
    getCurrentDatabaseList: (state) => {
      return Object.keys(state.databaseConfig[state.currentDBType] || {})
    },

    getCurrentTableList: (state) => {
      if (!state.currentDatabase) return []
      return Object.keys(state.databaseConfig[state.currentDBType][state.currentDatabase] || {})
    },

    getCurrentTableData: (state) => {
      const key = `${state.currentDBType}_${state.currentDatabase}_${state.currentTable}`
      return state.tableData[key] || null
    }
  },

  actions: {
    setActiveSection(section) {
      this.activeSection = section
    },

    setDBType(dbType) {
      this.currentDBType = dbType
      this.currentDatabase = ''
      this.currentTable = ''
    },

    setDatabase(database) {
      this.currentDatabase = database
      this.currentTable = ''
    },

    setTable(table) {
      this.currentTable = table
      if (!this.tableData[`${this.currentDBType}_${this.currentDatabase}_${table}`]) {
        this.tableData[`${this.currentDBType}_${this.currentDatabase}_${table}`] =
          generateTableData(table, this.currentDBType)
      }
    },

    showFieldModal(field) {
      this.selectedField = field
      this.showModal = true
    },

    hideModal() {
      this.showModal = false
      this.selectedField = null
    },

    updateIOMetrics() {
      this.ioMetrics = {
        read: Math.floor(Math.random() * 100) + 50,
        write: Math.floor(Math.random() * 80) + 30,
        cpu: Math.floor(Math.random() * 60) + 20,
        memory: Math.floor(Math.random() * 70) + 40
      }
    }
  }
})