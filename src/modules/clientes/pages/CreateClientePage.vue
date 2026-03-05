<script setup lang="ts">
import { useRouter } from 'vue-router'
import z from 'zod'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import { useForm } from '@/composables/useForm'
import { clienteService } from '@/modules/clientes/services/cliente.service'
import { createClienteSchema } from '@/modules/clientes/dtos/cliente.dto'
import { useUiStore } from '@/stores/ui.store'

const router = useRouter()
const uiStore = useUiStore()
const { data, errors, processing, submit } = useForm({ nome: '' })

async function handleSubmit() {
  const parsed = createClienteSchema.safeParse(data.value)
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
    await clienteService.create(formData)
    uiStore.notify('success', 'Cliente criado com sucesso.')
    router.push({ name: 'clientes' })
  })
}
</script>

<template>
  <div>
    <nav class="mb-6 flex items-center gap-2 text-sm text-gray-600">
      <RouterLink :to="{ name: 'clientes' }" class="hover:text-primary-600">Clientes</RouterLink>
      <span>/</span>
      <span class="font-medium text-gray-900">Novo Cliente</span>
    </nav>

    <div class="rounded-xl bg-white p-6 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <AppInput
          v-model="data.nome"
          label="Nome"
          placeholder="Nome do cliente"
          required
          :error="errors.nome"
        />

        <div class="flex gap-2 pt-4">
          <AppButton type="submit" :loading="processing"> Salvar </AppButton>
          <AppButton type="button" variant="secondary" @click="router.push({ name: 'clientes' })">
            Cancelar
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
