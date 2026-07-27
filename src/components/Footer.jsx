import { personalInfo } from "../data/portfolioData";

/**
 * Footer — Pie de página con créditos y enlace al inicio.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-6">
      <div className="section-divider mb-10" />

      <div className="max-w-6xl mx-auto text-center">
        {/* Logo — terminal style */}
        <a
          href="#inicio"
          className="inline-block font-mono-accent text-xl font-bold mb-4 hover:opacity-80 transition-opacity"
        >
          <span className="text-primary">{">"}</span>
          <span className="text-text-primary">WS</span>
          <span className="text-primary animate-blink">_</span>
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
        <p className="text-text-muted/40 text-xs mt-2 font-mono-accent">
          React + Vite + Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
