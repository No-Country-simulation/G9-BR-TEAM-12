import { Link } from "react-router-dom"

export const ButtonCallToAction = () => {
  return (
    <Link to="/products" className="cta-button">
      <span>Teste nosso Produto</span>
      <span className="cta-icon">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </Link>
  )
}