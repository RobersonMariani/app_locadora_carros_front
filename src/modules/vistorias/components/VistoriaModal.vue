<script setup lang="ts">
import { watch } from 'vue'
import type { AxiosError } from 'axios'
import z from 'zod'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useForm } from '@/composables/useForm'
import { useUiStore } from '@/stores/ui.store'
import { vistoriaService } from '../services/vistoria.service'
import { createVistoriaSchema } from '../dtos/vistoria.dto'

const TIPO_OPCOES = [
  { value: 'retirada', label: 'Retirada' },
  { value: 'devolucao', label: 'Devolução' },
]

const COMBUSTIVEL_OPCOES = [
  { value: 'vazio', label: 'Vazio' },
  { value: '1_4', label: '1/4' },
  { value: 'metade', label: 'Metade' },
  { value: '3_4', label: '3/4' },
  { value: 'cheio', label: 'Cheio' },
]

interface Props {
  locacaoId: number
  visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  created: []
  close: []
}>()

const uiStore = useUiStore()

const { data, errors, processing, submit, reset } = useForm({
  tipo: '',
  combustivel_nivel: '',
  km_registrado: '' as string | number,
  observacoes: '',
  data_vistoria: '',
})

watch(
  () => props.visible,
  (isOpen) => {
    if (!isOpen) {
      reset()
    }
  }
)

function handleClose() {
  emit('close')
}

async function handleConfirm() {
  const parsed = createVistoriaSchema.safeParse({
    tipo: data.value.tipo,
    combustivel_nivel: data.value.combustivel_nivel,
    km_registrado: data.value.km_registrado,
    observacoes: data.value.observacoes || null,
    data_vistoria: data.value.data_vistoria,
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

  try {
    await submit(async () => {
      await vistoriaService.create(props.locacaoId, parsed.data)
      uiStore.notify('success', 'Vistoria registrada com sucesso.')
      emit('created')
      handleClose()
    })
  } catch (err) {
    const axiosError = err as AxiosError<{ errors?: Record<string, string[]> }>
    if (axiosError.response?.status !== 422) {
      uiStore.notify('error', 'Erro ao registrar vistoria.')
    }
  }
}
</script>

<template>
  <AppModal :open="visible" title="Nova Vistoria" max-width="md" @close="handleClose">
    <form class="space-y-4" @submit.prevent="handleConfirm">
      <AppSelect
        v-model="data.tipo"
        label="Tipo"
        :options="TIPO_OPCOES"
        placeholder="Selecione o tipo"
        required
        :error="errors.tipo"
      />
      <AppSelect
        v-model="data.combustivel_nivel"
        label="Nível de Combustível"
        :options="COMBUSTIVEL_OPCOES"
        placeholder="Selecione o nível"
        required
        :error="errors.combustivel_nivel"
      />
      <AppInput
        v-model="data.km_registrado"
        type="number"
        label="KM Registrado"
        required
        :error="errors.km_registrado"
      />
      <AppInput
        v-model="data.data_vistoria"
        type="date"
        label="Data da Vistoria"
        required
        :error="errors.data_vistoria"
      />
      <AppInput
        v-model="data.observacoes"
        label="Observações"
        placeholder="Observações (opcional)"
        :error="errors.observacoes"
      />
      <div class="mt-6 flex justify-end gap-2">
        <AppButton type="button" variant="ghost" @click="handleClose">Cancelar</AppButton>
        <AppButton type="submit" variant="primary" :loading="processing">Registrar</AppButton>
      </div>
    </form>
  </AppModal>
</template>
