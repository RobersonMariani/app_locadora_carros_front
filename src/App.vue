<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'

const route = useRoute()

const layout = computed(() => {
  return route.meta.layout === 'guest' ? GuestLayout : AuthenticatedLayout
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
