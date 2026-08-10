import { useEffect, useRef } from "react"
import { initSmartCity } from "../../city.js"

export function SmartCity() {
  const cityRef = useRef(null)

  useEffect(() => {
    if (!cityRef.current) return

    const cleanup = initSmartCity(cityRef.current)
    return cleanup
  }, [])

  return (
    <main className="products-page">
      <section className="city-intro">
        <h1>Nosso Produto</h1>
        <p>Explore a visualização da cidade inteligente e ajuste o consumo de energia para ver o efeito em tempo real.</p>
      </section>

      <div ref={cityRef} className="city-root" />
    </main>
  )
}
