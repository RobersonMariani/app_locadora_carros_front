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
  <div class="w-full max-w-md">
    <div class="rounded-xl bg-white px-8 py-10 shadow-lg">
      <div class="mb-8 flex justify-center">
        <ApplicationLogo size="lg" />
      </div>

      <h1 class="mb-2 text-center text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
      <p class="mb-8 text-center text-sm text-gray-500">Faça login para acessar o sistema</p>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <AppInput
          v-model="email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          required
        />

        <AppInput
          v-model="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          required
        />

        <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>

        <AppButton type="submit" :loading="loading" class="w-full"> Entrar </AppButton>
      </form>
    </div>
  </div>
</template>
