import { ref, computed } from 'vue'
import type { PaginationMeta } from '@/types/api.types'

export function usePagination() {
  const meta = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })

  const hasPages = computed(() => meta.value.last_page > 1)
  const hasPrevious = computed(() => meta.value.current_page > 1)
  const hasNext = computed(() => meta.value.current_page < meta.value.last_page)

  function setMeta(newMeta: PaginationMeta) {
    meta.value = newMeta
  }

  function goToPage(page: number): number {
    if (page >= 1 && page <= meta.value.last_page) {
      meta.value.current_page = page
    }
    return meta.value.current_page
  }

  return { meta, hasPages, hasPrevious, hasNext, setMeta, goToPage }
}
