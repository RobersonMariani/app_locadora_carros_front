<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import z from 'zod'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useForm } from '@/composables/useForm'
import { multaService } from '@/modules/multas/services/multa.service'
import { updateMultaSchema } from '@/modules/multas/dtos/multa.dto'
import { MULTA_STATUS_OPCOES } from '@/modules/multas/types/multa.types'
import { locacaoService } from '@/modules/locacoes/services/locacao.service'
import { carroService } from '@/modules/carros/services/carro.service'
import { clienteService } from '@/modules/clientes/services/cliente.service'
import { useUiStore } from '@/stores/ui.store'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()
const { data, errors, processing, submit, reset } = useForm({
  locacao_id: '' as string | number,
  carro_id: '' as string | number,
  cliente_id: '' as string | number,
  valor: '' as string | number,
  data_infracao: '',
  descricao: '',
  status: '',
  codigo_infracao: '',
  pontos: '' as string | number,
  data_pagamento: '',
  observacoes: '',
})

const id = computed(() => Number(route.params.id))
const locacaoOptions = ref<{ value: number; label: string }[]>([])
const carroOptions = ref<{ value: number; label: string }[]>([])
const clienteOptions = ref<{ value: number; label: string }[]>([])
const loadingOptions = ref(true)

onMounted(async () => {
  try {
    const [multa, locacoesRes, carrosRes, clientesRes] = await Promise.all([
      multaService.show(id.value),
      locacaoService.list(1),
      carroService.list(1, 100),
      clienteService.list(1, 100),
    ])
    const locacoes = locacoesRes.data ?? []
    const carros = carrosRes.data ?? []
    const clientesPayload = (clientesRes as { data?: { data?: unknown[] } }).data
    const clientes = Array.isArray(clientesPayload) ? clientesPayload : (clientesPayload?.data ?? [])
    locacaoOptions.value = (
      locacoes as { id: number; cliente?: { nome: string }; carro?: { placa: string } }[]
    ).map((l) => ({
      value: l.id,
      label: `#${l.id} - ${l.carro?.placa ?? '-'} / ${l.cliente?.nome ?? '-'}`,
    }))
    carroOptions.value = carros.map((c) => ({ value: c.id, label: c.placa }))
    clienteOptions.value = (clientes as { id: number; nome: string }[]).map((c) => ({ value: c.id, label: c.nome }))
    reset()
    data.value.locacao_id = multa.locacao_id
    data.value.carro_id = multa.carro_id
    data.value.cliente_id = multa.cliente_id
    data.value.valor = multa.valor
    data.value.data_infracao = multa.data_infracao?.split('T')[0] ?? multa.data_infracao
    data.value.descricao = multa.descricao
    data.value.status = multa.status
    data.value.codigo_infracao = multa.codigo_infracao ?? ''
    data.value.pontos = multa.pontos ?? ''
    data.value.data_pagamento = multa.data_pagamento?.split('T')[0] ?? multa.data_pagamento ?? ''
    data.value.observacoes = multa.observacoes ?? ''
  } finally {
    loadingOptions.value = false
  }
})

async function handleSubmit() {
  const payload = {
    locacao_id: data.value.locacao_id ? Number(data.value.locacao_id) : undefined,
    carro_id: data.value.carro_id ? Number(data.value.carro_id) : undefined,
    cliente_id: data.value.cliente_id ? Number(data.value.cliente_id) : undefined,
    valor: data.value.valor !== '' ? Number(data.value.valor) : undefined,
    data_infracao: data.value.data_infracao || undefined,
    descricao: data.value.descricao || undefined,
    status: data.value.status || undefined,
    codigo_infracao: data.value.codigo_infracao || null,
    pontos: data.value.pontos !== '' ? Number(data.value.pontos) : null,
    data_pagamento: data.value.data_pagamento || null,
    observacoes: data.value.observacoes || null,
  }
  const parsed = updateMultaSchema.safeParse(payload)
  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error)
    const fieldErrors: Record<string, string> = {}
    const fieldErrorsObj = flattened.fieldErrors as Record<string, string[] | undefined>
    for (const [key, messages] of Object.entries(fieldErrorsObj)) {
      if (messages?.[0]) fieldErrors[key] = messages[0]
    }
    errors.value = fieldErrors
    return
  }

  const toSend = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v !== undefined)
  ) as Record<string, unknown>

  await submit(async () => {
    await multaService.update(id.value, toSend)
    uiStore.notify('success', 'Multa atualizada com sucesso.')
    router.push({ name: 'multas' })
  })
}
</script>

<template>
  <div>
    <nav class="mb-6 flex items-center gap-2 text-sm text-surface-500">
      <RouterLink :to="{ name: 'multas' }" class="transition-colors hover:text-primary-600">Multas</RouterLink>
      <ChevronRightIcon class="h-3 w-3 text-surface-400" />
      <span class="font-semibold text-surface-900">Editar Multa</span>
    </nav>

    <div class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AppSelect
            v-model="data.locacao_id"
            label="Locação"
            placeholder="Selecione a locação"
            :options="locacaoOptions"
            :disabled="loadingOptions"
            :error="errors.locacao_id"
          />
          <AppSelect
            v-model="data.carro_id"
            label="Carro"
            placeholder="Selecione o carro"
            :options="carroOptions"
            :disabled="loadingOptions"
            :error="errors.carro_id"
          />
          <AppSelect
            v-model="data.cliente_id"
            label="Cliente"
            placeholder="Selecione o cliente"
            :options="clienteOptions"
            :disabled="loadingOptions"
            :error="errors.cliente_id"
          />
          <AppInput
            v-model="data.valor"
            label="Valor"
            type="number"
            step="0.01"
            placeholder="0,00"
            :error="errors.valor"
          />
          <AppInput
            v-model="data.data_infracao"
            label="Data da Infração"
            type="date"
            :error="errors.data_infracao"
          />
          <AppSelect
            v-model="data.status"
            label="Status"
            :options="MULTA_STATUS_OPCOES"
            placeholder="Selecione o status"
            :error="errors.status"
          />
          <AppInput
            v-model="data.descricao"
            label="Descrição"
            placeholder="Descrição da infração"
            :error="errors.descricao"
          />
          <AppInput
            v-model="data.codigo_infracao"
            label="Código da Infração"
            placeholder="Opcional"
            :error="errors.codigo_infracao"
          />
          <AppInput
            v-model="data.pontos"
            type="number"
            label="Pontos"
            placeholder="0-21"
            :error="errors.pontos"
          />
          <AppInput
            v-model="data.data_pagamento"
            label="Data do Pagamento"
            type="date"
            :error="errors.data_pagamento"
          />
          <AppInput
            v-model="data.observacoes"
            label="Observações"
            placeholder="Opcional"
            :error="errors.observacoes"
          />
        </div>

        <div class="flex gap-2 pt-4">
          <AppButton type="submit" :loading="processing"> Salvar </AppButton>
          <AppButton type="button" variant="secondary" @click="router.push({ name: 'multas' })">
            Cancelar
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
