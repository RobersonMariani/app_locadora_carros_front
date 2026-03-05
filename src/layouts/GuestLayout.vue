<script setup lang="ts">
import NotificationToast from '@/components/ui/NotificationToast.vue'
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <NotificationToast />
    <slot />
  </div>
</template>
