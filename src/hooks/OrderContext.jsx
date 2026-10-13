import { createContext, useContext, useMemo, useState } from 'react'
import { findCake } from '../data/cakes'
import { useOrder } from './useOrder'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const orderApi = useOrder()
  const [step, setStep] = useState(0)

  const value = useMemo(() => {
    /** Pre-selects a model from anywhere on the page and brings the form into view. */
    const startOrder = (cakeId) => {
      if (cakeId) orderApi.selectCake(cakeId)
      // Models know their occasion and jump straight to customization
      setStep(cakeId && findCake(cakeId)?.occasion ? 1 : 0)
      document.getElementById('commander')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    return { ...orderApi, step, setStep, startOrder }
  }, [orderApi, step])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrderContext() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrderContext must be used inside <OrderProvider>')
  return ctx
}
