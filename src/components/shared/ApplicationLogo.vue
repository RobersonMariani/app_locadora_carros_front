<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  theme?: 'light' | 'dark'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  theme: 'dark',
})

const iconSizes: Record<string, string> = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
}

const textSizes: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}
</script>

<template>
  <div class="flex items-center gap-2.5">
    <div
      :class="[
        'flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 shadow-lg shadow-primary-500/25',
        iconSizes[size],
      ]"
    >
      <span class="font-extrabold tracking-tight text-white">LC</span>
    </div>
    <div class="flex flex-col leading-none">
      <span
        :class="[
          'font-bold tracking-tight',
          textSizes[size],
          theme === 'dark' ? 'text-white' : 'text-surface-900',
        ]"
      >
        Locadora
      </span>
      <span
        :class="[
          'text-[10px] font-medium uppercase tracking-widest',
          theme === 'dark' ? 'text-surface-400' : 'text-surface-400',
        ]"
      >
        Carros
      </span>
    </div>
  </div>
</template>
