import { personalInfo } from "../data/portfolioData";

/**
 * Hero — Sección principal con layout asimétrico estilo editorial.
 */
export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Atmospheric Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Warm amber glow — top right */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[120px] animate-float" />
        {/* Cool emerald glow — bottom left */}
        <div
          className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-accent/4 rounded-full blur-[140px] animate-float"
          style={{ animationDelay: "3s" }}
        />

        {/* Diagonal grid — editorial feel */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(229,149,0,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Decorative vertical line */}
        <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden md:block" />
      </div>

      {/* Content — asymmetric layout */}
      <div className="relative z-10 px-6 max-w-5xl mx-auto w-full">
        <div className="md:ml-[15%]">
          {/* Terminal-style badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 text-sm font-mono-accent text-primary mb-8 animate-fade-in-up"
          >
            <span className="status-dot" />
            <span className="text-text-secondary">status:</span> ocupado
          </div>

          {/* Name — large editorial */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 animate-fade-in-up tracking-tight leading-[0.95]"
            style={{ animationDelay: "0.15s" }}
          >
            <span className="text-text-primary">Hola, soy</span>
            <br />
            <span className="gradient-text">
              {personalInfo.name}
            </span>
          </h1>

          {/* Title — monospace accent */}
          <p
            className="text-lg md:text-xl text-text-secondary mb-3 animate-fade-in-up font-mono-accent font-light"
            style={{ animationDelay: "0.3s" }}
          >
            {"// "}{personalInfo.title}
          </p>

          {/* Subtitle */}
          <p
            className="text-base md:text-lg text-accent-light font-medium mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            {personalInfo.subtitle}
          </p>

          {/* CTAs — asymmetric sizing */}
          <div
            className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.55s" }}
          >
            <a
              href="#proyectos"
              className="group relative px-8 py-3.5 rounded-lg font-semibold text-surface overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light" />
              <span className="relative flex items-center gap-2">
                Ver Proyectos
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </a>
            <a
              href="#contacto"
              className="px-8 py-3.5 rounded-lg font-semibold text-text-primary border border-surface-lighter hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              Contáctame
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator — minimal */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-up opacity-50">
        <span className="text-xs text-text-muted tracking-[0.3em] uppercase font-mono-accent">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent" />
      </div>
    </section>
  );
}
