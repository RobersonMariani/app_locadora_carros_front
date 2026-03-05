import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import http from '@/lib/http'
import router from '@/router'

interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const { data } = await http.post('/login', { email, password })

    token.value = data.access_token
    localStorage.setItem('auth_token', data.access_token)

    await fetchUser()
  }

  async function fetchUser() {
    const { data } = await http.post('/v1/me')
    user.value = data
  }

  async function logout() {
    try {
      await http.post('/v1/logout')
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      router.push({ name: 'login' })
    }
  }

  async function refresh() {
    const { data } = await http.post('/refresh')
    token.value = data.access_token
    localStorage.setItem('auth_token', data.access_token)
  }

  return { token, user, isAuthenticated, login, fetchUser, logout, refresh }
})
