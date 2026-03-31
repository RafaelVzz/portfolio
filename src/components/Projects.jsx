import { projects } from "../data/portfolioData";
import { sanitizeUrl } from "../utils/sanitize";
import { useInView } from "../hooks/useInView";

/**
 * Projects — Sección de proyectos con tarjetas glassmorphism animadas.
 */
export default function Projects() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="proyectos" className="py-24 px-6 relative">
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-sm font-semibold text-accent tracking-widest uppercase">
            Mi Trabajo
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            Proyectos <span className="gradient-text">Destacados</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* Project Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <article
              key={project.id}
              className={`group glass rounded-2xl overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/30 hover:-translate-y-2 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: isInView ? `${i * 150}ms` : "0ms" }}
            >
              {/* Card Header */}
              <div className="relative p-8 pb-0">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{project.icon}</span>
                  <a
                    href={sanitizeUrl(project.repoUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-primary-light hover:bg-primary/10 transition-all duration-300"
                    aria-label={`Ver repositorio de ${project.title}`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary-light transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="px-8 pb-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary-light border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Repo Link */}
                <a
                  href={sanitizeUrl(project.repoUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-light transition-colors duration-300 group/link"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Ver en GitHub
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
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
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
