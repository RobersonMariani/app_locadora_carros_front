<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { dashboardService } from '@/modules/auth/services/dashboard.service'
import {
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon,
  PlayIcon,
  ClockIcon,
  BanknotesIcon,
  CubeIcon,
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const loading = ref(true)
const error = ref<string | null>(null)

const resumo = ref<{
  total_marcas: number
  total_modelos: number
  total_carros: number
  total_clientes: number
  carros_disponiveis: number
  carros_locados: number
  locacoes_ativas: number
  locacoes_reservadas: number
  faturamento_mes: number
} | null>(null)

const locacoesPorStatus = ref<Array<{ status: string; label: string; quantidade: number }>>([])
const faturamento = ref<Array<{ periodo: string; faturamento: number; quantidade_locacoes: number }>>([])

const dataAtual = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

function formatarPeriodo(periodo: string): string {
  if (/^\d{4}-\d{2}$/.test(periodo)) {
    const parts = periodo.split('-')
    const ano = parts[0] ?? '0'
    const mes = parts[1] ?? '0'
    const data = new Date(parseInt(ano, 10), parseInt(mes, 10) - 1)
    return data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  }
  return periodo
}

function isMesAtual(periodo: string): boolean {
  const hoje = new Date()
  const anoAtual = hoje.getFullYear()
  const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0')
  if (/^\d{4}-\d{2}$/.test(periodo)) {
    const parts = periodo.split('-')
    const ano = parts[0] ?? ''
    const mes = parts[1] ?? ''
    return ano === String(anoAtual) && mes === mesAtual
  }
  return false
}

function getStatusColor(status: string): { bg: string; text: string; border: string } {
  const s = status.toLowerCase()
  if (s === 'reservada') return { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-200' }
  if (s === 'ativa') return { bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200' }
  if (s === 'finalizada') return { bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-200' }
  if (s === 'cancelada') return { bg: 'bg-danger-50', text: 'text-danger-700', border: 'border-danger-200' }
  return { bg: 'bg-surface-50', text: 'text-surface-700', border: 'border-surface-200' }
}

const summaryCards = [
  {
    key: 'total_carros',
    title: 'Total de Carros',
    icon: TruckIcon,
    color: 'primary',
    getValue: (r: NonNullable<typeof resumo.value>) => r.total_carros,
  },
  {
    key: 'carros_disponiveis',
    title: 'Carros Disponíveis',
    icon: CheckCircleIcon,
    color: 'success',
    getValue: (r: NonNullable<typeof resumo.value>) => r.carros_disponiveis,
  },
  {
    key: 'carros_locados',
    title: 'Carros Locados',
    icon: XCircleIcon,
    color: 'warning',
    getValue: (r: NonNullable<typeof resumo.value>) => r.carros_locados,
  },
  {
    key: 'total_clientes',
    title: 'Total de Clientes',
    icon: UsersIcon,
    color: 'primary',
    getValue: (r: NonNullable<typeof resumo.value>) => r.total_clientes,
  },
  {
    key: 'locacoes_ativas',
    title: 'Locações Ativas',
    icon: PlayIcon,
    color: 'primary',
    getValue: (r: NonNullable<typeof resumo.value>) => r.locacoes_ativas,
  },
  {
    key: 'locacoes_reservadas',
    title: 'Locações Reservadas',
    icon: ClockIcon,
    color: 'warning',
    getValue: (r: NonNullable<typeof resumo.value>) => r.locacoes_reservadas,
  },
  {
    key: 'faturamento_mes',
    title: 'Faturamento do Mês',
    icon: BanknotesIcon,
    color: 'success',
    getValue: (r: NonNullable<typeof resumo.value>) => r.faturamento_mes,
    format: formatarMoeda,
  },
  {
    key: 'total_modelos',
    title: 'Total de Modelos',
    icon: CubeIcon,
    color: 'accent',
    getValue: (r: NonNullable<typeof resumo.value>) => r.total_modelos,
  },
]

const colorClasses: Record<string, { bg: string; icon: string; shadow: string }> = {
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600', shadow: 'shadow-primary-600/20' },
  success: { bg: 'bg-success-50', icon: 'text-success-600', shadow: 'shadow-success-600/20' },
  warning: { bg: 'bg-warning-50', icon: 'text-warning-600', shadow: 'shadow-warning-600/20' },
  accent: { bg: 'bg-primary-50', icon: 'text-accent-600', shadow: 'shadow-accent-600/20' },
}

async function carregarDados() {
  loading.value = true
  error.value = null
  try {
    const [resumoData, locacoesData, faturamentoData] = await Promise.all([
      dashboardService.getResumo(),
      dashboardService.getLocacoesPorStatus(),
      dashboardService.getFaturamento('mensal'),
    ])
    resumo.value = resumoData
    locacoesPorStatus.value = locacoesData
    faturamento.value = faturamentoData
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Erro ao carregar dados do dashboard.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  carregarDados()
})
</script>

<template>
  <div>
    <!-- Seção 1: Header com saudação -->
    <div class="mb-8 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 p-6 text-white shadow-xl shadow-primary-600/20 lg:p-8">
      <h1 class="text-2xl font-bold lg:text-3xl">
        Bem-vindo de volta, {{ auth.user?.name ?? 'Usuário' }}
      </h1>
      <p class="mt-2 text-sm opacity-90">{{ dataAtual }}</p>
      <p class="mt-1 text-sm opacity-75">Aqui está o resumo da sua locadora</p>
    </div>

    <!-- Erro -->
    <div
      v-if="error"
      class="mb-6 rounded-2xl border border-danger-200 bg-danger-50 px-4 py-3 text-danger-700"
    >
      {{ error }}
    </div>

    <!-- Seção 2: Cards de resumo -->
    <section class="mb-10">
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-surface-400">
        Resumo geral
      </h2>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="i in 8"
          :key="i"
          class="h-32 animate-pulse rounded-2xl bg-surface-100"
        />
      </div>

      <div
        v-else
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div
          v-for="card in summaryCards"
          :key="card.key"
          class="group relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div
            class="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.07] transition-transform duration-300 group-hover:scale-150"
            :class="{
              'bg-primary-500': card.color === 'primary',
              'bg-success-500': card.color === 'success',
              'bg-warning-500': card.color === 'warning',
              'bg-accent-500': card.color === 'accent',
            }"
          />
          <div class="relative flex items-start gap-4">
            <div
              :class="[
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                colorClasses[card.color]?.bg ?? 'bg-surface-100',
              ]"
            >
              <component
                :is="card.icon"
                :class="['h-6 w-6', colorClasses[card.color]?.icon ?? 'text-surface-600']"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-surface-500">{{ card.title }}</p>
              <p class="mt-1 text-2xl font-bold text-surface-900">
                {{ resumo ? (card.format ? card.format(card.getValue(resumo)) : card.getValue(resumo)) : '—' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção 3: Locações por Status -->
    <section class="mb-10">
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-surface-400">
        Locações por status
      </h2>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-24 animate-pulse rounded-2xl bg-surface-100"
        />
      </div>

      <div
        v-else
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div
          v-for="item in locacoesPorStatus"
          :key="item.status"
          :class="[
            'rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg',
            getStatusColor(item.status).bg,
            getStatusColor(item.status).border,
          ]"
        >
          <p :class="['text-sm font-medium', getStatusColor(item.status).text]">
            {{ item.label }}
          </p>
          <p class="mt-2 text-2xl font-bold text-surface-900">{{ item.quantidade }}</p>
        </div>
      </div>
    </section>

    <!-- Seção 4: Faturamento Mensal -->
    <section>
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-surface-400">
        Faturamento mensal
      </h2>

      <div v-if="loading" class="overflow-hidden rounded-2xl border border-surface-200 bg-white">
        <div class="animate-pulse space-y-3 p-6">
          <div v-for="i in 6" :key="i" class="h-10 rounded-lg bg-surface-100" />
        </div>
      </div>

      <div
        v-else
        class="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full min-w-[320px]">
            <thead>
              <tr class="border-b border-surface-200 bg-surface-50">
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Período
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Faturamento
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Locações
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in faturamento"
                :key="item.periodo"
                :class="[
                  'border-b border-surface-100 transition-colors last:border-b-0 hover:bg-surface-50',
                  isMesAtual(item.periodo) ? 'bg-primary-50/50' : '',
                ]"
              >
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'font-medium',
                      isMesAtual(item.periodo) ? 'text-primary-700' : 'text-surface-900',
                    ]"
                  >
                    {{ formatarPeriodo(item.periodo) }}
                    <span
                      v-if="isMesAtual(item.periodo)"
                      class="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700"
                    >
                      Atual
                    </span>
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-medium text-surface-900">
                  {{ formatarMoeda(item.faturamento) }}
                </td>
                <td class="px-6 py-4 text-right text-surface-600">
                  {{ item.quantidade_locacoes }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="faturamento.length === 0 && !loading" class="p-6 text-center text-surface-500">
          Nenhum dado de faturamento disponível.
        </p>
      </div>
    </section>
  </div>
</template>
