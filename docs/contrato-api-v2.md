# Contrato de API — Powerpolis (EnergiAI)

> Este documento é a fonte única de verdade sobre o formato de dados trocado entre as camadas do projeto. Backend e Data Science não devem divergir deste schema sem atualizar este arquivo primeiro e avisar o outro lado. Qualquer mudança aqui é uma mudança de arquitetura, não um detalhe de implementação.

**Equipe:** G9-BR-TEAM-12 · **Produto:** Powerpolis
**Dono deste documento:** Arquitetura - toda alteração passa por aqui antes de virar código.
**Última atualização:** 2026-07-28 · **Versão:** 2.0

---

## 1. Visão geral do fluxo

```
[Frontend] → [OCI API Gateway] → [Backend Java/Spring: POST /analise-energetica]
                                              ↓ (contrato interno #2, abaixo)
                                   [Serviço Python de IA: POST /predict]
                                              ↓
                                   [Backend monta a resposta final] → [Frontend]
```

Existem **dois contratos** neste projeto — não confundir:

1. **Contrato externo** (obrigatório, definido pelo edital, não pode ser alterado): entre o Frontend/avaliador e o Backend.
2. **Contrato interno** (definido pela equipe, pode e deve ser ajustado conforme necessário): entre o Backend e o serviço Python de IA.

---

## 2. Quem decide o quê neste contrato

> Seção para deixar explícito quem tem autoridade sobre cada tipo de mudança, evitando que alguém altere um campo sem o outro lado saber.

| Decisão | Responsável | Observação |
|---|---|---|
| Campos obrigatórios do contrato externo (os 5 do edital) | Ninguém — são fixos pelo edital | Não alterar sob nenhuma circunstância |
| Campos adicionais ao contrato | Data Science propõe → Arquitetura aprova e documenta aqui | ✅ Resolvido por ora: `temperatura` e `ar_condicionado` foram propostos, testados e **removidos** do contrato — ver seção 7 |
| Critérios de classificação e treino do modelo | Data Science | Documentado separadamente em `criterios-classificacao.md` |
| Origem das `recomendacoes` | **Data Science (serviço Python)** | ✅ Confirmado — deixa de ser pendência |
| Origem do cálculo de predição (categoria/probabilidade) | **Data Science (serviço Python)** | ✅ Confirmado — o Backend não implementa lógica de classificação própria |
| Tratamento de valores inválidos (ex: `tipo_imovel` fora do esperado) | Backend, validado com a Data Science | **Ainda pendente — ver seção 7** |
| Aprovação final de qualquer mudança neste documento | Arquitetura (trio temporário) | Nenhuma mudança de contrato é considerada oficial sem estar escrita aqui |

---

## 3. Contrato Externo — `POST /analise-energetica`

Apenas os 5 campos originais do edital. `temperatura` e `ar_condicionado` foram removidos do contrato (ver seção 7) — não incluir mais no DTO de entrada.

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
> ✅ Confirmado: o nome oficial deste campo é `custo_estimado_mensal`.
> ✅ Confirmado: `categoria`, `probabilidade` e `recomendacoes` vêm todos do serviço de IA (Data Science) — o Backend não gera nem calcula nenhum desses três valores.

**Regras de validação (Backend):**

| Campo | Tipo | Regra | Origem |
|---|---|---|---|
| `consumo_kwh` | number | > 0 | Edital |
| `uso_horario_pico` | boolean | — | Edital |
| `quantidade_equipamentos` | integer | ≥ 0 | Edital |
| `tipo_imovel` | string | valores aceitos: `"Casa"`, `"Apartamento"`, `"Comercial"`, `"Industria"` *(sem acento — grafia confirmada pela Data Science)* | Edital + Data Science |
| `horas_alto_consumo` | number | entre 0 e 24 | Edital |

---

## 4. Contrato Interno — Backend ↔ Serviço Python de IA

**Endpoint no serviço Python:** `POST /predict`

**Entrada (backend → serviço Python):**
```json
{
  "consumo_kwh": 420,
  "uso_horario_pico": true,
  "quantidade_equipamentos": 10,
  "tipo_imovel": "Casa",
  "horas_alto_consumo": 8
}
```
> Mesmo schema do contrato externo — o backend só repassa o corpo da requisição recebida, sem tradução.

**Saída (serviço Python → backend):**
```json
{
  "categoria": "Ineficiente",
  "probabilidade": 0.81,
  "recomendacoes": [
    "Reduzir o uso de equipamentos durante horários de pico",
    "Avaliar aparelhos com alto consumo energético",
    "Distribuir atividades de maior consumo ao longo do dia"
  ]
}
```
> ✅ **Confirmado (substitui a decisão anterior):** o serviço Python devolve `categoria`, `probabilidade` **e** `recomendacoes` juntos. O Backend não tem mais um método próprio de geração de recomendações nem de cálculo de predição — ele só repassa o que a Data Science calcula.
>
> **Impacto no código já escrito:** o método `gerarRecomendacoes()` que havia sido implementado no `AnaliseEnergeticaService` do Backend deve ser **removido** — essa lógica agora pertence ao serviço Python. O `ModelPrediction` (DTO interno do Backend que recebe a resposta do `/predict`) precisa ganhar um terceiro campo, `recomendacoes`, além de `categoria` e `probabilidade`.

**Cálculo do `custo_estimado_mensal`:**
> Continua sendo feito pelo Backend, usando `consumo_kwh × 0,75`. Este é o único cálculo que permanece do lado do Backend — não depende do modelo e não passa pelo serviço Python.

---

## 5. Erros e casos de borda

| Situação | Comportamento esperado |
|---|---|
| Campo obrigatório faltando | Backend retorna `400 Bad Request` antes mesmo de chamar o serviço Python |
| `consumo_kwh` negativo ou zero | Backend retorna `400 Bad Request` |
| Serviço Python fora do ar | Backend retorna `503 Service Unavailable` (não deixar a requisição travar sem resposta) |
| `tipo_imovel` com valor não previsto | *(a decidir: rejeitar com 400, ou tratar como categoria "Outro"? — ver seção 7)* |

---

## 6. Como manter este documento vivo

1. Qualquer mudança de campo, tipo ou regra **precisa ser discutida antes** entre quem mexe no Backend e quem mexe no modelo — não alterar em silêncio.
2. Ao mudar algo, atualize a **versão** e a **data** no topo do arquivo.
3. Se a mudança quebrar compatibilidade com código já escrito, avise no canal da arquitetura antes de dar push.
4. Este arquivo é a referência para escrever os **3 exemplos de uso obrigatórios** do edital — use os mesmos exemplos aqui e na demonstração do pitch, para não haver inconsistência.

---

## 7. Pendências em Aberto (consolidado)

- [x] ~~Origem das recomendações~~ — **Resolvido:** serviço Python (Data Science)
- [x] ~~Origem do cálculo de predição~~ — **Resolvido:** serviço Python (Data Science); Backend não implementa classificação própria
- [x] ~~Campos `temperatura` e `ar_condicionado`~~ — **Resolvido:** removidos do contrato externo e interno
- [ ] **Tratamento de `tipo_imovel` inválido** — rejeitar ou tratar como categoria genérica
- [ ] **Tipo de modelo e métricas reais** — a confirmar com a Data Science; não usar "Random Forest / 94%" como fato até validação de modelo final.

---

## 8. Exemplos de uso (preencher conforme forem definidos)

> O edital exige no mínimo 3 exemplos reais ou simulados demonstrando a API funcionando. Preencha aqui à medida que forem validados — isso vira insumo direto para o pitch.

**Exemplo 1 — [nome do cenário, ex: "Casa com alto consumo noturno"]**
```json
// entrada
{ }
// saída
{ }
```

**Exemplo 2 — [nome do cenário]**
```json
// entrada
{ }
// saída
{ }
```

**Exemplo 3 — [nome do cenário]**
```json
// entrada
{ }
// saída
{ }
```
