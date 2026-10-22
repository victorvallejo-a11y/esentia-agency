import './home.css'
import './ios.css'
import './sistema.css'
import './caso.css'
import './metodo.css'
import Nav from '@/home/Nav'
import Hero from '@/home/Hero'
import Dato from '@/home/Dato'
import Sistema from '@/home/Sistema'
import Calculadora from '@/home/Calculadora'
import Sintomas from '@/home/Sintomas'
import Caso from '@/home/Caso'
import Metodo from '@/home/Metodo'
import Agenda from '@/home/Agenda'
import Dudas from '@/home/Dudas'
import Footer from '@/home/Footer'
import Pointer from '@/home/Pointer'
import Scenes from '@/home/Scenes'

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        {/* Acto oscuro: el dato, el sistema y la calculadora */}
        <div className="act">
          <Dato />
          <Sistema />
          <Calculadora />
          <div className="act-sun" aria-hidden="true" />
        </div>
        {/* La página crema sube por encima del negro como un amanecer */}
        <div className="sheet">
          <div className="dawn-edge" aria-hidden="true" />
          <Sintomas />
          <Caso />
          <Metodo />
          <Agenda />
          <Dudas />
        </div>
      </main>
      <Footer />
      <Pointer />
      <Scenes />
    </>
  )
}
