<script setup lang="ts">
import { computed } from 'vue'

type LocacaoStatus = 'reservada' | 'ativa' | 'finalizada' | 'cancelada'
type PagamentoStatus = 'pendente' | 'pago' | 'cancelado'
type BadgeStatus = LocacaoStatus | PagamentoStatus

interface Props {
  status: BadgeStatus
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
})

const statusClasses: Record<BadgeStatus, string> = {
  reservada: 'bg-amber-100 text-amber-800',
  ativa: 'bg-blue-100 text-blue-800',
  finalizada: 'bg-emerald-100 text-emerald-800',
  cancelada: 'bg-red-100 text-red-800',
  pendente: 'bg-amber-100 text-amber-800',
  pago: 'bg-emerald-100 text-emerald-800',
  cancelado: 'bg-red-100 text-red-800',
}

const displayLabel = computed(() => {
  if (props.label) return props.label
  return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})

const statusClass = computed(() => {
  return statusClasses[props.status] ?? 'bg-surface-100 text-surface-700'
})
</script>

<template>
  <span
  :class="[
    'inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
    statusClass,
  ]"
  >
    {{ displayLabel }}
  </span>
</template>
