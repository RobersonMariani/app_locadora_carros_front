<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserGroupIcon } from '@heroicons/vue/24/outline'
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
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Clientes</h1>
        <p class="mt-1 text-sm text-surface-500">Gerencie seus clientes cadastrados</p>
      </div>
      <AppButton @click="router.push({ name: 'clientes.create' })"> Novo Cliente </AppButton>
    </div>

    <div class="rounded-2xl border border-surface-200 bg-white shadow-sm">
      <div v-if="clientesStore.loading" class="flex justify-center p-8">
        <svg
          class="h-8 w-8 animate-spin text-primary-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      <div v-else-if="clientesStore.clientes.length === 0" class="p-8 text-center">
        <UserGroupIcon class="mx-auto h-12 w-12 text-surface-400" />
        <p class="mt-2 text-surface-500">Nenhum cliente cadastrado.</p>
      </div>

      <div v-else class="min-w-full overflow-x-auto">
        <table class="min-w-full divide-y divide-surface-200">
          <thead class="bg-surface-50/80">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Nome
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Criado em
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
              v-for="cliente in clientesStore.clientes"
              :key="cliente.id"
              class="transition-colors hover:bg-surface-50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                {{ cliente.nome }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-500">
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
        class="flex items-center justify-between border-t border-surface-200 px-6 py-3"
      >
        <p class="text-sm text-surface-500">
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
      <p v-if="clienteToDelete" class="text-surface-600">
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
