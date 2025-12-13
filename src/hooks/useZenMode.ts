import { useZenStore } from '@/store/zenStore'

export const useZenMode = () => {
  const { isZenMode, toggleZenMode, setZenMode } = useZenStore()
  
  return {
    isZenMode,
    toggleZenMode,
    setZenMode,
  }
}