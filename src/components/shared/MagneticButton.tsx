'use client'
import { useRef, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit'
}

export default function MagneticButton({ children, className = '', onClick, href, type = 'button' }: Props) {
  const ref = useRef<HTMLElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.25
    const dy = (e.clientY - cy) * 0.25
    el.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0,0) scale(1)'
    el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)'
  }

  const handleMouseEnter = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.1s ease'
  }

  const sharedProps = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    className,
    style: { transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)' },
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href || !href.startsWith('#')) return
    e.preventDefault()
    const el = document.querySelector(href)
    if (!el) return
    const lenis = (window as unknown as Record<string, unknown>).__lenis as { scrollTo: (el: Element, opts: object) => void } | undefined
    if (lenis) lenis.scrollTo(el, { duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  if (href) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} onClick={handleClick} {...sharedProps}>
        {children}
      </a>
    )
  }

  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} {...sharedProps}>
      {children}
    </button>
  )
}
