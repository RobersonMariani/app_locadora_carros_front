<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
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
const COR_OPCOES = [
  { value: 'Branco', label: 'Branco' },
  { value: 'Preto', label: 'Preto' },
  { value: 'Prata', label: 'Prata' },
  { value: 'Vermelho', label: 'Vermelho' },
  { value: 'Azul', label: 'Azul' },
  { value: 'Cinza', label: 'Cinza' },
  { value: 'Outro', label: 'Outro' },
]
const COMBUSTIVEL_OPCOES = [
  { value: 'flex', label: 'Flex' },
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'etanol', label: 'Etanol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'eletrico', label: 'Elétrico' },
  { value: 'hibrido', label: 'Híbrido' },
]
const CAMBIO_OPCOES = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatico', label: 'Automático' },
  { value: 'cvt', label: 'CVT' },
]
const CATEGORIA_OPCOES = [
  { value: 'economico', label: 'Econômico' },
  { value: 'compacto', label: 'Compacto' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'luxo', label: 'Luxo' },
  { value: 'van', label: 'Van' },
]

const { data, errors, processing, submit, reset } = useForm({
  modelo_id: '' as string | number,
  placa: '',
  cor: '',
  ano_fabricacao: '' as string | number,
  ano_modelo: '' as string | number,
  renavam: '',
  disponivel: true,
  km: '' as string | number,
  combustivel: '',
  cambio: '',
  categoria: '',
  ar_condicionado: false,
  diaria_padrao: '' as string | number,
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
    data.value.cor = carro.cor
    data.value.ano_fabricacao = carro.ano_fabricacao
    data.value.ano_modelo = carro.ano_modelo
    data.value.renavam = carro.renavam ?? ''
    data.value.disponivel = carro.disponivel
    data.value.km = carro.km
    data.value.combustivel = carro.combustivel ?? ''
    data.value.cambio = carro.cambio ?? ''
    data.value.categoria = carro.categoria ?? ''
    data.value.ar_condicionado = carro.ar_condicionado ?? false
    data.value.diaria_padrao = carro.diaria_padrao ?? ''
  } finally {
    loadingModelos.value = false
  }
})

async function handleSubmit() {
  const modeloId = data.value.modelo_id ? Number(data.value.modelo_id) : 0
  const km = data.value.km !== '' ? Number(data.value.km) : 0
  const anoFab = data.value.ano_fabricacao !== '' ? Number(data.value.ano_fabricacao) : undefined
  const anoMod = data.value.ano_modelo !== '' ? Number(data.value.ano_modelo) : undefined
  const diariaPadrao = data.value.diaria_padrao !== '' ? Number(data.value.diaria_padrao) : null
  const payload = {
    modelo_id: modeloId || undefined,
    placa: data.value.placa || undefined,
    cor: data.value.cor || undefined,
    ano_fabricacao: anoFab,
    ano_modelo: anoMod,
    renavam: data.value.renavam === '' ? null : data.value.renavam || undefined,
    disponivel: data.value.disponivel,
    km: km || undefined,
    combustivel: data.value.combustivel || undefined,
    cambio: data.value.cambio || undefined,
    categoria: data.value.categoria || undefined,
    ar_condicionado: data.value.ar_condicionado,
    diaria_padrao: diariaPadrao,
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
  ) as {
    modelo_id?: number
    placa?: string
    cor?: string
    ano_fabricacao?: number
    ano_modelo?: number
    renavam?: string | null
    disponivel?: boolean
    km?: number
    combustivel?: string
    cambio?: string
    categoria?: string
    ar_condicionado?: boolean
    diaria_padrao?: number | null
  }

  await submit(async () => {
    await carroService.update(id.value, toSend)
    uiStore.notify('success', 'Carro atualizado com sucesso.')
    router.push({ name: 'carros' })
  })
}
</script>

<template>
  <div>
    <nav class="mb-6 flex items-center gap-2 text-sm text-surface-500">
      <RouterLink :to="{ name: 'carros' }" class="transition-colors hover:text-primary-600"
        >Carros</RouterLink
      >
      <span class="text-surface-300">/</span>
      <span class="font-semibold text-surface-900">Editar Carro</span>
    </nav>

    <div class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <AppSelect
            v-model="data.cor"
            label="Cor"
            placeholder="Selecione a cor"
            required
            :options="COR_OPCOES"
            :error="errors.cor"
          />

          <AppInput
            v-model="data.ano_fabricacao"
            type="number"
            label="Ano de Fabricação"
            placeholder="Ex: 2024"
            required
            :error="errors.ano_fabricacao"
          />

          <AppInput
            v-model="data.ano_modelo"
            type="number"
            label="Ano do Modelo"
            placeholder="Ex: 2024"
            required
            :error="errors.ano_modelo"
          />

          <AppInput
            v-model="data.renavam"
            label="RENAVAM"
            placeholder="Opcional"
            :error="errors.renavam"
          />

          <AppInput
            v-model="data.km"
            type="number"
            label="KM"
            placeholder="0"
            required
            :error="errors.km"
          />

          <AppSelect
            v-model="data.combustivel"
            label="Combustível"
            placeholder="Selecione o combustível"
            :options="COMBUSTIVEL_OPCOES"
            :error="errors.combustivel"
          />

          <AppSelect
            v-model="data.cambio"
            label="Câmbio"
            placeholder="Selecione o câmbio"
            :options="CAMBIO_OPCOES"
            :error="errors.cambio"
          />

          <AppSelect
            v-model="data.categoria"
            label="Categoria"
            placeholder="Selecione a categoria"
            :options="CATEGORIA_OPCOES"
            :error="errors.categoria"
          />

          <AppInput
            v-model="data.diaria_padrao"
            type="number"
            label="Diária Padrão (R$)"
            placeholder="0,00"
            step="0.01"
            :error="errors.diaria_padrao"
          />

          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <input
                v-model="data.disponivel"
                type="checkbox"
                id="disponivel"
                class="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
              />
              <label for="disponivel" class="text-sm font-medium text-surface-700">Disponível</label>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model="data.ar_condicionado"
                type="checkbox"
                id="ar_condicionado"
                class="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
              />
              <label for="ar_condicionado" class="text-sm font-medium text-surface-700"
                >Ar Condicionado</label
              >
            </div>
          </div>
        </div>

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
