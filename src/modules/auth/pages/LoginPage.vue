<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import AppButton from '@/components/ui/AppButton.vue'
import {
  TruckIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UsersIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const emailFocused = ref(false)
const passwordFocused = ref(false)

const features = [
  { icon: TruckIcon, title: 'Gestão de Frota', description: 'Controle completo de veículos e disponibilidade' },
  { icon: UsersIcon, title: 'Clientes', description: 'Cadastro e histórico de locações por cliente' },
  { icon: ChartBarIcon, title: 'Relatórios', description: 'Acompanhe métricas e desempenho da locadora' },
  { icon: ShieldCheckIcon, title: 'Segurança', description: 'Autenticação JWT com proteção de dados' },
]

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    await auth.login(email.value, password.value)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch {
    error.value = 'Credenciais inválidas. Verifique seu e-mail e senha.'
    ui.notify('error', 'Falha ao fazer login')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen">
    <div class="relative hidden w-[55%] overflow-hidden bg-surface-900 lg:flex lg:flex-col lg:justify-between">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900/80 to-surface-900" />

      <div class="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary-500/8 blur-3xl" />
      <div class="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-accent-500/8 blur-3xl" />
      <div class="absolute left-1/2 top-1/3 h-72 w-72 rounded-full bg-primary-400/5 blur-2xl" />

      <div
        class="absolute inset-0 opacity-[0.03]"
        style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)"
      />

      <div class="relative z-10 p-10 lg:p-12">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 shadow-xl shadow-primary-500/30">
            <span class="text-lg font-extrabold text-white">LC</span>
          </div>
          <div>
            <span class="text-xl font-bold text-white">Locadora</span>
            <span class="ml-1.5 text-xl font-light text-primary-300">Carros</span>
          </div>
        </div>
      </div>

      <div class="relative z-10 flex-1 flex flex-col justify-center px-10 lg:px-12">
        <h2 class="text-4xl font-bold leading-tight text-white lg:text-5xl">
          Gerencie sua<br />
          <span class="bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent">
            frota completa
          </span>
        </h2>
        <p class="mt-4 max-w-md text-lg leading-relaxed text-surface-400">
          Plataforma completa para controle de veículos, clientes e locações em tempo real.
        </p>

        <div class="mt-10 grid grid-cols-2 gap-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06]"
          >
            <component
              :is="feature.icon"
              class="h-6 w-6 text-primary-400 transition-transform duration-300 group-hover:scale-110"
            />
            <h4 class="mt-2.5 text-sm font-semibold text-white">{{ feature.title }}</h4>
            <p class="mt-1 text-xs leading-relaxed text-surface-500">{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <div class="relative z-10 p-10 lg:p-12">
        <p class="text-xs text-surface-600">
          &copy; {{ new Date().getFullYear() }} Locadora de Carros. Todos os direitos reservados.
        </p>
      </div>
    </div>

    <div class="flex flex-1 flex-col items-center justify-center bg-white px-6 lg:px-16">
      <div class="w-full max-w-sm">
        <div class="mb-2 flex items-center gap-3 lg:hidden">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 shadow-lg shadow-primary-500/25">
            <span class="text-sm font-extrabold text-white">LC</span>
          </div>
          <span class="text-lg font-bold text-surface-900">Locadora Carros</span>
        </div>

        <div class="mb-10">
          <h1 class="text-3xl font-bold tracking-tight text-surface-900">Entrar</h1>
          <p class="mt-2 text-surface-500">
            Acesse sua conta para gerenciar a locadora
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-surface-700">E-mail</label>
            <div
              :class="[
                'flex items-center gap-3 rounded-xl border px-4 transition-all duration-200',
                emailFocused
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : error
                    ? 'border-danger-300'
                    : 'border-surface-200 hover:border-surface-300',
              ]"
            >
              <EnvelopeIcon
                :class="[
                  'h-5 w-5 shrink-0 transition-colors',
                  emailFocused ? 'text-primary-500' : 'text-surface-400',
                ]"
              />
              <input
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                required
                class="w-full border-0 bg-transparent py-3 text-sm text-surface-900 placeholder:text-surface-400 focus:ring-0"
                @focus="emailFocused = true"
                @blur="emailFocused = false"
              />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-semibold text-surface-700">Senha</label>
            <div
              :class="[
                'flex items-center gap-3 rounded-xl border px-4 transition-all duration-200',
                passwordFocused
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : error
                    ? 'border-danger-300'
                    : 'border-surface-200 hover:border-surface-300',
              ]"
            >
              <LockClosedIcon
                :class="[
                  'h-5 w-5 shrink-0 transition-colors',
                  passwordFocused ? 'text-primary-500' : 'text-surface-400',
                ]"
              />
              <input
                v-model="password"
                type="password"
                placeholder="Digite sua senha"
                required
                class="w-full border-0 bg-transparent py-3 text-sm text-surface-900 placeholder:text-surface-400 focus:ring-0"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
              />
            </div>
          </div>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="-translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-1 opacity-0"
          >
            <div
              v-if="error"
              class="flex items-center gap-2.5 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3"
            >
              <ExclamationCircleIcon class="h-5 w-5 shrink-0 text-danger-500" />
              <p class="text-sm font-medium text-danger-700">{{ error }}</p>
            </div>
          </Transition>

          <AppButton type="submit" :loading="loading" class="w-full" size="lg">
            Acessar plataforma
          </AppButton>
        </form>

        <div class="mt-8 flex items-center gap-3">
          <div class="h-px flex-1 bg-surface-200" />
          <span class="text-xs font-medium text-surface-400">Sistema interno</span>
          <div class="h-px flex-1 bg-surface-200" />
        </div>

        <p class="mt-6 text-center text-xs text-surface-400">
          Acesso restrito a usuários autorizados.<br />
          Em caso de dúvidas, contate o administrador.
        </p>
      </div>
    </div>
  </div>
</template>
