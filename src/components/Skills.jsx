import { useState } from "react";
import { skills } from "../data/portfolioData";
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
        {/* Section Header — editorial */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="font-mono-accent text-xs font-semibold text-primary tracking-[0.25em] uppercase">
            02 / Mis Competencias
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            Habilidades <span className="gradient-text">Técnicas</span>
          </h2>
          <div className="w-16 h-0.5 bg-primary rounded-full" />
        </div>

        {/* Category Filter — pill style with outline */}
        <div
          className={`flex flex-wrap justify-start gap-3 mb-12 transition-all duration-700 delay-100 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium font-mono-accent transition-all duration-300 ${
                activeFilter === cat
                  ? "bg-primary text-surface shadow-lg shadow-primary/20"
                  : "border border-surface-lighter text-text-secondary hover:text-text-primary hover:border-primary/30"
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
              className={`glass rounded-xl p-5 group card-hover hover:border-primary/20 transition-all duration-500 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isInView ? `${i * 80}ms` : "0ms",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {skill.name}
                </span>
                <span className="text-sm font-mono-accent text-primary font-semibold">
                  {skill.level}%
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-surface-lighter/60 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: isInView ? `${skill.level}%` : "0%",
                    transitionDelay: `${i * 80 + 300}ms`,
                    background: `linear-gradient(90deg, var(--color-primary), var(--color-accent))`,
                  }}
                />
              </div>
              <div className="mt-2.5">
                <span className="text-[11px] text-text-muted font-mono-accent uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-surface-lighter">
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
