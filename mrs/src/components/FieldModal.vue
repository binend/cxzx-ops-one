<template>
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>字段详情</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div v-if="selectedField" class="modal-body">
          <div class="field-detail">
            <div class="detail-row">
              <span class="detail-label">字段名</span>
              <span class="detail-value">{{ selectedField.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">数据类型</span>
              <span class="detail-value">{{ selectedField.type }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">可空</span>
              <span :class="['status-badge', selectedField.nullable ? 'warning' : 'success']">
                {{ selectedField.nullable ? 'YES' : 'NO' }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">备注</span>
              <span class="detail-value">{{ selectedField.comment }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">示例值</span>
              <span class="detail-value">{{ selectedField.sampleValue }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
const { showModal, selectedField } = storeToRefs(appStore)

function closeModal() {
  appStore.hideModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 0;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1f2937;
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.field-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  word-break: break-all;
  max-width: 60%;
  text-align: right;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 16px;
  }

  .modal-header,
  .modal-body {
    padding: 16px;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .detail-value {
    max-width: 100%;
    text-align: left;
  }
}
</style>