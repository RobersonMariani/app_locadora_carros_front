<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhotoIcon } from '@heroicons/vue/24/outline'
import type { AxiosError } from 'axios'
import { marcaService } from '@/modules/marcas/services/marca.service'
import { modeloService } from '@/modules/modelos/services/modelo.service'
import { createModeloSchema } from '@/modules/modelos/dtos/modelo.dto'
import { useUiStore } from '@/stores/ui.store'
import { useForm } from '@/composables/useForm'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'

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

const imagePreview = ref<string | null>(null)
const marcaOptions = ref<{ value: number; label: string }[]>([])
const loadingMarcas = ref(true)

onMounted(async () => {
  try {
    const response = await marcaService.list(1)
    marcaOptions.value = response.data.map((m) => ({ value: m.id, label: m.nome }))
  } finally {
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
  const marcaId = data.value.marca_id ? Number(data.value.marca_id) : 0
  const result = createModeloSchema.safeParse({
    marca_id: marcaId,
    nome: data.value.nome,
    imagem: data.value.imagem,
    numero_portas: Number(data.value.numero_portas),
    lugares: Number(data.value.lugares),
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

  await submit(async () => {
    const formData = new FormData()
    formData.append('marca_id', String(result.data.marca_id))
    formData.append('nome', result.data.nome)
    formData.append('imagem', result.data.imagem)
    formData.append('numero_portas', String(result.data.numero_portas))
    formData.append('lugares', String(result.data.lugares))
    formData.append('air_bag', result.data.air_bag ? '1' : '0')
    formData.append('abs', result.data.abs ? '1' : '0')

    try {
      await modeloService.create(formData)
      uiStore.notify('success', 'Modelo cadastrado com sucesso.')
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
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Novo Modelo</h1>

    <div class="rounded-xl bg-white p-6 shadow-sm">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AppSelect
          v-model="data.marca_id"
          label="Marca"
          placeholder="Selecione a marca"
          required
          :options="marcaOptions"
          :disabled="loadingMarcas"
          :error="errors.marca_id"
        />

        <AppInput
          v-model="data.nome"
          label="Nome"
          placeholder="Ex: Corolla"
          required
          :error="errors.nome"
        />

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">
            Imagem
            <span class="text-danger-500">*</span>
          </label>
          <label
            class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition-colors hover:border-primary-500 hover:bg-gray-100"
          >
            <input type="file" accept=".png,.jpg,.jpeg" class="hidden" @change="onFileChange" />
            <div v-if="imagePreview" class="mb-2 max-h-32 overflow-hidden">
              <img :src="imagePreview" alt="Preview" class="max-h-32 object-contain" />
            </div>
            <PhotoIcon v-else class="mb-2 h-12 w-12 text-gray-400" />
            <span class="text-sm text-gray-600"
              >Clique para selecionar imagem (.png, .jpg, .jpeg)</span
            >
          </label>
          <p v-if="errors.imagem" class="mt-1 text-sm text-danger-600">{{ errors.imagem }}</p>
        </div>

        <AppInput
          v-model="data.numero_portas"
          type="number"
          label="Número de portas"
          required
          :error="errors.numero_portas"
        />

        <AppInput
          v-model="data.lugares"
          type="number"
          label="Lugares"
          required
          :error="errors.lugares"
        />

        <div class="flex gap-6">
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="data.air_bag"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="text-sm font-medium text-gray-700">Air Bag</span>
          </label>
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="data.abs"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="text-sm font-medium text-gray-700">ABS</span>
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
