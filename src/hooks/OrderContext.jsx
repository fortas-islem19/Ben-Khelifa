import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const initialOrder = {
  theme: '',
  size: '',
  date: '',
  time: '',
  flavor: '',
  cakeText: '',
  name: '',
  phone: '',
  notes: '',
}

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const [order, setOrder] = useState(initialOrder)
  const [step, setStep] = useState(0)

  const set = useCallback((field, value) => setOrder((o) => ({ ...o, [field]: value })), [])
  const reset = useCallback(() => setOrder(initialOrder), [])

  /** Brings the form into view; with a theme, pre-selects it and opens step 2. */
  const startOrder = useCallback((themeId) => {
    if (themeId) {
      setOrder((o) => ({ ...o, theme: themeId }))
      setStep(1)
    }
    document.getElementById('commander')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const value = useMemo(() => ({ order, set, reset, step, setStep, startOrder }), [order, set, reset, step, startOrder])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrderContext() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrderContext must be used inside <OrderProvider>')
  return ctx
}
