<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import z from 'zod'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useForm } from '@/composables/useForm'
import { clienteService } from '@/modules/clientes/services/cliente.service'
import { carroService } from '@/modules/carros/services/carro.service'
import { locacaoService } from '@/modules/locacoes/services/locacao.service'
import { updateLocacaoSchema } from '@/modules/locacoes/dtos/locacao.dto'
import { formatDateISO } from '@/lib/date'
import { useUiStore } from '@/stores/ui.store'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()
const { data, errors, processing, submit, reset } = useForm({
  cliente_id: '' as string | number,
  carro_id: '' as string | number,
  data_inicio_periodo: '',
  data_final_previsto_periodo: '',
  data_final_realizado_periodo: '',
  valor_diaria: '' as string | number,
  km_inicial: '' as string | number,
  km_final: '' as string | number,
})

const clienteOptions = ref<{ value: number; label: string }[]>([])
const carroOptions = ref<{ value: number; label: string }[]>([])
const loadingClientes = ref(true)
const loadingCarros = ref(true)

const id = computed(() => Number(route.params.id))

async function loadLocacao() {
  const locacao = await locacaoService.show(id.value)
  reset()
  data.value.cliente_id = locacao.cliente_id
  data.value.carro_id = locacao.carro_id
  data.value.data_inicio_periodo = formatDateISO(locacao.data_inicio_periodo)
  data.value.data_final_previsto_periodo = formatDateISO(locacao.data_final_previsto_periodo)
  data.value.data_final_realizado_periodo = locacao.data_final_realizado_periodo
    ? formatDateISO(locacao.data_final_realizado_periodo)
    : ''
  data.value.valor_diaria = locacao.valor_diaria
  data.value.km_inicial = locacao.km_inicial
  data.value.km_final = locacao.km_final ?? ''
}

onMounted(async () => {
  try {
    const [{ data: clientesRes }, carrosRes] = await Promise.all([
      clienteService.list(1, 100),
      carroService.list(1, 100),
    ])
    const clientesData = clientesRes?.data ?? []
    const carrosData = carrosRes.data ?? []
    clienteOptions.value = (clientesData as { id: number; nome: string }[]).map((c) => ({
      value: c.id,
      label: c.nome,
    }))
    carroOptions.value = (carrosData as { id: number; placa: string }[]).map((c) => ({
      value: c.id,
      label: c.placa,
    }))
  } finally {
    loadingClientes.value = false
    loadingCarros.value = false
  }
  await loadLocacao()
})

function buildPayload() {
  const clienteId = data.value.cliente_id ? Number(data.value.cliente_id) : 0
  const carroId = data.value.carro_id ? Number(data.value.carro_id) : 0
  const valorDiaria = data.value.valor_diaria !== '' ? Number(data.value.valor_diaria) : 0
  const kmInicial = data.value.km_inicial !== '' ? Number(data.value.km_inicial) : 0
  const kmFinal = data.value.km_final !== '' ? Number(data.value.km_final) : null

  const payload: Record<string, unknown> = {
    cliente_id: clienteId,
    carro_id: carroId,
    data_inicio_periodo: data.value.data_inicio_periodo,
    data_final_previsto_periodo: data.value.data_final_previsto_periodo,
    valor_diaria: valorDiaria,
    km_inicial: kmInicial,
  }

  if (data.value.data_final_realizado_periodo) {
    payload.data_final_realizado_periodo = data.value.data_final_realizado_periodo
  } else {
    payload.data_final_realizado_periodo = null
  }

  if (kmFinal !== null) {
    payload.km_final = kmFinal
  } else {
    payload.km_final = null
  }

  return payload
}

async function handleSubmit() {
  const payload = buildPayload()
  const parsed = updateLocacaoSchema.safeParse({
    cliente_id: payload.cliente_id,
    carro_id: payload.carro_id,
    data_inicio_periodo: payload.data_inicio_periodo,
    data_final_previsto_periodo: payload.data_final_previsto_periodo,
    data_final_realizado_periodo: payload.data_final_realizado_periodo || '',
    valor_diaria: payload.valor_diaria,
    km_inicial: payload.km_inicial,
    km_final: payload.km_final,
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
    await locacaoService.update(id.value, payload)
    uiStore.notify('success', 'Locação atualizada com sucesso.')
    router.push({ name: 'locacoes' })
  })
}
</script>

<template>
  <div>
    <nav class="mb-6 flex items-center gap-2 text-sm text-gray-600">
      <RouterLink :to="{ name: 'locacoes' }" class="hover:text-primary-600">Locações</RouterLink>
      <span>/</span>
      <span class="font-medium text-gray-900">Editar Locação</span>
    </nav>

    <div class="rounded-xl bg-white p-6 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <AppSelect
          v-model="data.cliente_id"
          label="Cliente"
          placeholder="Selecione o cliente"
          required
          :options="clienteOptions"
          :disabled="loadingClientes"
          :error="errors.cliente_id"
        />

        <AppSelect
          v-model="data.carro_id"
          label="Carro"
          placeholder="Selecione o carro"
          required
          :options="carroOptions"
          :disabled="loadingCarros"
          :error="errors.carro_id"
        />

        <AppInput
          v-model="data.data_inicio_periodo"
          type="date"
          label="Data Início Período"
          required
          :error="errors.data_inicio_periodo"
        />

        <AppInput
          v-model="data.data_final_previsto_periodo"
          type="date"
          label="Data Final Previsto Período"
          required
          :error="errors.data_final_previsto_periodo"
        />

        <AppInput
          v-model="data.data_final_realizado_periodo"
          type="date"
          label="Data Final Realizado Período (opcional)"
          :error="errors.data_final_realizado_periodo"
        />

        <AppInput
          v-model="data.valor_diaria"
          type="number"
          step="0.01"
          label="Valor Diária"
          placeholder="0.00"
          required
          :error="errors.valor_diaria"
        />

        <AppInput
          v-model="data.km_inicial"
          type="number"
          label="KM Inicial"
          placeholder="0"
          required
          :error="errors.km_inicial"
        />

        <AppInput
          v-model="data.km_final"
          type="number"
          label="KM Final (opcional)"
          placeholder="0"
          :error="errors.km_final"
        />

        <div class="flex gap-2 pt-4">
          <AppButton type="submit" :loading="processing"> Salvar </AppButton>
          <AppButton type="button" variant="secondary" @click="router.push({ name: 'locacoes' })">
            Cancelar
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
