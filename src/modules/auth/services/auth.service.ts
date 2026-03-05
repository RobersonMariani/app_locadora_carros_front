import http from '@/lib/http'

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/login', payload)
    return data
  },

  async me() {
    const { data } = await http.post('/v1/me')
    return data
  },

  async logout() {
    await http.post('/v1/logout')
  },

  async refresh(): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/refresh')
    return data
  },
}
