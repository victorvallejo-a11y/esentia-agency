import { Btn, Logo } from './ui'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-cta rv">
          <p>
            ¿Buscamos <em>tu cuello de botella?</em>
          </p>
          <Btn href="#agenda">Reservar diagnóstico gratis</Btn>
        </div>
        <div className="foot-row">
          <Logo />
          <nav aria-label="Legal">
            <a href="/privacidad">Privacidad</a>
            <a href="/cookies">Cookies</a>
            <a href="/legal">Aviso legal</a>
            <button type="button" className="foot-ck" data-open-consent>
              Preferencias de cookies
            </button>
          </nav>
          <span>© {new Date().getFullYear()} Esentia Agency · Barcelona</span>
        </div>
      </div>
    </footer>
  )
}
