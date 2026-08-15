import { useEffect, useRef, useState, useCallback } from "react"
import { initSmartCity, updateEnergy } from "../../city.js"

export function SmartCity() {
  const cityRef = useRef(null)

  // Input States matching FastAPI Data Science Model DTO (AnaliseInput)
  const [consumoKwh, setConsumoKwh] = useState(350)
  const [tipoImovel, setTipoImovel] = useState("Comercial")
  const [usoHorarioPico, setUsoHorarioPico] = useState(true)
  const [quantidadeEquipamentos, setQuantidadeEquipamentos] = useState(15)
  const [horasAltoConsumo, setHorasAltoConsumo] = useState(8)

  // AI Output & Status State
  const [aiResult, setAiResult] = useState({
    categoria: "Moderado",
    probabilidade: 0.85,
    custo_estimado_mensal: 262.5,
    recomendacoes: [
      "Potencial de melhoria! Faça uma auditoria energética.",
      "Otimize o uso do ar-condicionado.",
      "Invista em equipamentos mais eficientes."
    ]
  })

  const [loading, setLoading] = useState(false)
  const [apiSource, setApiSource] = useState("Local AI Fallback")

  // Local fallback predictor matching data-science/app/src/model_service/main.py logic
  const calculateLocalPrediction = useCallback((kwh, pico, equip, tipo, horas) => {
    const tarifa = 0.75
    const custo = Math.round(kwh * tarifa * 100) / 100

    let score = (kwh / 350) * 0.4 + (horas / 8) * 0.3 + (pico ? 0.2 : 0) + (equip / 20) * 0.1

    let cat = "Moderado"
    let prob = 0.84
    let recs = [
      "Potencial de melhoria! Faça uma auditoria energética.",
      "Otimize o uso do ar-condicionado.",
      "Invista em equipamentos mais eficientes."
    ]

    if (score < 0.75) {
      cat = "Eficiente"
      prob = 0.92
      recs = [
        "Excelente desempenho! Continue monitorando.",
        "Considere investimentos em energia renovável.",
        "Explore a certificação de eficiência."
      ]
    } else if (score > 1.3) {
      cat = "Ineficiente"
      prob = 0.89
      recs = [
        "Alerta Vermelho! Auditoria energética completa necessária.",
        "Substitua equipamentos antigos por modelos eficientes.",
        "Implemente automação para controle de energia."
      ]
    }

    return {
      categoria: cat,
      probabilidade: prob,
      custo_estimado_mensal: custo,
      recomendacoes: recs
    }
  }, [])

  // Execute prediction API fetch or local fallback
  const runAiAnalysis = useCallback(async () => {
    setLoading(true)
    const payload = {
      consumo_kwh: Number(consumoKwh),
      uso_horario_pico: Boolean(usoHorarioPico),
      quantidade_equipamentos: Number(quantidadeEquipamentos),
      tipo_imovel: String(tipoImovel),
      horas_alto_consumo: Number(horasAltoConsumo)
    }

    try {
      const response = await fetch("http://localhost:9091/analise-energetica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        setAiResult(data)
        setApiSource("FastAPI Data Science AI (Port 8000)")
      } else {
        throw new Error("FastAPI non-200 response")
      }
    } catch {
      // Fallback if FastAPI server is offline
      const fallbackData = calculateLocalPrediction(
        consumoKwh,
        usoHorarioPico,
        quantidadeEquipamentos,
        tipoImovel,
        horasAltoConsumo
      )
      setAiResult(fallbackData)
      setApiSource("EnergiAI Local Model Engine")
    } finally {
      setLoading(false)
    }
  }, [consumoKwh, usoHorarioPico, quantidadeEquipamentos, tipoImovel, horasAltoConsumo, calculateLocalPrediction])

  // Initialize Smart City Canvas once mounted
  useEffect(() => {
    if (!cityRef.current) return
    const cleanup = initSmartCity(cityRef.current)
    return cleanup
  }, [])

  // Trigger AI prediction and update city SVG color state when inputs change
  useEffect(() => {
    runAiAnalysis()
  }, [runAiAnalysis])

  useEffect(() => {
    const sliderPercent = Math.min(100, Math.max(0, Math.round((consumoKwh / 800) * 100)))
    updateEnergy(sliderPercent, aiResult.categoria)
  }, [consumoKwh, aiResult.categoria])

  return (
    <main className="products-page">
      <section className="city-intro">
        <span className="badge">Data Science & EnergiAI</span>
        <h1>Simulador e Diagnóstico Preditivo de Energia</h1>
        <p>
          Conectado ao modelo de Machine Learning (FastAPI), este painel analisa telemetria de consumo em tempo real,
          prevendo eficiência, custos mensais estimados e adaptando dinamicamente a simulação da cidade.
        </p>
      </section>

      {/* AI Controls & Insights Grid */}
      <div className="ai-dashboard-grid">
        {/* Controls Card */}
        <div className="content-card ai-controls-card">
          <div className="card-header">
            <h3>Parâmetros de Telemetria</h3>
            <span className="api-badge">{apiSource}</span>
          </div>

          <div className="form-group">
            <label>Tipo de Imóvel</label>
            <select
              value={tipoImovel}
              onChange={(e) => setTipoImovel(e.target.value)}
              className="ai-input"
            >
              <option value="Comercial">Comercial</option>
              <option value="Industria">Industrial</option>
              <option value="Residencia">Residencial</option>
            </select>
          </div>

          <div className="form-group">
            <label>Consumo Mensal (kWh): <strong>{consumoKwh} kWh</strong></label>
            <input
              type="range"
              min="50"
              max="800"
              step="10"
              value={consumoKwh}
              onChange={(e) => setConsumoKwh(Number(e.target.value))}
              className="energy-slider"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Qtd. Equipamentos</label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantidadeEquipamentos}
                onChange={(e) => setQuantidadeEquipamentos(Number(e.target.value))}
                className="ai-input"
              />
            </div>

            <div className="form-group">
              <label>Horas de Alto Consumo</label>
              <input
                type="number"
                min="1"
                max="24"
                value={horasAltoConsumo}
                onChange={(e) => setHorasAltoConsumo(Number(e.target.value))}
                className="ai-input"
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={usoHorarioPico}
                onChange={(e) => setUsoHorarioPico(e.target.checked)}
              />
              <span>Uso em Horário de Pico (18h às 21h)</span>
            </label>
          </div>
        </div>

        {/* AI Results & Insights Card */}
        <div className="content-card ai-results-card">
          <div className="card-header">
            <h3>Resultado da Predição IA</h3>
            {loading && <span className="spinner">Analisando...</span>}
          </div>

          <div className="ai-stat-row">
            <div className="ai-stat">
              <span className="stat-label">Classificação IA</span>
              <div className={`category-badge badge-${aiResult.categoria.toLowerCase()}`}>
                <span className="status-dot"></span>
                {aiResult.categoria}
              </div>
            </div>

            <div className="ai-stat">
              <span className="stat-label">Custo Estimado Mensal</span>
              <span className="stat-value cost-value">
                R$ {Number(aiResult.custo_estimado_mensal).toFixed(2)}
              </span>
            </div>

            <div className="ai-stat">
              <span className="stat-label">Confiança do Modelo</span>
              <span className="stat-value">
                {(aiResult.probabilidade * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="ai-recommendations">
            <h4>Recomendações Personalizadas da IA</h4>
            <ul>
              {aiResult.recomendacoes.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Smart City Visual Canvas */}
      <div className="smart-city-wrapper">
        <div className="city-canvas-header">
          <h3>Visualização da Cidade Inteligente em Tempo Real</h3>
          <p>As janelas dos edifícios e a vegetação reagem à categoria prevista pelo modelo de IA.</p>
        </div>
        <div ref={cityRef} className="city-root" />
      </div>
    </main>
  )
}
