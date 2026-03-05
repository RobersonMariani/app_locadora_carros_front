<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClasses: Record<string, string> = {
  sm: 'h-6 w-6 text-sm',
  md: 'h-8 w-8 text-base',
  lg: 'h-10 w-10 text-lg',
}
</script>

<template>
  <div :class="['flex items-center gap-2', sizeClasses[size]]">
    <div
      class="flex items-center justify-center rounded-lg bg-primary-600"
      :class="sizeClasses[size]"
    >
      <span class="font-bold text-white">LC</span>
    </div>
    <span class="font-semibold text-gray-800">Locadora</span>
  </div>
</template>
