import { useReducedMotion, type Transition } from 'framer-motion'

export const motionTokens = {
  fast: { duration: 0.18, ease: 'easeOut' as const },
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  exit: { duration: 0.16, ease: 'easeIn' as const },
}

export function useReducedMotionTransition(transition: Transition) {
  const shouldReduceMotion = useReducedMotion()
  return shouldReduceMotion ? { ...transition, duration: 0.01 } : transition
}

export const fadeScale = {
  initial: { opacity: 0, scale: 0.98, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 8 },
}

export const slideInRight = {
  initial: { opacity: 0, x: '100%' },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: '100%' },
}

export const dropdownMotion = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
}

export const staggerList = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
}

export const accordionHeight = (open: boolean) => ({
  initial: { height: 0, opacity: 0 },
  animate: { height: open ? 'auto' : 0, opacity: open ? 1 : 0 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.25, ease: 'easeInOut' },
})

export const stepSlide = (dir: number) => ({
  initial: { opacity: 0, x: dir > 0 ? 40 : -40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: dir > 0 ? -40 : 40 },
})
