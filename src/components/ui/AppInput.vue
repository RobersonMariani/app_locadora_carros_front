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
    <label v-if="label" class="mb-1 block text-sm font-medium text-gray-700">
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
        'w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200',
        error
          ? 'border-danger-500 focus:border-danger-500 focus:ring-1 focus:ring-danger-500'
          : 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
        disabled ? 'cursor-not-allowed bg-gray-50' : 'bg-white',
      ]"
    />
    <p v-if="error" class="mt-1 text-sm text-danger-600">{{ error }}</p>
  </div>
</template>
