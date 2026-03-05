<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { usePagination } from '@/composables/usePagination'
import { useCarrosStore } from '@/stores/carros.store'
import { useUiStore } from '@/stores/ui.store'
import type { Carro } from '@/modules/carros/types/carro.types'

const router = useRouter()
const carrosStore = useCarrosStore()
const uiStore = useUiStore()
const { meta, hasPages, hasPrevious, hasNext, setMeta, goToPage } = usePagination()

const deleteModalOpen = ref(false)
const carroToDelete = ref<{ id: number; placa: string } | null>(null)

async function loadCarros(page = 1) {
  await carrosStore.fetchCarros(page)
  setMeta(carrosStore.pagination)
}

function openDeleteModal(carro: { id: number; placa: string }) {
  carroToDelete.value = carro
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  carroToDelete.value = null
}

async function confirmDelete() {
  if (!carroToDelete.value) return
  try {
    await carrosStore.deleteCarro(carroToDelete.value.id)
    uiStore.notify('success', 'Carro excluído com sucesso.')
    closeDeleteModal()
    await loadCarros(meta.value.current_page)
  } catch {
    uiStore.notify('error', 'Erro ao excluir carro.')
  }
}

function goPrev() {
  const page = goToPage(meta.value.current_page - 1)
  loadCarros(page)
}

function goNext() {
  const page = goToPage(meta.value.current_page + 1)
  loadCarros(page)
}

function modeloNome(carro: Carro): string {
  return carro.modelo?.nome ?? '-'
}

onMounted(() => loadCarros(1))
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Carros</h1>
        <p class="mt-1 text-sm text-surface-500">Frota de veículos da locadora</p>
      </div>
      <AppButton @click="router.push({ name: 'carros.create' })"> Novo Carro </AppButton>
    </div>

    <div class="rounded-2xl border border-surface-200 bg-white shadow-sm">
      <div v-if="carrosStore.loading" class="p-8 text-center text-surface-500">Carregando...</div>

      <div v-else-if="carrosStore.carros.length === 0" class="p-8 text-center text-surface-500">
        Nenhum carro cadastrado.
      </div>

      <div v-else class="min-w-full divide-y divide-surface-200 overflow-x-auto">
        <table class="min-w-full divide-y divide-surface-200">
          <thead class="bg-surface-50/80">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Placa
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Modelo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                KM
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Disponível
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 bg-white">
            <tr
              v-for="carro in carrosStore.carros"
              :key="carro.id"
              class="transition-colors hover:bg-surface-50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-surface-900">
                {{ carro.placa }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                {{ modeloNome(carro) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                {{ carro.km.toLocaleString('pt-BR') }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  :class="[
                    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                    carro.disponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ carro.disponivel ? 'Disponível' : 'Indisponível' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                <AppButton
                  variant="ghost"
                  size="sm"
                  @click="router.push({ name: 'carros.edit', params: { id: carro.id } })"
                >
                  Editar
                </AppButton>
                <AppButton
                  variant="danger"
                  size="sm"
                  class="ml-2"
                  @click="openDeleteModal({ id: carro.id, placa: carro.placa })"
                >
                  Excluir
                </AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="hasPages"
        class="flex items-center justify-between border-t border-surface-200 px-6 py-3"
      >
        <p class="text-sm text-surface-600">
          Página {{ meta.current_page }} de {{ meta.last_page }} ({{ meta.total }} registros)
        </p>
        <div class="flex gap-2">
          <AppButton variant="secondary" size="sm" :disabled="!hasPrevious" @click="goPrev">
            Anterior
          </AppButton>
          <AppButton variant="secondary" size="sm" :disabled="!hasNext" @click="goNext">
            Próxima
          </AppButton>
        </div>
      </div>
    </div>

    <AppModal
      :open="deleteModalOpen"
      title="Excluir carro"
      max-width="sm"
      @close="closeDeleteModal"
    >
      <p v-if="carroToDelete" class="text-surface-600">
        Tem certeza que deseja excluir o carro de placa <strong>{{ carroToDelete.placa }}</strong
        >?
      </p>
      <div class="mt-6 flex justify-end gap-2">
        <AppButton variant="secondary" @click="closeDeleteModal">Cancelar</AppButton>
        <AppButton variant="danger" @click="confirmDelete">Excluir</AppButton>
      </div>
    </AppModal>
  </div>
</template>
