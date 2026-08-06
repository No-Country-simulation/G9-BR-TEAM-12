import { Routes, Route } from "react-router-dom"
import { ButtonCallToAction } from "./components/ButtonCallToAction"
import NavBar from "./components/NavBar"

function HomePage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Projeto Powerpolis</h1>
      <ButtonCallToAction />
    </div>
  )
}

function ProductsPage() {
  return <div style={{ padding: "40px" }}><h1>Nosso Produto</h1></div>
}

// 1. New About Page
function AboutPage() {
  return <div style={{ padding: "40px" }}><h1>Sobre o Powerpolis</h1></div>
}

// 2. New Team Page
function TeamPage() {
  return <div style={{ padding: "40px" }}><h1>Nossa Equipe</h1></div>
}

export default function App() {
  return (
    <nav>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </nav>
  )
}