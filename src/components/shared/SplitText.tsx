'use client'

import React, { useRef } from 'react'
import { motion, useInView, Variants } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
  mode?: 'words' | 'chars'
  once?: boolean
}

const charVariants: Variants = {
  hidden: { opacity: 0, y: '110%', rotateX: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: '0%',
    rotateX: 0,
    transition: { delay: i * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function SplitText({ text, className = '', style, mode = 'words', once = true }: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, margin: '-10% 0px' })

  if (mode === 'chars') {
    return (
      <span ref={ref} className={`inline-block overflow-hidden ${className}`} aria-label={text}>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {text.split('').map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={charVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="inline-block"
              style={{ willChange: 'transform' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>
      </span>
    )
  }

  return (
    <span ref={ref} className={className} style={style} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex flex-wrap gap-x-[0.25em]">
        {text.split(' ').map((word, i) => (
          <span key={i} className="overflow-hidden inline-block">
            <motion.span
              custom={i}
              variants={wordVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="inline-block"
              style={{ willChange: 'transform' }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  )
}
