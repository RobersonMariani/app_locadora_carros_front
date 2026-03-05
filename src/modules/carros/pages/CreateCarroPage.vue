<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import z from 'zod'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useForm } from '@/composables/useForm'
import { carroService } from '@/modules/carros/services/carro.service'
import { createCarroSchema } from '@/modules/carros/dtos/carro.dto'
import { modeloService } from '@/modules/modelos/services/modelo.service'
import { useUiStore } from '@/stores/ui.store'

const router = useRouter()
const uiStore = useUiStore()
const { data, errors, processing, submit } = useForm({
  modelo_id: '' as string | number,
  placa: '',
  disponivel: true,
  km: '' as string | number,
})

const modeloOptions = ref<{ value: number; label: string }[]>([])
const loadingModelos = ref(true)

onMounted(async () => {
  try {
    const response = await modeloService.list(1, 100)
    const items = response.data ?? []
    modeloOptions.value = items.map((m) => ({
      value: m.id,
      label: m.nome,
    }))
  } finally {
    loadingModelos.value = false
  }
})

async function handleSubmit() {
  const modeloId = data.value.modelo_id ? Number(data.value.modelo_id) : 0
  const km = data.value.km !== '' ? Number(data.value.km) : 0
  const parsed = createCarroSchema.safeParse({
    modelo_id: modeloId,
    placa: data.value.placa,
    disponivel: data.value.disponivel,
    km,
  })

  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error)
    const fieldErrors: Record<string, string> = {}
    for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
      if (messages?.[0]) fieldErrors[key] = messages[0]
    }
    errors.value = fieldErrors
    return
  }

  await submit(async () => {
    await carroService.create(parsed.data)
    uiStore.notify('success', 'Carro criado com sucesso.')
    router.push({ name: 'carros' })
  })
}
</script>

<template>
  <div>
    <nav class="mb-6 flex items-center gap-2 text-sm text-gray-600">
      <RouterLink :to="{ name: 'carros' }" class="hover:text-primary-600">Carros</RouterLink>
      <span>/</span>
      <span class="font-medium text-gray-900">Novo Carro</span>
    </nav>

    <div class="rounded-xl bg-white p-6 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <AppSelect
          v-model="data.modelo_id"
          label="Modelo"
          placeholder="Selecione o modelo"
          required
          :options="modeloOptions"
          :disabled="loadingModelos"
          :error="errors.modelo_id"
        />

        <AppInput
          v-model="data.placa"
          label="Placa"
          placeholder="Ex: ABC-1234"
          required
          :error="errors.placa"
        />

        <div class="flex items-center gap-2">
          <input
            v-model="data.disponivel"
            type="checkbox"
            id="disponivel"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label for="disponivel" class="text-sm font-medium text-gray-700">Disponível</label>
        </div>

        <AppInput
          v-model="data.km"
          type="number"
          label="KM"
          placeholder="0"
          required
          :error="errors.km"
        />

        <div class="flex gap-2 pt-4">
          <AppButton type="submit" :loading="processing"> Salvar </AppButton>
          <AppButton type="button" variant="secondary" @click="router.push({ name: 'carros' })">
            Cancelar
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
