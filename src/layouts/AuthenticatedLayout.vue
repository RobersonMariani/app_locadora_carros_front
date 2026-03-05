<script setup lang="ts">
import { onMounted } from 'vue'
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
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()

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
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <NotificationToast />

    <aside
      :class="[
        'flex flex-col border-r border-gray-200 bg-white transition-all duration-300',
        ui.sidebarOpen ? 'w-64' : 'w-16',
      ]"
    >
      <div class="flex h-16 items-center justify-center border-b border-gray-200 px-4">
        <ApplicationLogo v-if="ui.sidebarOpen" size="md" />
        <ApplicationLogo v-else size="sm" />
      </div>

      <nav class="flex-1 space-y-1 p-3">
        <RouterLink
          v-for="item in navigation"
          :key="item.route"
          :to="{ name: item.route }"
          :class="[
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
            isActive(item.route)
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          ]"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0" />
          <span v-if="ui.sidebarOpen">{{ item.name }}</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="flex flex-1 flex-col overflow-hidden">
      <header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        <button class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" @click="ui.toggleSidebar">
          <Bars3Icon class="h-5 w-5" />
        </button>

        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ auth.user?.name }}</span>
          <button
            class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-danger-600"
            @click="auth.logout()"
          >
            <ArrowRightStartOnRectangleIcon class="h-5 w-5" />
          </button>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
