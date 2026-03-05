<script setup lang="ts">
import { useUiStore } from '@/stores/ui.store'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const ui = useUiStore()

const icons = {
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
}

const styles = {
  success: 'bg-success-50 border-success-400 text-success-700',
  warning: 'bg-warning-50 border-warning-400 text-warning-600',
  error: 'bg-danger-50 border-danger-400 text-danger-700',
  info: 'bg-primary-50 border-primary-400 text-primary-700',
}

const iconStyles = {
  success: 'text-success-500',
  warning: 'text-warning-500',
  error: 'text-danger-500',
  info: 'text-primary-500',
}
</script>

<template>
  <div class="fixed right-4 top-4 z-[100] flex flex-col gap-3">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-8 opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-8 opacity-0"
    >
      <div
        v-for="notification in ui.notifications"
        :key="notification.id"
        :class="[
          'flex min-w-[340px] items-center gap-3 rounded-xl border px-4 py-3.5 shadow-lg shadow-surface-200/50',
          styles[notification.type],
        ]"
      >
        <component
          :is="icons[notification.type]"
          :class="['h-5 w-5 shrink-0', iconStyles[notification.type]]"
        />
        <p class="flex-1 text-sm font-medium">{{ notification.message }}</p>
        <button
          class="shrink-0 rounded-lg p-0.5 opacity-50 transition-opacity hover:opacity-100"
          @click="ui.removeNotification(notification.id)"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
