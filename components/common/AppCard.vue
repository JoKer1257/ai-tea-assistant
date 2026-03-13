<template>
  <div 
    class="app-card relative p-2 bg-white shadow-xl transition-all duration-800 hover:-translate-y-1 hover:shadow-2xl"
    :class="[noFrame ? '' : 'border-darkGreen/10']"
  >
    <!-- Outer thin border frame if not disabled -->
    <div v-if="!noFrame" class="absolute -inset-2 border border-[var(--theme-primary)]/10 pointer-events-none"></div>
    
    <!-- Content area -->
    <div class="card-inner overflow-hidden relative">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  noFrame: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.app-card {
  @apply bg-white;
}
.card-inner {
  @apply h-full w-full;
}
</style>
