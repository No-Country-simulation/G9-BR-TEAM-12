# Critérios de Classificação — Powerpolis (EnergiAI)

> Este documento existe porque o edital exige explicitamente: "as equipes deverão definir e justificar os critérios utilizados para caracterizar os diferentes perfis de eficiência energética". A regra abaixo foi implementada e testada no notebook `EDA_Modelagem_modelo_treinado.ipynb` (versão final, com modelo treinado e serializado) — este documento é o resumo oficial para consulta rápida e para o pitch.

**Dono deste documento:** Data Science
**Última atualização:** 2026-08-01 · **Versão:** 0.7 (baseado no notebook final, modelo treinado e serializado — `modelo_energiai_v1.pkl`)

---

## 1. Objetivo

Definir, de forma objetiva e justificável, os limiares que separam um perfil de consumo em **Eficiente**, **Moderado** ou **Ineficiente**, a partir das variáveis de entrada da API. Esses critérios são usados para gerar os rótulos (`categoria`) do dataset de treino.

---

## 2. Variáveis Utilizadas

**No cálculo do rótulo (target):**

| Variável | Papel na classificação |
|---|---|
| `consumo_kwh` | Variável base — usada somente para gerar o rótulo de treino, não é usada como feature de entrada do modelo |
| `tipo_imovel` | Usada para segmentar o cálculo — os limiares são calculados separadamente por tipo de imóvel, não de forma global |

**Como features de entrada do modelo (para prever a categoria de um caso novo):**

| Variável | Papel no modelo |
|---|---|
| `quantidade_equipamentos` | Feature direta |
| `horas_alto_consumo` | Feature direta |
| `uso_horario_pico` | Feature direta (convertida para 0/1) |
| `tipo_imovel` | Normalizado pelo Backend e agrupado em 3 categorias: `Residencial` (recebe também os sinônimos Casa/Apartamento), `Comercial`, `Industrial` — codificado via one-hot encoding |
| `uso_horario_pico × horas_alto_consumo` | Feature de interação (derivada) |
| `quantidade_equipamentos × horas_alto_consumo` | Feature de interação (derivada) |

**Mapeamento de agrupamento usado no treino** (`CATEGORIA_MAP`, notebook final):
```python
CATEGORIA_MAP = {
    'Casa': 'Residencial',
    'Apartamento': 'Residencial',
    'Comercial': 'Comercial',
    'Industria': 'Industrial'
}
```
> ✅ Este mapeamento é a fonte da verdade que resolveu a divergência entre este documento e o `contrato-api.md` — confirmado tanto pelo código do notebook quanto pelo modelo `.pkl` carregado e inspecionado diretamente (`feature_names_in_`).

**Excluídas do escopo do MVP (testadas, mas descartadas por decisão da equipe):** `temperatura` e `ar_condicionado` — geraram leve ganho de acurácia nos testes, mas foram removidas por: (1) não fazerem parte da lista de campos das diretrizes do projeto, (2) aumentarem a complexidade de integração com o Backend sem necessidade, e (3) o critério de construção dessas variáveis não ter sido totalmente validado com dados simulados. Documentadas como candidatas a uma v2 futura, condicionada a dados reais.

---

## 3. Lógica de Rotulagem (regra implementada)

```python
# Limiares calculados como quartis de consumo_kwh, DENTRO de cada tipo_imovel
limites = df.groupby('tipo_imovel')['consumo_kwh'].quantile([0.25, 0.75]).unstack()

def definir_target(row):
    tipo, val = row['tipo_imovel'], row['consumo_kwh']
    if val <= limites.loc[tipo, 0.25]:
        return "Eficiente"      # 25% de menor consumo dentro do próprio tipo de imóvel
    if val <= limites.loc[tipo, 0.75]:
        return "Moderado"       # 50% intermediário
    return "Ineficiente"        # 25% de maior consumo dentro do próprio tipo de imóvel
```

**Por que por quartil e não por um valor fixo de kWh:** um consumo de 1.000 kWh pode ser eficiente para uma indústria e péssimo para um apartamento. Comparar cada imóvel apenas com outros do mesmo tipo evita que a diferença natural de escala (residencial vs. comercial vs. industrial) distorça a classificação.

---

## 4. Limiares Numéricos

| Categoria | Faixa | Proporção observada no dataset |
|---|---|---|
| Eficiente | ≤ percentil 25 do seu tipo de imóvel | ≈ 25% |
| Moderado | entre percentil 25 e 75 do seu tipo de imóvel | ≈ 50% |
| Ineficiente | > percentil 75 do seu tipo de imóvel | ≈ 25% |

---

## 5. Justificativa dos Limiares

- **Fonte dos limiares:** percentis (quartis) da própria distribuição do dataset simulado, calculados por segmento de `tipo_imovel`.
- **Por que essa abordagem:** garante uma distribuição de classes balanceada por construção (~25/50/25%). Também evita comparar consumo de escalas muito diferentes (indústria vs. apartamento) na mesma régua.
- **Fontes públicas consultadas para os limiares:** nenhuma — abordagem estatística, baseada na distribuição dos próprios dados simulados.

---

## 6. Modelo Treinado

| Item | Valor |
|---|---|
| **Algoritmo escolhido** | Random Forest (com 2 features de interação) |
| **Acurácia no conjunto de teste** | **61,94%** |
| **Acurácia média em validação cruzada (GridSearchCV)** | 62,47% |
| **Recall da classe "Ineficiente"** | **0,45** ✅ confirmado pela matriz de confusão (1.123 acertos em 2.492 casos reais) |
| **Precisão da classe "Ineficiente"** | 0,65 |
| **F1-score da classe "Ineficiente"** | 0,53 |
| **Modelos alternativos testados** | Regressão Logística (61,53%), Árvore de Decisão (61,42%) |
| **Otimização de hiperparâmetros** | Testada via GridSearchCV; não trouxe ganho real — versão simples preferida por parcimônia |

**Matriz de confusão (conjunto de teste):**

| | Previsto: Eficiente | Previsto: Moderado | Previsto: Ineficiente |
|---|---|---|---|
| **Real: Eficiente** | 1193 | 1282 | 29 |
| **Real: Moderado** | 559 | 3878 | 567 |
| **Real: Ineficiente** | 18 | 1351 | 1123 |

**O que o recall de 0,45 na classe Ineficiente significa na prática:** o modelo deixa passar despercebido mais da metade dos imóveis realmente ineficientes (falso negativo) — geralmente confundindo-os com "Moderado" (1.351 dos 2.492 casos reais de Ineficiente, ~54%). Em compensação, a confusão direta entre os extremos (Eficiente ↔ Ineficiente) é rara: só 29 e 18 casos, respectivamente (~1% cada). Isso é uma limitação real e conhecida do MVP — o modelo raramente erra "grosseiramente", mas tem dificuldade em distinguir Moderado de Ineficiente.

---

## 7. Validação

- [x] A distribuição das 3 categorias no dataset não está desbalanceada — por construção via quartil, fica em ~25% / ~50% / ~25%
- [x] O modelo foi comparado com 2 alternativas (Regressão Logística, Árvore de Decisão) antes de escolher Random Forest
- [x] Otimização de hiperparâmetros foi tentada e descartada por não trazer ganho real
- [x] Matriz de confusão completa gerada e analisada por categoria
- [ ] Casos de borda (exatamente no limiar de quartil) ainda não foram testados manualmente
- [x] Revisão cruzada dos critérios por alguém fora da Data Science

---

## 8. Exemplos

| `consumo_kwh` | `quantidade_equipamentos` | `uso_horario_pico` | `horas_alto_consumo` | `tipo_imovel` | Categoria prevista | Probabilidade |
|---|---|---|---|---|---|---|
| 300 | 5 | false | 3 | Casa | Eficiente | 0,7389 |
| 700 | 12 | true | 8 | Comercial | Moderado | 0,7025 |
| 420 | 10 | true | 8 | Casa | **Ineficiente** ✅ testado | 0,5287 |

> O terceiro exemplo é o cenário oficial do edital — testado contra o modelo real, com recomendações corretamente amarradas à categoria prevista (ver `contrato-api.md`, seção 8).

---

## 9. Registro de Decisões

| Data | Decisão | Motivo |
|---|---|---|
| 2026-07-28 | Critério de classificação definido: quartis de `consumo_kwh` por `tipo_imovel` | Garante distribuição balanceada e evita comparar escalas de consumo muito diferentes |
| 2026-07-28 | Modelo escolhido: Random Forest com 2 features de interação, sem otimização de hiperparâmetros | Melhor acurácia entre as opções testadas |
| 2026-07-28 | `temperatura` e `ar_condicionado` excluídas do modelo e do contrato de API | Fora do escopo do edital; reduz complexidade de integração |
| 2026-07-28 | `tipo_imovel` agrupado em 3 categorias (Residencial/Comercial/Industrial) para fins de modelagem | Reduz dimensionalidade e reflete perfis de consumo mais parecidos entre Casa e Apartamento |
| 2026-08-01 | Recall da classe Ineficiente confirmado em 0,45 (corrigindo menção anterior a 0,58) | Matriz de confusão real, calculada no notebook final, confirma o valor |
| 2026-08-01 | Geração de recomendações corrigida para usar dicionário indexado pela categoria realmente prevista | Elimina o risco de recomendação divergente da predição, identificado em teste anterior |
| 2026-08-01 | `tipo_imovel`: contrato externo usa 3 valores canônicos (Residencia/Comercial/Industria); Backend aceita Casa/Apartamento como sinônimos e converte antes de repassar ao modelo | Resolve contradição entre este documento e o `contrato-api.md`, mantendo compatibilidade com o exemplo oficial do edital (que usa "Casa") |

---

## 10. Pendências em Aberto

- [x] ~~Confirmar por que o exemplo "Ineficiente" retornou "Moderado"~~ — **Resolvido:** lógica de recomendações corrigida para usar a categoria realmente prevista
- [x] ~~Resolver divergência do recall da classe Ineficiente~~ — **Resolvido:** 0,45, confirmado pela matriz de confusão
- [x] ~~Testar o exemplo oficial do edital contra o modelo real~~ — **Resolvido:** ver seção 8
- [ ] Validar manualmente casos de borda (exatamente no limiar de quartil)
- [ ] Avaliar se o recall baixo da classe Ineficiente (0,45) é aceitável para o MVP ou se merece mais uma rodada de ajuste antes do pitch
- [ ] **Nova pendência:** fixar a versão do scikit-learn (1.6.1) no `requirements.txt` do serviço Python — o modelo foi treinado nessa versão; carregá-lo com uma versão diferente gera aviso de incompatibilidade e risco real de comportamento inesperado em produção
