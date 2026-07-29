# Arquitetura — Powerpolis (EnergiAI)

> Documento vivo. Atualize sempre que uma decisão de arquitetura for tomada ou mudar — não deixe para preencher só no fim. Isso vira parte da entrega obrigatória do edital ("a arquitetura escolhida deverá ser documentada pela equipe") e é material direto para o pitch.

**Equipe:** G9-BR-TEAM-12 · **Produto:** Powerpolis (anteriormente chamado internamente de "EnergiAI")
**Dono deste documento:** Arquitetura (trio temporário)
**Última atualização:** 2026-07-28 · **Versão:** 2.0

---

## 1. Visão Geral

O Powerpolis recebe dados de consumo de energia de uma residência ou pequeno estabelecimento, classifica o perfil energético (Eficiente / Moderado / Ineficiente) usando um modelo de Machine Learning supervisionado, gera recomendações de eficiência e estima o custo mensal. O sistema expõe isso via API REST, com um serviço de IA separado do backend principal, e usa a OCI como parte obrigatória da infraestrutura — com 4 serviços confirmados (seção 5).

**Divisão de responsabilidade entre Backend e Data Science (confirmada):** o Backend orquestra a requisição, valida entrada e calcula o custo estimado. **Toda a inteligência do produto — classificação (categoria/probabilidade) e recomendações — é responsabilidade do serviço de IA (Data Science)**, não do Backend.

---

## 2. Diagrama de Arquitetura

```
[Usuário / Frontend React]
            │  HTTP/REST
            ▼
[OCI API Gateway]
    - Recebe a requisição externa de forma gerenciada
    - Encaminha para o Backend
            │
            ▼
[Backend Java + Spring Boot]
    - Recebe POST /analise-energetica
    - Valida entrada
    - Recupera credenciais/segredos via OCI Vault
    - Calcula custo_estimado_mensal
    - Repassa dados ao serviço de IA
    - Grava o histórico da análise no Autonomous Database
            │  HTTP/REST (contrato interno)
            ▼
[Serviço de IA — Python / FastAPI]
    - Carrega modelo treinado (serializado)
    - Retorna categoria + probabilidade + recomendacoes
            │
            ▼
[Modelo armazenado em: OCI Object Storage]

Backend monta a resposta final (categoria + probabilidade + recomendacoes,
recebidos do serviço de IA, + custo_estimado_mensal, calculado localmente)
e devolve ao Frontend, através do API Gateway.
```

*(Atualizar este diagrama se a integração mudar)*

---

## 3. Stack por Camada — e Por Quê

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | Javascript + CSS e HTML | Equipe já tem Frontend + Full Stack disponíveis |
| Backend | Java + Spring Boot |  Recomendação do Hackathon |
| Modelagem de IA | Python + Scikit-Learn | Recomendação do Hackathon |
| Serviço de IA (exposição do modelo) | Python + FastAPI | Mantém o modelo na mesma linguagem em que foi treinado; responsável por classificação e recomendações |
| Integração Backend ↔ IA | REST interno (contrato em `contrato-api.md`) | Desacopla times e cada um mexe na linguagem que domina |
| Gerenciamento de segredos | OCI Vault | Credenciais compartilhadas de forma segura entre os membros do time, na tenancy da liderança |
| Persistência (histórico) | OCI Autonomous Database | Suporta o item opcional "Histórico de análises" com decisão confirmada de implementar |
| Cloud / Exposição da API | OCI API Gateway | Exposição gerenciada do endpoint, sem depender de porta aberta direta na VM |
| Armazenamento do modelo | OCI Object Storage | Serviço obrigatório do edital para guardar o modelo serializado |
| Deploy | Docker + Docker Compose | Reprodutibilidade; evita "na minha máquina funciona" na demo ao vivo |

---

## 4. Fluxo de uma Requisição (ponta a ponta)

1. Frontend envia `POST /analise-energetica` através do OCI API Gateway.
2. Gateway encaminha a requisição para o Backend.
3. Backend valida os campos (ver regras em `contrato-api.md`).
4. Backend recupera credenciais necessárias via OCI Vault.
5. Backend chama o serviço Python (`POST /predict`) com os dados de consumo.
6. Serviço Python carrega o modelo a partir do OCI Object Storage e retorna `categoria`, `probabilidade` **e** `recomendacoes`.
7. Serviço Python calcula `custo_estimado_mensal`.
8. Backend grava o registro da análise no OCI Autonomous Database (histórico).
9. Backend responde ao Frontend, através do Gateway, com o JSON completo (repassando `categoria`, `probabilidade`, `recomendacoes` e `custo_estimado_mensal` todos vindos do Serviço Python).

---

## 5. Serviços OCI Escolhidos (4 confirmados)

| Serviço | Uso | Status |
|---|---|---|
| **Object Storage** | Armazenar o modelo serializado (.pkl/.joblib) treinado pela Data Science | Confirmado |
| **Autonomous Database** | Guardar o histórico de análises processadas (item opcional do edital) | Confirmado |
| **API Gateway** | Expor o endpoint do Backend de forma gerenciada, com uma URL pública controlada | Confirmado |
| **OCI Vault** | Armazenar e compartilhar credenciais/segredos entre os membros do time na mesma tenancy | Confirmado |

---

## 6. Dataset (Data Science)

- **Origem:** 100% simulado, gerado via `numpy`, com semente fixa (`seed 42`) para reprodutibilidade
- **Volume:** 50.000 registros
- **Campos do contrato de API:** `consumo_kwh`, `uso_horario_pico`, `quantidade_equipamentos`, `tipo_imovel`, `horas_alto_consumo` (os 5 originais do edital — ver seção abaixo sobre os campos removidos)
- **Variáveis internas de geração (não expostas na API):** `temperatura` e `ar_condicionado` foram usadas para gerar um dataset simulado mais realista (mais calor + ar-condicionado → mais consumo), mas **não fazem mais parte do contrato de entrada** — decisão revertida (ver Registro de Decisões)
- **Estado atual (notebook V1):** contém apenas geração e exploração do dataset (EDA) — ainda **não** inclui treino de modelo, definição de categorias (Eficiente/Moderado/Ineficiente) nem métricas de avaliação

---

## 7. Registro de Decisões

> Toda vez que uma escolha de arquitetura for tomada ou mudar, adicione uma linha aqui. Isso é o que evita "por que a gente escolheu isso mesmo?" três semanas depois — e é ótimo material para responder perguntas da banca no pitch.

| Data | Decisão | Motivo |
|---|---|---|
| 2026-07-28 | **Revertido:** `temperatura` e `ar_condicionado` removidos do contrato de entrada da API | Time decidiu manter o contrato restrito aos 5 campos originais do edital; esses 2 campos continuam existindo só como variáveis internas de geração do dataset simulado |
| 2026-07-28 | **Confirmado:** classificação (categoria/probabilidade) e recomendações são responsabilidade exclusiva do serviço de IA (Data Science) — o Backend não implementa lógica própria de predição nem de recomendação | Mantém a separação de responsabilidade original da arquitetura; evita duplicar/reimplementar a inteligência do produto dentro do Backend |
| 2026-07-24 | Nome do campo de custo confirmado como `custo_estimado_mensal` | Time validou; não haverá mudança para `custo_estimado` |
| 2026-07-24 | Nome do produto definido como **Powerpolis**; nome da equipe **G9-BR-TEAM-12** | Alinhamento de identidade para o pitch e materiais oficiais |
| 2026-07-24 | 4 serviços OCI confirmados: Object Storage, Autonomous Database, API Gateway, OCI Vault | Cobre armazenamento do modelo, histórico, exposição gerenciada da API e segredos compartilhados |
| 2026-07-24 | Autonomous Database terá uso real (histórico de análises) — deixa de ser "talvez" | Time confirmou que vai implementar esse item opcional do edital |
| [preencher] | Monorepo (backend/data-science/frontend na mesma raiz) | Facilita coordenação entre a equipe em prazo curto |
| [preencher] | Serviço Python separado (FastAPI) em vez de rodar o modelo direto em Java | Evita reimplementar o pipeline de ML em outra linguagem |
| | | |

---

## 8. Pendências em Aberto

- [ ] Confirmar com a Data Science: tipo de modelo e métricas reais (uma referência mencionou "Random Forest, 94% de acurácia", mas o notebook atual (V1) ainda não contém etapa de treino — **não tratar esse número como confirmado até validação**)
- [ ] Confirmar tratamento de `tipo_imovel` inválido (rejeitar com 400 ou tratar como categoria genérica)
- [ ] Validar (ou descartar) os números de ROI/economia mencionados informalmente (ex: "redução de 15%") — só devem entrar em qualquer material oficial (pitch, README) com cálculo real por trás
- [ ] Provisionar a instância Compute necessária para o Backend ficar acessível ao API Gateway
- [ ] Definir responsável por manter o CI/CD 
- [ ] Atualizar o código já escrito do Backend (DTOs e Service) para remover `temperatura`/`ar_condicionado` e o método `gerarRecomendacoes()` — ver `contrato-api.md` seção 4
