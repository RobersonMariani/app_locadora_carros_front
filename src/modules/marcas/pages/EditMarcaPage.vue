<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhotoIcon } from '@heroicons/vue/24/outline'
import type { AxiosError } from 'axios'
import { marcaService } from '@/modules/marcas/services/marca.service'
import { updateMarcaSchema } from '@/modules/marcas/dtos/marca.dto'
import { useUiStore } from '@/stores/ui.store'
import { useForm } from '@/composables/useForm'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()

const { data, errors, processing, setErrors, submit } = useForm({
  nome: '',
  imagem: null as File | null,
})

const loading = ref(true)
const imagePreview = ref<string | null>(null)
const currentImageUrl = ref<string | null>(null)

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    const marca = await marcaService.show(id)
    data.value.nome = marca.nome
    currentImageUrl.value = marca.imagem_url
  } finally {
    loading.value = false
  }
})

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    data.value.imagem = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function handleSubmit() {
  const result = updateMarcaSchema.safeParse({
    nome: data.value.nome || undefined,
    imagem: data.value.imagem || undefined,
  })

  if (!result.success) {
    const fieldErrors: Record<string, string> = {}
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.')
      if (path && issue.message) fieldErrors[path] = issue.message
    })
    errors.value = fieldErrors
    return
  }

  const parsed = result.data
  if (!parsed.nome && !parsed.imagem) {
    uiStore.notify('warning', 'Nenhuma alteração para salvar.')
    return
  }

  await submit(async () => {
    const formData = new FormData()
    if (parsed.nome) formData.append('nome', parsed.nome)
    if (parsed.imagem) formData.append('imagem', parsed.imagem)

    try {
      await marcaService.update(Number(route.params.id), formData)
      uiStore.notify('success', 'Marca atualizada com sucesso.')
      router.push({ name: 'marcas' })
    } catch (err) {
      setErrors(err as AxiosError)
      throw err
    }
  })
}
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Editar Marca</h1>

    <div v-if="loading" class="flex justify-center py-12">
      <svg
        class="h-8 w-8 animate-spin text-primary-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>

    <div v-else class="rounded-xl bg-white p-6 shadow-sm">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AppInput v-model="data.nome" label="Nome" placeholder="Ex: Toyota" :error="errors.nome" />

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Imagem</label>
          <div class="mb-2 flex items-center gap-4">
            <div
              v-if="currentImageUrl && !imagePreview"
              class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-gray-100"
            >
              <img :src="currentImageUrl" alt="Atual" class="max-h-20 object-contain" />
            </div>
            <div v-else-if="imagePreview" class="max-h-32 overflow-hidden">
              <img :src="imagePreview" alt="Nova" class="max-h-32 object-contain" />
            </div>
            <span v-else class="text-sm text-gray-500">Nenhuma imagem</span>
          </div>
          <label
            class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-4 transition-colors hover:border-primary-500 hover:bg-gray-100"
          >
            <input type="file" accept=".png" class="hidden" @change="onFileChange" />
            <PhotoIcon class="mb-1 h-8 w-8 text-gray-400" />
            <span class="text-sm text-gray-600">Selecionar nova imagem (.png)</span>
          </label>
          <p v-if="errors.imagem" class="mt-1 text-sm text-danger-600">{{ errors.imagem }}</p>
        </div>

        <div class="flex gap-2 pt-4">
          <AppButton type="submit" :loading="processing">Salvar</AppButton>
          <AppButton type="button" variant="secondary" @click="router.push({ name: 'marcas' })">
            Cancelar
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
