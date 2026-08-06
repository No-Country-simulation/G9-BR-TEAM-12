import { Link } from "react-router-dom"

export default function NavBar() {
  return (
    <nav style={{ display: "flex", gap: "20px", padding: "20px", background: "#222" }}>
      <Link to="/" style={{ color: "#fff" }}>Início</Link>
      <Link to="/about" style={{ color: "#fff" }}>Sobre</Link>
      <Link to="/team" style={{ color: "#fff" }}>Equipe</Link>
      <Link to="/products" style={{ color: "#fff" }}>Produto</Link>
    </nav>
  )
}