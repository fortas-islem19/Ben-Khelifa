import { useCallback, useMemo, useReducer } from 'react'
import { findCake } from '../data/cakes'

export const initialOrder = {
  cakeId: '',
  occasion: '',
  size: '',
  shape: 'round',
  sponge: '',
  filling: '',
  finish: 'buttercream',
  colors: [],
  decorations: [],
  nameOnCake: '',
  age: '',
  message: '',
  designNotes: '',
  referenceImage: null,
  date: '',
  timeSlot: '',
  fulfillment: 'pickup',
  address: '',
  city: '',
  customer: { name: '', phone: '', email: '', referral: '', notes: '' },
  acceptTerms: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'set':
      return { ...state, [action.field]: action.value }
    case 'setCustomer':
      return { ...state, customer: { ...state.customer, [action.field]: action.value } }
    case 'toggle': {
      const list = state[action.field]
      if (list.includes(action.value)) return { ...state, [action.field]: list.filter((v) => v !== action.value) }
      if (action.max && list.length >= action.max) return state
      return { ...state, [action.field]: [...list, action.value] }
    }
    case 'selectCake': {
      const cake = findCake(action.cakeId)
      if (!cake) return state
      // Apply the model defaults, keep everything the customer already filled in
      return {
        ...state,
        cakeId: cake.id,
        occasion: state.occasion || cake.occasion || '',
        size: cake.defaultSize,
        finish: cake.defaultFinish,
      }
    }
    case 'reset':
      return initialOrder
    default:
      return state
  }
}

export function useOrder() {
  const [order, dispatch] = useReducer(reducer, initialOrder)

  const set = useCallback((field, value) => dispatch({ type: 'set', field, value }), [])
  const setCustomer = useCallback((field, value) => dispatch({ type: 'setCustomer', field, value }), [])
  const toggle = useCallback((field, value, max) => dispatch({ type: 'toggle', field, value, max }), [])
  const selectCake = useCallback((cakeId) => dispatch({ type: 'selectCake', cakeId }), [])
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  return useMemo(
    () => ({ order, set, setCustomer, toggle, selectCake, reset }),
    [order, set, setCustomer, toggle, selectCake, reset],
  )
}
