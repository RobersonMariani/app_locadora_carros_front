import { ref } from 'vue'
import { defineStore } from 'pinia'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: number
  type: NotificationType
  message: string
}

let notificationId = 0

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const notifications = ref<Notification[]>([])

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function notify(type: NotificationType, message: string, duration = 4000) {
    const id = ++notificationId
    notifications.value.push({ id, type, message })

    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  function removeNotification(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return { sidebarOpen, notifications, toggleSidebar, notify, removeNotification }
})
