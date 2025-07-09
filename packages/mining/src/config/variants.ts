import type { Variants } from 'framer-motion'

export const variants = {
  stagger: {
    visible: {
      transition: {
        staggerChildren: 1,

      },
    },
  } as Variants,
  diffuse: (size: number): Variants => ({
    hidden: {
      opacity: 1,
      width: 0,
      height: 0,
    },
    visible: custom => ({
      width: size,
      height: size,
      opacity: [0, 0.5, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        delay: custom * 0.2,
      },
    }),
  }),
}
