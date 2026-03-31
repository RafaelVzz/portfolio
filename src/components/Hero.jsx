import { personalInfo } from "../data/portfolioData";

/**
 * Hero — Sección principal de bienvenida con animaciones y partículas decorativas.
 */
export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-dark/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-text-secondary mb-8 animate-fade-in-up">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Disponible para proyectos
        </div>

        {/* Name */}
        <h1
          className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-up tracking-tight"
          style={{ animationDelay: "0.2s" }}
        >
          Hola, soy{" "}
          <span className="gradient-text">
            {personalInfo.name}
          </span>
        </h1>

        {/* Title */}
        <p
          className="text-xl md:text-2xl text-text-secondary mb-4 animate-fade-in-up font-light"
          style={{ animationDelay: "0.4s" }}
        >
          {personalInfo.title}
        </p>

        {/* Subtitle */}
        <p
          className="text-lg text-accent-light font-medium mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          {personalInfo.subtitle}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            href="#proyectos"
            className="group relative px-8 py-3.5 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent animate-gradient" />
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
            className="px-8 py-3.5 rounded-xl font-semibold text-text-primary glass hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            Contáctame
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-up opacity-60">
        <span className="text-xs text-text-muted tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
