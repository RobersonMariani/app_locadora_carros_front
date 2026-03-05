<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { PhotoIcon } from '@heroicons/vue/24/outline'
import type { AxiosError } from 'axios'
import { marcaService } from '@/modules/marcas/services/marca.service'
import { modeloService } from '@/modules/modelos/services/modelo.service'
import { updateModeloSchema } from '@/modules/modelos/dtos/modelo.dto'
import { useUiStore } from '@/stores/ui.store'
import { useForm } from '@/composables/useForm'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()

const { data, errors, processing, setErrors, submit } = useForm({
  marca_id: '' as string | number,
  nome: '',
  imagem: null as File | null,
  numero_portas: 2,
  lugares: 5,
  air_bag: false,
  abs: false,
})

const loading = ref(true)
const imagePreview = ref<string | null>(null)
const currentImageUrl = ref<string | null>(null)
const marcaOptions = ref<{ value: number; label: string }[]>([])
const loadingMarcas = ref(true)

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    const [modelo, marcasResponse] = await Promise.all([
      modeloService.show(id),
      marcaService.list(1),
    ])
    data.value.marca_id = modelo.marca_id
    data.value.nome = modelo.nome
    data.value.numero_portas = modelo.numero_portas
    data.value.lugares = modelo.lugares
    data.value.air_bag = modelo.air_bag
    data.value.abs = modelo.abs
    currentImageUrl.value = modelo.imagem_url
    marcaOptions.value = marcasResponse.data.map((m) => ({ value: m.id, label: m.nome }))
  } finally {
    loading.value = false
    loadingMarcas.value = false
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
  const marcaId = data.value.marca_id ? Number(data.value.marca_id) : undefined
  const result = updateModeloSchema.safeParse({
    marca_id: marcaId,
    nome: data.value.nome || undefined,
    imagem: data.value.imagem || undefined,
    numero_portas:
      data.value.numero_portas !== undefined ? Number(data.value.numero_portas) : undefined,
    lugares: data.value.lugares !== undefined ? Number(data.value.lugares) : undefined,
    air_bag: data.value.air_bag,
    abs: data.value.abs,
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
  const hasChanges =
    parsed.nome !== undefined ||
    parsed.marca_id !== undefined ||
    parsed.imagem !== undefined ||
    parsed.numero_portas !== undefined ||
    parsed.lugares !== undefined ||
    parsed.air_bag !== undefined ||
    parsed.abs !== undefined

  if (!hasChanges) {
    uiStore.notify('warning', 'Nenhuma alteração para salvar.')
    return
  }

  await submit(async () => {
    const formData = new FormData()
    if (parsed.marca_id !== undefined) formData.append('marca_id', String(parsed.marca_id))
    if (parsed.nome !== undefined) formData.append('nome', parsed.nome)
    if (parsed.imagem) formData.append('imagem', parsed.imagem)
    if (parsed.numero_portas !== undefined)
      formData.append('numero_portas', String(parsed.numero_portas))
    if (parsed.lugares !== undefined) formData.append('lugares', String(parsed.lugares))
    formData.append('air_bag', data.value.air_bag ? '1' : '0')
    formData.append('abs', data.value.abs ? '1' : '0')

    try {
      await modeloService.update(Number(route.params.id), formData)
      uiStore.notify('success', 'Modelo atualizado com sucesso.')
      router.push({ name: 'modelos' })
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
      <RouterLink :to="{ name: 'modelos' }" class="transition-colors hover:text-primary-600"
        >Modelos</RouterLink
      >
      <span class="text-surface-300">/</span>
      <span class="font-semibold text-surface-900">Editar Modelo</span>
    </nav>

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

    <div v-else class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AppSelect
          v-model="data.marca_id"
          label="Marca"
          placeholder="Selecione a marca"
          :options="marcaOptions"
          :disabled="loadingMarcas"
          :error="errors.marca_id"
        />

        <AppInput v-model="data.nome" label="Nome" placeholder="Ex: Corolla" :error="errors.nome" />

        <div>
          <label class="mb-1 block text-sm font-medium text-surface-700">Imagem</label>
          <div class="mb-2 flex items-center gap-4">
            <div
              v-if="currentImageUrl && !imagePreview"
              class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-surface-100"
            >
              <img :src="currentImageUrl" alt="Atual" class="max-h-20 object-contain" />
            </div>
            <div v-else-if="imagePreview" class="max-h-32 overflow-hidden">
              <img :src="imagePreview" alt="Nova" class="max-h-32 object-contain" />
            </div>
            <span v-else class="text-sm text-surface-500">Nenhuma imagem</span>
          </div>
          <label
            class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-300 bg-surface-50 px-6 py-4 transition-colors hover:border-primary-500 hover:bg-surface-100"
          >
            <input type="file" accept=".png,.jpg,.jpeg" class="hidden" @change="onFileChange" />
            <PhotoIcon class="mb-1 h-8 w-8 text-surface-400" />
            <span class="text-sm text-surface-600">Selecionar nova imagem (.png, .jpg, .jpeg)</span>
          </label>
          <p v-if="errors.imagem" class="mt-1 text-sm text-danger-600">{{ errors.imagem }}</p>
        </div>

        <AppInput
          v-model="data.numero_portas"
          type="number"
          label="Número de portas"
          :error="errors.numero_portas"
        />

        <AppInput v-model="data.lugares" type="number" label="Lugares" :error="errors.lugares" />

        <div class="flex gap-6">
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="data.air_bag"
              type="checkbox"
              class="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="text-sm font-medium text-surface-700">Air Bag</span>
          </label>
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="data.abs"
              type="checkbox"
              class="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="text-sm font-medium text-surface-700">ABS</span>
          </label>
        </div>

        <div class="flex gap-2 pt-4">
          <AppButton type="submit" :loading="processing">Salvar</AppButton>
          <AppButton type="button" variant="secondary" @click="router.push({ name: 'modelos' })">
            Cancelar
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
