import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { socialLinks } from "../data/portfolioData";
import { sanitizeUrl } from "../utils/sanitize";
import { useInView } from "../hooks/useInView";
import { isRequired, isEmail, minLength } from "../utils/validators";

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-red-400 text-[11px] font-medium mt-1.5 flex items-center gap-1 animate-fade-in-up">
      <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
      {message}
    </p>
  );
};

export default function Contact() {
  const [ref, isInView] = useInView({ threshold: 0.15 });
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: isRequired(formData.name) || minLength(formData.name, 3),
      email: isRequired(formData.email) || isEmail(formData.email),
      message: isRequired(formData.message) || minLength(formData.message, 10),
    };

    const hasErrors = Object.values(newErrors).filter(Boolean).length > 0;

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStatus("sending");

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });

      // Volver al formulario después de 5 segundos
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("error");

      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contacto" className="py-24 px-6 relative">
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div ref={ref} className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <span className="text-sm font-semibold text-accent tracking-widest uppercase">
            Hablemos
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            Ponte en <span className="gradient-text">Contacto</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Info Column */}
          <div
            className={`md:col-span-2 transition-all duration-700 delay-200 ${isInView
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12"
              }`}
          >
            <div className="glass rounded-2xl p-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Redes Sociales
                </h3>
                <p className="text-sm text-text-secondary">
                  Encuéntrame en mis redes sociales para conectar.
                </p>
              </div>

              {/* Social Links */}
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={sanitizeUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-primary/10 transition-all duration-300 group"
                >
                  <span className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary-light group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-text-primary text-sm">
                      {link.name}
                    </div>
                    <div className="text-xs text-text-muted">
                      @RafaelVzz
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form Column */}
          <div
            className={`md:col-span-3 transition-all duration-700 delay-300 ${isInView
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12"
              }`}
          >
            <div className="glass rounded-2xl p-8">
              {status === "idle" || status === "sending" ? (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-text-secondary mb-2">Nombre</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 text-sm"
                    />
                    <ErrorMessage message={errors.name} />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 text-sm"
                    />
                    <ErrorMessage message={errors.email} />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-text-secondary mb-2">Mensaje</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Escribe tu mensaje..."
                      className="w-full px-4 py-3 rounded-xl bg-surface-lighter/50 border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 text-sm resize-none"
                    />
                    <ErrorMessage message={errors.message} />
                  </div>
                  <button
                    type="submit"
                    id="contact-submit"
                    disabled={status === "sending"}
                    className="group relative w-full py-3.5 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent animate-gradient" />
                    <span className="relative flex items-center justify-center gap-2">
                      {status === "sending" ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Mensaje
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
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              ) : status === "success" ? (
                <div className="text-center py-8 animate-fade-in-up">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/15 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    ¡Mensaje Enviado!
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Gracias por contactarme. Te responderé lo antes posible.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 animate-fade-in-up">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/15 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Error al enviar
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
