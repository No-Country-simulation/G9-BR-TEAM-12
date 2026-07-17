# Arquitetura — EnergiAI

> Documento vivo. Atualize sempre que uma decisão de arquitetura for tomada ou mudar — não deixe para preencher só no fim. Isso vira parte da entrega obrigatória do edital ("a arquitetura escolhida deverá ser documentada pela equipe") e é material direto para o pitch.

**Dono deste documento:** Arquitetura (você)
**Última atualização:** [preencher data] · **Versão:** 0.1 (rascunho inicial)

---

## 1. Visão Geral

O EnergiAI recebe dados de consumo de energia de uma residência ou pequeno estabelecimento, classifica o perfil energético (Eficiente / Moderado / Ineficiente) usando um modelo de Machine Learning supervisionado, gera recomendações de eficiência e estima o custo mensal. O sistema expõe isso via API REST, com um serviço de IA separado do backend principal, e usa a OCI como parte obrigatória da infraestrutura.

---

## 2. Diagrama de Arquitetura

```


---

## 3. Stack por Camada e o Por Quê



---

## 4. Fluxo de uma Requisição (ponta a ponta)



---

## 5. Serviço(s) OCI Escolhido



---

## 6. Registro de Decisões

> Toda vez que uma escolha de arquitetura for tomada ou mudar, adicione uma linha aqui. Isso é o que evita "por que a gente escolheu isso mesmo?" três semanas depois — e é ótimo material para responder perguntas da banca no pitch.

| Data | Decisão | Motivo |
|---|---|---|
| [preencher] | Monorepo (backend/data-science/frontend na mesma raiz) | Facilita coordenação entre 9 pessoas em prazo curto |
| [preencher] | Serviço Python separado (FastAPI) em vez de rodar o modelo direto em Java | Evita reimplementar o pipeline de ML em outra linguagem |
| | | |

---

## 7. Pendências em Aberto

- [ ] Qual serviço OCI será usado, de fato
- [ ] Se haverá banco de dados (depende de decidirem implementar "Histórico de análises")
- [ ] Onde o modelo será carregado a partir de: local (montado via Docker volume) ou direto do Object Storage
- [ ] Responsável por manter o CI/CD depois que Dryelli não estiver mais no projeto
