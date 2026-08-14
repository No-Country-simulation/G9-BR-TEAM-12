<div align="center">

# ⚡ Powerpolis — EnergiAI

### Artificial Intelligence for Energy Efficiency Classification

**Hackathon ONE G9 — Alura + Oracle**

<a href="https://alura-es-cursos.github.io/projetos-hackathon-g9-brasil/">
  <img src="https://img.shields.io/badge/View%20Challenge%20Page-Click%20Here-blue?style=for-the-badge&logo=github" alt="Challenge Link">
</a>

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-6DB33F?logo=springboot&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-Random%20Forest-F7931E?logo=scikitlearn&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![OCI](https://img.shields.io/badge/Oracle%20Cloud-F80000?logo=oracle&logoColor=white)

🌐 Read this in other languages: <a href="../README.md">Português</a> | <a href="README.es.md">Español</a>

</div>

---

## 📝 About the Project

**Powerpolis** is team **G9-BR-TEAM-12**'s solution for the **EnergiAI** challenge: an application that receives energy consumption data from a household or small business and, using a Machine Learning model trained from scratch by the team, classifies the energy profile as **Efficient, Moderate, or Inefficient** — generating personalized optimization recommendations and a monthly cost estimate, all delivered through a **REST API**, integrated with **Oracle Cloud Infrastructure (OCI)**.

More than a functional MVP, the project documents every technical decision made along the way — from the statistical classification criteria to the communication architecture between services — because we believe a good project should be able to explain itself, not just work.

---

## 🎯 The Challenge

Build, in a few weeks, a functional **MVP** capable of:

1. Analyzing energy consumption patterns and classifying efficiency profiles;
2. Generating practical improvement recommendations;
3. Estimating financial impact based on a reference tariff;
4. Delivering results through a REST API;
5. Using OCI infrastructure as part of the solution's architecture.

**The real pain behind the challenge:** many people receive high electricity bills but have little visibility into which habits and appliances impact their spending the most. Powerpolis exists to turn raw consumption data into conscious decisions — understanding your own profile, identifying waste, receiving recommendations, and tracking progress over time.

---

## ⚙️ How It Works

**Main endpoint:**
```
POST /analise-energetica
```

**Input example:**
```json
{
  "consumo_kwh": 420,
  "uso_horario_pico": true,
  "quantidade_equipamentos": 10,
  "tipo_imovel": "Casa",
  "horas_alto_consumo": 8
}
```

**Output example (validated against the real trained model):**
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

### Architecture

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Java 21 + Spring Boot — orchestrates the request and exposes the API |
| AI Service | Python + FastAPI — wraps the trained model (`POST /predict`) |
| Data Science | Python, Pandas, Scikit-Learn (Random Forest) |
| Infrastructure | Docker + Docker Compose · Oracle Cloud Infrastructure (OCI) |

The Backend never reimplements the product's intelligence — all classification, recommendation, and cost calculation logic lives in the AI service, keeping a clear separation of concerns between the two layers.

---

## 🔍 Technical Highlights

- **Model trained from scratch:** Random Forest with interaction features, **61.94% accuracy** on the test set, formally benchmarked against Logistic Regression and Decision Tree before the final choice.
- **Statistically justified classification criteria:** the Efficient/Moderate/Inefficient thresholds are computed by consumption quartile, **within each property type** — avoiding comparing an industrial facility to an apartment on the same scale.
- **Rigorously built simulated dataset:** 50,000 records generated deterministically (fixed seed), with scope decisions documented — including the conscious exclusion of climate variables, to keep the API aligned with the challenge requirements.
- **4 OCI services integrated by architectural decision:** Object Storage, Autonomous Database, API Gateway, and Vault.
- **Fully containerized, end-to-end validated environment:** Backend and AI service run together via Docker Compose and communicate for real — tested with actual requests, not just containers starting without errors.

---

## 👥 Team — G9-BR-TEAM-12

| Member | Role | Links |
|---|---|---|
| **Lídia Moura** | Data Analyst · Team Lead | [LinkedIn](https://www.linkedin.com/in/lidimoura/) · [GitHub](https://github.com/lidimoura) |
| **Pedro Henrique Tireli** | Data Scientist | [LinkedIn](https://www.linkedin.com/in/phtirelli/) · [GitHub](https://github.com/phtirelli) |
| **Samanta Sá** | Backend Developer · Scrum Master | [LinkedIn](https://www.linkedin.com/in/engsamantasa/) · [GitHub](https://github.com/engsamantasa) |
| **Alan Anderson** | Backend Developer | [LinkedIn](https://www.linkedin.com/in/alan-anderson-dev/) · [GitHub](https://github.com/alanandersondev) |
| **Kauã da Silva Barros** | Backend Developer | [GitHub](https://github.com/kaua3-c) |
| **Alex Furukawa** | Full Stack Developer | [LinkedIn](https://www.linkedin.com/in/lexkawa/) · [GitHub](https://github.com/dev-corvus/) |
| **Antônio Carlos Martins Teixeira** | Frontend Developer | [LinkedIn](https://www.linkedin.com/in/antonio-carlos-martins-teixeira) · [GitHub](https://github.com/digichargeac) |

The team moves across areas: the trio **Lídia, Samanta, and Alex** leads architecture decisions; **Alan** supports the frontend when needed; **Alex**, as a full stack developer, also reinforces the backend. This cross-functional collaboration helped the team keep momentum despite differing schedules over the 5 weeks of the hackathon.

---

## 💼 Business Model and Market Application

> **Strategic direction — not yet implemented; part of the product vision for upcoming phases.**

Beyond direct use by the end consumer, Powerpolis opens a second value stream: profiles classified as **Moderate** or **Inefficient** represent exactly the audience with the highest savings potential from switching to solar energy — making the classification itself a natural **lead qualification mechanism** for solar energy companies. The team has already validated this direction as the product's next step, with potential value for both the end user (savings) and commercial partners (leads qualified by real consumption data, not generic forms).

---

## 🗺️ Post-Hackathon Roadmap

**Data Science:** migration to a dataset built with real data (public sources such as UCI Household Power Consumption and IEEE DataPort), production pipeline via `sklearn.Pipeline`, periodic model retraining, evaluation of Gradient Boosting (XGBoost/LightGBM), and a BI dashboard to track predictions.

**Product:** user login and consumption history with evolution charts, plus integration with smart home (IoT) devices for automatic consumption readings.

---

## 📌 Transparency

Parts of the Data Science notebook's development and organization were supported by AI tools (Gemini, integrated with Google Colab) for organization, formatting, and consistency auditing. All technical decisions — classification criteria, feature selection, and final model configuration — were defined and validated by the team.

---

<div align="center">

**[Hackathon ONE G9 — Alura + Oracle](https://alura-es-cursos.github.io/projetos-hackathon-g9-brasil/)**

</div>
