import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

const publicRoutes = ['login']

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const token = localStorage.getItem('auth_token')
  const isPublic = publicRoutes.includes(to.name as string)

  if (!token && !isPublic) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  if (token && to.name === 'login') {
    return next({ name: 'dashboard' })
  }

  return next()
}
