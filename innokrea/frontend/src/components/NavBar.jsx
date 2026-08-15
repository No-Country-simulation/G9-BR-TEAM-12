import { Link, useLocation } from "react-router-dom"
import logo from "../assets/powerpolis-logo.png"

export default function NavBar() {
  const location = useLocation()

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Powerpolis Logo" className="logo-img" />
          <span className="logo-text">EnergiAI</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Início
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            Sobre
          </Link>
          <Link to="/team" className={`nav-link ${location.pathname === '/team' ? 'active' : ''}`}>
            Equipe
          </Link>
          <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>
            Produto
          </Link>
        </nav>
      </div>
    </header>
  )
}