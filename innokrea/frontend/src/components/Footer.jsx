import githubIcon from "../assets/github-icon.png"

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>Powerpolis</h2>
          <p>Soluções inteligentes para gerenciamento energético.</p>
        </div>
        <div className="footer-social">
          <a href="https://github.com/No-Country-simulation/G9-BR-TEAM-12/" target="_blank" rel="noreferrer">
            <img src={githubIcon} alt="Github" className="social-icon" />
          </a>
        </div>
      </div>
      <div className="footer-copy">
        <p>© 2026 Powerpolis. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}