<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import z from 'zod'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useForm } from '@/composables/useForm'
import { manutencaoService } from '@/modules/manutencoes/services/manutencao.service'
import { createManutencaoSchema } from '@/modules/manutencoes/dtos/manutencao.dto'
import {
  MANUTENCAO_TIPO_OPCOES,
  MANUTENCAO_STATUS_OPCOES,
} from '@/modules/manutencoes/types/manutencao.types'
import { carroService } from '@/modules/carros/services/carro.service'
import { useUiStore } from '@/stores/ui.store'

const router = useRouter()
const uiStore = useUiStore()
const { data, errors, processing, submit } = useForm({
  carro_id: '' as string | number,
  tipo: '',
  descricao: '',
  valor: '' as string | number,
  km_manutencao: '' as string | number,
  data_manutencao: '',
  status: 'agendada',
  data_proxima: '',
  fornecedor: '',
  observacoes: '',
})

const carroOptions = ref<{ value: number; label: string }[]>([])
const loadingCarros = ref(true)

onMounted(async () => {
  try {
    const response = await carroService.list(1, 100)
    const items = response.data ?? []
    carroOptions.value = (items as { id: number; placa: string }[]).map((c) => ({
      value: c.id,
      label: c.placa,
    }))
  } finally {
    loadingCarros.value = false
  }
})

async function handleSubmit() {
  const payload = {
    carro_id: Number(data.value.carro_id),
    tipo: data.value.tipo,
    descricao: data.value.descricao,
    valor: Number(data.value.valor),
    km_manutencao: Number(data.value.km_manutencao),
    data_manutencao: data.value.data_manutencao,
    status: data.value.status,
    data_proxima: data.value.data_proxima || null,
    fornecedor: data.value.fornecedor || null,
    observacoes: data.value.observacoes || null,
  }
  const parsed = createManutencaoSchema.safeParse(payload)
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
    await manutencaoService.create(parsed.data)
    uiStore.notify('success', 'Manutenção criada com sucesso.')
    router.push({ name: 'manutencoes' })
  })
}
</script>

<template>
  <div>
    <nav class="mb-6 flex items-center gap-2 text-sm text-surface-500">
      <RouterLink :to="{ name: 'manutencoes' }" class="transition-colors hover:text-primary-600">
        Manutenções
      </RouterLink>
      <ChevronRightIcon class="h-3 w-3 text-surface-400" />
      <span class="font-semibold text-surface-900">Nova Manutenção</span>
    </nav>

    <div class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AppSelect
            v-model="data.carro_id"
            label="Carro"
            placeholder="Selecione o carro"
            required
            :options="carroOptions"
            :disabled="loadingCarros"
            :error="errors.carro_id"
          />
          <AppSelect
            v-model="data.tipo"
            label="Tipo"
            :options="MANUTENCAO_TIPO_OPCOES"
            placeholder="Selecione o tipo"
            required
            :error="errors.tipo"
          />
          <AppSelect
            v-model="data.status"
            label="Status"
            :options="MANUTENCAO_STATUS_OPCOES"
            placeholder="Selecione o status"
            required
            :error="errors.status"
          />
          <AppInput
            v-model="data.descricao"
            label="Descrição"
            placeholder="Descrição da manutenção"
            required
            :error="errors.descricao"
          />
          <AppInput
            v-model="data.valor"
            label="Valor"
            type="number"
            step="0.01"
            placeholder="0,00"
            required
            :error="errors.valor"
          />
          <AppInput
            v-model="data.km_manutencao"
            type="number"
            label="KM da Manutenção"
            placeholder="0"
            required
            :error="errors.km_manutencao"
          />
          <AppInput
            v-model="data.data_manutencao"
            label="Data da Manutenção"
            type="date"
            required
            :error="errors.data_manutencao"
          />
          <AppInput
            v-model="data.data_proxima"
            label="Data Próxima"
            type="date"
            :error="errors.data_proxima"
          />
          <AppInput
            v-model="data.fornecedor"
            label="Fornecedor"
            placeholder="Opcional"
            :error="errors.fornecedor"
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
          <AppButton type="button" variant="secondary" @click="router.push({ name: 'manutencoes' })">
            Cancelar
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
