<div align="center">

# ⚡ Powerpolis — EnergiAI

### Inteligencia Artificial para la Clasificación de Eficiencia Energética

**Hackathon ONE G9 - Alura + Oracle**

<a href="https://alura-es-cursos.github.io/projetos-hackathon-g9-brasil/">
  <img src="https://img.shields.io/badge/Ver%20Página%20del%20Desafío-Haz%20Clic%20Aquí-blue?style=for-the-badge&logo=github" alt="Enlace del Desafío">
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

🌐 Lee esto en otros idiomas: <a href="../README.md">Português</a> | <a href="README.en.md">English</a>

</div>

---

## <img src="../innokrea/frontend/src/assets/powerpolis-logo.png" width="24" alt="Powerpolis"> Sobre el Proyecto

> _"El proyecto Powerpolis (EnergiAI) ayuda a clientes sostenibles a analizar su consumo de energía e identificar el origen de sus gastos mensuales mediante la categorización de la eficiencia energética. A través de IA predictiva y asertiva, la solución conecta de manera eficiente a consumidores conscientes con las soluciones ideales de energía solar."_

**Powerpolis** es la solución del equipo **G9-BR-TEAM-12** para el desafío **EnergiAI**: una aplicación que recibe datos de consumo energético de una vivienda o pequeño establecimiento y, utilizando un modelo de Machine Learning entrenado desde cero por el equipo, clasifica el perfil en **Eficiente, Moderado o Ineficiente** y además genera recomendaciones personalizadas de optimización y una estimación de costo mensual, todo entregado mediante una **API REST**, integrada con **Oracle Cloud Infrastructure (OCI)**.

---

## 🎯 El Desafío

Desarrollar en 6 semanas un **MVP** funcional capaz de:

1. Analizar patrones de consumo energético y clasificar perfiles de eficiencia;
2. Generar recomendaciones prácticas de mejora;
3. Estimar impactos financieros con base en una tarifa de referencia;
4. Poner a disposición los resultados mediante una API REST;
5. Utilizar la infraestructura de **OCI** como parte de la arquitectura de la solución.

**El dolor real detrás del desafío:** muchas personas reciben facturas de energía elevadas, pero tienen poca visibilidad sobre qué hábitos y equipos impactan más sus gastos. Powerpolis existe para transformar datos brutos de consumo en decisiones conscientes, así pudiendo entender el propio perfil, identificar desperdicio, recibir recomendaciones y hacer seguimiento de la evolución a lo largo del tiempo.

---

## ⚙️ Cómo Funciona

**Endpoint principal:**
```
POST /analise-energetica
```

**Ejemplo de entrada:**
```json
{
  "consumo_kwh": 420,
  "uso_horario_pico": true,
  "quantidade_equipamentos": 10,
  "tipo_imovel": "Casa",
  "horas_alto_consumo": 8
}
```

**Ejemplo de salida (validado contra el modelo real entrenado):**
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

### Arquitectura

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite (interfaz web responsiva) |
| Backend | Java 21 + Spring Boot (orquesta la solicitud y expone la API) |
| Servicio de IA | Python + FastAPI (encapsula el modelo entrenado) `POST /predict` |
| Ciencia de Datos | Python + Pandas + Scikit-Learn (Random Forest) |
| Infraestructura | Docker Compose + Oracle Cloud Infrastructure (OCI) |

El Backend nunca reimplementa la inteligencia del producto, toda la clasificación, recomendaciones y cálculo de costo son responsabilidad del servicio de IA. En caso de que FastAPI esté fuera de línea, el frontend cuenta con un mecanismo de respaldo (fallback) implementado.

---

## 🔍 Aspectos Técnicos Destacados

- **Modelo entrenado desde cero:** Random Forest con features de interacción, **61,94% de precisión** en el conjunto de prueba, comparado formalmente contra Regresión Logística y Árbol de Decisión antes de la elección final.
- **Criterio de clasificación con justificación estadística:** los umbrales de Eficiente/Moderado/Ineficiente se calculan por cuartil de consumo, **dentro de cada tipo de inmueble**, evitando comparar una industria con un apartamento en la misma escala.
- **Dataset simulado con rigor:** 50.000 registros generados de forma determinística (semilla fija), con decisiones de alcance documentadas, incluyendo la exclusión consciente de variables climáticas, para mantener la API alineada con el desafío.
- **4 servicios OCI integrados por decisión de arquitectura:** Object Storage, Autonomous Database, API Gateway y Vault.
- **Entorno contenedorizado y validado de extremo a extremo:** Backend y servicio de IA se levantan juntos vía Docker Compose y se comunican de verdad, probado con solicitudes reales, no solo con los contenedores iniciando sin error.

---

## 👥 Equipo — G9-BR-TEAM-12

| Integrante | Rol | Enlaces |
|---|---|---|
| **Alan Anderson** | Backend Developer | <a href="https://www.linkedin.com/in/alan-anderson-dev/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/alanandersondev"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Alex Furukawa** | Full Stack Developer | <a href="https://www.linkedin.com/in/lexkawa/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/dev-corvus/"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Antônio Carlos Martins Teixeira** | Frontend Developer | <a href="https://www.linkedin.com/in/antonio-carlos-martins-teixeira"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/digichargeac"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Kauã da Silva Barros** | Backend Developer | <a href="https://www.linkedin.com/in/kauabarros/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/kaua3-c"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Lídia Moura** | Data Analyst · Líder del equipo | <a href="https://www.linkedin.com/in/lidimoura/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/lidimoura"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Pedro Henrique Tireli** | Data Scientist | <a href="https://www.linkedin.com/in/phtirelli/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/phtirelli"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |
| **Samanta Sá** | Backend Developer · Scrum Master | <a href="https://www.linkedin.com/in/engsamantasa/"><img src="../innokrea/frontend/src/assets/linkedin-icon.png" width="24" alt="LinkedIn"></a> <a href="https://github.com/engsamantasa"><img src="../innokrea/frontend/src/assets/github-icon.png" width="24" alt="GitHub"></a> |

El equipo circula entre áreas: el trío **Lídia, Samanta y Alex** lidera las decisiones de arquitectura; **Kauã** apoya el frontend cuando es necesario; **Alex**, como full-stack, también refuerza el backend. Esta colaboración cruzada ayudó al equipo a colaborar con distintos niveles de experiencia y definir cómo se comunicaría cada área con el proyecto.

---

## 💼 Modelo de Negocio y Aplicación de Mercado

> **Dirección estratégica (aún no implementada):** forma parte de la visión de producto para las próximas fases.

Además del uso directo por parte del consumidor final, Powerpolis abre un segundo frente de valor: los perfiles clasificados como **Moderado** o **Ineficiente** representan precisamente al público con mayor potencial de ahorro al migrar a energía solar. Este público representa un mercado con gran potencial de ingresos, convirtiendo la clasificación en un mecanismo natural de **calificación de clientes potenciales (leads)** para empresas del sector de paneles solares. El equipo validó esta dirección como el siguiente paso del producto, con potencial de generar valor tanto para el usuario final (ahorro) como para socios comerciales (leads calificados con datos reales de consumo, no mediante formularios genéricos).

---

## 🗺️ Hoja de Ruta Post-Hackathon

**Ciencia de Datos:** migración a un dataset con datos reales (fuentes públicas como UCI Household Power Consumption e IEEE DataPort), pipeline de producción vía `sklearn.Pipeline`, reentrenamiento periódico del modelo, evaluación de Gradient Boosting (XGBoost/LightGBM) y dashboard de BI para el seguimiento de las predicciones.

**Producto:** inicio de sesión e historial de consumo del usuario con gráficos de evolución, e integración con dispositivos para hogares inteligentes (IoT) para lectura automática del consumo. Además de una función de gamificación, donde los usuarios acumulan puntos por acciones que reduzcan el consumo.

---

## 📌 Transparencia

Partes del desarrollo y organización del cuaderno (notebook) de Ciencia de Datos contaron con el apoyo de herramientas de IA (Gemini, integrado en Google Colab y Antigravity IDE; Copilot, integrado en VS Code) para organización, formato y auditoría de consistencia. Todas las decisiones técnicas: criterios de clasificación, elección de características (features) y configuración final del modelo fueron definidas y validadas por el equipo.

---

<div align="center">

**[Hackathon ONE G9 — Alura + Oracle](https://alura-es-cursos.github.io/projetos-hackathon-g9-brasil/)**

</div>
