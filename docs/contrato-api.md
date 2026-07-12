# Contrato de API — EnergiAI

> Este documento é a fonte única de verdade sobre o formato de dados trocado entre as camadas do projeto. Backend e Data Science não devem divergir deste schema sem atualizar este arquivo primeiro e avisar o outro lado. Qualquer mudança aqui é uma mudança de arquitetura, não um detalhe de implementação.

**Dono deste documento:** Arquitetura (EnergiAi) — toda alteração passa por aqui antes de virar código.
**Última atualização:** [11/07/2026] · **Versão:** 0.1 (rascunho inicial)

---

## 1. Visão geral do fluxo

```
[Frontend] → [Backend Java/Spring: POST /analise-energetica]
                         ↓ (contrato interno #2, abaixo)
              [Serviço Python de IA: POST /predict]
                         ↓
              [Backend monta a resposta final] → [Frontend]
```

Existem **dois contratos** neste projeto — não confundir:

1. **Contrato externo** (obrigatório, definido pelo edital, não pode ser alterado): entre o Frontend/avaliador e o Backend.
2. **Contrato interno** (definido pela equipe, pode e deve ser ajustado conforme necessário): entre o Backend e o serviço Python de IA.

---

## 2. Contrato Externo — `POST /analise-energetica`

Este é fixo pelo edital. Copiado aqui para que ninguém precise abrir o PDF do desafio para conferir o formato.

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
| `tipo_imovel` | string | valores aceitos: `"Casa"`, `"Apartamento"`, `"Comércio"` *(ajustar conforme decidido na reunião)* |
| `horas_alto_consumo` | number | entre 0 e 24 |

---

## 3. Contrato Interno — Backend ↔ Serviço Python de IA

Definir com melhor propriedade na reunião da semana 1 com as informações extras do Data Science

**Endpoint sugerido no serviço Python:** `POST /predict`

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
> Ideia: manter o mesmo schema do contrato externo aqui, para o backend não precisar traduzir nada e só repassar o corpo da requisição recebida.

**Saída (serviço Python → backend):**
```json
{
  "categoria": "Ineficiente",
  "probabilidade": 0.81
}
```
> As `recomendacoes` podem vir do próprio serviço Python (se forem geradas por regra/modelo) OU ser montadas pelo Backend com base na `categoria` recebida. 

**Decisão pendente !!! marcar aqui quando definida:**
> - [ ] Recomendações geradas pelo serviço Python
> - [ ] Recomendações geradas pelo Backend (regras fixas por categoria)

**Cálculo do `custo_estimado_mensal`:**
> Feito pelo Backend, usando `consumo_kwh × 0,75`. Não depende do modelo e não precisa passar pelo serviço Python.

---

## 4. Erros e casos de borda

| Situação | Comportamento esperado |
|---|---|
| Campo obrigatório faltando | Backend retorna `400 Bad Request` antes mesmo de chamar o serviço Python |
| `consumo_kwh` negativo ou zero | Backend retorna `400 Bad Request` |
| Serviço Python fora do ar | Backend retorna `503 Service Unavailable` (não deixar a requisição travar sem resposta) |
| `tipo_imovel` com valor não previsto | *(a decidir: rejeitar com 400, ou tratar como categoria "Outro"?)* |

---

## 5. Como manter este documento vivo

1. Qualquer mudança de campo, tipo ou regra **precisa ser discutida antes** entre quem mexe no Backend e quem mexe no modelo.  Não alterar em silêncio.
2. Ao mudar algo, atualize a **versão** e a **data** no topo do arquivo.
3. Se a mudança quebrar compatibilidade com código já escrito, avise no Discord no canal da arquitetura antes de dar push.
4. Este arquivo é a referência para escrever os **3 exemplos de uso obrigatórios** do edital. (Usar os mesmos exemplos aqui e na demonstração do pitch, para não haver inconsistência.)

---

## 6. Exemplos de uso (preencher conforme forem definidos)

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
