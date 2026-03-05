<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import {
  UsersIcon,
  TagIcon,
  CubeIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()

const cards = [
  { name: 'Clientes', route: 'clientes', icon: UsersIcon, color: 'bg-primary-500' },
  { name: 'Marcas', route: 'marcas', icon: TagIcon, color: 'bg-success-500' },
  { name: 'Modelos', route: 'modelos', icon: CubeIcon, color: 'bg-warning-500' },
  { name: 'Carros', route: 'carros', icon: TruckIcon, color: 'bg-danger-500' },
  { name: 'Locações', route: 'locacoes', icon: ClipboardDocumentListIcon, color: 'bg-primary-700' },
]
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-sm text-gray-500">Bem-vindo, {{ auth.user?.name ?? 'Usuário' }}</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="card in cards"
        :key="card.route"
        :to="{ name: card.route }"
        class="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      >
        <div
          :class="['flex h-12 w-12 items-center justify-center rounded-lg text-white', card.color]"
        >
          <component :is="card.icon" class="h-6 w-6" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">{{ card.name }}</h3>
          <p class="text-sm text-gray-500">Gerenciar</p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
