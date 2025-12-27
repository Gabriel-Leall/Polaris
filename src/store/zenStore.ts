import { create } from 'zustand'

const DEFAULT_DURATION = 25 * 60 // 25 minutes in seconds

interface ZenStore {
  // Zen Mode state
  isZenMode: boolean
  toggleZenMode: () => void
  setZenMode: (enabled: boolean) => void
  
  // Timer state
  timeRemaining: number
  isTimerRunning: boolean
  initialDuration: number
  
  // Timer actions
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  tick: () => void
  setDuration: (seconds: number) => void
}

export const useZenStore = create<ZenStore>()((set) => ({
  // Zen Mode state
  isZenMode: false,
  toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
  setZenMode: (enabled: boolean) => set({ isZenMode: enabled }),
  
  // Timer state
  timeRemaining: DEFAULT_DURATION,
  isTimerRunning: false,
  initialDuration: DEFAULT_DURATION,
  
  // Timer actions
  startTimer: () => set({ isTimerRunning: true }),
  
  stopTimer: () => set({ isTimerRunning: false }),
  
  resetTimer: () => set((state) => ({
    timeRemaining: state.initialDuration,
    isTimerRunning: false,
  })),
  
  tick: () => set((state) => {
    if (!state.isTimerRunning || state.timeRemaining <= 0) {
      return state
    }
    const newTimeRemaining = state.timeRemaining - 1
    // Auto-stop when timer reaches zero
    if (newTimeRemaining <= 0) {
      return { timeRemaining: 0, isTimerRunning: false }
    }
    return { timeRemaining: newTimeRemaining }
  }),
  
  setDuration: (seconds: number) => set({
    initialDuration: seconds,
    timeRemaining: seconds,
    isTimerRunning: false,
  }),
}))