import { personalInfo } from "../data/portfolioData";

/**
 * Footer — Pie de página con créditos y enlace al inicio.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-10 px-6">
      <div className="section-divider mb-10" />

      <div className="max-w-6xl mx-auto text-center">
        {/* Logo */}
        <a
          href="#inicio"
          className="inline-block text-2xl font-bold gradient-text mb-4 hover:opacity-80 transition-opacity"
        >
          {"<WS />"}
        </a>

        <p className="text-text-muted text-sm mb-6">
          {personalInfo.title} · {personalInfo.location}
        </p>

        {/* Divider */}
        <div className="w-16 h-px bg-surface-lighter mx-auto mb-6" />

        <p className="text-text-muted text-xs">
          &copy; {currentYear} {personalInfo.name}. Todos los
          derechos reservados.
        </p>
        <p className="text-text-muted/50 text-xs mt-2">
          Construido con React + Vite + Tailwind CSS · Protección XSS con
          DOMPurify
        </p>
      </div>
    </footer>
  );
}
