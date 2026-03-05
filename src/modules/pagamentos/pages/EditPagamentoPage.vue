<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import z from 'zod'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useForm } from '@/composables/useForm'
import { pagamentoService } from '@/modules/pagamentos/services/pagamento.service'
import { updatePagamentoSchema } from '@/modules/pagamentos/dtos/pagamento.dto'
import { PAGAMENTO_TIPOS, METODOS_PAGAMENTO } from '@/modules/pagamentos/types/pagamento.types'
import { useUiStore } from '@/stores/ui.store'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()
const { data, errors, processing, submit, reset } = useForm({
  locacao_id: '' as string | number,
  valor: '' as string | number,
  tipo: '',
  metodo_pagamento: '',
  data_pagamento: '',
  observacoes: '',
})

const id = computed(() => Number(route.params.id))

async function loadPagamento() {
  const { data: pagamento } = await pagamentoService.getById(id.value)
  reset()
  data.value.locacao_id = pagamento.locacao_id
  data.value.valor = pagamento.valor
  data.value.tipo = pagamento.tipo
  data.value.metodo_pagamento = pagamento.metodo_pagamento
  data.value.data_pagamento = pagamento.data_pagamento.split('T')[0] ?? pagamento.data_pagamento
  data.value.observacoes = pagamento.observacoes ?? ''
}

async function handleSubmit() {
  const parsed = updatePagamentoSchema.safeParse(data.value)
  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error)
    const fieldErrors: Record<string, string> = {}
    for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
      if (messages?.[0]) fieldErrors[key] = messages[0]
    }
    errors.value = fieldErrors
    return
  }

  await submit(async (formData) => {
    const payload = {
      locacao_id: Number(formData.locacao_id),
      valor: Number(formData.valor),
      tipo: formData.tipo,
      metodo_pagamento: formData.metodo_pagamento,
      data_pagamento: formData.data_pagamento,
      observacoes: formData.observacoes || undefined,
    }
    await pagamentoService.update(id.value, payload)
    uiStore.notify('success', 'Pagamento atualizado com sucesso.')
    router.push({ name: 'pagamentos' })
  })
}

onMounted(loadPagamento)
</script>

<template>
  <div>
    <nav class="mb-6 flex items-center gap-2 text-sm text-surface-500">
      <RouterLink :to="{ name: 'pagamentos' }" class="hover:text-primary-600">Pagamentos</RouterLink>
      <ChevronRightIcon class="h-3 w-3 text-surface-400" />
      <span class="font-semibold text-surface-900">Editar Pagamento</span>
    </nav>

    <div class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <AppInput
          v-model="data.locacao_id"
          label="Locação ID"
          type="number"
          placeholder="ID da locação"
          required
          :error="errors.locacao_id"
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
        <AppSelect
          v-model="data.tipo"
          label="Tipo"
          :options="PAGAMENTO_TIPOS"
          placeholder="Selecione o tipo"
          required
          :error="errors.tipo"
        />
        <AppSelect
          v-model="data.metodo_pagamento"
          label="Método de Pagamento"
          :options="METODOS_PAGAMENTO"
          placeholder="Selecione o método"
          required
          :error="errors.metodo_pagamento"
        />
        <AppInput
          v-model="data.data_pagamento"
          label="Data do Pagamento"
          type="date"
          required
          :error="errors.data_pagamento"
        />
        <AppInput
          v-model="data.observacoes"
          label="Observações"
          placeholder="Observações (opcional)"
          :error="errors.observacoes"
        />

        <div class="flex gap-2 pt-4">
          <AppButton type="submit" :loading="processing"> Salvar </AppButton>
          <AppButton type="button" variant="secondary" @click="router.push({ name: 'pagamentos' })">
            Cancelar
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
