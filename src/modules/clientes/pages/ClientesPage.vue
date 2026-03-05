<script setup lang="ts">
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
      <RouterLink :to="{ name: 'clientes.create' }" class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
        Novo
      </RouterLink>
    </div>
    <div class="rounded-xl bg-white p-6 shadow-sm">
      <p class="text-gray-500">Carregando...</p>
    </div>
  </div>
</template>
