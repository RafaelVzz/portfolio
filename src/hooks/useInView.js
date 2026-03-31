import { useEffect, useRef, useState } from "react";

/**
 * Hook personalizado para detectar cuándo un elemento entra en el viewport.
 * Utiliza la API IntersectionObserver para activar animaciones on-scroll.
 *
 * @param {Object} options - Opciones del IntersectionObserver.
 * @param {number} options.threshold - Porcentaje visible para activar (0-1).
 * @param {string} options.rootMargin - Margen alrededor del root.
 * @param {boolean} options.triggerOnce - Si true, solo se activa una vez.
 * @returns {[React.RefObject, boolean]} Ref para el elemento y estado de visibilidad.
 */
export function useInView({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView];
}
