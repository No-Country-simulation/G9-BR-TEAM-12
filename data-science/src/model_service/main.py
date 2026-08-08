"""
Serviço de IA do Powerpolis / EnergiAI — expõe o modelo treinado via API HTTP com FastAPI.
Contrato interno com o Backend Java (Spring Boot): ver docs/contrato-api.md, seção 4.

Endpoints disponíveis:
- GET  /health   : Diagnóstico de saúde da API e verificação de carregamento do modelo.
- POST /predict  : Recebe os dados de consumo e retorna a classificação, probabilidade,
                   recomendações personalizadas e custo mensal estimado.
"""

import os
import joblib  # type: ignore[import-not-found]
import pandas as pd  # type: ignore[import-not-found]
from fastapi import FastAPI  # type: ignore[import-not-found]
from pydantic import BaseModel  # type: ignore[import-not-found]

# Inicialização da aplicação FastAPI
app = FastAPI(
    title="Powerpolis - Serviço de IA (EnergiAI)",
    description="API de predição de eficiência energética baseada no modelo scikit-learn treinado.",
    version="1.0.0"
)

# Caminho do modelo serializado (.pkl)
# Aceita a variável de ambiente MODEL_PATH ou usa caminhos padrão locais
MODEL_PATH = os.getenv("MODEL_PATH", "models/modelo_energiai_v1.pkl")

# Tarifa de referência padrão padronizada (R$ 0,75 / kWh) conforme edital EnergiAI
TARIFA_KWH = 0.75

# Mapeamento de rótulos numéricos do modelo scikit-learn para categorias legíveis
LABELS = {
    0: "Eficiente",
    1: "Moderado",
    2: "Ineficiente"
}

# Recomendações dinâmicas atreladas diretamente à categoria prevista pelo modelo
RECOMENDACOES_POR_CATEGORIA = {
    "Eficiente": [
        "Excelente desempenho! Continue monitorando.",
        "Considere investimentos em energia renovável.",
        "Explore a certificação de eficiência."
    ],
    "Moderado": [
        "Potencial de melhoria! Faça uma auditoria energética.",
        "Otimize o uso do ar-condicionado.",
        "Invista em equipamentos mais eficientes."
    ],
    "Ineficiente": [
        "Alerta Vermelho! Auditoria energética completa necessária.",
        "Substitua equipamentos antigos por modelos eficientes.",
        "Implemente automação para controle de energia."
    ]
}

# Variável global privada para armazenar o modelo em memória
_modelo = None


# DTO (Data Transfer Object) de entrada: validação de dados via Pydantic
class AnaliseInput(BaseModel):
    consumo_kwh: float
    uso_horario_pico: bool
    quantidade_equipamentos: int
    tipo_imovel: str
    horas_alto_consumo: float


# DTO de saída: formato exato da resposta JSON negociado com o Backend Java
class AnalisePrediction(BaseModel):
    categoria: str
    probabilidade: float
    recomendacoes: list[str]
    custo_estimado_mensal: float


@app.on_event("startup")
def carregar_modelo() -> None:
    """
    Roda automaticamente quando a API é iniciada.
    Carrega o modelo do arquivo .pkl para a memória global apenas UMA vez,
    garantindo respostas ultra-rápidas a cada requisição HTTP.
    """
    global _modelo

    # Tenta carregar no caminho configurado ou em caminhos alternativos conhecidos
    caminhos_para_testar = [
        MODEL_PATH,
        "models/modelo_energiai_v1.pkl",
        "../models/modelo_energiai_v1.pkl",
        "data-science/models/modelo_energiai_v1.pkl"
    ]

    for caminho in caminhos_para_testar:
        if os.path.exists(caminho):
            try:
                _modelo = joblib.load(caminho)
                print(f"[OK] Modelo de IA carregado com sucesso a partir de: {caminho}")
                return
            except Exception as e:
                print(f"[AVISO] Erro ao carregar modelo em {caminho}: {e}")

    print("[AVISO] Nenhum arquivo de modelo .pkl foi encontrado. O serviço funcionará no modo FALLBACK (predição fixa).")
    _modelo = None


def _montar_features(dados: AnaliseInput) -> pd.DataFrame:
    """
    Engenharia de Recursos (Feature Engineering):
    Transforma os 5 campos recebidos da requisição HTTP na matriz de 8 colunas
    exatas exigidas pelo modelo scikit-learn treinado (modelo.feature_names_in_).

    Ordem estrita das 8 colunas:
    1. quantidade_equipamentos
    2. horas_alto_consumo
    3. uso_horario_pico (1/0)
    4. categoria_imovel_Comercial (1/0)
    5. categoria_imovel_Industrial (1/0)
    6. categoria_imovel_Residencial (1/0)
    7. uso_horario_pico_x_horas_alto_consumo (interação)
    8. quantidade_equipamentos_x_horas_alto_consumo (interação)
    """
    pico = int(dados.uso_horario_pico)
    horas = dados.horas_alto_consumo
    equipamentos = dados.quantidade_equipamentos

    # Normalização e One-Hot Encoding para tipo_imovel
    tipo = dados.tipo_imovel.strip().capitalize() if dados.tipo_imovel else ""
    is_comercial = 1 if tipo == "Comercial" else 0
    is_industrial = 1 if tipo == "Industria" or tipo == "Industrial" else 0
    is_residencial = 1 if tipo in ("Residencia", "Residencial", "Casa", "Apartamento") else 0

    linha = {
        "quantidade_equipamentos": equipamentos,
        "horas_alto_consumo": horas,
        "uso_horario_pico": pico,
        "categoria_imovel_Comercial": is_comercial,
        "categoria_imovel_Industrial": is_industrial,
        "categoria_imovel_Residencial": is_residencial,
        "uso_horario_pico_x_horas_alto_consumo": pico * horas,
        "quantidade_equipamentos_x_horas_alto_consumo": equipamentos * horas,
    }

    return pd.DataFrame([linha])


def _calcular_custo(consumo_kwh: float) -> float:
    """Calcula a estimativa financeira mensal com base na tarifa padrão."""
    return round(consumo_kwh * TARIFA_KWH, 2)


@app.post("/predict", response_model=AnalisePrediction)
def predict(dados: AnaliseInput) -> AnalisePrediction:
    """
    Endpoint principal acionado pelo Backend Java.
    Recebe os dados de consumo, executa o modelo e retorna a análise energética completa.
    """
    custo = _calcular_custo(dados.consumo_kwh)

    if _modelo is None:
        # Fallback de segurança: evita que falhas de arquivo travem a integração
        categoria = "Ineficiente"
        probabilidade = 0.50
    else:
        features = _montar_features(dados)
        predicao_num = _modelo.predict(features)[0]
        categoria = LABELS.get(int(predicao_num), "Ineficiente")

        # Probabilidade associada à classe prevista
        probabilidades_todas = _modelo.predict_proba(features)[0]
        probabilidade = float(max(probabilidades_todas))

    recomendacoes = RECOMENDACOES_POR_CATEGORIA.get(categoria, RECOMENDACOES_POR_CATEGORIA["Ineficiente"])

    return AnalisePrediction(
        categoria=categoria,
        probabilidade=round(probabilidade, 4),
        recomendacoes=recomendacoes,
        custo_estimado_mensal=custo
    )


@app.get("/health")
def health() -> dict:
    """Endpoint de diagnóstico de saúde do serviço."""
    return {
        "status": "ok",
        "modelo_carregado": _modelo is not None
    }
