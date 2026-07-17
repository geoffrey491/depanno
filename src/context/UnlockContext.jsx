import { createContext, useContext, useState } from 'react'

const UnlockContext = createContext(null)

export function UnlockProvider({ children }) {
  const [unlocked, setUnlocked] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const unlock = (plan) => {
    setSelectedPlan(plan)
    setUnlocked(true)
  }

  const reset = () => {
    setUnlocked(false)
    setSelectedPlan(null)
  }

  return (
    <UnlockContext.Provider value={{ unlocked, selectedPlan, unlock, reset }}>
      {children}
    </UnlockContext.Provider>
  )
}

export function useUnlock() {
  return useContext(UnlockContext)
}
