import type { Variants } from 'framer-motion'

export const variants = {
  stagger: {
    visible: { transition: { staggerChildren: 0.5 } },
  },
  line: <Variants>{
    hidden: { pathLength: 0 },
    visible: { pathLength: 1, transition: { ease: 'linear' } },
  },
  opacity: <Variants>{
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeOpacity: <Variants>{
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 1, ease: 'linear' } },
  },
  randoms: {
    float: (y?: [number, number], delay?: [number, number]): Variants => {
      delay = delay || [0, 1]
      y = y || [-10, 10]
      return {
        animate: {
          y: [random(y), random(y)],
          transition: {
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 1,
            delay: random(delay),
          },
        },
      }
    },
  },
}

function random(range: [number, number]) {
  return Math.random() * (range[1] - range[0]) + range[0]
}
