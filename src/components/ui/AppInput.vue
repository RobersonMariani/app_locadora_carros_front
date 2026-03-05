<script setup lang="ts">
interface Props {
  label?: string
  error?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  label: undefined,
  error: undefined,
  type: 'text',
  placeholder: undefined,
  required: false,
  disabled: false,
})

const model = defineModel<string | number>()
</script>

<template>
  <div>
    <label v-if="label" class="mb-1.5 block text-sm font-medium text-surface-700">
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>
    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="[
        'w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 placeholder:text-surface-400',
        error
          ? 'border-danger-400 bg-danger-50/50 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
          : 'border-surface-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        disabled ? 'cursor-not-allowed bg-surface-50 text-surface-400' : '',
      ]"
    />
    <p v-if="error" class="mt-1.5 text-xs font-medium text-danger-600">{{ error }}</p>
  </div>
</template>
