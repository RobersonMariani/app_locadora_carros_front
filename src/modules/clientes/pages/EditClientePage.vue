<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import z from 'zod'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import { useForm } from '@/composables/useForm'
import { clienteService } from '@/modules/clientes/services/cliente.service'
import { updateClienteSchema } from '@/modules/clientes/dtos/cliente.dto'
import { useUiStore } from '@/stores/ui.store'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()
const { data, errors, processing, submit, reset } = useForm({ nome: '' })

const id = computed(() => Number(route.params.id))

async function loadCliente() {
  const { data: cliente } = await clienteService.show(id.value)
  reset()
  data.value.nome = cliente.nome
}

async function handleSubmit() {
  const parsed = updateClienteSchema.safeParse(data.value)
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
    await clienteService.update(id.value, formData)
    uiStore.notify('success', 'Cliente atualizado com sucesso.')
    router.push({ name: 'clientes' })
  })
}

onMounted(loadCliente)
</script>

<template>
  <div>
    <nav class="mb-6 flex items-center gap-2 text-sm text-surface-500">
      <RouterLink :to="{ name: 'clientes' }" class="hover:text-primary-600">Clientes</RouterLink>
      <ChevronRightIcon class="h-3 w-3 text-surface-400" />
      <span class="font-semibold text-surface-900">Editar Cliente</span>
    </nav>

    <div class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
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
