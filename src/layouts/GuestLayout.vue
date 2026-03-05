<script setup lang="ts">
import NotificationToast from '@/components/ui/NotificationToast.vue'
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-900">
    <NotificationToast />

    <div class="absolute inset-0 bg-gradient-to-br from-primary-950 via-surface-900 to-surface-900" />
    <div class="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl" />
    <div class="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-accent-600/10 blur-3xl" />

    <div class="absolute inset-0" style="background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 24px 24px;" />

    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>
