<script setup lang="ts">
import { useRouter } from 'vue-router'
import z from 'zod'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useForm } from '@/composables/useForm'
import { clienteService } from '@/modules/clientes/services/cliente.service'
import { createClienteSchema } from '@/modules/clientes/dtos/cliente.dto'
import { useUiStore } from '@/stores/ui.store'

const UF_OPCOES = [
  { value: 'AC', label: 'AC' },
  { value: 'AL', label: 'AL' },
  { value: 'AP', label: 'AP' },
  { value: 'AM', label: 'AM' },
  { value: 'BA', label: 'BA' },
  { value: 'CE', label: 'CE' },
  { value: 'DF', label: 'DF' },
  { value: 'ES', label: 'ES' },
  { value: 'GO', label: 'GO' },
  { value: 'MA', label: 'MA' },
  { value: 'MG', label: 'MG' },
  { value: 'MS', label: 'MS' },
  { value: 'MT', label: 'MT' },
  { value: 'PA', label: 'PA' },
  { value: 'PB', label: 'PB' },
  { value: 'PE', label: 'PE' },
  { value: 'PI', label: 'PI' },
  { value: 'PR', label: 'PR' },
  { value: 'RJ', label: 'RJ' },
  { value: 'RN', label: 'RN' },
  { value: 'RS', label: 'RS' },
  { value: 'RO', label: 'RO' },
  { value: 'RR', label: 'RR' },
  { value: 'SC', label: 'SC' },
  { value: 'SP', label: 'SP' },
  { value: 'SE', label: 'SE' },
  { value: 'TO', label: 'TO' },
]

const router = useRouter()
const uiStore = useUiStore()
const { data, errors, processing, submit } = useForm({
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  data_nascimento: '',
  cnh: '',
  endereco: '',
  cidade: '',
  estado: '',
  cep: '',
})

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
    const payload = {
      ...formData,
      email: formData.email || undefined,
      telefone: formData.telefone || undefined,
      data_nascimento: formData.data_nascimento || undefined,
      cnh: formData.cnh || undefined,
      endereco: formData.endereco || undefined,
      cidade: formData.cidade || undefined,
      estado: formData.estado || undefined,
      cep: formData.cep || undefined,
    }
    await clienteService.create(payload)
    uiStore.notify('success', 'Cliente criado com sucesso.')
    router.push({ name: 'clientes' })
  })
}
</script>

<template>
  <div>
    <nav class="mb-6 flex items-center gap-2 text-sm text-surface-500">
      <RouterLink :to="{ name: 'clientes' }" class="hover:text-primary-600">Clientes</RouterLink>
      <ChevronRightIcon class="h-3 w-3 text-surface-400" />
      <span class="font-semibold text-surface-900">Novo Cliente</span>
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
        <AppInput
          v-model="data.endereco"
          label="Endereço"
          placeholder="Rua, número, complemento"
          :error="errors.endereco"
        />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AppInput
            v-model="data.cidade"
            label="Cidade"
            placeholder="Cidade"
            :error="errors.cidade"
          />
          <AppSelect
            v-model="data.estado"
            label="Estado"
            placeholder="UF"
            :options="UF_OPCOES"
            :error="errors.estado"
          />
        </div>
        <AppInput
          v-model="data.cep"
          label="CEP"
          placeholder="00000-000"
          :error="errors.cep"
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
