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
const { data, errors, processing, submit, reset } = useForm({
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  data_nascimento: '',
  cnh: '',
})

const id = computed(() => Number(route.params.id))

async function loadCliente() {
  const { data: cliente } = await clienteService.show(id.value)
  reset()
  data.value.nome = cliente.nome
  data.value.cpf = cliente.cpf
  data.value.email = cliente.email ?? ''
  data.value.telefone = cliente.telefone ?? ''
  data.value.data_nascimento = cliente.data_nascimento ?? ''
  data.value.cnh = cliente.cnh ?? ''
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
    const payload = {
      ...formData,
      email: formData.email || undefined,
      telefone: formData.telefone || undefined,
      data_nascimento: formData.data_nascimento || undefined,
      cnh: formData.cnh || undefined,
    }
    await clienteService.update(id.value, payload)
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
        <AppInput
          v-model="data.cpf"
          label="CPF"
          placeholder="000.000.000-00"
          required
          :error="errors.cpf"
        />
        <AppInput
          v-model="data.email"
          label="Email"
          type="email"
          placeholder="email@exemplo.com"
          :error="errors.email"
        />
        <AppInput
          v-model="data.telefone"
          label="Telefone"
          placeholder="(00) 00000-0000"
          :error="errors.telefone"
        />
        <AppInput
          v-model="data.data_nascimento"
          label="Data de Nascimento"
          type="date"
          :error="errors.data_nascimento"
        />
        <AppInput
          v-model="data.cnh"
          label="CNH"
          placeholder="Número da CNH"
          :error="errors.cnh"
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
