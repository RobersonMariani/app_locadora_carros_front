<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import ApplicationLogo from '@/components/shared/ApplicationLogo.vue'
import NotificationToast from '@/components/ui/NotificationToast.vue'
import {
  Bars3Icon,
  ArrowRightStartOnRectangleIcon,
  HomeIcon,
  UsersIcon,
  TagIcon,
  CubeIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  ChevronLeftIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const userMenuOpen = ref(false)

const navigation = [
  { name: 'Dashboard', route: 'dashboard', icon: HomeIcon },
  { name: 'Clientes', route: 'clientes', icon: UsersIcon },
  { name: 'Marcas', route: 'marcas', icon: TagIcon },
  { name: 'Modelos', route: 'modelos', icon: CubeIcon },
  { name: 'Carros', route: 'carros', icon: TruckIcon },
  { name: 'Locações', route: 'locacoes', icon: ClipboardDocumentListIcon },
]

onMounted(async () => {
  if (auth.isAuthenticated && !auth.user) {
    try {
      await auth.fetchUser()
    } catch {
      await auth.logout()
    }
  }
})

function isActive(routeName: string): boolean {
  return router.currentRoute.value.name === routeName
}

function getInitials(name: string | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div class="flex h-screen bg-surface-100">
    <NotificationToast />

    <aside
      :class="[
        'relative flex flex-col bg-surface-900 transition-all duration-300 ease-in-out',
        ui.sidebarOpen ? 'w-64' : 'w-[72px]',
      ]"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-primary-950/50 to-transparent pointer-events-none" />

      <div
        :class="[
          'relative flex h-16 items-center border-b border-white/10 px-4',
          ui.sidebarOpen ? 'justify-between' : 'justify-center',
        ]"
      >
        <ApplicationLogo v-if="ui.sidebarOpen" size="md" theme="dark" />
        <ApplicationLogo v-else size="sm" theme="dark" />
        <button
          v-if="ui.sidebarOpen"
          class="rounded-lg p-1 text-surface-400 transition-colors hover:bg-white/10 hover:text-white"
          @click="ui.toggleSidebar"
        >
          <ChevronLeftIcon class="h-4 w-4" />
        </button>
      </div>

      <nav class="relative flex-1 space-y-1 p-3">
        <p v-if="ui.sidebarOpen" class="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-surface-500">
          Menu
        </p>
        <RouterLink
          v-for="item in navigation"
          :key="item.route"
          :to="{ name: item.route }"
          :class="[
            'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
            isActive(item.route)
              ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-600/30'
              : 'text-surface-400 hover:bg-white/5 hover:text-white',
            !ui.sidebarOpen && 'justify-center',
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              'h-5 w-5 shrink-0 transition-transform duration-200',
              !isActive(item.route) && 'group-hover:scale-110',
            ]"
          />
          <span v-if="ui.sidebarOpen">{{ item.name }}</span>
        </RouterLink>
      </nav>

      <div class="relative border-t border-white/10 p-3" v-if="ui.sidebarOpen">
        <div class="flex items-center gap-3 rounded-xl px-3 py-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-500 text-xs font-bold text-white">
            {{ getInitials(auth.user?.name) }}
          </div>
          <div class="flex-1 truncate">
            <p class="truncate text-sm font-medium text-white">{{ auth.user?.name }}</p>
            <p class="truncate text-xs text-surface-500">{{ auth.user?.email }}</p>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex flex-1 flex-col overflow-hidden">
      <header class="flex h-16 items-center justify-between border-b border-surface-200 bg-white px-6 shadow-sm shadow-surface-200/50">
        <div class="flex items-center gap-4">
          <button
            v-if="!ui.sidebarOpen"
            class="rounded-xl p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-700"
            @click="ui.toggleSidebar"
          >
            <Bars3Icon class="h-5 w-5" />
          </button>
        </div>

        <div class="relative flex items-center gap-3">
          <button
            class="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-surface-50"
            @click="userMenuOpen = !userMenuOpen"
          >
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-500 text-xs font-bold text-white">
              {{ getInitials(auth.user?.name) }}
            </div>
            <span class="text-sm font-medium text-surface-700">{{ auth.user?.name }}</span>
          </button>

          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-95 opacity-0"
          >
            <div
              v-if="userMenuOpen"
              class="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-surface-200 bg-white py-1 shadow-xl shadow-surface-200/50"
              @click="userMenuOpen = false"
            >
              <button
                class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-surface-600 transition-colors hover:bg-surface-50 hover:text-danger-600"
                @click="auth.logout()"
              >
                <ArrowRightStartOnRectangleIcon class="h-4 w-4" />
                Sair
              </button>
            </div>
          </Transition>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <div
      v-if="userMenuOpen"
      class="fixed inset-0 z-40"
      @click="userMenuOpen = false"
    />
  </div>
</template>
