<template>
  <button
    class="app-btn"
    :class="[
      type === 'primary' ? 'btn-primary' : 'btn-outline',
      size === 'lg' ? 'btn-lg' : 'btn-md'
    ]"
    :disabled="disabled"
    @tap="$emit('click')"
  >
    <text class="btn-label">
      <slot />
    </text>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'outline'
  },
  size: {
    type: String,
    default: 'md'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.app-btn {
  position: relative;
  overflow: hidden;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
.app-btn::after {
  border: none;
}
.btn-primary {
  background-color: var(--theme-primary, #1C1917);
  border: 1rpx solid var(--theme-primary, #1C1917);
}
.btn-primary .btn-label {
  color: var(--theme-bg, #F2EFE9);
}
.btn-outline {
  background-color: transparent;
  border: 1rpx solid var(--theme-primary, #1C1917);
}
.btn-outline .btn-label {
  color: var(--theme-primary, #1C1917);
}
.btn-md {
  padding: 12px 40px;
}
.btn-lg {
  padding: 16px 48px;
}
.btn-label {
  font-size: 14px;
  letter-spacing: 1em;
  font-family: 'PingFang SC', sans-serif;
  position: relative;
  z-index: 1;
}
</style>
