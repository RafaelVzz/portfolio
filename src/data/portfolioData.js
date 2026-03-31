/**
 * portfolioData.js — Datos del portafolio centralizados.
 *
 * Todos los datos personales se almacenan aquí para facilitar la
 * actualización y para demostrar la sanitización XSS centralizada.
 * Antes de ser renderizados, pasan por las funciones de sanitize.js.
 */

export const personalInfo = {
  name: "Wilmer Salazar",
  title: "Estudiante de Ing. en Sistemas",
  subtitle: "Desarrollador Full Stack en Formación",
  location: "Venezuela",
  yearsExperience: "1",
  about:
    "Soy un apasionado estudiante de Ingeniería en Sistemas con un año de experiencia en desarrollo de software. Me especializo en la creación de soluciones tecnológicas que van desde aplicaciones de escritorio robustas hasta plataformas web completas. Mi enfoque combina la curiosidad por aprender nuevas tecnologías con la disciplina de aplicar buenas prácticas de desarrollo, incluyendo arquitectura en capas y patrones de diseño como SOLID. Estoy constantemente buscando nuevos desafíos que me permitan crecer como profesional y contribuir a proyectos con impacto real.",
};

export const skills = [
  { name: "Python", level: 20, category: "Lenguajes" },
  { name: "C#", level: 30, category: "Lenguajes" },
  { name: "JavaScript", level: 10, category: "Lenguajes" },
  { name: "HTML & CSS", level: 55, category: "Lenguajes" },
  { name: "SQL Server", level: 25, category: "Lenguajes" },
  { name: "Git", level: 10, category: "Herramientas" },
  { name: "React", level: 5, category: "Frameworks" },
  { name: "Django", level: 25, category: "Frameworks" },
  { name: "Flask", level: 20, category: "Frameworks" },
  { name: "Windows Forms", level: 70, category: "Frameworks" },
];

export const projects = [
  {
    id: 1,
    title: "Docentes por Periodos",
    description:
      "Aplicación de escritorio desarrollada en C# bajo una arquitectura en capas, diseñada para la gestión, importación y exportación de datos académicos mediante archivos Excel y SQL Server.",
    technologies: ["C# .NET", "Windows Forms", "SQL Server", "ClosedXML"],
    repoUrl: "https://github.com/RafaelVzz/Docentes-por-periodos",
    icon: "📊",
  },
  {
    id: 2,
    title: "Delegate System UNEFA",
    description:
      "Aplicación Web para la elección de delegados de curso para la UNEFA Núcleo Apure. Sistema completo con autenticación, votación y generación de resultados.",
    technologies: ["Python", "HTML", "Bootstrap CSS", "Django"],
    repoUrl: "https://github.com/RafaelVzz/Delegate-system-UNEFA",
    icon: "🗳️",
  },
];

export const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/RafaelVzz",
    icon: "github",
  },
];

export const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre Mí", href: "#sobre-mi" },
  { label: "Habilidades", href: "#habilidades" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Contacto", href: "#contacto" },
];
