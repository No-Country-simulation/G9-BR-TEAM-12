# Contrato de API — Powerpolis (EnergiAI)

> Este documento é a fonte única de verdade sobre o formato de dados trocado entre as camadas do projeto. Backend e Data Science não devem divergir deste schema sem atualizar este arquivo primeiro e avisar o outro lado. Qualquer mudança aqui é uma mudança de arquitetura, não um detalhe de implementação.

**Equipe:** G9-BR-TEAM-12 · **Produto:** Powerpolis
**Dono deste documento:** Arquitetura (trio: Alex, Lídia, Samanta) — toda alteração passa por aqui antes de virar código.
**Última atualização:** 2026-08-01 · **Versão:** 0.7

---

## 1. Visão geral do fluxo

```
[Frontend] → [OCI API Gateway] → [Backend Java/Spring: POST /analise-energetica]
                                              ↓ (contrato interno #2, abaixo)
                                   [Serviço Python de IA: POST /predict]
                                              ↓
                                   [Backend repassa a resposta] → [Frontend]
```

Existem **dois contratos** neste projeto:

1. **Contrato externo**: entre o Frontend/avaliador e o Backend.
2. **Contrato interno** (definido pela equipe, pode e deve ser ajustado conforme necessário): entre o Backend e o serviço Python de IA.

---

## 2. Quem decide o quê neste contrato

| Decisão | Responsável | Observação |
|---|---|---|
| Campos obrigatórios do contrato externo (os 5 do edital) | Ninguém — são fixos pelas diretrizes do projeto | Não alterar sob nenhuma circunstância |
| Campos adicionais ao contrato | Data Science propõe → Arquitetura aprova | `temperatura` e `ar_condicionado` foram testados e removidos definitivamente — ver `criterios-classificacao.md` |
| Critérios de classificação e treino do modelo | Data Science | Documentado em `criterios-classificacao.md` (v0.7 — modelo real treinado: Random Forest, 61,94% acurácia) |
| Origem das `recomendacoes` | **Data Science** | ✅ Confirmado — geradas dinamicamente a partir da categoria realmente prevista (ver seção 4) |
| Origem do cálculo de predição (categoria/probabilidade) | **Data Science** | ✅ Confirmado |
| Origem do cálculo de `custo_estimado_mensal` | **Data Science** | ✅ Confirmado — o modelo serializado já implementa esse cálculo junto com a predição |
| Valores aceitos de `tipo_imovel` e conversão de sinônimos | Data Science define o modelo; **Backend implementa a conversão** | ✅ Resolvido nesta versão — ver seção 3 |
| Tratamento de valores realmente inválidos (fora de qualquer sinônimo conhecido) | Backend | Retorna `400 Bad Request` — ver seção 5 |
| Aprovação final de qualquer mudança neste documento | Arquitetura (trio) | Nenhuma mudança de contrato é considerada oficial sem estar escrita aqui |

---

## 3. Contrato Externo — `POST /analise-energetica`

Apenas os 5 campos originais do edital.

**Entrada:**
```json
{
  "consumo_kwh": 420,
  "uso_horario_pico": true,
  "quantidade_equipamentos": 10,
  "tipo_imovel": "Casa",
  "horas_alto_consumo": 8
}
```

**Saída:**
```json
{
  "categoria": "Ineficiente",
  "probabilidade": 0.81,
  "recomendacoes": [
    "Reduzir o uso de equipamentos durante horários de pico",
    "Avaliar aparelhos com alto consumo energético",
    "Distribuir atividades de maior consumo ao longo do dia"
  ],
  "custo_estimado_mensal": 315.00
}
```

**Regras de validação (Backend):**

| Campo | Tipo | Regra |
|---|---|---|
| `consumo_kwh` | number | > 0 |
| `uso_horario_pico` | boolean | — |
| `quantidade_equipamentos` | integer | ≥ 0 |
| `tipo_imovel` | string | ver regra de `tipo_imovel` abaixo |
| `horas_alto_consumo` | number | entre 0 e 24 |

**Regra de `tipo_imovel` (resolvida nesta versão):**

- **Valores canônicos do contrato:** `"Residencia"`, `"Comercial"`, `"Industria"` — são esses os 3 valores documentados oficialmente.
- **Sinônimos aceitos, por compatibilidade com o edital:** `"Casa"` e `"Apartamento"` continuam sendo aceitos como entrada — o **Backend converte ambos para `"Residencia"` antes de repassar ao serviço Python**, não devolve erro.
- **Por quê:** o próprio exemplo oficial do edital usa `"Casa"` literalmente — rejeitar esse valor com 400 quebraria a demonstração obrigatória. Ao mesmo tempo, o time decidiu simplificar o contrato documentado para 3 categorias. A conversão no Backend resolve as duas coisas ao mesmo tempo.
- **Qualquer outro valor** (diferente dos 5 conhecidos: Casa, Apartamento, Residencia, Comercial, Industria) é rejeitado com `400 Bad Request`.

---

## 4. Contrato Interno — Backend ↔ Serviço Python de IA

**Endpoint no serviço Python:** `POST /predict`

**Entrada (backend → serviço Python):** o Backend já envia `tipo_imovel` **normalizado** — nunca `"Casa"` ou `"Apartamento"`, sempre `"Residencia"`, `"Comercial"` ou `"Industria"`.
```json
{
  "consumo_kwh": 420,
  "uso_horario_pico": true,
  "quantidade_equipamentos": 10,
  "tipo_imovel": "Residencia",
  "horas_alto_consumo": 8
}
```

**Saída (serviço Python → backend):**
```json
{
  "categoria": "Ineficiente",
  "probabilidade": 0.5287,
  "recomendacoes": [
    "Alerta Vermelho! Auditoria energética completa necessária.",
    "Substitua equipamentos antigos por modelos eficientes.",
    "Implemente automação para controle de energia."
  ],
  "custo_estimado_mensal": 315.00
}
```
> ✅ Exemplo real, testado contra o modelo treinado (ver seção 8, Exemplo 3 — cenário oficial do edital).

> **Transformação interna que o serviço Python faz:** `tipo_imovel` (já normalizado pelo Backend) é convertido em one-hot encoding (`categoria_imovel_Residencial`, `categoria_imovel_Comercial`, `categoria_imovel_Industrial`); são criadas 2 features de interação (`uso_horario_pico × horas_alto_consumo` e `quantidade_equipamentos × horas_alto_consumo`); `consumo_kwh` **não** é usado como feature de predição (só para o cálculo de custo) — ver `criterios-classificacao.md`, seção 2.
>
> ✅ **Recomendações confirmadas como corretamente amarradas à categoria prevista** — a Data Science corrigiu a lógica para usar um dicionário indexado pela categoria real (`recomendacoes_por_categoria[categoria_prevista]`), eliminando o risco de recomendação divergente da predição.

**Impacto no código do Backend:** o `ModelPrediction` (DTO interno que recebe a resposta do `/predict`) precisa ter os 4 campos: `categoria`, `probabilidade`, `recomendacoes`, `custoEstimadoMensal`. O `TipoImovel` (enum) precisa de uma conversão customizada aceitando `Casa`/`Apartamento` como sinônimos de `Residencia` (ver seção 3).

---

## 5. Erros e casos de borda

| Situação | Comportamento esperado |
|---|---|
| Campo obrigatório faltando | Backend retorna `400 Bad Request` antes mesmo de chamar o serviço Python |
| `consumo_kwh` negativo ou zero | Backend retorna `400 Bad Request` |
| Serviço Python fora do ar | Backend retorna `503 Service Unavailable` |
| `tipo_imovel` fora dos 5 valores conhecidos (Casa, Apartamento, Residencia, Comercial, Industria) | Backend retorna `400 Bad Request` |

---

## 6. Como manter este documento vivo

1. Qualquer mudança de campo, tipo ou regra **precisa ser discutida antes** entre quem mexe no Backend e quem mexe no modelo.
2. Ao mudar algo, atualize a **versão** e a **data** no topo do arquivo.
3. Se a mudança quebrar compatibilidade com código já escrito, avise no canal da arquitetura antes de dar push.
4. Este arquivo é a referência para escrever os **3 exemplos de uso obrigatórios** do edital.

---

## 7. Pendências em Aberto (consolidado)

- [x] ~~Origem das recomendações~~ — **Resolvido:** serviço Python (Data Science)
- [x] ~~Origem do cálculo de predição~~ — **Resolvido:** serviço Python (Data Science)
- [x] ~~Origem do cálculo de custo~~ — **Resolvido:** serviço Python (Data Science)
- [x] ~~Tipo de modelo e métricas reais~~ — **Resolvido:** Random Forest, 61,94% de acurácia
- [x] ~~Tratamento de `tipo_imovel` inválido~~ — **Resolvido:** 400 Bad Request para valores fora dos 5 conhecidos
- [x] ~~Recomendações não amarradas à categoria prevista~~ — **Resolvido:** lógica corrigida para usar dicionário indexado pela categoria real
- [x] ~~Contradição de `tipo_imovel` entre contrato-api.md e criterios-classificacao.md~~ — **Resolvido:** 3 valores canônicos + Casa/Apartamento como sinônimos convertidos pelo Backend
- [ ] **Nova pendência:** fixar a versão do scikit-learn no `requirements.txt` do serviço Python (modelo foi treinado em 1.6.1; ambientes com versões diferentes geram aviso de incompatibilidade ao carregar o `.pkl` — risco real para o deploy)

---

## 8. Exemplos de uso

> Os 3 exemplos obrigatórios do edital, todos testados e validados contra o modelo real.

**Exemplo 1 — Casa com consumo eficiente**
```json
// entrada
{ "consumo_kwh": 300, "uso_horario_pico": false, "quantidade_equipamentos": 5, "tipo_imovel": "Casa", "horas_alto_consumo": 3 }
// saída
{ "categoria": "Eficiente", "probabilidade": 0.7389, "recomendacoes": ["Excelente desempenho! Continue monitorando.", "Considere investimentos em energia renovável.", "Explore a certificação de eficiência."], "custo_estimado_mensal": 225.00 }
```

**Exemplo 2 — Estabelecimento comercial com consumo moderado**
```json
// entrada
{ "consumo_kwh": 700, "uso_horario_pico": true, "quantidade_equipamentos": 12, "tipo_imovel": "Comercial", "horas_alto_consumo": 8 }
// saída
{ "categoria": "Moderado", "probabilidade": 0.7025, "recomendacoes": ["Potencial de melhoria! Faça uma auditoria energética.", "Otimize o uso do ar-condicionado.", "Invista em equipamentos mais eficientes."], "custo_estimado_mensal": 525.00 }
```

**Exemplo 3 — Cenário oficial do edital** ✅ testado
```json
// entrada
{ "consumo_kwh": 420, "uso_horario_pico": true, "quantidade_equipamentos": 10, "tipo_imovel": "Casa", "horas_alto_consumo": 8 }
// saída
{ "categoria": "Ineficiente", "probabilidade": 0.5287, "recomendacoes": ["Alerta Vermelho! Auditoria energética completa necessária.", "Substitua equipamentos antigos por modelos eficientes.", "Implemente automação para controle de energia."], "custo_estimado_mensal": 315.00 }
```
> Nota: o edital usa `0.81` como probabilidade ilustrativa no enunciado — o valor real do modelo treinado é `0.5287`. A categoria (`Ineficiente`) e o custo (`315.00`) batem exatamente com o esperado.
