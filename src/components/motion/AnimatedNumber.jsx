import { animate } from 'motion/react'
import { useEffect, useRef } from 'react'

/** Number that counts smoothly to its new value. */
export default function AnimatedNumber({ value, format = (n) => Math.round(n).toString(), duration = 0.6 }) {
  const ref = useRef(null)
  const from = useRef(value)

  useEffect(() => {
    const controls = animate(from.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => {
        from.current = v
        if (ref.current) ref.current.textContent = format(v)
      },
    })
    return () => controls.stop()
  }, [value, format, duration])

  return <span ref={ref}>{format(value)}</span>
}
