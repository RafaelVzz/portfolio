import { useState, useEffect } from "react";

const localQuotes = [
  {
    text: "No nos afecta lo que nos sucede, sino lo que nos decimos acerca de lo que nos sucede.",
    author: "Epicteto",
  },
  {
    text: "La felicidad de tu vida depende de la calidad de tus pensamientos.",
    author: "Marco Aurelio",
  },
  {
    text: "No es que tengamos poco tiempo, sino que perdemos mucho.",
    author: "Séneca",
  },
  {
    text: "El que teme a la muerte nunca hará nada digno de un hombre que está vivo.",
    author: "Séneca",
  },
  {
    text: "Si no está bien, no lo hagas. Si no es cierto, no lo digas.",
    author: "Marco Aurelio",
  },
  {
    text: "Cuanto más busques la seguridad, menos la tendrás.",
    author: "Epicteto",
  },
  {
    text: "El hombre sabio se alegra con lo que tiene y no se aflige por lo que no tiene.",
    author: "Epicteto",
  },
  {
    text: "La vida es muy corta y ansiosa para aquellos que olvidan el pasado, descuidan el presente y temen el futuro.",
    author: "Séneca",
  }
];

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchQuote = async () => {
      try {
        // Timeout de 5 segundos para evitar que la UI se quede colgada
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // DummyJSON tiene CORS habilitado nativamente — no requiere proxy.
        // El parámetro _t evita que el navegador cachee la respuesta.
        const response = await fetch(
          `https://dummyjson.com/quotes/random?_t=${Date.now()}`,
          { signal: controller.signal, cache: "no-store" }
        );

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        if (data && data.quote && data.author) {
          setQuote({
            text: data.quote,
            author: data.author,
          });
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        // Si la petición fue cancelada por desmontaje del componente, no hacer nada
        if (error.name === "AbortError") return;

        console.warn("Error fetching quote, using local fallback:", error.message);
        // Fallback a una cita estoica local aleatoria
        const randomFallback = localQuotes[Math.floor(Math.random() * localQuotes.length)];
        setQuote(randomFallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();

    // Cleanup: abortar la petición si el componente se desmonta antes de recibir respuesta
    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-12 max-w-2xl mx-auto opacity-50 animate-pulse">
        <div className="h-4 bg-gray-500 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-500 rounded w-1/4 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-2xl mx-auto px-4 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
      <div className="glass rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-50 group-hover:opacity-100 transition-opacity" />
        <svg className="w-8 h-8 text-primary/40 absolute top-4 left-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <blockquote className="text-lg md:text-xl font-medium text-text-primary italic mb-4 mt-2">
          "{quote?.text}"
        </blockquote>
        <cite className="text-sm font-semibold text-accent-light block not-italic">
          — {quote?.author}
        </cite>
      </div>
    </div>
  );
}
