import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white py-8 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Marca */}
        <p className="font-inter font-semibold text-[12px] tracking-[0.06em] uppercase text-white/50">
          ESENTIA AGENCY
        </p>

        {/* Copyright */}
        <p className="text-[11px] font-inter text-white/20 text-center">
          © 2026 Esentia Agency. Todos los derechos reservados.
        </p>

        {/* Legal */}
        <div className="flex items-center gap-4">
          {[
            { label: 'Privacidad', href: '/privacidad' },
            { label: 'Cookies',    href: '/cookies' },
            { label: 'Legal',      href: '/legal' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="text-[11px] font-inter text-white/20 hover:text-white/50 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

      </div>
    </footer>
  )
}
