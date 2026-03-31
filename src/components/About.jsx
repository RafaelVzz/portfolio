import { personalInfo } from "../data/portfolioData";
import { useInView } from "../hooks/useInView";

/**
 * About — Sección "Sobre Mí" con tarjetas de estadísticas y descripción.
 */
export default function About() {
  const [ref, isInView] = useInView({ threshold: 0.15 });

  const stats = [
    { value: `${personalInfo.yearsExperience}+`, label: "Año de Experiencia" },
    { value: "2+", label: "Proyectos Realizados" },
    { value: "7+", label: "Tecnologías" },
    { value: "∞", label: "Ganas de Aprender" },
  ];

  return (
    <section id="sobre-mi" className="py-24 px-6 relative">
      {/* Decorative */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-sm font-semibold text-accent tracking-widest uppercase">
            Conóceme
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            Sobre <span className="gradient-text">Mí</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-5 gap-10 items-start">
          {/* Text Content */}
          <div
            className={`md:col-span-3 transition-all duration-700 delay-200 ${
              isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-lg">
                  👨‍💻
                </span>
                ¿Quién soy?
              </h3>
              <p className="text-text-secondary leading-relaxed text-[15px]">
                {personalInfo.about}
              </p>

              {/* Quick Info */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary-light">📍</span>
                  <span className="text-text-muted">Ubicación:</span>
                  <span className="text-text-primary font-medium">
                    {personalInfo.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary-light">🎓</span>
                  <span className="text-text-muted">Estudio:</span>
                  <span className="text-text-primary font-medium">
                    Ing. en Sistemas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div
            className={`md:col-span-2 grid grid-cols-2 gap-4 transition-all duration-700 delay-400 ${
              isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-text-muted font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
