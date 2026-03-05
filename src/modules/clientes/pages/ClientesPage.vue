<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { usePagination } from '@/composables/usePagination'
import { formatDateTime } from '@/lib/date'
import { useClientesStore } from '@/stores/clientes.store'
import { useUiStore } from '@/stores/ui.store'

const router = useRouter()
const clientesStore = useClientesStore()
const uiStore = useUiStore()
const { meta, hasPages, hasPrevious, hasNext, setMeta, goToPage } = usePagination()

const deleteModalOpen = ref(false)
const clienteToDelete = ref<{ id: number; nome: string } | null>(null)

async function loadClientes(page = 1) {
  await clientesStore.fetchClientes(page)
  setMeta(clientesStore.meta)
}

function openDeleteModal(cliente: { id: number; nome: string }) {
  clienteToDelete.value = cliente
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  clienteToDelete.value = null
}

async function confirmDelete() {
  if (!clienteToDelete.value) return
  try {
    await clientesStore.deleteCliente(clienteToDelete.value.id)
    uiStore.notify('success', 'Cliente excluído com sucesso.')
    closeDeleteModal()
    await loadClientes(meta.value.current_page)
  } catch {
    uiStore.notify('error', 'Erro ao excluir cliente.')
  }
}

function goPrev() {
  const page = goToPage(meta.value.current_page - 1)
  loadClientes(page)
}

function goNext() {
  const page = goToPage(meta.value.current_page + 1)
  loadClientes(page)
}

onMounted(() => loadClientes(1))
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
      <AppButton @click="router.push({ name: 'clientes.create' })"> Novo Cliente </AppButton>
    </div>

    <div class="rounded-xl bg-white shadow-sm">
      <div v-if="clientesStore.loading" class="p-8 text-center text-gray-500">Carregando...</div>

      <div v-else-if="clientesStore.clientes.length === 0" class="p-8 text-center text-gray-500">
        Nenhum cliente cadastrado.
      </div>

      <div v-else class="min-w-full divide-y divide-gray-200 overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Nome
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Criado em
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="cliente in clientesStore.clientes" :key="cliente.id">
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ cliente.nome }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {{ formatDateTime(cliente.created_at) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                <AppButton
                  variant="ghost"
                  size="sm"
                  @click="router.push({ name: 'clientes.edit', params: { id: cliente.id } })"
                >
                  Editar
                </AppButton>
                <AppButton
                  variant="danger"
                  size="sm"
                  class="ml-2"
                  @click="openDeleteModal({ id: cliente.id, nome: cliente.nome })"
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
      title="Excluir cliente"
      max-width="sm"
      @close="closeDeleteModal"
    >
      <p v-if="clienteToDelete" class="text-gray-600">
        Tem certeza que deseja excluir o cliente <strong>{{ clienteToDelete.nome }}</strong
        >?
      </p>
      <div class="mt-6 flex justify-end gap-2">
        <AppButton variant="secondary" @click="closeDeleteModal">Cancelar</AppButton>
        <AppButton variant="danger" @click="confirmDelete">Excluir</AppButton>
      </div>
    </AppModal>
  </div>
</template>
