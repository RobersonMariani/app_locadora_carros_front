<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { PhotoIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useMarcasStore } from '@/stores/marcas.store'
import { useUiStore } from '@/stores/ui.store'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'

const marcasStore = useMarcasStore()
const uiStore = useUiStore()

const deleteModalOpen = ref(false)
const marcaToDelete = ref<{ id: number; nome: string } | null>(null)
const deleting = ref(false)

onMounted(() => {
  marcasStore.fetchMarcas(marcasStore.pagination.current_page)
})

function openDeleteModal(marca: { id: number; nome: string }) {
  marcaToDelete.value = marca
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  marcaToDelete.value = null
}

async function confirmDelete() {
  if (!marcaToDelete.value) return
  deleting.value = true
  try {
    await marcasStore.deleteMarca(marcaToDelete.value.id)
    uiStore.notify('success', 'Marca excluída com sucesso.')
    closeDeleteModal()
  } catch {
    uiStore.notify('error', 'Não foi possível excluir a marca.')
  } finally {
    deleting.value = false
  }
}

function goToPage(page: number) {
  marcasStore.fetchMarcas(page)
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Marcas</h1>
      <RouterLink :to="{ name: 'marcas.create' }">
        <AppButton>Nova Marca</AppButton>
      </RouterLink>
    </div>

    <div class="rounded-xl bg-white p-6 shadow-sm">
      <div v-if="marcasStore.loading" class="flex justify-center py-12">
        <svg
          class="h-8 w-8 animate-spin text-primary-600"
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

      <div v-else-if="marcasStore.marcas.length === 0" class="py-12 text-center">
        <PhotoIcon class="mx-auto h-12 w-12 text-gray-400" />
        <p class="mt-2 text-gray-500">Nenhuma marca cadastrada.</p>
        <RouterLink :to="{ name: 'marcas.create' }" class="mt-4 inline-block">
          <AppButton>Cadastrar primeira marca</AppButton>
        </RouterLink>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Imagem
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Nome
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="marca in marcasStore.marcas" :key="marca.id">
              <td class="whitespace-nowrap px-6 py-4">
                <div
                  class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100 object-contain"
                >
                  <img
                    v-if="marca.imagem_url"
                    :src="marca.imagem_url"
                    :alt="marca.nome"
                    class="h-10 w-10 rounded-lg object-cover"
                  />
                  <PhotoIcon v-else class="h-6 w-6 text-gray-400" />
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {{ marca.nome }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <RouterLink :to="{ name: 'marcas.edit', params: { id: marca.id } }">
                    <AppButton variant="secondary" size="sm">
                      <PencilIcon class="h-4 w-4" />
                      Editar
                    </AppButton>
                  </RouterLink>
                  <AppButton variant="danger" size="sm" @click="openDeleteModal(marca)">
                    <TrashIcon class="h-4 w-4" />
                    Excluir
                  </AppButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="marcasStore.hasPages"
          class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4"
        >
          <p class="text-sm text-gray-600">
            Mostrando página {{ marcasStore.pagination.current_page }} de
            {{ marcasStore.pagination.last_page }}
          </p>
          <div class="flex gap-2">
            <AppButton
              variant="secondary"
              size="sm"
              :disabled="!marcasStore.hasPrevious"
              @click="goToPage(marcasStore.pagination.current_page - 1)"
            >
              Anterior
            </AppButton>
            <AppButton
              variant="secondary"
              size="sm"
              :disabled="!marcasStore.hasNext"
              @click="goToPage(marcasStore.pagination.current_page + 1)"
            >
              Próxima
            </AppButton>
          </div>
        </div>
      </div>
    </div>

    <AppModal
      :open="deleteModalOpen"
      title="Excluir marca"
      max-width="sm"
      @close="closeDeleteModal"
    >
      <p v-if="marcaToDelete" class="text-gray-600">
        Tem certeza que deseja excluir a marca <strong>{{ marcaToDelete.nome }}</strong
        >?
      </p>
      <div class="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" @click="closeDeleteModal">Cancelar</AppButton>
        <AppButton variant="danger" :loading="deleting" @click="confirmDelete">Excluir</AppButton>
      </div>
    </AppModal>
  </div>
</template>
