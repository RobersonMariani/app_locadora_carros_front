<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { usePagination } from '@/composables/usePagination'
import { formatDate } from '@/lib/date'
import { useLocacoesStore } from '@/stores/locacoes.store'
import { useUiStore } from '@/stores/ui.store'
import type { Locacao } from '../types/locacao.types'

const router = useRouter()
const locacoesStore = useLocacoesStore()
const uiStore = useUiStore()
const { meta, hasPages, hasPrevious, hasNext, setMeta, goToPage } = usePagination()

const deleteModalOpen = ref(false)
const locacaoToDelete = ref<Locacao | null>(null)

async function loadLocacoes(page = 1) {
  await locacoesStore.fetchLocacoes(page)
  setMeta(locacoesStore.meta)
}

function openDeleteModal(locacao: Locacao) {
  locacaoToDelete.value = locacao
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  locacaoToDelete.value = null
}

async function confirmDelete() {
  if (!locacaoToDelete.value) return
  try {
    await locacoesStore.deleteLocacao(locacaoToDelete.value.id)
    uiStore.notify('success', 'Locação excluída com sucesso.')
    closeDeleteModal()
    await loadLocacoes(meta.value.current_page)
  } catch {
    uiStore.notify('error', 'Erro ao excluir locação.')
  }
}

function goPrev() {
  const page = goToPage(meta.value.current_page - 1)
  loadLocacoes(page)
}

function goNext() {
  const page = goToPage(meta.value.current_page + 1)
  loadLocacoes(page)
}

function formatCurrency(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

onMounted(() => loadLocacoes(1))
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Locações</h1>
      <AppButton @click="router.push({ name: 'locacoes.create' })"> Nova Locação </AppButton>
    </div>

    <div class="rounded-xl bg-white shadow-sm">
      <div v-if="locacoesStore.loading" class="p-8 text-center text-gray-500">Carregando...</div>

      <div v-else-if="locacoesStore.locacoes.length === 0" class="p-8 text-center text-gray-500">
        Nenhuma locação cadastrada.
      </div>

      <div v-else class="min-w-full divide-y divide-gray-200 overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Cliente
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Carro
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Data Início
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Data Prevista
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Data Realizada
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Valor Diária
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                KM Inicial
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                KM Final
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="locacao in locacoesStore.locacoes" :key="locacao.id">
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ locacao.cliente?.nome ?? '-' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ locacao.carro?.placa ?? '-' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {{ formatDate(locacao.data_inicio_periodo) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {{ formatDate(locacao.data_final_previsto_periodo) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {{ formatDate(locacao.data_final_realizado_periodo) ?? '-' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ formatCurrency(locacao.valor_diaria) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {{ locacao.km_inicial }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {{ locacao.km_final ?? '-' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                <AppButton
                  variant="ghost"
                  size="sm"
                  @click="router.push({ name: 'locacoes.edit', params: { id: locacao.id } })"
                >
                  Editar
                </AppButton>
                <AppButton
                  variant="danger"
                  size="sm"
                  class="ml-2"
                  @click="openDeleteModal(locacao)"
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
        class="flex items-center justify-between border-t border-gray-200 px-6 py-3"
      >
        <p class="text-sm text-gray-600">
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
      title="Excluir locação"
      max-width="sm"
      @close="closeDeleteModal"
    >
      <p v-if="locacaoToDelete" class="text-gray-600">
        Tem certeza que deseja excluir esta locação?
        <span v-if="locacaoToDelete.cliente || locacaoToDelete.carro">
          (Cliente: {{ locacaoToDelete.cliente?.nome ?? '-' }}, Carro:
          {{ locacaoToDelete.carro?.placa ?? '-' }})
        </span>
      </p>
      <div class="mt-6 flex justify-end gap-2">
        <AppButton variant="secondary" @click="closeDeleteModal">Cancelar</AppButton>
        <AppButton variant="danger" @click="confirmDelete">Excluir</AppButton>
      </div>
    </AppModal>
  </div>
</template>
