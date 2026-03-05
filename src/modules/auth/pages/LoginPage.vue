<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import ApplicationLogo from '@/components/shared/ApplicationLogo.vue'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

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
  <div class="w-full max-w-md px-4">
    <div class="mb-10 flex justify-center">
      <ApplicationLogo size="lg" theme="dark" />
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <h1 class="mb-2 text-center text-2xl font-bold text-white">Bem-vindo de volta</h1>
      <p class="mb-8 text-center text-sm text-surface-400">
        Faça login para acessar o sistema
      </p>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-surface-300">E-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
            class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-surface-500 transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-surface-300">Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="Digite sua senha"
            required
            class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-surface-500 transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20"
          />
        </div>

        <div v-if="error" class="rounded-xl border border-danger-500/20 bg-danger-500/10 px-4 py-3">
          <p class="text-sm text-danger-400">{{ error }}</p>
        </div>

        <AppButton type="submit" :loading="loading" class="w-full" size="lg"> Entrar </AppButton>
      </form>
    </div>

    <p class="mt-8 text-center text-xs text-surface-600">
      Locadora de Carros &copy; {{ new Date().getFullYear() }}
    </p>
  </div>
</template>
