import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

export function formatDate(date: string | null | undefined): string {
  if (!date) return '-'
  return dayjs(date).format('DD/MM/YYYY')
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '-'
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

export function formatDateISO(date: string): string {
  return dayjs(date).format('YYYY-MM-DD')
}
