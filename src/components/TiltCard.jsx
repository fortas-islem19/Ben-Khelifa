import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'

/** Card that tilts in 3D and catches a soft light under the pointer. */
export default function TiltCard({ children, className = '', ...rest }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 200, damping: 20 })
  const lx = useTransform(mx, (v) => `${v * 100}%`)
  const ly = useTransform(my, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${lx} ${ly}, rgba(255,255,255,0.35), transparent 55%)`

  return (
    <motion.article
      className={`tilt ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
      }}
      onPointerLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
      {...rest}
    >
      {children}
      <motion.span className="tilt__glare" style={{ background: glare }} aria-hidden="true" />
    </motion.article>
  )
}
