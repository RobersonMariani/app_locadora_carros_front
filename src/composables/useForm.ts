import { ref, type Ref } from 'vue'
import type { AxiosError } from 'axios'
import type { ApiValidationError } from '@/types/api.types'

export function useForm<T extends Record<string, unknown>>(initialData: T) {
  const data = ref({ ...initialData }) as Ref<T>
  const errors = ref<Record<string, string>>({})
  const processing = ref(false)

  function reset() {
    data.value = { ...initialData } as T
    errors.value = {}
  }

  function clearErrors() {
    errors.value = {}
  }

  function setErrors(err: unknown) {
    const axiosError = err as AxiosError<ApiValidationError>

    if (axiosError.response?.status === 422 && axiosError.response.data?.errors) {
      const serverErrors = axiosError.response.data.errors
      const mapped: Record<string, string> = {}

      for (const [field, messages] of Object.entries(serverErrors)) {
        mapped[field] = messages[0] ?? ''
      }

      errors.value = mapped
    }
  }

  async function submit(callback: (formData: T) => Promise<void>) {
    processing.value = true
    clearErrors()

    try {
      await callback(data.value)
    } catch (err) {
      setErrors(err)
      throw err
    } finally {
      processing.value = false
    }
  }

  return { data, errors, processing, reset, clearErrors, setErrors, submit }
}
