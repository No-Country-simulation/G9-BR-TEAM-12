<div align="center">

# ⚡ Powerpolis — EnergiAI

### Inteligencia Artificial para la Clasificación de Eficiencia Energética

**Hackathon ONE G9 — Alura + Oracle**

<a href="https://alura-es-cursos.github.io/projetos-hackathon-g9-brasil/">
  <img src="https://img.shields.io/badge/Ver%20Página%20del%20Desafío-Haz%20Clic%20Aquí-blue?style=for-the-badge&logo=github" alt="Enlace del Desafío">
</a>

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-6DB33F?logo=springboot&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-Random%20Forest-F7931E?logo=scikitlearn&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![OCI](https://img.shields.io/badge/Oracle%20Cloud-F80000?logo=oracle&logoColor=white)

🌐 Lee esto en otros idiomas: <a href="../README.md">Português</a> | <a href="README.en.md">English</a>

</div>

---

## 📝 Sobre el Proyecto

**Powerpolis** es la solución del equipo **G9-BR-TEAM-12** para el desafío **EnergiAI**: una aplicación que recibe datos de consumo energético de una vivienda o pequeño establecimiento y, utilizando un modelo de Machine Learning entrenado desde cero por el equipo, clasifica el perfil en **Eficiente, Moderado o Ineficiente** — generando recomendaciones personalizadas de optimización y una estimación de costo mensual, todo entregado mediante una **API REST**, integrada con **Oracle Cloud Infrastructure (OCI)**.

Más que un MVP funcional, el proyecto documenta cada decisión técnica tomada en el camino — desde los criterios estadísticos de clasificación hasta la arquitectura de comunicación entre los servicios — porque creemos que un buen proyecto debe poder explicarse a sí mismo, no solo funcionar.

---

## 🎯 El Desafío

Desarrollar, en pocas semanas, un **MVP** funcional capaz de:

1. Analizar patrones de consumo energético y clasificar perfiles de eficiencia;
2. Generar recomendaciones prácticas de mejora;
3. Estimar impactos financieros con base en una tarifa de referencia;
4. Poner a disposición los resultados mediante una API REST;
5. Utilizar la infraestructura de **OCI** como parte de la arquitectura de la solución.

**El dolor real detrás del desafío:** muchas personas reciben facturas de energía elevadas, pero tienen poca visibilidad sobre qué hábitos y equipos impactan más sus gastos. Powerpolis existe para transformar datos brutos de consumo en decisiones conscientes — entender el propio perfil, identificar desperdicio, recibir recomendaciones y hacer seguimiento de la evolución a lo largo del tiempo.

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
| Frontend | React |
| Backend | Java 21 + Spring Boot — orquesta la solicitud y expone la API |
| Servicio de IA | Python + FastAPI — encapsula el modelo entrenado (`POST /predict`) |
| Ciencia de Datos | Python, Pandas, Scikit-Learn (Random Forest) |
| Infraestructura | Docker + Docker Compose · Oracle Cloud Infrastructure (OCI) |

El Backend nunca reimplementa la inteligencia del producto — toda la clasificación, recomendación y cálculo de costo es responsabilidad del servicio de IA, manteniendo una separación clara de responsabilidades entre ambas capas.

---

## 🔍 Aspectos Técnicos Destacados

- **Modelo entrenado desde cero:** Random Forest con features de interacción, **61,94% de precisión** en el conjunto de prueba, comparado formalmente contra Regresión Logística y Árbol de Decisión antes de la elección final.
- **Criterio de clasificación con justificación estadística:** los umbrales de Eficiente/Moderado/Ineficiente se calculan por cuartil de consumo, **dentro de cada tipo de inmueble** — evitando comparar una industria con un apartamento en la misma escala.
- **Dataset simulado con rigor:** 50.000 registros generados de forma determinística (semilla fija), con decisiones de alcance documentadas — incluyendo la exclusión consciente de variables climáticas, para mantener la API alineada con el desafío.
- **4 servicios OCI integrados por decisión de arquitectura:** Object Storage, Autonomous Database, API Gateway y Vault.
- **Entorno contenedorizado y validado de extremo a extremo:** Backend y servicio de IA se levantan juntos vía Docker Compose y se comunican de verdad — probado con solicitudes reales, no solo con los contenedores iniciando sin error.

---

## 👥 Equipo — G9-BR-TEAM-12

| Integrante | Rol | Enlaces |
|---|---|---|
| **Lídia Moura** | Data Analyst · Líder del equipo | [LinkedIn](https://www.linkedin.com/in/lidimoura/) · [GitHub](https://github.com/lidimoura) |
| **Pedro Henrique Tireli** | Data Scientist | [LinkedIn](https://www.linkedin.com/in/phtirelli/) · [GitHub](https://github.com/phtirelli) |
| **Samanta Sá** | Backend Developer · Scrum Master | [LinkedIn](https://www.linkedin.com/in/engsamantasa/) · [GitHub](https://github.com/engsamantasa) |
| **Alan Anderson** | Backend Developer | [LinkedIn](https://www.linkedin.com/in/alan-anderson-dev/) · [GitHub](https://github.com/alanandersondev) |
| **Kauã da Silva Barros** | Backend Developer | [GitHub](https://github.com/kaua3-c) |
| **Alex Furukawa** | Full Stack Developer | [LinkedIn](https://www.linkedin.com/in/lexkawa/) · [GitHub](https://github.com/dev-corvus/) |
| **Antônio Carlos Martins Teixeira** | Frontend Developer | [LinkedIn](https://www.linkedin.com/in/antonio-carlos-martins-teixeira) · [GitHub](https://github.com/digichargeac) |

El equipo circula entre áreas: el trío **Lídia, Samanta y Alex** lidera las decisiones de arquitectura; **Alan** apoya el frontend cuando es necesario; **Alex**, como full stack, también refuerza el backend. Esta colaboración cruzada ayudó al equipo a mantener el ritmo incluso con agendas distintas durante las 5 semanas del hackathon.

---

## 💼 Modelo de Negocio y Aplicación de Mercado

> **Dirección estratégica — aún no implementada; forma parte de la visión de producto para las próximas fases.**

Más allá del uso directo por el consumidor final, Powerpolis abre un segundo frente de valor: los perfiles clasificados como **Moderado** o **Ineficiente** representan justamente al público con mayor potencial de ahorro al migrar a energía solar — convirtiendo la clasificación, por sí sola, en un mecanismo natural de **calificación de leads** para empresas del sector de energía solar. El equipo ya validó esta dirección como el próximo paso del producto, con potencial de generar valor tanto para el usuario final (ahorro) como para socios comerciales (leads calificados por datos reales de consumo, no por formularios genéricos).

---

## 🗺️ Hoja de Ruta Post-Hackathon

**Ciencia de Datos:** migración a un dataset con datos reales (fuentes públicas como UCI Household Power Consumption e IEEE DataPort), pipeline de producción vía `sklearn.Pipeline`, reentrenamiento periódico del modelo, evaluación de Gradient Boosting (XGBoost/LightGBM) y dashboard de BI para el seguimiento de las predicciones.

**Producto:** inicio de sesión e historial de consumo del usuario con gráficos de evolución, además de integración con dispositivos de hogares inteligentes (IoT) para lectura automática de consumo.

---

## 📌 Transparencia

Partes del desarrollo y organización del notebook de Ciencia de Datos contaron con el apoyo de herramientas de IA (Gemini, integrado con Google Colab) para organización, formato y auditoría de consistencia. Todas las decisiones técnicas — criterios de clasificación, selección de features y configuración final del modelo — fueron definidas y validadas por el equipo.

---

<div align="center">

**[Hackathon ONE G9 — Alura + Oracle](https://alura-es-cursos.github.io/projetos-hackathon-g9-brasil/)**

</div>
