<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { PhotoIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useModelosStore } from '@/stores/modelos.store'
import { useUiStore } from '@/stores/ui.store'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'

const modelosStore = useModelosStore()
const uiStore = useUiStore()

const deleteModalOpen = ref(false)
const modeloToDelete = ref<{ id: number; nome: string } | null>(null)
const deleting = ref(false)

onMounted(() => {
  modelosStore.fetchModelos(modelosStore.pagination.current_page)
})

function openDeleteModal(modelo: { id: number; nome: string }) {
  modeloToDelete.value = modelo
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  modeloToDelete.value = null
}

async function confirmDelete() {
  if (!modeloToDelete.value) return
  deleting.value = true
  try {
    await modelosStore.deleteModelo(modeloToDelete.value.id)
    uiStore.notify('success', 'Modelo excluído com sucesso.')
    closeDeleteModal()
  } catch {
    uiStore.notify('error', 'Não foi possível excluir o modelo.')
  } finally {
    deleting.value = false
  }
}

function goToPage(page: number) {
  modelosStore.fetchModelos(page)
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Modelos</h1>
        <p class="mt-1 text-sm text-surface-500">Modelos de veículos disponíveis</p>
      </div>
      <RouterLink :to="{ name: 'modelos.create' }">
        <AppButton>Novo Modelo</AppButton>
      </RouterLink>
    </div>

    <div class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
      <div v-if="modelosStore.loading" class="flex justify-center py-12">
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

      <div v-else-if="modelosStore.modelos.length === 0" class="py-12 text-center">
        <PhotoIcon class="mx-auto h-12 w-12 text-surface-400" />
        <p class="mt-2 text-surface-500">Nenhum modelo cadastrado.</p>
        <RouterLink :to="{ name: 'modelos.create' }" class="mt-4 inline-block">
          <AppButton>Cadastrar primeiro modelo</AppButton>
        </RouterLink>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-surface-200">
          <thead class="bg-surface-50/80">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Imagem
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Nome
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Marca
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Portas
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Lugares
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Air Bag
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                ABS
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
              v-for="modelo in modelosStore.modelos"
              :key="modelo.id"
              class="transition-colors hover:bg-surface-50"
            >
              <td class="whitespace-nowrap px-6 py-4">
                <div
                  class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-surface-100 object-contain"
                >
                  <img
                    v-if="modelo.imagem_url"
                    :src="modelo.imagem_url"
                    :alt="modelo.nome"
                    class="h-10 w-10 rounded-lg object-cover"
                  />
                  <PhotoIcon v-else class="h-6 w-6 text-surface-400" />
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-surface-900">
                {{ modelo.nome }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-600">
                {{ modelo.marca?.nome ?? '-' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-600">
                {{ modelo.numero_portas }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-600">
                {{ modelo.lugares }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <CheckIcon v-if="modelo.air_bag" class="h-5 w-5 text-green-600" />
                <XMarkIcon v-else class="h-5 w-5 text-red-600" />
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <CheckIcon v-if="modelo.abs" class="h-5 w-5 text-green-600" />
                <XMarkIcon v-else class="h-5 w-5 text-red-600" />
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <RouterLink :to="{ name: 'modelos.edit', params: { id: modelo.id } }">
                    <AppButton variant="secondary" size="sm">
                      <PencilIcon class="h-4 w-4" />
                      Editar
                    </AppButton>
                  </RouterLink>
                  <AppButton variant="danger" size="sm" @click="openDeleteModal(modelo)">
                    <TrashIcon class="h-4 w-4" />
                    Excluir
                  </AppButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="modelosStore.hasPages"
          class="mt-4 flex items-center justify-between border-t border-surface-200 pt-4"
        >
          <p class="text-sm text-surface-600">
            Mostrando página {{ modelosStore.pagination.current_page }} de
            {{ modelosStore.pagination.last_page }}
          </p>
          <div class="flex gap-2">
            <AppButton
              variant="secondary"
              size="sm"
              :disabled="!modelosStore.hasPrevious"
              @click="goToPage(modelosStore.pagination.current_page - 1)"
            >
              Anterior
            </AppButton>
            <AppButton
              variant="secondary"
              size="sm"
              :disabled="!modelosStore.hasNext"
              @click="goToPage(modelosStore.pagination.current_page + 1)"
            >
              Próxima
            </AppButton>
          </div>
        </div>
      </div>
    </div>

    <AppModal
      :open="deleteModalOpen"
      title="Excluir modelo"
      max-width="sm"
      @close="closeDeleteModal"
    >
      <p v-if="modeloToDelete" class="text-surface-600">
        Tem certeza que deseja excluir o modelo <strong>{{ modeloToDelete.nome }}</strong
        >?
      </p>
      <div class="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" @click="closeDeleteModal">Cancelar</AppButton>
        <AppButton variant="danger" :loading="deleting" @click="confirmDelete">Excluir</AppButton>
      </div>
    </AppModal>
  </div>
</template>
