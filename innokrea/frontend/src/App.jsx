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
          A EnergiAI ajuda clientes sustentáveis a analisar o consumo de energia através do projeto Powerpolis categorizando a eficiência energética, descobrindo a fonte dos gastos mensais que será tratada de forma preditiva e assertiva com o uso de inteligência artificial
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
    <div className="page-container">
      <div className="content-card">
        <h1>Sobre o Powerpolis</h1>
        <p className="hero-description" style={{ marginTop: "1rem" }}>
          O Powerpolis é uma plataforma focada em simulações interativas para gerenciamento e consumo consciente de energia em cidades inteligentes.
        </p>
      </div>
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