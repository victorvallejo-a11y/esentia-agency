'use client'
import { useEffect, useRef, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale'
}

export default function RevealOnScroll({ children, className = '', delay = 0, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const getInitial = () => {
      switch (direction) {
        case 'left': return 'translateX(-40px)'
        case 'right': return 'translateX(40px)'
        case 'scale': return 'scale(0.9) translateY(20px)'
        default: return 'translateY(30px)'
      }
    }

    el.style.opacity = '0'
    el.style.transform = getInitial()
    el.style.transition = `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1'
        el.style.transform = direction === 'scale' ? 'scale(1) translateY(0)' : 'translateY(0) translateX(0)'
      } else {
        el.style.opacity = '0'
        el.style.transform = getInitial()
      }
    }, { threshold: 0.15 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, direction])

  return <div ref={ref} className={className}>{children}</div>
}
