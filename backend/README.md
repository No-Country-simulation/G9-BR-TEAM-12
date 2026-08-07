# Hackathon ONE – Projetos G9 | Alura + Oracle 

<p align="center">
  <a href="https://alura-es-cursos.github.io/projetos-hackathon-g9-brasil/">
    <img src="https://img.shields.io/badge/Acessar%20Página%20do%20Projeto-Clique%20Aqui-blue?style=for-the-badge&logo=github" alt="Link do Projeto">
  </a>
</p>


---

## 📝 Descrição do Projeto.

O objetivo deste projeto é criar uma solução inteligente capaz de analisar padrões de consumo de energia elétrica e gerar informações que auxiliem na tomada de decisões relacionadas à eficiência energética. 

A aplicação recebe dados de consumo de uma residência ou pequeno estabelecimento (como consumo mensal em kWh, horários de pico, quantidade de equipamentos, etc.) e, utilizando técnicas de **Ciência de Dados**, identifica padrões e classifica o perfil energético em categorias:
* **Eficiente**
* **Moderado**
* **Ineficiente**

Além da classificação, o sistema fornece recomendações personalizadas para redução de desperdício, estima os impactos financeiros com base em uma tarifa de referência e disponibiliza os resultados via **API REST (JSON)**, utilizando a infraestrutura da **Oracle Cloud Infrastructure (OCI)**.

---

## 🎯 Objetivo do Hackathon

Desenvolver um **MVP (Minimum Viable Product)** funcional capaz de:
1. Analisar padrões de consumo energético e classificar perfis de eficiência.
2. Gerar recomendações práticas de melhoria.
3. Estimar impactos financeiros com base em uma tarifa de referência.
4. Disponibilizar os resultados por meio de uma API REST.
5. Utilizar pelo menos um serviço **OCI** como parte integrante da arquitetura.

---

## 💡 Necessidade do Cliente (Visão de Negócio)

Muitas pessoas recebem contas de energia elevadas, mas possuem pouca visibilidade sobre quais hábitos e equipamentos mais impactam seus gastos. A solução visa transformar dados brutos em informações claras e úteis para apoiar decisões mais conscientes, permitindo ao usuário:
* Entender seu perfil de consumo energético;
* Identificar possíveis pontos de desperdício;
* Receber recomendações de melhoria personalizadas;
* Estimar custos associados ao consumo;
* Acompanhar indicadores de eficiência ao longo do tempo.

---

## 📈 Validação de Mercado

A preocupação com a eficiência energética e sustentabilidade é uma demanda crescente para empresas, governos e consumidores. Soluções focadas neste nicho agregam valor direto ao:
* Reduzir custos operacionais e residenciais;
* Melhorar indicadores de sustentabilidade (ESG);
* Incentivar o consumo consciente e monitorar padrões de utilização;
* Apoiar estratégias robustas de eficiência energética.

---

## ⚙️ Funcionalidades Obrigatórias (MVP)

### Análise do Perfil Energético & Estimativa Financeira
* **Endpoint:** `POST /analise-energetica`
* **Tarifa de Referência Utilizada:** R$ 0,75 por kWh *(valor médio nacional recomendado)*

#### 📥 Exemplo de Entrada (Payload):
```json
{
  "consumo_kwh": 420,
  "uso_horario_pico": true,
  "quantidade_equipamentos": 10,
  "tipo_imovel": "Casa",
  "horas_alto_consumo": 8
}
```

## Equipe 12

* Samanta Sá | Backend Developer - Scrum Maser
[Github](https://github.com/engsamantasa)
[Linkedin](https://www.linkedin.com/in/engsamantasa/)

* Kauã da Silva Barros | Backend Developer
[Github](https://github.com/kaua3-c)

* Alan Anderson | Backend Developer 
[Github](https://github.com/alanandersondev)
[Linkedin](https://www.linkedin.com/in/alan-anderson-dev/)


* Mayara Medeiros Giangiacomo | Backend Developer


* Lídia Moura | Data analyst - Líder
[Github](https://github.com/lidimoura)
[Linkedin](https://www.linkedin.com/in/lidimoura/)


* Alex Furukawa | Full Stack Developer
[Github](https://github.com/dev-corvus/)
[Linkedin](https://www.linkedin.com/in/lexkawa/)


* Pedro Henrique Rodrigues da Costa Tireli | Data Scientist
[Github](https://github.com/phtirelli)
[Linkedin](https://www.linkedin.com/in/phtirelli/)


* Dryelli Vitoria Martins de Freitas | Architect (Software / Solution Architect)


* Antônio Carlos Martins Teixeira | Frontend Developer
[Github](https://github.com/digichargeac)
[Linkedin](www.linkedin.com/in/antonio-carlos-martins-teixeira)
