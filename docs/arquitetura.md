# Arquitetura — Powerpolis (EnergiAI)

> Documento vivo. Atualize sempre que uma decisão de arquitetura for tomada ou mudar — não deixe para preencher só no fim. Isso vira parte da entrega obrigatória do edital ("a arquitetura escolhida deverá ser documentada pela equipe") e é material direto para o pitch.

**Equipe:** G9-BR-TEAM-12 · **Produto:** Powerpolis (anteriormente chamado internamente de "EnergiAI")
**Dono deste documento:** Arquitetura (trio: Alex, Lídia, Samanta)
**Última atualização:** 2026-08-12 · **Versão:** 0.6

---

## 1. Visão Geral

O Powerpolis recebe dados de consumo de energia de uma residência ou pequeno estabelecimento, classifica o perfil energético (Eficiente / Moderado / Ineficiente) usando um modelo de Machine Learning supervisionado (Random Forest), gera recomendações de eficiência e estima o custo mensal. O sistema expõe isso via API REST, com um serviço de IA separado do backend principal, e usa a OCI como parte obrigatória da infraestrutura — com 4 serviços confirmados (seção 5).

**Divisão de responsabilidade entre Backend e Data Science (confirmada):** o Backend valida a entrada, orquestra a chamada ao serviço de IA e (se implementado) persiste o histórico. **Toda a inteligência do produto — classificação, probabilidade, recomendações e cálculo de custo — é responsabilidade do serviço de IA (Data Science)**. O Backend não implementa nenhuma regra de negócio própria; ele repassa a resposta do serviço Python.

**Ambiente local validado (novidade desta versão):** Backend e serviço de IA já sobem juntos via Docker Compose e se comunicam de verdade — testado com `POST /analise-energetica` ponta a ponta, não só os containers subindo sem erro. Ver seção 6.

---

## 2. Diagrama de Arquitetura

```
[Usuário / Frontend React]
            │  HTTP/REST
            ▼
[OCI API Gateway]                     ← produção/cloud (pendente de configurar)
    - Recebe a requisição externa de forma gerenciada
    - Encaminha para o Backend
            │
            ▼
[Backend Java + Spring Boot]          ← porta 9091
    - Recebe POST /analise-energetica
    - Valida entrada
    - Recupera credenciais/segredos via OCI Vault
    - Repassa dados ao serviço de IA
    - Grava o histórico da análise no Autonomous Database
            │  HTTP/REST (contrato interno)
            ▼
[model-service — Python / FastAPI]    ← porta 8000
    - Carrega modelo treinado (Random Forest, serializado)
    - Aplica transformação de features (agrupamento de tipo_imovel,
      features de interação)
    - Retorna categoria + probabilidade + recomendacoes + custo_estimado_mensal
            │
            ▼
[Modelo armazenado em: OCI Object Storage]   ← integração funcional via model_loader.py
                                                  (MODEL_SOURCE=oci testado localmente;
                                                  Docker Compose mantém cópia local — ver seção 6)

Backend repassa a resposta completa do serviço de IA ao Frontend,
através do API Gateway (em produção) ou diretamente (em ambiente local).
```

---

## 3. Stack por Camada — e Por Quê

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | React | Em construção — ainda não integrado ao Docker Compose (ver seção 6) |
| Backend | Java + Spring Boot 4.0.7, Java 21 | Preferência do edital; boa parte da equipe já tem experiência |
| Modelagem de IA | Python + Scikit-Learn (Random Forest) | Recomendação do edital; melhor resultado entre 3 modelos testados |
| Serviço de IA (exposição do modelo) | Python + FastAPI (`model-service`) | Mantém o modelo na mesma linguagem em que foi treinado; responsável por toda a lógica de negócio (classificação, recomendações, custo) |
| Documentação da API | springdoc-openapi 3.1.0 (Swagger) | Versão compatível com Spring Boot 4 — versões anteriores (2.x) não são |
| Integração Backend ↔ IA | REST interno (contrato em `contrato-api.md`) | Desacopla times |
| Gerenciamento de segredos | OCI Vault | Credenciais compartilhadas de forma segura na tenancy da liderança |
| Persistência (histórico) | OCI Autonomous Database | Suporta "Histórico de análises" (item opcional confirmado) |
| Cloud / Exposição da API | OCI API Gateway | Exposição gerenciada do endpoint (produção) |
| Armazenamento do modelo | OCI Object Storage | Serviço obrigatório do edital (produção) |
| Orquestração local | Docker Compose | Backend + model-service já validados juntos — ver seção 6 |

---

## 4. Fluxo de uma Requisição (ponta a ponta)

1. Frontend envia `POST /analise-energetica` (em produção, através do OCI API Gateway).
2. Backend valida os campos (ver regras em `contrato-api.md`).
3. Backend recupera credenciais necessárias via OCI Vault (produção).
4. Backend chama o serviço Python (`POST /predict`, em `http://model-service:8000` dentro da rede Docker) com os dados de consumo.
5. Serviço Python transforma os dados (agrupa `tipo_imovel`, cria features de interação), carrega o modelo e calcula `categoria`, `probabilidade`, `recomendacoes` e `custo_estimado_mensal` — os 4 juntos.
6. Backend grava o registro da análise no OCI Autonomous Database (histórico — ainda pendente de implementar).
7. Backend responde ao Frontend, repassando integralmente o que o serviço de IA retornou.

> ✅ Os passos 1, 2, 4, 5 e 7 já foram validados de verdade, localmente, via Docker Compose (ver seção 6). O passo 3 (OCI Vault) está provisionado no compartment `powerpolis`, mas ainda não integrado ao runtime da API. O passo 6 (Autonomous Database) está provisionado, mas ainda não configurado nem integrado ao fluxo funcional.

---

## 5. Serviços OCI Escolhidos (4 confirmados)

| Serviço | Uso | Status |
|---|---|---|
| **Object Storage** | Armazenar o modelo serializado (.pkl) | ✅ **Integrado e testado** — `model_loader.py` baixa o modelo do bucket privado `powerpolis-bucket-models` via OCI SDK; testado localmente com `MODEL_SOURCE=oci` (Docker Compose continua usando cópia local) |
| **Autonomous Database** | Guardar o histórico de análises processadas | Provisionado no compartment `powerpolis` — ainda não configurado nem integrado ao fluxo funcional do MVP |
| **API Gateway** | Expor o endpoint do Backend de forma gerenciada | Confirmado — ainda não configurado |
| **OCI Vault** | Armazenar e compartilhar credenciais/segredos entre o time | Provisionado no compartment `powerpolis` — ainda não integrado ao runtime da API |

**Observação sobre o API Gateway:** por definição, ele precisa apontar para algo já hospedado — isso implica que o Backend também precisará rodar numa instância Compute (Always Free) em produção, mesmo essa não sendo, isoladamente, um dos "4 serviços" oficialmente votados.

---

## 6. Ambiente Local — Docker Compose (novo)

**Status: funcionando e validado.** Backend e serviço de IA sobem juntos e se comunicam de verdade — testado com uma chamada real a `POST /analise-energetica`, com o Backend chamando o `model-service` por dentro e devolvendo a resposta completa (não apenas "os containers sobem sem erro").

**Serviços definidos hoje no `docker-compose.yml`:**

| Serviço | Porta (host:container) | Build context | Observação |
|---|---|---|---|
| `backend` | `9091:9091` | `../backend` | Java/Spring Boot |
| `model-service` | `8000:8000` | `../data-science/app` | Python/FastAPI — note o `app/` extra na pasta (ver estrutura abaixo) |
| `frontend` | — | — | **Ainda não incluído no compose.** Frontend em construção; já existe um Dockerfile próprio, falta adicionar o serviço no `docker-compose.yml` quando o React estiver pronto para integrar |

**Estrutura de pastas real do serviço de IA** (diferente do que foi documentado em versões anteriores deste arquivo):
```
data-science/
└── app/
    ├── models/
    │   └── modelo_energiai_v1.pkl
    ├── src/
    │   └── model_service/
    │       ├── main.py
    │       └── model_loader.py          ← [NOVO] carregamento local + OCI
    ├── requirements.txt
    └── Dockerfile
```

**Variável de conexão:** `MODEL_SERVICE_URL=http://model-service:8000` — o Backend usa o nome do serviço (`model-service`), não `localhost`, para se comunicar dentro da rede interna do Docker (`app-network`, tipo `bridge`).

**Como o modelo chega dentro do container hoje:** o `Dockerfile` do `model-service` faz `COPY models ./models` — ou seja, o `.pkl` é copiado para dentro da imagem no momento do build, não montado como volume. Na prática, isso significa que **qualquer atualização do modelo exige rebuild da imagem** (`docker compose build model-service`), não é suficiente só trocar o arquivo na pasta. É uma escolha válida para o momento (simplicidade), mas vale que o time saiba dessa implicação.

**Pendência de limpeza:** o serviço `backend` no `docker-compose.yml` tem uma variável `NODE_ENV=development`, que não tem nenhum efeito sobre uma aplicação Spring Boot (é convenção de projetos Node.js/JavaScript). Foi adicionada, aparentemente sem essa intenção, por alguém de fora do time de Backend. Recomendação: remover essa variável do serviço `backend` agora; se for necessária para o Frontend futuramente, ela deve entrar no bloco do serviço `frontend`, quando ele for adicionado ao compose — não no `backend`.

---

## 7. Dataset e Modelo (Data Science)

- **Origem do dataset:** 100% simulado — gerado via `numpy`, semente fixa (`seed 42`), 50.000 registros
- **Campos do contrato de API:** os 5 originais do edital
- **Variáveis testadas e descartadas:** `temperatura` e `ar_condicionado` — excluídas do contrato por decisão da equipe (fora do escopo do edital, complexidade de integração, validação incompleta com dados simulados)
- **Critério de classificação:** quartis de `consumo_kwh`, calculados por `tipo_imovel` — ver `criterios-classificacao.md`
- **Modelo escolhido:** Random Forest com 2 features de interação, sem otimização de hiperparâmetros
- **Acurácia real: 61,94%** — não confundir com números de referências antigas ("94%"), que não são reais
- **Recall da classe "Ineficiente": 0,45** — limitação conhecida e documentada, não escondida
- **Estimativa de ROI (projeção de negócio, não medição real):** até 15% de redução nos custos operacionais e até R$ 450.000,00/ano de economia projetada para uma carteira de imóveis de médio porte — **usar no pitch sempre com a ressalva de que é projeção**, nunca como fato medido

---

## 8. Registro de Decisões

| Data | Decisão | Motivo |
|---|---|---|
| 2026-08-12 | Porta oficial do Backend confirmada: **9091** (não 8080) | Confirmado com o time, batendo com `application.properties`, `docker-compose.yml` e `Dockerfile` |
| 2026-08-12 | Nome oficial do serviço de IA no Docker Compose: **`model-service`** (não `data-science`) | Alinhar documentação com o `docker-compose.yml` real |
| 2026-08-12 | Estrutura de pastas do serviço de IA confirmada como `data-science/app/...` | Alinhar documentação com o build context real do Docker Compose |
| 2026-08-12 | Comunicação Backend ↔ model-service validada via Docker Compose, com chamada real a `POST /analise-energetica` | Primeira validação de ponta a ponta fora do ambiente local individual de cada dev |
| 2026-07-24 | Cálculo de `custo_estimado_mensal` migrado do Backend para o serviço de IA (Data Science) | Centraliza toda a lógica de negócio num só lugar |
| 2026-07-24 | Modelo definido: Random Forest com 2 features de interação, 61,94% de acurácia | Melhor resultado entre 3 modelos testados |
| 2026-07-24 | `temperatura` e `ar_condicionado` definitivamente fora do contrato de API e do modelo | Fora do escopo do edital; simplifica integração |
| 2026-07-24 | Nome do produto: **Powerpolis**; nome da equipe: **G9-BR-TEAM-12** | Alinhamento de identidade |
| 2026-07-24 | 4 serviços OCI confirmados: Object Storage, Autonomous Database, API Gateway, OCI Vault | — |
| 2026-07-16 | Trio de Arquitetura confirmado: Alex, Lídia, Samanta | Definido em reunião de equipe |

---

## 9. Pendências em Aberto

- [ ] Remover `NODE_ENV=development` do serviço `backend` no `docker-compose.yml` (ver seção 6)
- [ ] Adicionar o serviço `frontend` ao `docker-compose.yml` quando o React estiver pronto para integrar (Dockerfile do frontend já existe)
- [ ] Avaliar se o modelo deve continuar sendo copiado para a imagem em build time, ou passar a ser montado como volume (ver seção 6) — nota: para `MODEL_SOURCE=oci` o download já é automático via SDK
- [ ] Investigar com a Data Science: o exemplo de teste rotulado "Ineficiente" que retornou "Moderado" — já resolvido pela correção da lógica de recomendações (dicionário por categoria real), mas vale uma validação final
- [ ] Confirmar tratamento de `tipo_imovel` inválido — já implementado no `TratadorDeErros` (400 Bad Request), validar se cobre todos os casos
- [ ] Provisionar a instância Compute (OCI, produção) necessária para o Backend ficar acessível ao API Gateway
- [x] ~~Configurar Object Storage~~ — **Resolvido:** integração funcional via `model_loader.py`, bucket `powerpolis-bucket-models` testado localmente com `MODEL_SOURCE=oci`
- [ ] Configurar Autonomous Database, API Gateway e Vault de fato na OCI (Vault e Autonomous Database provisionados no compartment `powerpolis`, mas ainda não integrados ao runtime)
- [ ] Responsável por manter o CI/CD, considerando a saída da Dryelli do projeto
