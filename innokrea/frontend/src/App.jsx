import { Routes, Route } from "react-router-dom"
import { ButtonCallToAction } from "./components/ButtonCallToAction"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import { SmartCity } from "./components/SmartCity"

import logoOn from "./assets/powerpolis-logo.png"
import logoOff from "./assets/powerpolis-logo-off.png"

import alanImg from "./assets/alan.jpeg"
import alexImg from "./assets/alex.jpeg"
import carlosImg from "./assets/carlos.jpeg"
import kauaImg from "./assets/kaua.jpeg"
import lidiImg from "./assets/lidi.png"
import pedroImg from "./assets/Pedro Henrique.png"
import samantaImg from "./assets/samanta.jpg"

import githubIcon from "./assets/github-icon.png"
import linkedinIcon from "./assets/linkedin-icon.png"


const teamMembers = [
  {
    name: "Alan Anderson",
    role: "Backend Developer",
    image: alanImg,
    github: "https://github.com/alanandersondev",
    linkedin: "https://www.linkedin.com/in/alan-anderson-dev/"
  },
  {
    name: "Alex Furukawa",
    role: "Full Stack Developer",
    image: alexImg,
    github: "https://github.com/dev-corvus/",
    linkedin: "https://www.linkedin.com/in/lexkawa/"
  },
  {
    name: "Antônio Carlos Martins Teixeira",
    role: "Frontend Developer",
    image: carlosImg,
    github: "https://github.com/digichargeac",
    linkedin: "https://www.linkedin.com/in/antonio-carlos-martins-teixeira"
  },
  {
    name: "Kauã da Silva Barros",
    role: "Backend Developer",
    image: kauaImg,
    github: "https://github.com/kaua3-c",
    linkedin: "https://www.linkedin.com/in/kauabarros/"
  },
  {
    name: "Lídia Moura",
    role: "Data Analyst · Líder",
    image: lidiImg,
    github: "https://github.com/lidimoura",
    linkedin: "https://www.linkedin.com/in/lidimoura/"
  },
  {
    name: "Pedro Henrique Rodrigues da Costa Tireli",
    role: "Data Scientist",
    image: pedroImg,
    github: "https://github.com/phtirelli",
    linkedin: "https://www.linkedin.com/in/phtirelli/"
  },
  {
    name: "Samanta Sá",
    role: "Backend Developer · Scrum Master",
    image: samantaImg,
    github: "https://github.com/engsamantasa",
    linkedin: "https://www.linkedin.com/in/engsamantasa/"
  }
]

function HomePage() {
  return (
    <div className="page-container">
      <div className="hero-card">
        <span className="badge">Eficiência Energética</span>

        <div className="hero-header-logo">
          <span className="hero-prefix">Projeto</span>
          <div className="blinking-logo-wrapper" title="Powerpolis Neon Sign">
            <img src={logoOff} alt="Powerpolis Logo Base" className="logo-base" />
            <img src={logoOn} alt="Powerpolis Logo Neon Glow" className="logo-neon-glow" />
          </div>
        </div>

        <p className="hero-description">
          O projeto Powerpolis (EnergiAI) ajuda clientes sustentáveis a analisar o consumo de energia, descobrindo a fonte dos gastos mensais através da categorização de eficiência energética. A solução será tratada de forma preditiva e assertiva com o uso de IA para conectar consumidores conscientes a soluções ideais de energia solar.
        </p>
        <div className="hero-actions">
          <ButtonCallToAction />
        </div>
      </div>
    </div>
  )
}

function ProductsPage() {
  return <SmartCity />
}

function AboutPage() {
  return (
    <div className="page-container about-page">
      <header className="about-hero">
        <span className="badge">EnergiAI</span>
        <h1>Sobre o Powerpolis</h1>
        <p className="about-hero-desc">
          O <strong>Powerpolis</strong> é a solução da equipe <strong>G9-BR-TEAM-12</strong> para o desafio <strong>EnergiAI</strong>: uma aplicação que recebe dados de consumo energético de uma residência ou pequeno estabelecimento e, usando um modelo de Machine Learning treinado do zero pela equipe, classifica o perfil em <strong>Eficiente, Moderado ou Ineficiente</strong> e ainda gera recomendações personalizadas de otimização e uma estimativa de custo mensal, tudo entregue via <strong>API REST</strong>, com integração à <strong>Oracle Cloud Infrastructure (OCI)</strong>.
        </p>
      </header>

      <div className="about-grid">
        <section className="about-card">
          <h2>O Desafio</h2>
          <p>Desenvolver em 6 semanas um <strong>MVP</strong> funcional capaz de:</p>
          <ol>
            <li>Analisar padrões de consumo energético e classificar perfis de eficiência;</li>
            <li>Gerar recomendações práticas de melhoria;</li>
            <li>Estimar impactos financeiros com base em uma tarifa de referência;</li>
            <li>Disponibilizar os resultados por meio de uma API REST;</li>
            <li>Utilizar a infraestrutura da <strong>OCI</strong> como parte da arquitetura da solução.</li>
          </ol>
          <p className="about-card-note">
            <strong>A dor real por trás do desafio:</strong> muitas pessoas recebem contas de energia elevadas, mas têm pouca visibilidade sobre quais hábitos e equipamentos mais pesam na conta. O Powerpolis existe para transformar dados brutos de consumo em decisões conscientes, assim podendo entender o próprio perfil, identificar desperdício, receber recomendações e acompanhar a evolução ao longo do tempo.
          </p>
        </section>

        <section className="about-card about-card-wide">
          <h2>Como Funciona</h2>
          <p><strong>Endpoint principal:</strong></p>
          <div className="about-code-block">
            <code>POST /analise-energetica</code>
          </div>

          <div className="about-code-pair">
            <div className="about-code-col">
              <h4>Exemplo de entrada</h4>
              <div className="about-code-block">
                <code>{JSON.stringify({
                  consumo_kwh: 420,
                  uso_horario_pico: true,
                  quantidade_equipamentos: 10,
                  tipo_imovel: "Casa",
                  horas_alto_consumo: 8
                }, null, 2)}</code>
              </div>
            </div>
            <div className="about-code-col">
              <h4>Exemplo de saída</h4>
              <div className="about-code-block">
                <code>{JSON.stringify({
                  categoria: "Ineficiente",
                  probabilidade: 0.5287,
                  recomendacoes: [
                    "Alerta Vermelho! Auditoria energética completa necessária.",
                    "Substitua equipamentos antigos por modelos eficientes.",
                    "Implemente automação para controle de energia."
                  ],
                  custo_estimado_mensal: 315.00
                }, null, 2)}</code>
              </div>
            </div>
          </div>
        </section>

        <section className="about-card">
          <h2>Arquitetura</h2>
          <div className="about-arch-list">
            <div className="about-arch-item">
              <span className="about-arch-label">Frontend</span>
              <span className="about-arch-value">React + Vite (interface web responsiva)</span>
            </div>
            <div className="about-arch-item">
              <span className="about-arch-label">Backend</span>
              <span className="about-arch-value">Java 21 + Spring Boot (orquestra a requisição e expõe a API)</span>
            </div>
            <div className="about-arch-item">
              <span className="about-arch-label">Serviço de IA</span>
              <span className="about-arch-value">Python + FastAPI (encapsula o modelo treinado) <code>POST /predict</code></span>
            </div>
            <div className="about-arch-item">
              <span className="about-arch-label">Ciência de Dados</span>
              <span className="about-arch-value">Python + Pandas + Scikit-Learn (Random Forest)</span>
            </div>
            <div className="about-arch-item">
              <span className="about-arch-label">Infraestrutura</span>
              <span className="about-arch-value">Docker Compose + Oracle Cloud Infrastructure (OCI)</span>
            </div>
          </div>
          <p className="about-card-note">
            O Backend nunca reimplementa a inteligência do produto, pois toda classificação, recomendação e cálculo de custo é responsabilidade do serviço de IA. Caso a FastAPI esteja offline, o frontend possui um fallback implementado.
          </p>
        </section>

        <section className="about-card">
          <h2>Destaques Técnicos</h2>
          <ul className="about-highlights">
            <li><strong>Modelo treinado do zero:</strong> Random Forest com features de interação, <strong>61,94% de acurácia</strong> no conjunto de teste, comparado formalmente contra Regressão Logística e Árvore de Decisão antes da escolha final.</li>
            <li><strong>Critério de classificação com justificativa estatística:</strong> os limiares de Eficiente/Moderado/Ineficiente são calculados por quartil de consumo, <strong>dentro de cada tipo de imóvel</strong>, evitando comparar uma indústria com um apartamento na mesma régua.</li>
            <li><strong>Dataset simulado com rigor:</strong> 50.000 registros gerados de forma determinística (seed fixa), com decisões de escopo documentadas, inclusive a exclusão consciente de variáveis de clima, para manter a API aderente ao edital.</li>
            <li><strong>4 serviços OCI integrados por decisão de arquitetura:</strong> Object Storage, Autonomous Database e Vault.</li>
            <li><strong>Ambiente containerizado e validado de ponta a ponta:</strong> Backend e serviço de IA sobem juntos via Docker Compose, testado com chamadas reais, não apenas os containers subindo sem erro.</li>
          </ul>
        </section>

        <section className="about-card">
          <h2>Nossa Equipe</h2>
          <p>
            A equipe circula entre áreas: o trio <strong>Lídia, Samanta e Alex</strong> conduz as decisões de arquitetura; <strong>Kauã</strong> apoia o front-end quando necessário; <strong>Alex</strong>, como full stack, também reforça o backend. Essa colaboração cruzada ajudou o time a colaborar com níveis de senioridade distintas e como cada área se comunicaria com o projeto.
          </p>
        </section>

        <section className="about-card">
          <h2>Modelo de Negócio e Aplicação de Mercado</h2>
          <div className="about-callout">
            <strong>Direção estratégica (ainda não implementada):</strong> faz parte da visão de produto para as próximas fases.
          </div>
          <p>
            Além do uso direto pelo consumidor final, o Powerpolis abre uma segunda frente de valor: perfis classificados como <strong>Moderado</strong> ou <strong>Ineficiente</strong> representam justamente o público com maior potencial de economia ao migrar para energia solar. Esse público representa um mercado com grande potencial de receita, tornando a classificação, um mecanismo natural de <strong>qualificação de leads</strong> para empresas do setor de placas solares. A equipe validou essa direção como próximo passo de produto, com potencial de gerar valor tanto para o usuário final (economia) quanto para parceiros comerciais (leads qualificados por dado real de consumo, não por formulário genérico).
          </p>
        </section>

        <section className="about-card about-card-wide">
          <h2>Roadmap Pós-Hackathon</h2>
          <div className="about-roadmap-grid">
            <div className="about-roadmap-item">
              <h4>Ciência de Dados</h4>
              <p>
                Migração para dataset com dados reais (fontes públicas como UCI Household Power Consumption e IEEE DataPort), pipeline de produção via <code>sklearn.Pipeline</code>, retreinamento periódico do modelo, avaliação de Gradient Boosting (XGBoost/LightGBM) e dashboard de BI para acompanhamento das predições.
              </p>
            </div>
            <div className="about-roadmap-item">
              <h4>Produto</h4>
              <p>
                Login e histórico de consumo do usuário com gráficos de evolução, e integração com dispositivos de casas inteligentes (IoT) para leitura automática de consumo. Além de uma feature para gamificação, onde usuários acumulam pontos por ações que reduzem o consumo.
              </p>
            </div>
          </div>
        </section>

        <section className="about-card">
          <h2>Transparência</h2>
          <p>
            Partes do desenvolvimento e organização do notebook de Ciência de Dados contaram com apoio de ferramentas de IA (Gemini, integrado ao Google Colab e Antigravity IDE; Copilot, integrado no VS Code) para organização, formatação e auditoria de consistência. Todas as decisões técnicas: critérios de classificação, escolha de features e configuração final do modelo foram definidas e validadas pela equipe.
          </p>
        </section>
      </div>

      <footer className="about-footer-link">
        <a href="https://alura-es-cursos.github.io/projetos-hackathon-g9-brasil/" target="_blank" rel="noreferrer" className="cta-button" style={{ fontSize: "0.95rem", padding: "0.75rem 1.75rem" }}>
          Hackathon ONE G9 — Alura + Oracle
        </a>
      </footer>
    </div>
  )
}

function TeamPage() {
  return (
    <div className="page-container team-page">
      <h1>Equipe Powerpolis</h1>
      <div className="team-list">
        {teamMembers.map((member, index) => (
          <div className="member-card" key={index}>
            <div className="fotos">
              <img src={member.image} alt={member.name} />
            </div>
            <h2>{member.name}</h2>
            <p className="team-role">{member.role}</p>
            <div className="member-links">
              {member.github && (
                <a href={member.github} target="_blank" rel="noreferrer">
                  <img src={githubIcon} alt="GitHub" className="social-icon" />
                </a>
              )}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noreferrer">
                  <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}