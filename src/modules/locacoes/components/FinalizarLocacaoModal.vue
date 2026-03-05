<script setup lang="ts">
import { watch } from 'vue'
import type { AxiosError } from 'axios'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useForm } from '@/composables/useForm'
import { useUiStore } from '@/stores/ui.store'
import { locacaoService } from '../services/locacao.service'

interface Props {
  open: boolean
  locacaoId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  finalizada: []
}>()

const uiStore = useUiStore()

const { data, errors, processing, submit, reset } = useForm({
  km_final: '' as string | number,
  data_final_realizado_periodo: '',
})

watch(
  () => props.open,
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
  const kmFinal = Number(data.value.km_final)
  const dataFinal = String(data.value.data_final_realizado_periodo).trim()

  if (kmFinal < 0 || !dataFinal) {
    errors.value = {
      km_final: kmFinal < 0 ? 'KM Final deve ser maior ou igual a 0' : '',
      data_final_realizado_periodo: !dataFinal ? 'Data de Devolução é obrigatória' : '',
    }
    return
  }

  try {
    await submit(async () => {
      await locacaoService.finalizar(props.locacaoId, {
        km_final: kmFinal,
        data_final_realizado_periodo: dataFinal,
      })
      emit('finalizada')
      handleClose()
    })
  } catch (err) {
    const axiosError = err as AxiosError<{ errors?: Record<string, string[]> }>
    if (axiosError.response?.status !== 422) {
      uiStore.notify('error', 'Erro ao finalizar locação.')
    }
  }
}
</script>

<template>
  <AppModal :open="open" title="Finalizar Locação" max-width="md" @close="handleClose">
    <form class="space-y-4" @submit.prevent="handleConfirm">
      <AppInput
        v-model="data.km_final"
        type="number"
        label="KM Final"
        required
        :error="errors.km_final"
      />
      <AppInput
        v-model="data.data_final_realizado_periodo"
        type="date"
        label="Data de Devolução"
        required
        :error="errors.data_final_realizado_periodo"
      />
      <div class="mt-6 flex justify-end gap-2">
        <AppButton type="button" variant="ghost" @click="handleClose">Cancelar</AppButton>
        <AppButton type="submit" variant="primary" :loading="processing">Finalizar</AppButton>
      </div>
    </form>
  </AppModal>
</template>
