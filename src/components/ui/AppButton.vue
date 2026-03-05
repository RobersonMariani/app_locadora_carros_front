<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
})

const variantClasses: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-600/25 hover:shadow-lg hover:shadow-primary-600/30 hover:from-primary-700 hover:to-primary-600 active:shadow-sm',
  secondary:
    'bg-white text-surface-700 border border-surface-200 shadow-sm hover:bg-surface-50 hover:border-surface-300 active:bg-surface-100',
  danger:
    'bg-gradient-to-r from-danger-600 to-danger-500 text-white shadow-md shadow-danger-600/25 hover:shadow-lg hover:shadow-danger-600/30 hover:from-danger-700 hover:to-danger-600 active:shadow-sm',
  ghost:
    'bg-transparent text-surface-600 hover:bg-surface-100 hover:text-surface-900 active:bg-surface-200',
  success:
    'bg-gradient-to-r from-success-600 to-success-500 text-white shadow-md shadow-success-600/25 hover:shadow-lg hover:shadow-success-600/30 hover:from-success-700 hover:to-success-600 active:shadow-sm',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
      variantClasses[variant],
      sizeClasses[size],
    ]"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot />
  </button>
</template>
