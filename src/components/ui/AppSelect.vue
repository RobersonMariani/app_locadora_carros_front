<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

interface Props {
  label?: string
  error?: string
  options: Option[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  label: undefined,
  error: undefined,
  placeholder: 'Selecione...',
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
    <select
      v-model="model"
      :required="required"
      :disabled="disabled"
      :class="[
        'w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200',
        error
          ? 'border-danger-400 bg-danger-50/50 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
          : 'border-surface-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        disabled ? 'cursor-not-allowed bg-surface-50 text-surface-400' : '',
      ]"
    >
      <option value="" disabled class="text-surface-400">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1.5 text-xs font-medium text-danger-600">{{ error }}</p>
  </div>
</template>
