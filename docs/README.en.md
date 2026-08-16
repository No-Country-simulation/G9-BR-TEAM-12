<div align="center">

# ⚡ Powerpolis · EnergiAI

### Artificial Intelligence for Energy Efficiency Classification

**Hackathon ONE G9 - Alura + Oracle**

<a href="https://alura-es-cursos.github.io/projetos-hackathon-g9-brasil/">
  <img src="https://img.shields.io/badge/View%20Challenge%20Page-Click%20Here-blue?style=for-the-badge&logo=github" alt="Challenge Link">
</a>

<br>

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-6DB33F?logo=springboot&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-Random%20Forest-F7931E?logo=scikitlearn&logoColor=white)
![React](https://img.shields.io/badge/React-2496ED?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22.11-6DB33F?logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![OCI](https://img.shields.io/badge/Oracle%20Cloud-F80000?logo=oracle&logoColor=white)

🌐 Read this in other languages: <a href="../README.md">Português</a> | <a href="README.es.md">Español</a>

</div>

---

## <img src="../innokrea/frontend/src/assets/powerpolis-logo.png" width="24" alt="Powerpolis"> About the Project

**Powerpolis** is the **G9-BR-TEAM-12** team's solution for the **EnergiAI** challenge: an application that receives energy consumption data from a household or small business and, using a Machine Learning model trained from scratch by the team, classifies the energy profile as **Efficient, Moderate, or Inefficient** and also generates personalised optimisation recommendations and a monthly cost estimate, all delivered through a **REST API**, integrated with **Oracle Cloud Infrastructure (OCI)**.

---

## 🎯 The Challenge

Build in 6 weeks a functional **MVP** capable of:

1. Analysing energy consumption patterns and classifying efficiency profiles;
2. Generating practical improvement recommendations;
3. Estimating financial impact based on a reference cost;
4. Delivering results through a REST API;
5. Using OCI infrastructure as part of the solution's architecture.

**The real pain behind the challenge:** many people receive high electricity bills but have little visibility into which habits and household equipments impact their spending the most. Powerpolis exists to turn raw consumption data into conscious decisions, nderstanding your own profile, identifying waste, receiving recommendations, and tracking progress over time.

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
| Frontend | React + Vite (responsive web interface) |
| Backend | Java 21 + Spring Boot (orchestrates requests and exposes the API) |
| AI Service | Python + FastAPI (encapsulates the trained model) `POST /predict` |
| Data Science | Python + Pandas + Scikit-Learn (Random Forest) |
| Infrastructure | Docker Compose + Oracle Cloud Infrastructure (OCI) |

The Backend never reimplements the product's intelligence, all classification, recommendations, and cost calculation logic lives in the AI service. If FastAPI is offline, the frontend has a fallback mechanism implemented.

---

## 🔍 Technical Highlights

- **Model trained from scratch:** Random Forest with interaction features, **61.94% accuracy** on the test set, formally benchmarked against Logistic Regression and Decision Tree before the final choice.
- **Statistically justified classification criteria:** the Efficient/Moderate/Inefficient thresholds are computed by consumption quartile, **within each property type**, avoiding comparing an industrial facility to an apartment on the same scale.
- **Rigorously built simulated dataset:** 50,000 records generated deterministically (fixed seed), with scope decisions documented, including the conscious exclusion of climate variables, to keep the API aligned with the challenge requirements.
- **4 OCI services integrated by architectural decision:** Object Storage, Autonomous Database, API Gateway, and Vault.
- **Fully containerised, end-to-end validated environment:** Backend and AI service run together via Docker Compose and communicate for real, tested with actual requests, not just containers starting without errors.

---

## 👥 Team — G9-BR-TEAM-12

| Member | Role | Links |
|---|---|---|
| **Alan Anderson** | Backend Developer | <a href="https://www.linkedin.com/in/alan-anderson-dev/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/alanandersondev"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Alex Furukawa** | Full Stack Developer | <a href="https://www.linkedin.com/in/lexkawa/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/dev-corvus/"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Antônio Carlos Martins Teixeira** | Frontend Developer | <a href="https://www.linkedin.com/in/antonio-carlos-martins-teixeira"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/digichargeac"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Kauã da Silva Barros** | Backend Developer | <a href="https://www.linkedin.com/in/kauabarros/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/kaua3-c"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Lídia Moura** | Data Analyst · Team Lead | <a href="https://www.linkedin.com/in/lidimoura/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/lidimoura"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Pedro Henrique Tireli** | Data Scientist | <a href="https://www.linkedin.com/in/phtirelli/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/phtirelli"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Samanta Sá** | Backend Developer · Scrum Master | <a href="https://www.linkedin.com/in/engsamantasa/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/engsamantasa"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |

The team moves across areas: the trio **Lídia, Samanta, and Alex** leads architecture decisions; **Kauã** supports the frontend when needed; **Alex**, as a full-stack developer, also reinforces the backend. This cross-functional collaboration helped the team collaborate across different seniority levels and establish clear connection between project areas.

---

## 💼 Business Model and Market Application

> **Strategic direction (not yet implemented):** part of the product vision for upcoming phases.

Beyond direct use by the end consumer, Powerpolis opens a second value stream: profiles classified as **Moderate** or **Inefficient** represent precisely the audience with the highest potential savings from switching to solar energy. This audience represents a market with significant revenue potential, making the classification a natural **lead qualification mechanism** for companies in the solar panel sector. The team validated this direction as the product's next step, with the potential to generate value for both the end user (savings) and commercial partners (leads qualified by real consumption data, rather than generic forms).

---

## 🗺️ Post-Hackathon Roadmap

**Data Science:** migration to a dataset built with real data (public sources such as UCI Household Power Consumption and IEEE DataPort), production pipeline via `sklearn.Pipeline`, periodic model retraining, evaluation of Gradient Boosting (XGBoost/LightGBM), and a BI dashboard to track predictions.

**Product:** user login and consumption history with progress charts, plus integration with smart home (IoT) devices for automated consumption reading. Additionally, a gamification feature where users accumulate points for actions that reduce energy consumption.

---

## 📌 Transparency

Parts of the development and organisation of the Data Science notebook were supported by AI tools (Gemini, integrated into Google Colab and Antigravity IDE; Copilot, integrated into VS Code) for organisation, formatting, and consistency auditing. All technical decisions: classification criteria, feature selection, and final model configuration were defined and validated by the team.

---

<div align="center">

**[Hackathon ONE G9 — Alura + Oracle](https://alura-es-cursos.github.io/projetos-hackathon-g9-brasil/)**

</div>
