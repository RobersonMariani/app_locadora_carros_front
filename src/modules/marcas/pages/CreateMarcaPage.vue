<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { PhotoIcon } from '@heroicons/vue/24/outline'
import type { AxiosError } from 'axios'
import { marcaService } from '@/modules/marcas/services/marca.service'
import { createMarcaSchema } from '@/modules/marcas/dtos/marca.dto'
import { useUiStore } from '@/stores/ui.store'
import { useForm } from '@/composables/useForm'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'

const router = useRouter()
const uiStore = useUiStore()

const { data, errors, processing, setErrors, submit } = useForm({
  nome: '',
  imagem: null as File | null,
})

const imagePreview = ref<string | null>(null)

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    data.value.imagem = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function handleSubmit() {
  const result = createMarcaSchema.safeParse({
    nome: data.value.nome,
    imagem: data.value.imagem,
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

  await submit(async () => {
    const formData = new FormData()
    formData.append('nome', result.data.nome)
    formData.append('imagem', result.data.imagem)

    try {
      await marcaService.create(formData)
      uiStore.notify('success', 'Marca cadastrada com sucesso.')
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
    <nav class="mb-6 flex items-center gap-2 text-sm text-surface-500">
      <RouterLink :to="{ name: 'marcas' }" class="transition-colors hover:text-primary-600"
        >Marcas</RouterLink
      >
      <span class="text-surface-300">/</span>
      <span class="font-semibold text-surface-900">Nova Marca</span>
    </nav>

    <div class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AppInput
          v-model="data.nome"
          label="Nome"
          placeholder="Ex: Toyota"
          required
          :error="errors.nome"
        />

        <div>
          <label class="mb-1 block text-sm font-medium text-surface-700">
            Imagem
            <span class="text-danger-500">*</span>
          </label>
          <label
            class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-300 bg-surface-50 px-6 py-8 transition-colors hover:border-primary-400 hover:bg-surface-100"
          >
            <input type="file" accept=".png" class="hidden" @change="onFileChange" />
            <div v-if="imagePreview" class="mb-2 max-h-32 overflow-hidden">
              <img :src="imagePreview" alt="Preview" class="max-h-32 object-contain" />
            </div>
            <PhotoIcon v-else class="mb-2 h-12 w-12 text-surface-400" />
            <span class="text-sm text-surface-600">Clique para selecionar imagem (.png)</span>
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
