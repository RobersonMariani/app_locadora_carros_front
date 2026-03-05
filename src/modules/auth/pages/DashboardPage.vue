<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import {
  UsersIcon,
  TagIcon,
  CubeIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()

const cards = [
  {
    name: 'Clientes',
    description: 'Gerenciar cadastro de clientes',
    route: 'clientes',
    icon: UsersIcon,
    gradient: 'from-primary-600 to-primary-400',
    shadow: 'shadow-primary-600/20',
    bg: 'bg-primary-50',
    iconColor: 'text-primary-600',
  },
  {
    name: 'Marcas',
    description: 'Cadastro de marcas de veículos',
    route: 'marcas',
    icon: TagIcon,
    gradient: 'from-success-600 to-success-400',
    shadow: 'shadow-success-600/20',
    bg: 'bg-success-50',
    iconColor: 'text-success-600',
  },
  {
    name: 'Modelos',
    description: 'Modelos disponíveis por marca',
    route: 'modelos',
    icon: CubeIcon,
    gradient: 'from-accent-600 to-accent-400',
    shadow: 'shadow-accent-600/20',
    bg: 'bg-primary-50',
    iconColor: 'text-accent-600',
  },
  {
    name: 'Carros',
    description: 'Frota de veículos disponíveis',
    route: 'carros',
    icon: TruckIcon,
    gradient: 'from-warning-600 to-warning-400',
    shadow: 'shadow-warning-600/20',
    bg: 'bg-warning-50',
    iconColor: 'text-warning-600',
  },
  {
    name: 'Locações',
    description: 'Contratos de locação ativos',
    route: 'locacoes',
    icon: ClipboardDocumentListIcon,
    gradient: 'from-danger-600 to-danger-400',
    shadow: 'shadow-danger-600/20',
    bg: 'bg-danger-50',
    iconColor: 'text-danger-600',
  },
]
</script>

<template>
  <div>
    <div class="mb-8 flex items-end justify-between">
      <div>
        <h1 class="text-3xl font-bold text-surface-900">Dashboard</h1>
        <p class="mt-1 text-surface-500">
          Bem-vindo de volta, <span class="font-medium text-surface-700">{{ auth.user?.name ?? 'Usuário' }}</span>
        </p>
      </div>
      <div class="hidden items-center gap-2 rounded-xl bg-success-50 px-3 py-1.5 text-sm font-medium text-success-700 sm:flex">
        <ArrowTrendingUpIcon class="h-4 w-4" />
        Sistema operacional
      </div>
    </div>

    <div class="mb-8 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 p-6 text-white shadow-xl shadow-primary-600/20 lg:p-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold opacity-90">Painel de Controle</h2>
          <p class="mt-1 text-2xl font-bold lg:text-3xl">Locadora de Carros</p>
          <p class="mt-2 text-sm opacity-75">
            Gerencie sua frota, clientes e locações em um só lugar.
          </p>
        </div>
        <div class="hidden h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm lg:flex">
          <TruckIcon class="h-10 w-10 text-white/80" />
        </div>
      </div>
    </div>

    <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-surface-400">
      Acesso rápido
    </h3>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="card in cards"
        :key="card.route"
        :to="{ name: card.route }"
        class="group relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-surface-200/50"
      >
        <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-[0.07] transition-transform duration-300 group-hover:scale-150"
          :class="card.gradient"
        />

        <div class="relative flex items-start gap-4">
          <div
            :class="[
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
              card.bg,
            ]"
          >
            <component :is="card.icon" :class="['h-6 w-6', card.iconColor]" />
          </div>
          <div>
            <h3 class="font-bold text-surface-900 group-hover:text-primary-700 transition-colors">
              {{ card.name }}
            </h3>
            <p class="mt-0.5 text-sm text-surface-500">{{ card.description }}</p>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
