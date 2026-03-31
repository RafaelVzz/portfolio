import { useState } from "react";
import { skills } from "../data/portfolioData";
// NOTA XSS: React escapa automáticamente el contenido JSX,
// por lo que no es necesario usar escapeHtml() aquí.
// La sanitización explícita se aplica en contextos donde React
// no protege automáticamente (URLs, dangerouslySetInnerHTML, etc.).
import { useInView } from "../hooks/useInView";

/**
 * Skills — Sección de habilidades con barras de progreso animadas y filtro por categoría.
 */
export default function Skills() {
  const [ref, isInView] = useInView({ threshold: 0.15 });
  const [activeFilter, setActiveFilter] = useState("Todos");

  const categories = ["Todos", ...new Set(skills.map((s) => s.category))];

  const filteredSkills =
    activeFilter === "Todos"
      ? skills
      : skills.filter((s) => s.category === activeFilter);

  return (
    <section id="habilidades" className="py-24 px-6 relative">
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div ref={ref} className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-sm font-semibold text-accent tracking-widest uppercase">
            Mis Competencias
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            Habilidades <span className="gradient-text">Técnicas</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* Category Filter */}
        <div
          className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-100 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === cat
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
                  : "glass text-text-secondary hover:text-text-primary hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {filteredSkills.map((skill, i) => (
            <div
              key={skill.name}
              className={`glass rounded-xl p-5 group hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isInView ? `${i * 80}ms` : "0ms",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-text-primary group-hover:text-primary-light transition-colors">
                  {skill.name}
                </span>
                <span className="text-sm font-mono text-accent font-semibold">
                  {skill.level}%
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-surface-lighter/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: isInView ? `${skill.level}%` : "0%",
                    transitionDelay: `${i * 80 + 300}ms`,
                  }}
                />
              </div>
              <div className="mt-2">
                <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5">
                  {skill.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
