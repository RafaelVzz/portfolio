import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

/**
 * App — Componente raíz del Mini Portafolio SPA.
 *
 * Arquitectura de prevención XSS (multicapa):
 *
 * Capa 1 - React JSX (automática):
 *   React escapa automáticamente todo contenido renderizado en JSX,
 *   previniendo la inyección de HTML/scripts en texto.
 *
 * Capa 2 - sanitizeUrl() (URLs):
 *   Valida que las URLs usen protocolos seguros (http, https, mailto),
 *   bloqueando ataques vía javascript: o data: URIs.
 *
 * Capa 3 - DOMPurify + escapeHtml() (formularios y HTML dinámico):
 *   El formulario de contacto sanitiza datos del usuario antes de
 *   mostrarlos, demostrando la protección contra inyecciones XSS
 *   cuando se manejan entradas externas.
 *
 * Capa 4 - sanitizeHtml() (contenido HTML rico):
 *   Disponible en /utils/sanitize.js para sanitizar HTML de fuentes
 *   externas cuando sea necesario usar dangerouslySetInnerHTML.
 */
function App() {
  return (
    <div className="min-h-screen bg-surface text-text-primary overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
