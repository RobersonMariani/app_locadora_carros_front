<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import z from 'zod'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useForm } from '@/composables/useForm'
import { carroService } from '@/modules/carros/services/carro.service'
import { updateCarroSchema } from '@/modules/carros/dtos/carro.dto'
import { modeloService } from '@/modules/modelos/services/modelo.service'
import { useUiStore } from '@/stores/ui.store'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()
const { data, errors, processing, submit, reset } = useForm({
  modelo_id: '' as string | number,
  placa: '',
  disponivel: true,
  km: '' as string | number,
})

const id = computed(() => Number(route.params.id))
const modeloOptions = ref<{ value: number; label: string }[]>([])
const loadingModelos = ref(true)

onMounted(async () => {
  try {
    const [carroResponse, modelosResponse] = await Promise.all([
      carroService.show(id.value),
      modeloService.list(1, 100),
    ])
    const carro = carroResponse
    const items = modelosResponse.data ?? []
    modeloOptions.value = items.map((m) => ({
      value: m.id,
      label: m.nome,
    }))
    reset()
    data.value.modelo_id = carro.modelo_id
    data.value.placa = carro.placa
    data.value.disponivel = carro.disponivel
    data.value.km = carro.km
  } finally {
    loadingModelos.value = false
  }
})

async function handleSubmit() {
  const modeloId = data.value.modelo_id ? Number(data.value.modelo_id) : 0
  const km = data.value.km !== '' ? Number(data.value.km) : 0
  const payload = {
    modelo_id: modeloId || undefined,
    placa: data.value.placa || undefined,
    disponivel: data.value.disponivel,
    km: km || undefined,
  }
  const parsed = updateCarroSchema.safeParse(payload)

  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error)
    const fieldErrors: Record<string, string> = {}
    for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
      if (messages?.[0]) fieldErrors[key] = messages[0]
    }
    errors.value = fieldErrors
    return
  }

  const toSend = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v !== undefined),
  ) as { modelo_id?: number; placa?: string; disponivel?: boolean; km?: number }

  await submit(async () => {
    await carroService.update(id.value, toSend)
    uiStore.notify('success', 'Carro atualizado com sucesso.')
    router.push({ name: 'carros' })
  })
}
</script>

<template>
  <div>
    <nav class="mb-6 flex items-center gap-2 text-sm text-gray-600">
      <RouterLink :to="{ name: 'carros' }" class="hover:text-primary-600">Carros</RouterLink>
      <span>/</span>
      <span class="font-medium text-gray-900">Editar Carro</span>
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
