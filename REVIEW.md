# 📋 Code Review — Reporte Automático

> Generado el **jueves, 28 de mayo de 2026, 12:05 a. m.** por el Agente de Análisis de Código
> Modelo: `moonshotai/kimi-k2.6` vía NVIDIA NIM

---

## 📄 `src\App.jsx`

# Code Review: `src/App.jsx`

## Análisis General

El archivo es un componente raíz simple y limpio para una SPA de portafolio. La estructura es correcta, pero hay varios aspectos a considerar para mejorar la calidad del código.

---

## 🐛 Bugs o errores potenciales

### 1. **Inconsistencia entre documentación y código**

El comentario JSDoc describe una "Arquitectura de prevención XSS (multicapa)" con 4 capas, pero **ninguna de estas capas está implementada en este archivo**. Esto genera:

- **Confusión para otros desarrolladores** que esperarían ver la implementación
- **Documentación desactualizada** si las utilidades existen en otros archivos pero no se usan aquí
- **Falsa sensación de seguridad** al leer el código

```jsx
// ❌ Actual: Documentación que no corresponde con el código

// ✅ Sugerencia: Simplificar el comentario o moverlo al README
/**
 * App — Componente raíz del Mini Portafolio SPA.
 * Renderiza la estructura principal de la aplicación.
 */
```

### 2. **Falta de manejo de errores en el nivel raíz**

No hay `ErrorBoundary` para capturar errores de renderizado en componentes hijos:

```jsx
// ✅ Sugerencia: Crear un ErrorBoundary
// src/components/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Algo salió mal
            </h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// En App.jsx:
function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-surface text-text-primary overflow-x-hidden">
        {/* ... */}
      </div>
    </ErrorBoundary>
  );
}
```

---

## ⚡ Mejoras de rendimiento (performance)

### 1. **Lazy loading de secciones del portafolio**

Las secciones como `Projects`, `Skills` y `Contact` pueden no ser necesarias en el render inicial. Implementar `React.lazy()` con `Suspense`:

```jsx
import { lazy, Suspense } from 'react';

// Eager loading para contenido above-the-fold
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';

// Lazy loading para secciones below-the-fold
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));

// Componente de fallback reutilizable
const SectionSkeleton = () => (
  <div className="animate-pulse min-h-[200px] bg-surface/50" aria-hidden="true" />
);

function App() {
  return (
    <div className="min-h-screen bg-surface text-text-primary overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
```

### 2. **Considerar React.memo para evitar re-renderizados innecesarios**

Aunque en este caso `App` no recibe props, es buena práctica para componentes raíz:

```jsx
import { memo } from 'react';

function App() {
  // ... implementación
}

export default memo(App);
```

> **Nota:** `memo` tiene más impacto si `App` recibiera props de un contexto o estado global.

---

## 🎨 Mejoras de estilo y buenas prácticas

### 1. **Eliminar el comentario JSDoc excesivo**

La documentación de seguridad debe estar donde se **implementa** la lógica, no donde se describe. Mover a `README.md` o archivos de utilidades:

```jsx
// ✅ Versión limpia y profesional
/**
 * Componente raíz de la aplicación.
 * @see docs/SECURITY.md para detalles de la arquitectura XSS
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
```

### 2. **Agregar atributos de accesibilidad semántica**

```jsx
function App() {
  return (
    <div className="min-h-screen bg-surface text-text-primary overflow-x-hidden">
      <Navbar />
      <main id="main-content"> {/* Para skip links */}
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
```

### 3. **Considerar estructura con `<>` (Fragment) si el `div` wrapper no es necesario**

Si `min-h-screen` y otras clases pueden aplicarse en un layout superior o en `index.html`:

```jsx
// Solo si aplica al diseño específico
function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

> En este caso, **no recomiendo** esta cambio porque las clases de Tailwind (`bg-surface`, etc.) son necesarias para el tema.

### 4. **Ordenar imports de forma consistente**

Agrupar por: built-in → externo → interno (absoluto) → interno (relativo):

```jsx
// React/built-in
import { lazy, Suspense } from 'react';

// Componentes (asumiendo que están en barrel export)
import { Navbar, Hero, Footer } from './components';
// o con imports individuales manteniendo orden alfabético:
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import Skills from './components/Skills';
```

---

## 📋 Resumen de Prioridades

| Prioridad | Ítem | Impacto |
|-----------|------|---------|
| 🔴 Alta | Documentación desincronizada | Confusión, deuda técnica |
| 🟡 Media | Falta de ErrorBoundary | UX en caso de errores |
| 🟡 Media | Lazy loading de secciones | Performance inicial |
| 🟢 Baja | Orden de imports | Mantenibilidad |
| 🟢 Baja | `React.memo` | Micro-optimización |

---

## Veredicto Final

El archivo **funciona correctamente** pero presenta un **problema significativo de documentación**: el comentario JSDoc describe una arquitectura de seguridad que no está visible en este archivo, lo cual es más perjudicial que útil. La estructura del componente es adecuada para una SPA de portafolio, pero podría beneficiarse de optimizaciones de rendimiento como lazy loading dado que es una aplicación de secciones largas.

---

## 📄 `src\components\About.jsx`

# Code Review: `About.jsx`

---

## 🐛 Bugs o errores potenciales

### 1. `key` prop potencialmente inestable en el mapeo de `stats`

**Problema:** Usar `stat.label` como `key` puede causar problemas si en el futuro se repiten labels o se internacionalizan. Aunque en este caso son únicos, es un patrón frágil.

```jsx
// Actual (frágil)
{stats.map((stat, i) => (
  <div key={stat.label} ... />
))}

// Sugerido: usar un identificador explícito o el índice con un prefijo descriptivo
const stats = [
  { id: 'experience', value: `${personalInfo.yearsExperience}+`, label: "Año de Experiencia" },
  // ... etc
];

{stats.map((stat) => (
  <div key={stat.id} ... />
))}
```

### 2. Inconsistencia en plural/singular

**Problema:** El label dice "Año de Experiencia" (singular) pero el valor es dinámico (`yearsExperience+`). Si `yearsExperience` es 1, el plural es incorrecto; si es >1, el singular lo es.

```jsx
// Sugerido: manejar pluralización
const stats = [
  { 
    value: `${personalInfo.yearsExperience}+`, 
    label: personalInfo.yearsExperience === 1 ? "Año de Experiencia" : "Años de Experiencia" 
  },
  // ...
];
```

### 3. `animationDelay` sin efecto real

**Problema:** El `style={{ animationDelay: `${i * 100}ms` }}` no tiene efecto porque no hay ninguna animación CSS definida con `animation` en las clases. Solo hay `transition`.

```jsx
// Actual (sin efecto)
style={{ animationDelay: `${i * 100}ms` }}

// Opción 1: Eliminar si no se usa
// Opción 2: Si se quiere stagger effect, usar delay en transition o implementar con CSS @keyframes
```

---

## ⚡ Mejoras de rendimiento (performance)

### 1. `stats` se recrea en cada render

**Problema:** El array `stats` se define dentro del componente, causando re-renders innecesarios en elementos hijos si se pasaran como props (aunque aquí no es crítico, es buena práctica).

```jsx
// Sugerido: definir fuera del componente o memoizar
const STATS_CONFIG = [
  { key: 'experience', getValue: (info) => `${info.yearsExperience}+`, label: "Años de Experiencia" },
  // ... podría parametrizarse más
];

// O más simple, si es estático:
const getStats = (yearsExperience) => [
  { value: `${yearsExperience}+`, label: "Años de Experiencia" },
  { value: "2+", label: "Proyectos Realizados" },
  { value: "7+", label: "Tecnologías" },
  { value: "∞", label: "Ganas de Aprender" },
];

export default function About() {
  const stats = useMemo(() => getStats(personalInfo.yearsExperience), []);
  // ...
}
```

### 2. Clases condicionales complejas repetidas

**Problema:** La lógica de transición se repite 3 veces con patrones similares. Esto genera código duplicado y más bundle size innecesario.

```jsx
// Sugerido: crear componente helper o utilidad
const AnimatedSection = ({ children, isInView, delay = 0, direction = 'up', className = '' }) => {
  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: '-translate-x-12',
    right: 'translate-x-12',
    none: 'translate-x-0 translate-y-0'
  };
  
  const baseClasses = 'transition-all duration-700';
  const visibleClasses = 'opacity-100 translate-x-0 translate-y-0';
  const hiddenClasses = `opacity-0 ${directionClasses[direction]}`;
  
  return (
    <div className={`${baseClasses} ${isInView ? visibleClasses : hiddenClasses} ${className}`}
         style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// Uso:
<AnimatedSection isInView={isInView} delay={200} direction="left" className="md:col-span-3">
  {/* contenido */}
</AnimatedSection>
```

### 3. Posible problema de hidratación con emoji

**Problema:** Los emojis como `👨‍💻`, `📍`, `🎓` pueden causar inconsistencias de hidratación en SSR (Next.js) o mostrar el emoji de forma diferente según el sistema operativo.

```jsx
// Sugerido: usar componentes de icono o SVGs, o al menos centralizar
const ICONS = {
  developer: <span role="img" aria-label="Desarrollador">👨‍💻</span>,
  location: <span role="img" aria-label="Ubicación">📍</span>,
  education: <span role="img" aria-label="Educación">🎓</span>,
};
```

---

## 🎨 Mejoras de estilo y buenas prácticas

### 1. Separación de responsabilidades: datos vs. presentación

**Problema:** Los datos están mezclados con la presentación. `stats` contiene valores hardcodeados que deberían venir de `personalInfo` o una fuente de datos.

```jsx
// Sugerido: extender personalInfo o crear un archivo de datos
// src/data/aboutData.js
export const getAboutStats = (personalInfo) => [
  { value: `${personalInfo.yearsExperience}+`, label: "Años de Experiencia" },
  { value: personalInfo.projectsCompleted || "2+", label: "Proyectos Realizados" },
  { value: `${personalInfo.technologies?.length || 7}+`, label: "Tecnologías" },
  { value: "∞", label: "Ganas de Aprender" },
];
```

### 2. Magic strings en clases de Tailwind

**Problema:** Las clases como `delay-200`, `delay-400` pueden no funcionar si Tailwind no las detecta en build time (aunque aquí parece que sí están definidas como custom).

```jsx
// Verificar en tailwind.config.js que existan:
// extend: { transitionDelay: { 200: '200ms', 400: '400ms' } }

// Alternativa más segura: usar style para delays dinámicos
<div style={{ transitionDelay: `${delay}ms` }} ... />
```

### 3. Accesibilidad mejorada

**Problema:** Falta atributos ARIA para la sección de estadísticas y el contenido animado.

```jsx
<section 
  id="sobre-mi" 
  aria-labelledby="about-heading"
  className="py-24 px-6 relative"
>
  <h2 id="about-heading" className="...">
    Sobre <span className="gradient-text">Mí</span>
  </h2>
  
  {/* Stats con mejor semántica */}
  <dl className="...">
    {stats.map((stat) => (
      <div key={stat.id} className="...">
        <dt className="sr-only">{stat.label}</dt>
        <dd className="text-3xl font-bold gradient-text mb-1">{stat.value}</dd>
        <dd className="text-xs ...">{stat.label}</dd>
      </div>
    ))}
  </dl>
</section>
```

### 4. Documentación del custom hook

**Problema:** No sabemos si `useInView` retorna un array o un objeto. La desestructuración sugiere array `[ref, isInView]`, pero es bueno verificar la consistencia.

```jsx
// Sugerido: verificar la firma del hook. Si es posible, preferir objeto para extensibilidad:
// const { ref, isInView, entry } = useInView({ threshold: 0.15 });
```

### 5. Constantes para valores mágicos

```jsx
// Sugerido: constantes al inicio del archivo
const ANIMATION_CONFIG = {
  duration: 700,
  threshold: 0.15,
  staggerDelay: 100,
};

const SECTION_ID = 'sobre-mi';
```

---

## 📋 Resumen de prioridades

| Prioridad | Ítem | Esfuerzo |
|-----------|------|----------|
| 🔴 Alta | Fix pluralización "Año/Años" | Bajo |
| 🔴 Alta | Eliminar `animationDelay` sin efecto o implementar stagger real | Bajo |
| 🟡 Media | Extraer datos de `stats` a fuente externa | Medio |
| 🟡

---

## 📄 `src\components\Contact.jsx`

Voy a realizar un code review detallado de este componente `Contact.jsx`.

---

## 🐛 Bugs o errores potenciales

### 1. **Fuga de memoria (memory leak) con `setTimeout`**

El `setTimeout` de 5 segundos no se limpia si el componente se desmonta antes de que termine. Esto puede causar fugas de memoria y errores de estado en componentes desmontados.

```jsx
// ❌ Actual - sin cleanup
setTimeout(() => {
  setSubmitted(false);
  setPreview(null);
  setFormData({ name: "", email: "", message: "" });
}, 5000);

// ✅ Corregido - con cleanup
useEffect(() => {
  let timeoutId;
  
  if (submitted) {
    timeoutId = setTimeout(() => {
      setSubmitted(false);
      setPreview(null);
      setFormData({ name: "", email: "", message: "" });
    }, 5000);
  }
  
  return () => clearTimeout(timeoutId);
}, [submitted]);
```

> **Nota:** Esto requiere importar `useEffect`.

---

### 2. **Validación lógica incorrecta en `newErrors`**

El operador `||` en la validación tiene un problema de cortocircuito: si `isRequired` devuelve un string vacío `""` (falsy pero no es un error real), se evalúa `minLength`. Sin embargo, si `isRequired` devuelve `null` o `undefined` para "sin error", funciona. El problema real es que si `isRequired` devuelve un string de error truthy, nunca se llega a `minLength`. Esto es intencional (short-circuit), pero si quieres **acumular** errores, necesitas otra lógica.

```jsx
// ❌ Actual - solo un error por campo (puede ser intencional)
const newErrors = {
  name: isRequired(formData.name) || minLength(formData.name, 3),
  // ...
};

// ✅ Si se quieren acumular errores (más robusto)
const validateField = (value, validators) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error; // o acumular en array si se quieren todos
  }
  return null;
};

// Uso:
const newErrors = {
  name: validateField(formData.name, [
    (v) => isRequired(v),
    (v) => minLength(v, 3),
  ]),
  // ...
};
```

---

### 3. **`escapeHtml` innecesario en `link.name` y potencial doble escape**

React ya escapa automáticamente el contenido de texto. Aplicar `escapeHtml` a `link.name` es redundante y, si `escapeHtml` convierte `&` a `&amp;`, el resultado se mostraría literalmente como `&amp;` en lugar de `&`.

```jsx
// ❌ Redundante y potencialmente problemático
<div className="font-semibold text-text-primary text-sm">
  {escapeHtml(link.name)}
</div>

// ✅ React ya lo protege
<div className="font-semibold text-text-primary text-sm">
  {link.name}
</div>
```

---

### 4. **Falta de `key` único estable en el mapeo de `socialLinks`**

Si `link.name` no es único o cambia, puede causar problemas de reconciliación. Además, no hay verificación de que `socialLinks` exista.

```jsx
// ✅ Más defensivo
{socialLinks?.map((link, index) => (
  <a
    key={`${link.name}-${index}`} // o un ID único si existe
    // ...
  >
```

---

### 5. **Comentario desactualizado sobre `escapeHtml`**

El comentario dice "Eliminamos el EscapeHTML porque React ya lo hace por defecto" pero más arriba sigue importándose y usándose en `link.name`. Hay inconsistencia entre el comentario y el código.

---

## ⚡ Mejoras de rendimiento (performance)

### 1. **Re-creación de funciones y objetos en cada render**

`handleChange` y `handleSubmit` se re-crean en cada render. Aunque no es crítico aquí, para formularios más complejos considera `useCallback`.

```jsx
// ✅ Con useCallback para estabilidad (opcional pero recomendable en componentes grandes)
const handleChange = useCallback((e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
}, []);

const handleSubmit = useCallback((e) => {
  e.preventDefault();
  // ... lógica
}, [formData]); // o con ref si es muy frecuente
```

> **Nota:** Como `formData` es dependencia, el beneficio es limitado aquí. Considera usar una ref para el formulario o una librería como `react-hook-form` para formularios complejos.

---

### 2. **Animaciones CSS con `transition-all`**

`transition-all` fuerza al navegador a trackear todas las propiedades CSS. Es más performante especificar solo las necesarias.

```jsx
// ❌
className="transition-all duration-700"

// ✅
className="transition-opacity duration-700"
// o si hay múltiples:
className="transition-[opacity,transform] duration-700"
```

---

### 3. **SVG inline repetido**

El SVG de GitHub está hardcodeado pero el componente parece genérico para cualquier red social. Si todas usan el mismo ícono, está bien, pero probablemente debería venir de `socialLinks`.

```jsx
// En portfolioData.js
const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/RafaelVzz",
    icon: GithubIcon, // Componente o path SVG
  },
  // ...
];

// En el componente:
{socialLinks?.map((link) => (
  <a key={link.name} ...>
    {/* ... */}
    <span className="...">
      {link.icon ? <link.icon className="w-5 h-5" /> : <DefaultIcon />}
    </span>
  </a>
))}
```

---

### 4. **`useInView` sin opciones de desconexión del observer**

Si el hook `useInView` no desconecta el `IntersectionObserver`, puede causar observadores huérfanos. Verifica que el hook interno tenga:

```jsx
// En useInView.js (verificación)
useEffect(() => {
  const observer = new IntersectionObserver(callback, options);
  if (ref.current) observer.observe(ref.current);
  
  return () => {
    observer.disconnect(); // o unobserve específico
  };
}, []);
```

---

## 🎨 Mejoras de estilo y buenas prácticas

### 1. **Inconsistencia en naming: `ContactData` vs `contactData`**

```jsx
// ❌ PascalCase para variable regular (reservado para componentes/clases)
const ContactData = { ... };

// ✅ camelCase
const contactData = { ... };
```

---

### 2. **Separación de responsabilidades: lógica de validación**

La validación está mezclada con el componente. Extraer a un custom hook mejora la reutilización:

```jsx
// hooks/useContactForm.js
export const useContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  // ... lógica de validación, handlers, reset
  
  return { formData, errors, submitted, handleChange, handleSubmit, preview };
};
```

---

### 3. **Typo en comentario**

```jsx
// ❌
// Para manjerar errores en las validaciones:

// ✅
// Para manejar errores en las validaciones:
```

---

### 4. **Accesibilidad: `aria-live` para mensajes de error y éxito**

```jsx
// En ErrorMessage
<p 
  className="text-red-400 ..."
  role="alert"
  aria-live="polite"
>
  {message}
</p>

// En el mensaje de éxito
<div 
  className="text-center py-8 animate-fade-in-up"
  role="status"
  aria-live="polite"
>
```

---

### 5. **Botón sin estado de carga ni deshabilitado**

El formulario puede enviarse múltiples veces y no hay feedback durante el envío.

```jsx
const [isSubmitting, setIsSubmitting] = useState(false);

// En handleSubmit:
const handleSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  
  setIs

---

## 📄 `src\components\Footer.jsx`

Voy a realizar un code review detallado de este archivo `Footer.jsx`. Analizaré cada sección que mencionas.

---

## 🐛 Bugs o Errores Potenciales

### 1. **Sintaxis JSX Rota - Múltiples errores de cierre de etiquetas**

El código tiene numerosos problemas de sintaxis que impedirían compilar:

```jsx
// ❌ ERROR: Etiquetas mal cerradas, atributos sin completar, mezcla de JSX y texto plano
<div className="max-w-6xl mx-auto text-center">
  {/* Logo */}
  <a
    href="#inicio"
    className="inline-block text-2xl font-bold gradient-text mb-4 hover:opacity-80 transition-opacity"
  >
    {"<WS />"}  {/* ✅ Esto está bien como string, pero el cierre de <a> falta */}
  </a>  {/* ❌ FALTA ESTE CIERRE en el original */}

  {/* ❌ ERROR: Texto suelto sin etiqueta contenedora válida */}
  <p className="text-text-muted text-sm mb-6">
    {personalInfo.title} · {personalInfo.location}
  </p>
  {/* ❌ ERROR: `personalInfo` vs `personalInfo` - typo en import? */}
```

**Problemas específicos de sintaxis en el original:**
- `className="section-divider mb-10" />` → Cierre de `div` sin apertura
- `className="w-16 h-px bg-surface-lighter mx-auto mb-6" />` → Igual, `div` autocerrado sin contexto
- `</p>` → Cierre de `<p>` sin apertura correspondiente visible
- `</footer>` → Mal escrito como `</footer>`
- `</div>` → Sin apertura correspondiente

### 2. **Typo en importación vs uso**

```jsx
// ❌ En el import:    personalInfo (con 'a')
import { personalInfo } from "../data/portfolioData";

// ❌ En el uso:       personalInfo (con 'e') - ¡No existe!
{personalInfo.title}  // ❌ Variable no definida

// ✅ Corrección: Usar el nombre correcto del import
{personalInfo.title}
```

### 3. **Referencia a variable no definida: `currentYear` vs `currentYear`**

```jsx
const currentYear = new Date().getFullYear();  // ✅ Definido correctamente

// Pero en el JSX se usa:
&copy; {currentYear}  // ✅ Correcto (asumiendo que el typo del original es de transcripción)
```

En tu código parece estar bien, pero verificar que no haya `currentYear` (con typo) en algún lugar.

### 4. **Problema de seguridad: `dangerouslySetInnerHTML` implícito en el string HTML**

```jsx
// ⚠️ RIESGO: Si esto se renderiza como HTML real en algún momento:
{"<WS />"}  // Actualmente es seguro (string literal)

// Pero si algún día se cambia a:
<div dangerouslySetInnerHTML={{ __html: someUserInput }} />
// Sin sanitización con DOMPurify que mencionas en el footer
```

---

## ⚡ Mejoras de Rendimiento

### 1. **Cálculo de año en cada render**

```jsx
// ❌ Se ejecuta en cada render
const currentYear = new Date().getFullYear();

// ✅ Mejor: Memoizar si fuera necesario, aunque para getFullYear es overkill
// Sin embargo, en SSR podría causar hydration mismatch
const currentYear = useMemo(() => new Date().getFullYear(), []);
```

**Problema real de SSR/Hydration:**
```jsx
// ❌ En SSR, el servidor y el cliente pueden tener años diferentes (cambio de año)
// o zonas horarias diferentes, causando "hydration mismatch"

// ✅ Solución robusta para Next.js o SSR:
const [currentYear, setCurrentYear] = useState(2024); // año por defecto

useEffect(() => {
  setCurrentYear(new Date().getFullYear());
}, []);
```

### 2. **Re-renderizados innecesarios del Footer**

```jsx
// El Footer no recibe props, pero si está en un contexto que cambia,
// se re-renderiza innecesariamente.

// ✅ Mejor práctica: Memoizar si el componente padre re-renderiza frecuentemente
export default memo(function Footer() {
  // ... implementación
});
```

---

## 🎨 Mejoras de Estilo y Buenas Prácticas

### 1. **Separación de responsabilidades - Datos hardcodeados**

```jsx
// ❌ Actual: Datos mezclados en el componente
// ✅ Mejor: Centralizar configuración

// src/config/site.js
export const SITE_CONFIG = {
  author: "Tu Nombre",
  location: "Ciudad, País",
  startYear: 2023,
  techStack: ["React", "Vite", "Tailwind CSS"],
  security: {
    xssProtection: "DOMPurify",
  },
};

// Footer.jsx
import { SITE_CONFIG } from "@/config/site";
import { personalInfo } from "@/data/portfolioData";

function Footer() {
  const currentYear = new Date().getFullYear();
  const { author, startYear, techStack, security } = SITE_CONFIG;
  
  return (
    <footer className="...">
      {/* ... */}
      <p className="text-text-muted text-xs">
        © {startYear}-{currentYear} {author} · {personalInfo.location}
      </p>
      <p className="text-text-muted/50 text-xs mt-2">
        Construido con {techStack.join(", ")} · Protección XSS con {security.xssProtection}
      </p>
    </footer>
  );
}
```

### 2. **Mejora de semántica HTML y accesibilidad**

```jsx
// ❌ Actual: Enlace vacío con hash, texto poco descriptivo
<a href="#inicio" className="...">
  {"<WS />"}
</a>

// ✅ Mejor: Enlace con aria-label, y si es logo, mejor como <nav> o con role
<footer className="relative py-10 px-6">
  <div className="max-w-6xl mx-auto">
    
    {/* Navegación explícita para lectores de pantalla */}
    <nav aria-label="Navegación del pie de página">
      <a 
        href="#inicio"
        aria-label="Volver al inicio - Logo de WS"
        className="inline-block text-2xl font-bold gradient-text mb-4 
                   hover:opacity-80 transition-opacity focus:outline-none 
                   focus:ring-2 focus:ring-primary rounded-sm"
      >
        <span aria-hidden="true">{"<WS />"}</span>
      </a>
    </nav>

    {/* Información personal con estructura semántica */}
    <address className="not-italic text-text-muted text-sm mb-6">
      <span>{personalInfo.title}</span>
      {personalInfo.location && (
        <>
          <span aria-hidden="true"> · </span>
          <span>{personalInfo.location}</span>
        </>
      )}
    </address>

    <hr className="w-16 h-px bg-surface-lighter mx-auto mb-6" />

    {/* Copyright con etiqueta semántica */}
    <p className="text-text-muted text-xs">
      <small>
        © <time dateTime={currentYear}>{currentYear}</time> {personalInfo.name}
      </small>
    </p>
    
    <p className="text-text-muted/50 text-xs mt-2">
      Construido con React + Vite + Tailwind CSS · Protección XSS con DOMPurify
    </p>
    
  </div>
</footer>
```

### 3. **Implementación completa corregida**

```jsx
// src/components/Footer.jsx
import { memo } from "react";
import { personalInfo } from "@/data/portfolioData";

/**
 * Footer - Pie de página con información de copyright y créditos técnicos.
 * 
 * @component
 * @example
 * <Footer />
 */
function Footer() {
  // Manejo seguro del año para SSR/CSR
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-10 px-6">
      <div className="section-divider mb-10" aria-hidden="true" />
      
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Logo/Navegación */}
        <nav aria-label="Navegación principal del footer">
          <a
            href="#inicio"
            aria-label="Volver al inicio de la página"
            className="inline-block text-2xl font-bold gradient-text mb-4 
                       hover:opacity-80 transition-opacity duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary 
                      

---

## 📄 `src\components\Hero.jsx`

Voy a realizar un code review detallado de este componente `Hero.jsx`, organizando los hallazgos en las tres secciones solicitadas.

---

## 🐛 Bugs o errores potenciales

### 1. **Error de sintaxis en CSS: `bg-accent/8` no es válido en Tailwind**

**Problema:** La clase `bg-accent/8` intenta usar opacidad 8%, pero Tailwind CSS v3 no genera clases de opacidad arbitrarias con números sin unidades que no estén en su escala por defecto (0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100). `8` no es un valor válido.

```jsx
// ❌ INCORRECTO - No generará el estilo esperado
<div className="... bg-accent/8 ..." />
```

**Corrección:**
```jsx
// ✅ CORRECTO - Usar un valor de opacidad válido de Tailwind o estilo inline
<div className="... bg-accent/10 ..." />  // opacidad 10%
// o si necesitas exactamente 8%:
<div className="..." style={{ backgroundColor: 'hsl(var(--accent) / 0.08)' }} />
```

---

### 2. **Error de sintaxis en `backgroundImage`: falta `linear-gradient(` inicial**

**Problema:** La propiedad `backgroundImage` tiene un error de sintaxis. El primer `linear-gradient` está mal formado — falta el paréntesis de apertura completo y la sintaxis de `rgba` está incorrecta.

```jsx
// ❌ INCORRECTO - Sintaxis rota
style={{
  backgroundImage:
    "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
  // ...
}}
```

El problema es que `linear-gradient` necesita dirección + stops, pero aquí se intenta usar como `repeating-linear-gradient` para un grid. Además, el resultado visual esperado es un grid de puntos/líneas, pero la sintaxis actual generaría gradientes sólidos.

**Corrección:**
```jsx
// ✅ CORRECTO - Usar repeating-linear-gradient para un grid
style={{
  backgroundImage: `
    linear-gradient(to right, rgba(99, 102, 241, 0.3) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
  `,
  backgroundSize: "60px 60px",
}}
```

---

### 3. **Cierre de comillas inconsistente en clases**

**Problema:** Hay múltiples casos donde las comillas de cierre de `className` están mal colocadas o faltan, lo que causaría errores de compilación.

```jsx
// ❌ INCORRECTO - Línea 38: falta comilla de cierre antes del style
<div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

// ❌ INCORRECTO - Línea 67: comillas mal cerradas
<h1 className="... animate-fade-in-up tracking-tight"
  style={{ animationDelay: "0.2s" }}  // falta ">" de cierre de h1
>

// ❌ INCORRECTO - Línea 90: className con comillas mal anidadas
<div className="flex flex-col sm:flex-row ... animate-fade-in-up"
  style={{ animationDelay: "0.6s" }}  // falta ">" de cierre
>

// ❌ INCORRECTO - Línea 122: cierre de div sin ">"
<div className="absolute bottom-8 ... animate-fade-in-up opacity-60">
```

**Corrección:** Revisar todos los cierres de etiquetas. Ejemplo corregido:
```jsx
// ✅ CORRECTO
<div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
  {/* ... */}
</div>

<h1
  className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-up tracking-tight"
  style={{ animationDelay: "0.2s" }}
>
  {/* contenido */}
</h1>
```

---

### 4. **Etiqueta `<a>` con estilo de botón pero sin `role` o manejo de navegación**

**Problema:** Los enlaces con `href="#proyectos"` y `href="#contacto"` funcionan para navegación interna, pero el primer enlace tiene una estructura visual compleja (con `div` interno para gradiente) que puede romper el modelo de caja y la accesibilidad del enlace.

```jsx
// ❌ PROBLEMÁTICO - div dentro de <a> sin role, potencial problema de anidación
<a href="#proyectos" className="group relative ...">
  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent animate-gradient" />
  <span className="relative flex items-center gap-2">
    Ver Proyectos
    {/* svg */}
  </span>
</a>
```

**Corrección:**
```jsx
// ✅ CORRECTO - Asegurar que el enlace sea semánticamente correcto
<a
  href="#proyectos"
  className="group relative inline-flex px-8 py-3.5 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
>
  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent animate-gradient" />
  <span className="relative flex items-center gap-2">
    Ver Proyectos
    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </span>
</a>
```

---

### 5. **Falta `key` en elementos mapeados implícitos (si aplica en el futuro)**

**Problema:** Aunque no hay `.map()` en este archivo, los "orbs" animados podrían beneficiarse de extracción a un componente o array. Si se refactorizan, recordar `key`.

---

## ⚡ Mejoras de rendimiento

### 1. **Animaciones CSS que causan repaints/layout thrashing**

**Problema:** `blur-3xl` combinado con `animate-float` en elementos posicionados absolutamente puede causar **compositing costoso** en el navegador. El blur de 64px (`blur-3xl` = 64px) en elementos grandes con animación de transformación fuerza al navegador a recalcular capas constantemente.

```jsx
// ❌ COSTOSO - blur + animación en múltiples elementos
<div className="... w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
<div className="... w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-float" />
```

**Corrección:** Usar `will-change` con precaución o preferir `transform` y `opacity` para animaciones. Considerar usar `contain: paint` o reducir la complejidad visual en móviles:

```jsx
// Componente optimizado con media query para reducir efectos en móvil
const orbs = [
  { size: "w-72 h-72", color: "bg-primary/10", position: "top-1/4 left-1/4", delay: "0s" },
  { size: "w-96 h-96", color: "bg-accent/10", position: "bottom-1/4 right-1/4", delay: "2s" },
  { size: "w-64 h-64", color: "bg-primary-dark/10", position: "top-1/2 left-1/2", delay: "4s" },
];

// En el componente:
{orbs.map((orb, index) => (
  <div
    key={index}
    className={`
      absolute ${orb.position} ${orb.size} ${orb.color} rounded-full 
      blur-3xl animate-float
      hidden md:block  /* Ocultar en móvil para ahorrar batería */
    `}
    style={{ 
      animationDelay: orb.delay,
      willChange: "transform",  /* Solo si la animación es de transform */
    }}
  />
))}
```



---

## 📄 `src\components\MotivationalQuote.jsx`

# Code Review: `MotivationalQuote.jsx`

---

## 🐛 Bugs o errores potenciales

### 1. **Race condition en el timeout con `AbortController`**

El `timeoutId` se limpia con `clearTimeout` solo si la petición tiene éxito, pero si hay un error *antes* de que el timeout se dispare (por ejemplo, un error de red inmediato), el timeout sigue activo. Aunque el `cleanup` del `useEffect` aborta el controller, es más limpio asegurar que el timeout siempre se limpie.

**Corrección:**

```jsx
const fetchQuote = async () => {
  let timeoutId; // ← declarar fuera del try para acceso en finally
  
  try {
    timeoutId = setTimeout(() => controller.abort(), 5000);
    // ... resto del código
  } catch (error) {
    // ...
  } finally {
    clearTimeout(timeoutId); // ← siempre limpiar
    setIsLoading(false);
  }
};
```

---

### 2. **`setIsLoading(false)` en el `finally` puede ejecutarse después del desmonte**

Aunque el `AbortError` se maneja correctamente, si el componente se desmonta *durante* el `fetch` pero *antes* de que el `finally` se ejecute, `setIsLoading` se llamará en un componente desmontado. En React 18 con Strict Mode esto genera warnings en consola.

**Corrección con flag de montado:**

```jsx
useEffect(() => {
  const controller = new AbortController();
  let isMounted = true;

  const fetchQuote = async () => {
    // ... lógica de fetch ...
    finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  fetchQuote();
  return () => {
    isMounted = false;
    controller.abort();
  };
}, []);
```

---

### 3. **Posible `undefined` en `quote` si `localQuotes` estuviera vacío**

Aunque no es el caso actual, `Math.floor(Math.random() * localQuotes.length)` con array vacío daría `undefined`. Además, el tipo de `quote` permite `null` inicial pero el renderizado asume que siempre existe cuando `isLoading` es `false`.

**Sugerencia de robustez:**

```jsx
// Garantizar que siempre haya un fallback válido
const getRandomQuote = () => localQuotes[Math.floor(Math.random() * localQuotes.length)];

// En el catch:
const randomFallback = getRandomQuote();
setQuote(randomFallback);
```

---

### 4. **`style={{ animationDelay: "0.8s" }}` puede no aplicarse correctamente**

Si `animate-fade-in-up` usa `animation` shorthand en CSS, el `animationDelay` inline puede no tener efecto o entrar en conflicto. Esto depende de la configuración de Tailwind, pero es un punto a verificar.

---

## ⚡ Mejoras de rendimiento (performance)

### 1. **Fetch en cada render del padre sin caché de citas**

Cada vez que el componente se monta, se hace una petición nueva. Si el usuario navega y vuelve, se pierde la cita anterior. Considerar si se quiere cachear la cita obtenida.

**Sugerencia con `sessionStorage` o contexto:**

```jsx
// Opción simple con caché en memoria del módulo
let cachedQuote = null;

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(cachedQuote);
  const [isLoading, setIsLoading] = useState(!cachedQuote);

  useEffect(() => {
    if (cachedQuote) return; // No volver a fetchear si ya tenemos una
    
    // ... lógica de fetch, y al final:
    cachedQuote = newQuote;
  }, []);
```

---

### 2. **`Date.now()` en la URL invalida caché del navegador pero también de servicios**

El parámetro `_t=${Date.now()}` es correcto para evitar caché, pero si la API tiene rate limiting, esto agota el límite rápidamente. Documentar esta decisión o hacerlo condicional.

---

### 3. **SVG inline sin lazy loading ni memoización**

El SVG de las comillas se re-renderiza en cada actualización. Aunque es ligero, podría extraerse a un componente memoizado.

```jsx
const QuoteIcon = React.memo(() => (
  <svg className="w-8 h-8 text-primary/40 absolute top-4 left-4" ...>
    <path d="..." />
  </svg>
));
```

---

## 🎨 Mejoras de estilo y buenas prácticas

### 1. **Separación de responsabilidades: lógica de datos vs. presentación**

El componente mezcla fetching, fallback, estado y presentación. Extraer la lógica de datos a un custom hook mejora testabilidad y reutilización.

```jsx
// hooks/useQuote.js
export function useQuote() {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... lógica completa de fetch ...
  }, []);

  return { quote, isLoading, error, refetch };
}

// MotivationalQuote.jsx
export default function MotivationalQuote() {
  const { quote, isLoading } = useQuote();
  // ... renderizado puro
}
```

---

### 2. **Mejorar semántica HTML y accesibilidad**

- `<cite>` dentro de `<blockquote>` es válido en HTML5, pero el contenedor principal debería usar `<figure>` y `<figcaption>` para mejor semántica.
- Falta `aria-live` para anunciar cambios de cita a lectores de pantalla.

```jsx
<figure className="glass rounded-2xl p-6 relative overflow-hidden group" aria-live="polite">
  <blockquote>
    <p className="...">"{quote.text}"</p>
    <figcaption className="...">— {quote.author}</figcaption>
  </blockquote>
</figure>
```

---

### 3. **Constantes mágicas y configuración hardcodeada**

Extraer a constantes configurables:

```jsx
const CONFIG = {
  API_URL: "https://dummyjson.com/quotes/random",
  FETCH_TIMEOUT: 5000,
  FALLBACK_QUOTES: localQuotes,
};

// O mejor, desde variables de entorno:
const API_URL = import.meta.env.VITE_QUOTES_API_URL || "https://dummyjson.com/quotes/random";
```

---

### 4. **Inconsistencia en el manejo de errores**

Se usa `console.warn` para el fallback, pero no hay forma de que el UI muestre que ocurrió un error (aunque sea recuperable). Considerar un estado `error` para transparencia.

---

### 5. **Clase `glass` no es estándar de Tailwind**

Asumiendo que es un custom class, documentar que requiere definición en el CSS global. Si no está definida, el componente se verá sin fondo translúcido.

---

## ✅ Resumen ejecutivo

| Aspecto | Estado | Prioridad |
|---------|--------|-----------|
| Bugs potenciales | 🔴 Timeout no siempre limpio, setState post-desmonte | Alta |
| Performance | 🟡 Sin caché de citas, SVG no memoizado | Media |
| Separación de concerns | 🟡 Mezcla de lógica y UI | Media |
| Accesibilidad | 🟡 Falta `aria-live`, semántica mejorable | Media |
| Estilo y mantenibilidad | 🟡 Constantes hardcodeadas, falta documentación | Baja |

El componente funciona correctamente para su propósito, pero necesita atención en el manejo del ciclo de vida del `fetch` y la limpieza de efectos para ser production-ready.

---

## 📄 `src\components\Navbar.jsx`

# Code Review: `Navbar.jsx`

---

## 🐛 Bugs o errores potenciales

### 1. **Scroll spy con comportamiento errático en secciones pequeñas o al final de página**

El scroll spy solo verifica `top <= 120`, lo que puede causar que la última sección nunca se active si no alcanza a cruzar ese umbral, o que secciones pequeñas entre grandes no se detecten correctamente.

```jsx
// ❌ Problema: Umbral fijo y lógica simple
const el = document.getElementById(sections[i]);
if (el && el.getBoundingClientRect().top <= 120) {
  setActiveSection(`#${sections[i]}`);
  break;
}

// ✅ Corrección: Usar IntersectionObserver o mejorar la lógica con umbral dinámico
// Opción A: Con IntersectionObserver (más robusto)
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    },
    {
      rootMargin: "-80px 0px -70% 0px", // Ajusta según tu layout
      threshold: 0,
    }
  );

  const sections = navLinks.map((l) => l.href.replace("#", ""));
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, []);
```

### 2. **`socialLinks[0]` puede ser `undefined` sin manejo adecuado**

Aunque hay un fallback a `"#"`, el acceso directo a `socialLinks[0]?.url` sin verificar la estructura completa es frágil.

```jsx
// ❌ Problema: Asume estructura de datos
href={sanitizeUrl(socialLinks[0]?.url || "#")}

// ✅ Corrección: Validación más explícita o usar un selector
const githubLink = socialLinks.find(s => s.platform === 'github') || { url: '#' };

// O mejor aún, pasar por props o usar un hook de configuración
```

### 3. **Falta `event.preventDefault()` en navegación con hash**

Los clicks en enlaces con `href="#section"` causan scroll nativo del browser, que puede conflictuar con scroll suave o animaciones.

```jsx
// ❌ Problema: Scroll nativo no controlado
<a href={sanitizeUrl(link.href)} onClick={() => handleNavClick(link.href)}>

// ✅ Corrección:
const handleNavClick = (e, href) => {
  e.preventDefault();
  setIsMobileOpen(false);
  setActiveSection(href);
  
  // Scroll suave controlado
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

// En el JSX:
<a 
  href={sanitizeUrl(link.href)} 
  onClick={(e) => handleNavClick(e, link.href)}
>
```

### 4. **`id="navbar"` y `id="mobile-menu-toggle"` innecesarios**

Los IDs hardcodeados rompen el principio de reusabilidad de componentes React. Si se montan dos instancias, hay colisión.

```jsx
// ❌ Problema:
id="navbar"
id="mobile-menu-toggle"

// ✅ Corrección: Eliminar o usar useId si son necesarios para aria
import { useId } from 'react';

export default function Navbar() {
  const navId = useId();
  // Solo si realmente necesitas referenciarlo (ej: aria-controls)
```

---

## ⚡ Mejoras de rendimiento (performance)

### 1. **Re-renderizaciones innecesarias en scroll**

El evento `scroll` se dispara decenas de veces por segundo. `setIsScrolled` y `setActiveSection` se ejecutan en cada frame.

```jsx
// ❌ Problema: Sin throttling
useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50); // Se ejecuta constantemente
    // ... scroll spy
  };
  window.addEventListener("scroll", handleScroll);
}, []);

// ✅ Corrección: Separar concerns y usar throttling/debounce
import { useCallback, useRef } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollTimeout = useRef(null);
  const lastScrollY = useRef(0);

  // Estado derivado para scroll (sin necesidad de state si solo es clase CSS)
  // O mejor: usar CSS sticky con backdrop-filter si es posible

  useEffect(() => {
    const handleScroll = () => {
      // Throttle manual con requestAnimationFrame
      if (scrollTimeout.current) return;
      
      scrollTimeout.current = requestAnimationFrame(() => {
        scrollTimeout.current = null;
        const currentY = window.scrollY;
        
        // Solo actualizar si cambió significativamente
        if (Math.abs(currentY - lastScrollY.current) > 5) {
          setIsScrolled(currentY > 50);
          lastScrollY.current = currentY;
        }
        
        // Scroll spy separado o con IntersectionObserver
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) cancelAnimationFrame(scrollTimeout.current);
    };
  }, []);
```

### 2. **Separar scroll spy en custom hook**

```jsx
// hooks/useScrollSpy.js
import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds, options = {}) {
  const { rootMargin = '-80px 0px -70% 0px' } = options;
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Priorizar la sección más visible o la primera que intersecta
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      
      if (visible.length > 0) {
        setActiveId(`#${visible[0].target.id}`);
      }
    }, { rootMargin, threshold: 0 });

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return activeId;
}

// En Navbar.jsx
const sectionIds = useMemo(() => navLinks.map(l => l.href.replace('#', '')), []);
const activeSection = useScrollSpy(sectionIds);
```

### 3. **Memorizar mapeos de listas**

```jsx
// ❌ Problema: Re-creación de funciones en cada render
{navLinks.map((link) => (
  <li key={link.href}>
    <a onClick={() => handleNavClick(link.href)}>

// ✅ Corrección: Si la lista es estática, extraer componente
const NavItem = React.memo(({ link, isActive, onClick }) => (
  <li>
    <a
      href={sanitizeUrl(link.href)}
      onClick={(e) => {
        e.preventDefault();
        onClick(link.href);
      }}
      className={clsx(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
        isActive 
          ? "text-primary-light bg-primary/10"
          : "text-text-secondary hover:text-text-primary hover:bg-white/5"
      )}
    >
      {link.label}
    </a>
  </li>
));
```

---

## 🎨 Mejoras de estilo y buenas prácticas

### 1. **Usar `clsx` o `tailwind-merge` para clases condicionales**

```jsx
// ❌ Problema: Template strings con condicionales difíciles de mantener
className={`fixed top-0 ... ${isScrolled ? "glass-strong..." : "py-5..."}`}

// ✅ Corrección:
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper recomendado
const cn = (...inputs) => twMerge(clsx(inputs));

// Uso:
className={cn(
  "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
  isScrolled 
    ? "glass-strong py-3 shadow-lg shadow-black/20"
    : "py-5 bg-transparent"
)}
```

### 2. **Extraer SVG a componente reutilizable**

```jsx
// components/icons/GitHubIcon.jsx
export const GitHubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c-6.626..." />
  </svg>
);

// En Navbar:
import { GitHubIcon } from

---

## 📄 `src\components\Projects.jsx`

Voy a realizar un code review detallado de este componente `Projects.jsx`. Analizaré el código en profundidad buscando bugs, problemas de rendimiento y mejoras de estilo.

---

## 🐛 Bugs o errores potenciales

### 1. **Sintaxis JSX rota: paréntesis desbalanceados en `href`**

Hay un paréntesis de cierre extra en dos lugares donde se usa `sanitizeUrl(project.repoUrl)`:

```jsx
// ❌ ERROR - Línea 55 y línea 108 aproximadamente
href={sanitizeUrl(project.repoUrl))}  // ¡Dos cierres de paréntesis!
```

**Corrección:**
```jsx
// ✅ CORRECTO
href={sanitizeUrl(project.repoUrl)}
```

---

### 2. **Estructura HTML semántica incorrecta: `<article>` mal anidado**

El `<article>` contiene un `<div>` que cierra prematuramente (`</div>` de "Card Header"), pero el contenido siguiente (technologies, repo link) está fuera de ese div sin un contenedor padre que agrupe lógicamente. Además, hay un comentario `/* Technologies */` que está mal cerrado con `*/}` en lugar de `*/}`.

Peor aún: el cierre `</div>` del "Card Header" está mal ubicado. El `<h3>` y `<p>` están dentro del header visualmente, pero el cierre `</div>` después del `<p>` cierra el `<div className="relative p-8 pb-0">`, dejando las technologies y el link fuera del padding consistente.

**Corrección estructural:**
```jsx
<article className="...">
  {/* Card Header - contenido con padding */}
  <div className="relative p-8 pb-0">
    <div className="flex items-start justify-between mb-4">
      <span className="text-4xl">{project.icon}</span>
      <a href={sanitizeUrl(project.repoUrl)} ...>
        {/* svg */}
      </a>
    </div>
    
    <h3 className="...">{project.title}</h3>
    <p className="...">{project.description}</p>
  </div>

  {/* Card Body - contenido con padding separado */}
  <div className="px-8 pb-8">
    <div className="flex flex-wrap gap-2 mb-6">
      {project.technologies.map((tech) => (
        <span key={tech} className="...">
          {tech}
        </span>
      ))}
    </div>

    <a href={sanitizeUrl(project.repoUrl)} className="...">
      {/* svg y texto */}
    </a>
  </div>
</article>
```

---

### 3. **Falta de `key` estable para el map de technologies**

```jsx
// ❌ PROBLEMA - puede causar problemas de reconciliación si hay techs repetidas
{project.technologies.map((tech) => (
  <span key={tech}>...</span>
))}
```

Si `technologies` contiene duplicados o si se reordenan, React mostrará warning. Además, `tech` como string puede no ser único si hay repetidos.

**Corrección:**
```jsx
{project.technologies.map((tech, techIndex) => (
  <span key={`${project.id}-${tech}-${techIndex}`} className="...">
    {tech}
  </span>
))}
```

---

### 4. **SVG de GitHub potencialmente roto o con path incorrecto**

El SVG del icono de GitHub tiene un path muy largo y complejo que parece el path oficial, pero está mezclado con un SVG de flecha. Revisando: el path parece correcto para el logo de GitHub, pero el segundo SVG (la flecha) está dentro del mismo `<a>`, lo cual es intencional para el diseño, pero verifica que el path del logo no esté truncado.

Verificación: el path `M12 0c-6.626...` sí es el path oficial de GitHub. ✅

---

### 5. **Falta de manejo de caso `project.repoUrl` undefined/null**

```jsx
// ❌ PROBLEMA - sanitizeUrl podría recibir undefined
href={sanitizeUrl(project.repoUrl)}
```

Si `repoUrl` es opcional en los datos, esto romperá o generará `href="undefined"`.

**Corrección:**
```jsx
// Opción 1: Condicional en el componente
{project.repoUrl && (
  <a href={sanitizeUrl(project.repoUrl)} ...>
    Ver en GitHub
  </a>
)}

// Opción 2: Default en sanitizeUrl o early return
const safeUrl = project.repoUrl ? sanitizeUrl(project.repoUrl) : '#';
```

---

### 6. **Falta de `aria-label` en el link del icono superior**

El link con el icono externo (flecha) solo tiene `aria-label` si se mantiene, pero verifica que sea descriptivo:

```jsx
// ✅ Ya está bien implementado
aria-label={`Ver repositorio de ${project.title}`}
```

---

## ⚡ Mejoras de rendimiento

### 1. **Re-renderizados innecesarios por `useInView` sin memoización**

El `useInView` se ejecuta en cada render, y el objeto de configuración `{ threshold: 0.1 }` se crea cada vez. Aunque el hook probablemente lo maneja internamente, el componente completo se re-renderiza cuando `isInView` cambia, causando re-render de TODAS las tarjetas.

**Corrección:**
```jsx
import { useMemo } from 'react';
import { projects } from "../data/portfolioData";
import { sanitizeUrl } from "../utils/sanitize";
import { useInView } from "../hooks/useInView";

export default function Projects() {
  // Memoizar configuración si el hook no la memoiza internamente
  const inViewOptions = useMemo(() => ({ threshold: 0.1 }), []);
  const [ref, isInView] = useInView(inViewOptions);

  // ... resto del componente
}
```

---

### 2. **Animaciones CSS masivas sin `will-change` ni contención**

Las transiciones complejas pueden causar repaints costosos.

**Corrección:**
```jsx
// Agregar a las clases de animación:
className="... will-change-transform"
```

Y considerar `contain: layout` en las tarjetas para aislar el repaint.

---

### 3. **Lazy loading de imágenes (si las hubiera)**

No hay imágenes en este componente, pero si `project.icon` fuera una imagen, faltaría `loading="lazy"`. Como es un emoji/icono inline, está bien. ✅

---

### 4. **Memoización de ProjectCard como subcomponente**

El map de proyectos crea elementos inline. Extraer a un componente memoizado mejora el rendimiento:

```jsx
// Nuevo archivo: ProjectCard.jsx
import { memo } from 'react';
import { sanitizeUrl } from "../utils/sanitize";

const ProjectCard = memo(function ProjectCard({ project, index, isInView }) {
  return (
    <article className="...">
      {/* ... contenido de la tarjeta ... */}
    </article>
  );
});

// En Projects.jsx:
{projects.map((project, i) => (
  <ProjectCard 
    key={project.id} 
    project={project} 
    index={i} 
    isInView={isInView} 
  />
))}
```

---

## 🎨 Mejoras de estilo y buenas prácticas

### 1. **Separación de responsabilidades: Componente muy largo**

El componente tiene ~140 líneas mezclando layout de sección, lógica de animación y markup de tarjeta. Extraer componentes:

```jsx
// Estructura recomendada:
// Projects.jsx - Solo layout de sección y lógica de inView
// ProjectCard.jsx - Tarjeta individual
// ProjectIcon.jsx - Icono/link externo
// TechTag.jsx - Badge de tecnología
```

---

### 2. **Clases CSS dinámicas difíciles de mantener**

Las clases condicionales largas son propensas a errores. Usar `clsx` o `tailwind-merge`:

```jsx
// ❌ ACTUAL
className={`group glass rounded-2xl overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/30 hover:-translate-y-2 ${
  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
}`}

// ✅ MEJORADO con clsx
import clsx from 'clsx';

className={clsx(
  "group glass rounded-2xl overflow-hidden transition-all duration-700",
  "hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/30 hover:-translate-y-2",
  isInView ? "opacity-100 translate-y-0" : "opacity-0

---

## 📄 `src\components\Skills.jsx`

Voy a realizar un code review detallado de este archivo `Skills.jsx`.

---

## 🐛 Bugs o errores potenciales

### 1. **Error de sintaxis: paréntesis desbalanceados en `categories`**

```jsx
const categories = ["Todos", ...new Set(skills.map((s) => s.category))];
//                                                           ^^^^^^^^^^
// Falta cerrar el paréntesis de map y el de Set
```

**Problema:** Hay un paréntesis de cierre extra que causa error de sintaxis. El código actual tiene `))` al final pero falta cerrar `skills.map(...)`.

**Corrección:**
```jsx
const categories = ["Todos", ...new Set(skills.map((s) => s.category))];
// Correcto: skills.map(...) cierra map, Set(...) cierra Set, [...] cierra array
```

> ⚠️ **Nota:** Revisando de nuevo, tu código tiene `...new Set(skills.map((s) => s.category))` — parece correcto en cuanto a paréntesis. Pero hay un **paréntesis extra** en tu código original: `...new Set(skills.map((s) => s.category))` — no, espera. Revisando cuidadosamente tu código: `...new Set(skills.map((s) => s.category))` — esto parece correcto. Pero en tu snippet hay `...new Set(skills.map((s) => s.category))` con doble paréntesis al final `))`. 

**Verificación:** Tu línea es: `...new Set(skills.map((s) => s.category))` — esto tiene **3 aperturas** (`Set(`, `map(`, `(s)`) y **3 cierres** (`))`, `))` — espera, hay `))` al final. Contando: `Set(` = 1, `map(` = 2, `(s)` = 3. Cierres: `s.category)` = cierra map, `))` = cierra Set y... sobra uno? No, `))` cierra Set y el array. 

En realidad: `skills.map((s) => s.category)` → dentro de `Set(...)` → dentro de array `[...]`. Los cierres son: `s.category)` cierra map, `)` cierra Set, `]` cierra array. Tu código tiene `))` antes del `;` — eso son dos cierres, pero el array se cierra con `]`. 

**Conclusión:** Tu código tiene `...new Set(skills.map((s) => s.category))` — el `))` cierra Set y... no hay array? Espera, la línea completa es `const categories = ["Todos", ...new Set(skills.map((s) => s.category))];` — el `]` cierra el array. Entonces `))` cierra map y Set. Esto es **correcto**. 

Pero revisando tu código original: `...new Set(skills.map((s) => s.category))` — sí, está bien. No hay bug aquí. Me disculpo por la confusión inicial.

---

### 2. **Bug real: `i` (índice) no está definido en el map de `filteredSkills`**

```jsx
{filteredSkills.map((skill, i) => (  // ✅ i está definido aquí
  // ...
  style={{
    transitionDelay: isInView ? `${i * 80}ms` : "0ms",  // ✅ Usado aquí
  }}
  // ...
  <div
    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
    style={{
      width: isInView ? `${skill.level}%` : "0%",
      transitionDelay: `${i * 80 + 300}ms`,  // ✅ Usado aquí también
    }}
  />
))}
```

**Análisis:** El índice `i` sí está definido y usado correctamente. No hay bug aquí.

---

### 3. **Bug real: Dependencia circular o re-renderizado infinito potencial en `useInView`**

```jsx
const [ref, isInView] = useInView({ threshold: 0.15 });
```

**Problema:** No se ve la implementación de `useInView`, pero si este hook crea un nuevo objeto de opciones cada render o no memoiza el observer, puede causar re-renderizados infinitos o memory leaks.

**Corrección sugerida (defensiva):**
```jsx
import { useRef } from "react"; // o verificar que useInView maneje esto internamente

// Si useInView acepta un ref en lugar de retornarlo:
const ref = useRef(null);
const isInView = useInView(ref, { threshold: 0.15 }); // API más común
```

---

### 4. **Bug de accesibilidad: Botones de filtro sin estado aria-pressed**

```jsx
<button
  key={cat}
  onClick={() => setActiveFilter(cat)}
  // ❌ Falta aria-pressed o aria-current
>
```

**Corrección:**
```jsx
<button
  key={cat}
  onClick={() => setActiveFilter(cat)}
  aria-pressed={activeFilter === cat}
  className={`...`}
>
  {cat}
</button>
```

---

### 5. **Bug de semántica HTML: `div` con role implícito incorrecto**

El grid de skills usa `div` genéricos. Para mejor accesibilidad, deberían ser listas.

---

## ⚡ Mejoras de rendimiento (performance)

### 1. **Cálculo de `categories` no memoizado**

```jsx
// ❌ Se recalcula en cada render
const categories = ["Todos", ...new Set(skills.map((s) => s.category))];
```

**Problema:** Si `skills` es importado (estático), esto es innecesario. Si fuera dinámico, necesitaría `useMemo`.

**Corrección:**
```jsx
// Opción A: Si skills es estático, calcular fuera del componente
// En data/portfolioData.js o un archivo separado:
// export const skillCategories = ["Todos", ...new Set(skills.map(s => s.category))];

// Opción B: Si es dinámico, usar useMemo
const categories = useMemo(
  () => ["Todos", ...new Set(skills.map((s) => s.category))],
  [] // o [skills] si cambia
);
```

---

### 2. **Re-renderizados innecesarios en botones de filtro**

```jsx
{categories.map((cat) => (
  <button
    key={cat}
    onClick={() => setActiveFilter(cat)}  // ❌ Nueva función en cada render
  >
```

**Corrección:**
```jsx
// Extraer componente o usar useCallback
const handleFilterChange = useCallback((cat) => {
  setActiveFilter(cat);
}, []);

// En el JSX:
{categories.map((cat) => (
  <FilterButton
    key={cat}
    category={cat}
    isActive={activeFilter === cat}
    onClick={handleFilterChange}
  />
))}
```

---

### 3. **Animaciones CSS que podrían usar `will-change`**

```jsx
// Añadir para optimizar composición
className="... will-change-transform"
```

---

### 4. **Lazy loading o code splitting para la sección**

```jsx
import { lazy, Suspense } from 'react';

const Skills = lazy(() => import('./Skills'));

// En App.jsx o donde se use:
<Suspense fallback={<SkillsSkeleton />}>
  <Skills />
</Suspense>
```

---

## 🎨 Mejoras de estilo y buenas prácticas

### 1. **Separar lógica de presentación: Extraer componentes**

```jsx
// Skills.jsx principal
import { SkillCard } from './SkillCard';
import { CategoryFilter } from './CategoryFilter';

export default function Skills() {
  // ... lógica del hook
  
  return (
    <section id="habilidades" className="py-24 px-6 relative">
      {/* ... */}
      <CategoryFilter 
        categories={categories}
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />
      <div className="grid md:grid-cols-2 gap-5">
        {filteredSkills.map((skill, i) => (
          <SkillCard key={skill.name} skill={skill} index={i} isInView={isInView} />
        ))}
      </div>
    </section>
  );
}
```

---

### 2. **Mejorar la estructura semántica**

```jsx
// ❌ Actual
<div className="grid md:grid-cols-2 gap-5">
  {filteredSkills.map((skill, i) => (
    <div key={skill.name}>...</div>
  ))}
</div>

// ✅ Mejorado
<ul className="grid md:grid-cols-2 gap-5" aria-label="Lista de habilidades técnicas">
  {filteredSkills.map((skill, i) =>

---

## 📄 `src\data\portfolioData.js`

# Code Review: `portfolioData.js`

---

## 🐛 Bugs o errores potenciales

### 1. Inconsistencia en el campo `yearsExperience` como string

**Problema:** `yearsExperience` está definido como string (`"1"`), lo que puede causar comportamientos inesperados si se usa en cálculos o comparaciones numéricas.

```javascript
// Actual
yearsExperience: "1",

// Corrección
yearsExperience: 1, // number
```

### 2. Validación faltante en URLs de redes sociales y proyectos

**Problema:** Las URLs no tienen validación. Un error tipográfico en `repoUrl` o `url` podría generar enlaces rotos o, peor, vulnerabilidades de redirección abierta (open redirect) si se usaran parámetros dinámicos.

```javascript
// Sugerencia: Validar formato o usar un helper
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// O mejor aún, definir un schema con Zod para validar en build time
```

### 3. IDs hardcodeados potencialmente conflictivos

**Problema:** Los IDs numéricos manuales (`id: 1`, `id: 2`) son propensos a duplicados al escalar. No hay garantía de unicidad.

```javascript
// Corrección: Usar un generador de IDs o UUIDs
import { v4 as uuidv4 } from 'uuid';

// O al menos un prefijo semántico
const generateProjectId = (title) => 
  `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

// Mejor aún con un schema validado
```

### 4. El comentario sobre sanitización XSS es engañoso

**Problema:** El JSDoc menciona que los datos "pasan por las funciones de sanitize.js", pero este archivo solo exporta datos planos. La sanitización debe documentarse donde realmente ocurre, o el comentario puede generar falsa seguridad.

```javascript
// Corrección: Eliminar o ajustar el comentario
/**
 * portfolioData.js — Fuente de datos estáticos del portafolio.
 * 
 * ⚠️ NOTA: Estos datos son renderizados como texto plano.
 * Si se necesita renderizar HTML, aplicar sanitización en el componente
 * usando DOMPurify o similar.
 */
```

---

## ⚡ Mejoras de rendimiento (performance)

### 1. Falta de inmutabilidad garantizada y memoización potencial

**Problema:** Los arrays y objetos son mutables por defecto. Aunque no es crítico aquí, en una app React esto puede causar re-renderizados innecesarios si se usan mal.

```javascript
// Mejor práctica: Congelar objetos si son truly inmutables
export const personalInfo = Object.freeze({
  name: "Wilmer Salazar",
  // ...resto
});

export const skills = Object.freeze([
  // ...items con Object.freeze anidado si es necesario
]);

// O usar deepFreeze para objetos anidados
const deepFreeze = (obj) => {
  Object.keys(obj).forEach(key => {
    const val = obj[key];
    if (typeof val === 'object' && val !== null) deepFreeze(val);
  });
  return Object.freeze(obj);
};
```

### 2. Datos no normalizados para búsquedas eficientes

**Problema:** Si `skills` o `projects` crecen, buscar por categoría o tecnología es O(n). Para datasets grandes, una estructura indexada es preferible.

```javascript
// Estructura alternativa para acceso O(1) por categoría
export const skillsByCategory = skills.reduce((acc, skill) => {
  (acc[skill.category] ||= []).push(skill);
  return acc;
}, {});

// O mantener ambas representaciones con un selector
export const getSkillsByCategory = (category) => 
  skills.filter(s => s.category === category); // Memoizar con useMemo en React
```

### 3. Posible carga innecesaria de todos los datos

**Problema:** Este archivo centralizado importa todo de golpe. En una app grande, considerar code splitting por sección.

```javascript
// portfolioData/
//   ├── personalInfo.js
//   ├── skills.js
//   ├── projects.js
//   └── index.js (re-exports)

// En el consumidor:
const { projects } = await import('./data/projects.js'); // Lazy loading
```

---

## 🎨 Mejoras de estilo y buenas prácticas

### 1. Magic strings en categorías y tecnologías

**Problema:** `"Lenguajes"`, `"Frameworks"`, `"Herramientas"` son strings repetidos. Error tipográfico = bug silencioso.

```javascript
// Definir constantes o enum
export const SKILL_CATEGORIES = Object.freeze({
  LANGUAGES: 'Lenguajes',
  FRAMEWORKS: 'Frameworks',
  TOOLS: 'Herramientas',
});

// Uso
{ name: "Python", level: 20, category: SKILL_CATEGORIES.LANGUAGES },
```

### 2. Nivel de habilidad sin contexto semántico

**Problema:** `level: 20` es arbitrario. ¿20 de 100? ¿De 50? Falta claridad.

```javascript
// Opción A: Documentar la escala
/**
 * @typedef {Object} Skill
 * @property {string} name
 * @property {number} level - Porcentaje 0-100 de dominio
 * @property {keyof typeof SKILL_CATEGORIES} category
 */

// Opción B: Usar enum descriptivo
const PROFICIENCY = Object.freeze({
  BEGINNER: 25,
  INTERMEDIATE: 50,
  ADVANCED: 75,
  EXPERT: 100,
});

// Opción C: Ambos con validación runtime
const SkillSchema = z.object({
  name: z.string(),
  level: z.number().min(0).max(100),
  category: z.nativeEnum(SKILL_CATEGORIES)
});
```

### 3. Iconos como emojis sin alternativa de accesibilidad

**Problema:** Los emojis (`📊`, `🗳️`) pueden interpretarse diferente por screen readers. El icono `"github"` en `socialLinks` es inconsistente con los emojis.

```javascript
// Unificar sistema de iconos con metadatos de accesibilidad
export const projects = [
  {
    id: 1,
    title: "Docentes por Periodos",
    // ...
    icon: {
      emoji: "📊",
      label: "Gráfico de barras", // Para aria-label
      // O usar un componente Icon referenciado por nombre
      iconName: "ChartBar",
    },
  },
];

// O mejor, en el componente React:
<span role="img" aria-label="Gráfico de barras">📊</span>
```

### 4. Estructura monolítica vs. modular

**Problema:** Todo en un archivo dificulta el mantenimiento y las pruebas unitarias por separado.

```javascript
// Estructura recomendada:
// src/
//   data/
//     ├── constants/
//     │   ├── categories.js
//     │   └── skillLevels.js
//     ├── schemas/
//     │   └── portfolioSchemas.js  // Validación Zod/Yup
//     ├── types/
//     │   └── portfolio.types.ts   // Si se migra a TS
//     ├── personalInfo.js
//     ├── skills.js
//     ├── projects.js
//     ├── socialLinks.js
//     ├── navLinks.js
//     └── index.js                 // Barrel export

// index.js
export { personalInfo } from './personalInfo.js';
export { skills } from './skills.js';
// etc.
```

### 5. Falta de TypeScript o al menos JSDoc completo

```javascript
// Mejorar el JSDoc existente para autocompletado y validación

/**
 * @typedef {Object} Project
 * @property {number | string} id - Identificador único del proyecto
 * @property {string} title - Título descriptivo
 * @property {string} description - Resumen de máximo 2-3 líneas
 * @property {string[]} technologies - Stack tecnológico usado
 * @property {string} repoUrl - URL pública del repositorio (validada)
 * @property {{ emoji: string, label: string }} icon - Icono con texto alternativo
 */

/**
 * @type {Project[]}
 */
export const projects = [/* ... */];
```

---

## 📋 Resumen ejecutivo

| Prioridad | Hallazgo | Acción recomendada |
|-----------|----------|-------------------|
| 🔴 Alta | `yearsExperience` como string | Cambiar a `number` |
| 🔴 Alta | Comentario de sanitización engañoso |

---

## 📄 `src\hooks\useInView.js`

# Code Review: `useInView.js`

## 🐛 Bugs o errores potenciales

### 1. Reconexión innecesaria del observer al cambiar `triggerOnce`

**Problema:** Cuando `triggerOnce` cambia de `true` a `false`, el efecto se reejecuta y el observer se reconecta. Esto puede causar comportamientos inesperados si el elemento ya estaba en vista.

**Corrección:** Considera si `triggerOnce` debería ser estable o si necesitas manejar este caso:

```javascript
// Opción: usar ref para triggerOnce si no debe cambiar en runtime
export function useInView({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const triggerOnceRef = useRef(triggerOnce); // Captura inicial

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnceRef.current) {
            observer.unobserve(element);
          }
        } else if (!triggerOnceRef.current) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]); // Sin triggerOnce en deps

  return [ref, isInView];
}
```

### 2. Falta de manejo de `root` para casos avanzados

**Problema:** No se expone la opción `root` del IntersectionObserver, limitando casos de uso como scroll en contenedores.

**Corrección:**
```javascript
export function useInView({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
  root = null, // Añadir
} = {}) {
  // ...
  const observer = new IntersectionObserver(
    ([entry]) => { /* ... */ },
    { threshold, rootMargin, root } // Incluir root
  );
  // ...
}
```

---

## ⚡ Mejoras de rendimiento (performance)

### 1. Re-creación del observer en cada render por dependencias inestables

**Problema:** Si el consumidor pasa objetos/arrays como `rootMargin` dinámico, el efecto se reejecuta constantemente.

**Corrección:** Usa serialización o comparación estable para opciones complejas:

```javascript
import { useEffect, useRef, useState, useMemo } from "react";

export function useInView({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
  root = null,
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const triggerOnceRef = useRef(triggerOnce);

  // Memoizar opciones para estabilidad
  const options = useMemo(() => ({
    threshold,
    rootMargin,
    root,
  }), [threshold, rootMargin, root]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnceRef.current) {
            observer.unobserve(element);
          }
        } else if (!triggerOnceRef.current) {
          setIsInView(false);
        }
      },
      options
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView];
}
```

### 2. Uso de `disconnect()` en lugar de `unobserve()` en cleanup

**Problema:** `disconnect()` desconecta todos los elementos observados por ese observer. Aunque en este caso solo hay uno, `unobserve()` es más preciso y semánticamente correcto.

**Corrección:**
```javascript
return () => {
  observer.unobserve(element);
  observer.disconnect(); // o solo unobserve si prefieres
};
```

### 3. Optimización: evitar setState si el valor no cambia

**Problema:** Si `triggerOnce = false` y el elemento entra/sale repetidamente del viewport, se hacen setters innecesarios cuando el estado ya es el mismo.

**Corrección:**
```javascript
const observer = new IntersectionObserver(
  ([entry]) => {
    const isIntersecting = entry.isIntersecting;
    
    setIsInView(prev => {
      // Evitar re-render si no hay cambio
      if (isIntersecting === prev) return prev;
      
      if (isIntersecting && triggerOnceRef.current) {
        observer.unobserve(element);
      }
      
      return isIntersecting;
    });
  },
  options
);
```

---

## 🎨 Mejoras de estilo y buenas prácticas

### 1. Inconsistencia en el retorno: array vs object

**Problema:** Retornar un array `[ref, isInView]` es poco legible en el consumo. Los hooks modernos prefieren objetos o arrays con nombres descriptivos.

**Corrección (opcional, breaking change):**
```javascript
// Opción A: Objeto nombrado (más legible)
return { ref, isInView, inViewRef: ref };

// Consumo:
// const { ref, isInView } = useInView();

// Opción B: Array con nombre semántico (si mantienes array)
// return [ref, isInView]; // Ya lo tienes, pero documenta mejor
```

### 2. Mejorar la documentación JSDoc con tipos

**Problema:** Los tipos en JSDoc son básicos y no aprovechan el sistema de tipos de React.

**Corrección:**
```javascript
/**
 * @typedef {Object} UseInViewOptions
 * @property {number} [threshold=0.1] - Porcentaje visible para activar (0-1).
 * @property {string} [rootMargin="0px"] - Margen alrededor del root.
 * @property {boolean} [triggerOnce=true] - Si true, solo se activa una vez.
 * @property {Element|null} [root=null] - Elemento contenedor para el scroll.
 */

/**
 * Hook para detectar cuando un elemento entra en el viewport.
 * 
 * @param {UseInViewOptions} [options] - Opciones del IntersectionObserver.
 * @returns {{ ref: React.RefObject<HTMLElement>, isInView: boolean }} 
 *   Ref para el elemento y estado de visibilidad.
 * 
 * @example
 * function Component() {
 *   const { ref, isInView } = useInView({ threshold: 0.5 });
 *   return <div ref={ref}>{isInView ? 'Visible' : 'Hidden'}</div>;
 * }
 */
export function useInView({ /* ... */ } = {}) {
  // ...
  return { ref, isInView };
}
```

### 3. Añadir validación de entorno (SSR safety)

**Problema:** En SSR (Next.js, etc.), `IntersectionObserver` no existe en el servidor.

**Corrección:**
```javascript
useEffect(() => {
  const element = ref.current;
  if (!element || typeof IntersectionObserver === 'undefined') {
    return;
  }
  // ...
}, [options]);
```

### 4. Versión final recomendada

```javascript
import { useEffect, useRef, useState, useMemo } from "react";

/**
 * Hook para detectar cuando un elemento entra en el viewport.
 * 
 * @param {Object} options
 * @param {number} [options.threshold=0.1]
 * @param {string} [options.rootMargin="0px"]
 * @param {boolean} [options.triggerOnce=true]
 * @param {Element|null} [options.root=null]
 * @returns {{ ref: React.RefObject<HTMLElement|null>, isInView: boolean, hasBeenInView: boolean }}
 */
export function useInView({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
  root = null,
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const triggerOnceRef = useRef(triggerOnce);

  const options = useMemo(
    () => ({ threshold, rootMargin, root }),
    [threshold, rootMargin, root]
  );

  useEffect(() => {
    const element = ref.current;
    
    if (!element || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      const isIntersecting = entry?.isIntersecting ?? false;
      
      setIsInView(isIntersecting);
      
      if (isIntersecting) {
        setHasBeenInView(true);
        if (triggerOnceRef.current)

---

## 📄 `src\main.jsx`

Realizaré un code review detallado de este archivo `main.jsx`.

---

## 🐛 Bugs o errores potenciales

### 1. **Falta de manejo de errores en la obtención del elemento root**

**Problema:** Si el elemento con `id="root"` no existe en el DOM, `createRoot` lanzará un error poco descriptivo o `null` causará fallos. No hay validación previa.

```jsx
// ❌ Actual - sin validación
createRoot(document.getElementById("root")).render(
```

**Corrección sugerida:**
```jsx
// ✅ Con validación explícita
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "No se encontró el elemento #root en el DOM. " +
    "Verifica que exista <div id='root'></div> en tu index.html"
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

### 2. **Potencial problema con StrictMode en producción (menor)**

**Problema:** `StrictMode` intencionalmente doble-renderiza componentes en desarrollo para detectar side effects. Aunque no es un bug, puede confundir a desarrolladores junior que no entiendan por qué sus `useEffect` se ejecutan dos veces.

**Nota:** Esto es **intencional y deseable** para desarrollo. No elimines `StrictMode`, pero documenta su comportamiento si el equipo lo desconoce.

---

## ⚡ Mejoras de rendimiento (performance)

### 1. **No hay optimizaciones críticas pendientes en este archivo**

El archivo es el entry point estándar de React 18+. No hay problemas de rendimiento inherentes en estas 8 líneas.

### 2. **Consideración: Lazy loading del App component (opcional)**

**Problema:** Si `App.jsx` crece significativamente o tiene dependencias pesadas, el bundle inicial se carga de forma síncrona.

**Corrección sugerida (solo si aplica para tu caso):**
```jsx
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const App = lazy(() => import("./App.jsx"));

// Componente de fallback mínimo para evitar flash de carga
const AppLoader = () => null; // o un spinner si lo prefieres

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<AppLoader />}>
      <App />
    </Suspense>
  </StrictMode>
);
```

> ⚠️ **Nota:** Solo recomendable si `App.jsx` tiene un tamaño significativo o subcomponentes pesados. Para aplicaciones pequeñas, añade complejidad innecesaria.

---

## 🎨 Mejoras de estilo y buenas prácticas

### 1. **Inconsistencia en el orden de imports**

**Problema:** Mezcla de imports de librerías, archivos CSS y componentes sin orden semántico.

**Corrección sugerida (orden estándar):**
```jsx
// 1. Librerías de terceros (React, etc.)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// 2. Estilos globales
import "./index.css";

// 3. Componentes locales
import App from "./App.jsx";
```

### 2. **Falta de separación de responsabilidades (render vs. configuración)**

**Problema:** La lógica de renderizado está mezclada con la obtención del DOM. En aplicaciones grandes, esto dificulta testing y mantenimiento.

**Corrección sugerida:**
```jsx
// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { initializeRoot } from "./bootstrap";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento #root no encontrado en el DOM");
}

// Función pura, fácil de testear
function renderApp(container) {
  const root = createRoot(container);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  return root;
}

const root = renderApp(rootElement);

// HMR (Hot Module Replacement) para Vite
if (import.meta.hot) {
  import.meta.hot.accept("./App.jsx", (NewApp) => {
    root.render(
      <StrictMode>
        {NewApp ? <NewApp.default /> : <App />}
      </StrictMode>
    );
  });
}
```

> **Nota sobre HMR:** Vite ya maneja HMR automáticamente para React, pero este patrón es útil si necesitas control adicional.

### 3. **Extensión `.jsx` en import de App**

**Problema menor:** Vite/ESBuild resuelve la extensión automáticamente, pero incluir `.jsx` es explícito. Sin embargo, en configuraciones modernas de Vite, puedes omitir la extensión.

**Opción consistente con convenciones modernas:**
```jsx
import App from "./App"; // Vite resuelve automáticamente .jsx, .tsx, etc.
```

> Esto es preferencia del equipo. Lo importante es **ser consistente** en todo el proyecto.

### 4. **Falta de comentario de documentación (JSDoc)**

**Corrección sugerida:**
```jsx
/**
 * Entry point de la aplicación React.
 * 
 * Inicializa el root de React 18+ con StrictMode habilitado.
 * @see {@link https://react.dev/reference/react/StrictMode}
 */
```

---

## 📋 Resumen Ejecutivo

| Aspecto | Evaluación | Prioridad |
|---------|-----------|-----------|
| Bugs funcionales | 🟢 No críticos | Baja |
| Rendimiento | 🟢 Óptimo para caso actual | - |
| Validación de DOM | 🟡 Mejorable | Media |
| Orden de imports | 🟡 Inconsistente | Baja |
| Documentación | 🟡 Ausente | Baja |

## ✅ Veredicto Final

El archivo **cumple su función correctamente** y sigue las prácticas estándar de React 18. No hay bugs críticos. Las mejoras sugeridas son **principalmente de robustez y mantenibilidad**, no de funcionalidad.

**Recomendación mínima aplicable inmediatamente:**
```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento #root en el DOM");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## 📄 `src\utils\sanitize.js`

# Code Review: `src/utils/sanitize.js`

---

## 🐛 Bugs o errores potenciales

### 1. `DOMPurify` no funciona correctamente en Node.js / SSR

**Problema:** `DOMPurify` requiere un DOM real o `jsdom`. En entornos SSR (Next.js, Remix, etc.) o Node.js puro, esta importación fallará o producirá resultados inesperados.

```javascript
// ❌ Problema: No funciona en SSR/Node.js
import DOMPurify from "dompurify";

// ✅ Corrección: Configurar con jsdom para SSR o detectar entorno
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom"; // Solo para Node.js/SSR

const isBrowser = typeof window !== "undefined";

let purify;
if (isBrowser) {
  purify = createDOMPurify(window);
} else {
  // Para SSR, usar jsdom o una alternativa
  const { window } = new JSDOM("");
  purify = createDOMPurify(window);
}

// O más simple: usar una librería isomórfica como `isomorphic-dompurify`
```

**Alternativa recomendada:** Usar `isomorphic-dompurify` que maneja esto automáticamente.

---

### 2. `sanitizeData` muta objetos con referencias circulares → Stack Overflow

**Problema:** Si el objeto tiene referencias circulares, `sanitizeData` entrará en bucle infinito.

```javascript
// ❌ Problema: Referencias circulares rompen la función
const data = { name: "test" };
data.self = data; // Referencia circular

sanitizeData(data); // 💥 RangeError: Maximum call stack size exceeded
```

```javascript
// ✅ Corrección: Agregar detección de referencias circulares
export function sanitizeData(data, seen = new WeakSet()) {
  if (typeof data !== "object" || data === null) return data;
  if (seen.has(data)) return "[Circular]"; // o throw, según necesidad
  seen.add(data);

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item, seen));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitized[key] = escapeHtml(value);
    } else if (typeof value === "object") {
      sanitized[key] = sanitizeData(value, seen);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
```

---

### 3. `sanitizeUrl` permite URLs con `javascript:` codificado

**Problema:** El regex no detecta `javascript:` con encoding o whitespace:

```javascript
// ❌ Estos pasan la validación actual:
"java\tscript:alert(1)"  // Tab intermedio
"javascript :alert(1)"   // Espacio antes de :
"javascript%3Aalert(1)"  // URL-encoded (en href se decodifica)
```

```javascript
// ✅ Corrección: Normalizar antes de validar
export function sanitizeUrl(url) {
  if (typeof url !== "string") return "#";
  
  // Normalizar: decodificar, quitar whitespace, lowercase
  const normalized = decodeURIComponent(url)
    .replace(/\s+/g, "") // Eliminar todo whitespace
    .toLowerCase();
  
  // Verificar protocolo peligroso en la forma normalizada
  if (/^(javascript|data|vbscript):/i.test(normalized)) {
    return "#";
  }

  try {
    const parsed = new URL(normalized);
    const allowedProtocols = ["http:", "https:", "mailto:"];
    return allowedProtocols.includes(parsed.protocol) ? url.trim() : "#";
  } catch {
    // URLs relativas o anclas: permitir si pasaron el filtro de protocolos
    return url.trim();
  }
}
```

---

### 4. `escapeHtml` no escapa todos los caracteres necesarios para atributos

**Problema:** Para uso en atributos HTML (ej. `value="..."`), faltan escapes adicionales:

```javascript
// ❌ Problema: En atributos, estos caracteres son peligrosos
// `onerror="..."` - backtick en atributos sin comillas
// `\x00` - null byte puede romper parsers

// ✅ Corrección: Opción para modo "atributo" o más completo
export function escapeHtml(text, { forAttribute = false } = {}) {
  if (typeof text !== "string") return "";
  
  let escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
  
  if (forAttribute) {
    // Backtick para atributos sin comillas, null bytes, etc.
    escaped = escaped
      .replace(/`/g, "&#x60;")
      .replace(/\x00/g, "&#xfffd;"); // Replacement character
  }
  
  return escaped;
}
```

---

### 5. `sanitizeData` no maneja `Map`, `Set`, `Date`, etc.

```javascript
// ❌ Problema: Se pierden tipos especiales
const data = {
  date: new Date(),        // Se convierte en {} 
  map: new Map([["a", 1]]), // Se convierte en {}
  set: new Set([1, 2, 3]),   // Se convierte en {}
};

// ✅ Corrección: Preservar tipos primitivos conocidos
export function sanitizeData(data, seen = new WeakSet()) {
  if (data === null || typeof data !== "object") {
    return typeof data === "string" ? escapeHtml(data) : data;
  }
  
  if (data instanceof Date) return data;
  if (data instanceof Map) {
    const sanitized = new Map();
    for (const [key, value] of data) {
      sanitized.set(key, sanitizeData(value, seen));
    }
    return sanitized;
  }
  if (data instanceof Set) {
    return new Set([...data].map(item => sanitizeData(item, seen)));
  }
  
  if (seen.has(data)) return "[Circular]";
  seen.add(data);

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item, seen));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = sanitizeData(value, seen);
  }
  return sanitized;
}
```

---

## ⚡ Mejoras de rendimiento

### 1. `escapeHtml`: Crear `Map` una sola vez

```javascript
// ❌ Problema: Se crea el objeto `map` en cada llamada
function escapeHtml(text) {
  const map = { "&": "&amp;", ... }; // Creado cada vez
  // ...
}

// ✅ Corrección: Definir fuera de la función
const HTML_ESCAPE_MAP = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
});

const HTML_ESCAPE_REGEX = /[&<>"'/]/g;

export function escapeHtml(text) {
  if (typeof text !== "string") return "";
  return text.replace(HTML_ESCAPE_REGEX, (char) => HTML_ESCAPE_MAP[char]);
}
```

---

### 2. `sanitizeData`: Usar `Object.hasOwn` y evitar `Object.entries` overhead

```javascript
// ✅ Corrección: Iteración más eficiente y segura
export function sanitizeData(data, seen = new WeakSet()) {
  // ...validaciones previas...
  
  const sanitized = {};
  for (const key in data) {
    if (!Object.hasOwn(data, key)) continue; // Más rápido que Object.entries
    
    const value = data[key];
    if (typeof value === "string") {
      sanitized[key] = escapeHtml(value);
    } else if (value !== null && typeof value === "object") {
      sanitized[key] = sanitizeData(value, seen);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
```

---

### 3. Compilar regex de `sanitizeUrl` una vez

```javascript
// ✅ Corrección: Regex compilada una vez
const DANGEROUS_PROTOCOL_REGEX = /^(javascript|data|vbscript):/i;

// Usar en la función...
```

---

## 🎨 Mejoras de estilo y buenas prácticas

### 1. Agregar JSDoc con `@throws` y tipos más precisos

```javascript
/**
 * @param {unknown} dirtyHtml - HTML potencialmente inseguro (no nullish-safe).
 * @returns {string} HTML sanitizado.
 * @throws {Error} Si DOMPurify no está inicializado (entorno no soportado).
 */
```

---

### 2. Us

---

## 📄 `src\utils\validators.js`

# Code Review: `src/utils/validators.js`

---

## 🐛 Bugs o errores potenciales

### 1. `isEmail` no maneja valores `null`, `undefined` ni números

**Problema:** Si se pasa `null`, `undefined` o un número, `emailRegex.test(value)` fallará silenciosamente (coerción a string) o podría generar comportamientos inesperados. El regex `test` convierte el valor a string, pero esto es frágil.

```javascript
// Casos problemáticos:
isEmail(null);        // "El formato del correo no es válido." (ok, pero por coerción)
isEmail(undefined);   // Igual
isEmail(123);         // 123@... intenta matchear como "123"
```

**Corrección:**
```javascript
export const isEmail = (value) => {
    if (!value || typeof value !== 'string') {
        return "El formato del correo no es válido.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) { // trim() para evitar espacios
        return "El formato del correo no es válido.";
    }
    return "";
};
```

---

### 2. `minLength` permite pasar `null`/`undefined` sin error

**Problema:** La condición `value && ...` hace que `null` o `undefined` pasen la validación sin error. Si el campo es opcional pero tiene longitud mínima cuando se llena, esto podría ser intencional, pero si se usa en combinación con `isRequired`, el comportamiento no es obvio.

```javascript
minLength(null, 5);      // "" (pasa) — ¿esperado?
minLength(undefined, 5); // "" (pasa)
```

**Corrección** (según intención, documentar o hacer estricto):
```javascript
export const minLength = (value, min) => {
    if (!value || typeof value !== 'string') {
        return `Debe tener al menos ${min} caracteres.`;
    }
    if (value.trim().length < min) {
        return `Debe tener al menos ${min} caracteres.`;
    }
    return "";
};
```

> **Nota:** Si se quiere que sea opcional (solo validar si hay valor), documentarlo explícitamente en un JSDoc.

---

### 3. `isRequired` acepta solo espacios en blanco como válido después de `trim`

**Problema:** El `trim()` en `isRequired` es correcto, pero hay una inconsistencia: `!value` cubre `null`, `undefined`, `""`, `0`, `false`. Sin embargo, `0` y `false` son valores válidos en algunos contextos (ej: checkbox "0" como string, o booleano). Para strings está bien, pero si se reusa para otros tipos, falla.

```javascript
isRequired(0);      // "Este campo es obligatorio." — ¿siempre deseado?
isRequired(false);  // "Este campo es obligatorio."
```

**Corrección** (más robusta para strings, explícita para otros tipos):
```javascript
export const isRequired = (value) => {
    if (value === null || value === undefined || value === "") {
        return "Este campo es obligatorio.";
    }
    if (typeof value === 'string' && value.trim() === "") {
        return "Este campo es obligatorio.";
    }
    return "";
};
```

---

## ⚡ Mejoras de rendimiento (performance)

### 4. Creación de regex en cada llamada a `isEmail`

**Problema:** El `RegExp` se compila en cada invocación. Para una función pura de utilidad que puede llamarse muchas veces (cada keystroke en un formulario), esto es innecesario.

**Corrección:**
```javascript
// Fuera de la función para reutilizar la compilación
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmail = (value) => {
    if (!value || typeof value !== 'string') {
        return "El formato del correo no es válido.";
    }
    if (!EMAIL_REGEX.test(value.trim())) {
        return "El formato del correo no es válido.";
    }
    return "";
};
```

---

### 5. `trim()` repetido en cada validador

**Problema:** Si se encadenan validadores, `trim()` se ejecuta múltiples veces sobre el mismo valor. Considerar normalizar el valor una sola vez en el punto de entrada.

**Sugerencia** (patrón alternativo, no estrictamente necesario aquí):
```javascript
// Opcional: función de normalización previa
export const normalizeInput = (value) => 
    typeof value === 'string' ? value.trim() : value;
```

---

## 🎨 Mejoras de estilo y buenas prácticas

### 6. Falta documentación JSDoc para parámetros y retornos

**Problema:** Los consumidores del módulo no tienen autocompletado ni type checking sin leer la implementación.

**Corrección:**
```javascript
/**
 * Verifica que el valor no sea vacío.
 * @param {unknown} value - Valor a validar
 * @returns {string} Mensaje de error o string vacío si es válido
 */
export const isRequired = (value) => { /* ... */ };

/**
 * Verifica formato de email.
 * @param {unknown} value - Valor a validar
 * @returns {string} Mensaje de error o string vacío si es válido
 */
export const isEmail = (value) => { /* ... */ };

/**
 * Verifica longitud mínima de string.
 * @param {unknown} value - Valor a validar
 * @param {number} min - Longitud mínima requerida
 * @returns {string} Mensaje de error o string vacío si es válido
 */
export const minLength = (value, min) => { /* ... */ };
```

---

### 7. Inconsistencia en el manejo de tipos: `min` no tiene validación

**Problema:** Si `min` no es número o es negativo, el comportamiento es impredecible.

```javascript
minLength("hola", "5");   // "Debe tener al menos 5 caracteres." — funciona por coerción
minLength("hola", -1);    // Siempre pasa
minLength("hola");        // "Debe tener al menos undefined caracteres."
```

**Corrección:**
```javascript
export const minLength = (value, min) => {
    if (typeof min !== 'number' || min < 0 || !Number.isInteger(min)) {
        console.warn(`[minLength] Parámetro 'min' inválido:`, min);
        return ""; // o lanzar error en desarrollo
    }
    // ... resto de validación
};
```

---

### 8. Considerar composición de validadores (patrón más escalable)

**Sugerencia de mejora arquitectural:** El archivo funciona para casos simples, pero para formularios complejos, considerar un patrón de composición:

```javascript
// Ejemplo de mejora futura (no obligatorio para este archivo)
export const composeValidators = (...validators) => (value) => {
    for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
    }
    return "";
};

// Uso: composeValidators(isRequired, isEmail)
```

---

## Resumen

| Categoría | Hallazgos | Severidad |
|-----------|-----------|-----------|
| 🐛 Bugs | #1 Email con tipos inválidos, #2 minLength con null/undefined, #3 isRequired con 0/false | Media-Alta |
| ⚡ Performance | #4 Regex recompilado, #5 trim repetido | Media |
| 🎨 Estilo | #6 JSDoc faltante, #7 Validación de parámetros, #8 Patrón composición | Baja-Media |

El código tiene una buena base con funciones puras y responsabilidad única, pero necesita robustez en el manejo de tipos y mejor documentación para ser mantenible en equipo.

---

*Fin del reporte. Total de archivos analizados: 14*
