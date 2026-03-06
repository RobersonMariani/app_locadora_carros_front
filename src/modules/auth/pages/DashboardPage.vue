<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
  WrenchScrewdriverIcon,
  ExclamationCircleIcon,
  BellAlertIcon,
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)

const resumo = ref<{
  total_marcas?: number
  total_modelos?: number
  total_carros?: number
  total_clientes?: number
  carros_disponiveis?: number
  carros_locados?: number
  carros_em_manutencao?: number
  taxa_ocupacao?: number
  locacoes_ativas?: number
  locacoes_reservadas?: number
  locacoes_atrasadas?: number
  faturamento_mes?: number
  total_multas_pendentes?: number
  valor_multas_pendentes?: number
  total_a_receber?: number
  total_recebido_mes?: number
  manutencoes_proximas?: number
  alertas_nao_lidos?: number
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

interface CardConfig {
  key: string
  title: string
  icon: typeof TruckIcon
  color: string
  getValue: (r: NonNullable<typeof resumo.value>) => number | string
  format?: (v: number) => string
  badgeDanger?: (r: NonNullable<typeof resumo.value>) => boolean
  badgeWarning?: (r: NonNullable<typeof resumo.value>) => boolean
  linkTo?: string
}

const frotaCards: CardConfig[] = [
  { key: 'total_carros', title: 'Total de Carros', icon: TruckIcon, color: 'primary', getValue: (r) => r.total_carros ?? 0 },
  { key: 'carros_disponiveis', title: 'Carros Disponíveis', icon: CheckCircleIcon, color: 'success', getValue: (r) => r.carros_disponiveis ?? 0 },
  { key: 'carros_locados', title: 'Carros Locados', icon: XCircleIcon, color: 'warning', getValue: (r) => r.carros_locados ?? 0 },
  { key: 'carros_em_manutencao', title: 'Carros em Manutenção', icon: WrenchScrewdriverIcon, color: 'warning', getValue: (r) => r.carros_em_manutencao ?? 0 },
  { key: 'taxa_ocupacao', title: 'Taxa de Ocupação', icon: CubeIcon, color: 'primary', getValue: (r) => r.taxa_ocupacao ?? 0, format: (v) => `${v}%` },
]

const financeiroCards: CardConfig[] = [
  { key: 'faturamento_mes', title: 'Faturamento do Mês', icon: BanknotesIcon, color: 'success', getValue: (r) => r.faturamento_mes ?? 0, format: formatarMoeda },
  { key: 'total_a_receber', title: 'Total a Receber', icon: BanknotesIcon, color: 'primary', getValue: (r) => r.total_a_receber ?? 0, format: formatarMoeda },
  { key: 'total_recebido_mes', title: 'Recebido no Mês', icon: BanknotesIcon, color: 'success', getValue: (r) => r.total_recebido_mes ?? 0, format: formatarMoeda },
]

const atencaoCards: CardConfig[] = [
  { key: 'locacoes_atrasadas', title: 'Locações Atrasadas', icon: ExclamationCircleIcon, color: 'danger', getValue: (r) => r.locacoes_atrasadas ?? 0, badgeDanger: (r) => (r.locacoes_atrasadas ?? 0) > 0 },
  { key: 'total_multas_pendentes', title: 'Multas Pendentes', icon: BanknotesIcon, color: 'warning', getValue: (r) => r.total_multas_pendentes ?? 0 },
  { key: 'valor_multas_pendentes', title: 'Valor Multas Pendentes', icon: BanknotesIcon, color: 'warning', getValue: (r) => r.valor_multas_pendentes ?? 0, format: formatarMoeda },
  { key: 'manutencoes_proximas', title: 'Manutenções Próximas', icon: WrenchScrewdriverIcon, color: 'warning', getValue: (r) => r.manutencoes_proximas ?? 0, badgeWarning: (r) => (r.manutencoes_proximas ?? 0) > 0 },
  { key: 'alertas_nao_lidos', title: 'Alertas Não Lidos', icon: BellAlertIcon, color: 'primary', getValue: (r) => r.alertas_nao_lidos ?? 0, badgeDanger: (r) => (r.alertas_nao_lidos ?? 0) > 0, linkTo: 'alertas' },
]

const colorClasses: Record<string, { bg: string; icon: string; shadow: string }> = {
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600', shadow: 'shadow-primary-600/20' },
  success: { bg: 'bg-success-50', icon: 'text-success-600', shadow: 'shadow-success-600/20' },
  warning: { bg: 'bg-warning-50', icon: 'text-warning-600', shadow: 'shadow-warning-600/20' },
  accent: { bg: 'bg-primary-50', icon: 'text-accent-600', shadow: 'shadow-accent-600/20' },
  danger: { bg: 'bg-danger-50', icon: 'text-danger-600', shadow: 'shadow-danger-600/20' },
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

    <!-- Seção 2: Frota -->
    <section class="mb-10">
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-surface-400">
        Frota
      </h2>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 5" :key="i" class="h-32 animate-pulse rounded-2xl bg-surface-100" />
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="card in frotaCards"
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
              'bg-danger-500': card.color === 'danger',
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
                {{ resumo ? (card.format ? card.format(Number(card.getValue(resumo))) : card.getValue(resumo)) : '—' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção 3: Financeiro -->
    <section class="mb-10">
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-surface-400">
        Financeiro
      </h2>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 3" :key="i" class="h-32 animate-pulse rounded-2xl bg-surface-100" />
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="card in financeiroCards"
          :key="card.key"
          class="group relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div
            class="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.07] transition-transform duration-300 group-hover:scale-150"
            :class="{
              'bg-primary-500': card.color === 'primary',
              'bg-success-500': card.color === 'success',
              'bg-warning-500': card.color === 'warning',
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
                {{ resumo ? (card.format ? card.format(Number(card.getValue(resumo))) : card.getValue(resumo)) : '—' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção 4: Atenção -->
    <section class="mb-10">
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-surface-400">
        Atenção
      </h2>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 5" :key="i" class="h-32 animate-pulse rounded-2xl bg-surface-100" />
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="card in atencaoCards"
          :key="card.key"
          :class="[
            'group relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl',
            card.linkTo && 'cursor-pointer',
          ]"
          role="button"
          tabindex="0"
          @click="card.linkTo ? router.push({ name: card.linkTo }) : undefined"
          @keydown.enter="card.linkTo ? router.push({ name: card.linkTo }) : undefined"
        >
          <div
            class="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.07] transition-transform duration-300 group-hover:scale-150"
            :class="{
              'bg-primary-500': card.color === 'primary',
              'bg-warning-500': card.color === 'warning',
              'bg-danger-500': card.color === 'danger',
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
              <p class="flex items-center gap-2 text-sm font-medium text-surface-500">
                {{ card.title }}
                <span
                  v-if="resumo && card.badgeDanger?.(resumo)"
                  class="rounded-full bg-danger-500 px-2 py-0.5 text-[10px] font-bold text-white"
                >
                  !
                </span>
                <span
                  v-if="resumo && card.badgeWarning?.(resumo)"
                  class="rounded-full bg-warning-500 px-2 py-0.5 text-[10px] font-bold text-white"
                >
                  !
                </span>
              </p>
              <p class="mt-1 text-2xl font-bold text-surface-900">
                {{ resumo ? (card.format ? card.format(Number(card.getValue(resumo))) : card.getValue(resumo)) : '—' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção 5: Locações por Status -->
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

    <!-- Seção 6: Faturamento Mensal -->
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
