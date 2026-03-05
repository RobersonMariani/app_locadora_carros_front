<script setup lang="ts">
import NotificationToast from '@/components/ui/NotificationToast.vue'
</script>

<template>
  <div class="min-h-screen">
    <NotificationToast />
    <slot />
  </div>
</template>
