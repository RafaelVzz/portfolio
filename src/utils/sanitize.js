/**
 * sanitize.js — Utilidades de prevención XSS
 *
 * Este módulo centraliza la sanitización de datos para prevenir
 * ataques de Cross-Site Scripting (XSS).
 *
 * Estrategias implementadas:
 * 1. DOMPurify: Sanitiza HTML potencialmente peligroso.
 * 2. Escape de entidades HTML: Convierte caracteres especiales a entidades seguras.
 * 3. Validación de URLs: Solo permite protocolos seguros (http, https, mailto).
 */

import DOMPurify from "dompurify";

/**
 * Sanitiza una cadena HTML eliminando scripts maliciosos
 * mientras preserva formato seguro (negritas, cursivas, links).
 * @param {string} dirtyHtml - HTML potencialmente inseguro.
 * @returns {string} HTML sanitizado.
 */
export function sanitizeHtml(dirtyHtml) {
  if (typeof dirtyHtml !== "string") return "";
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br", "p", "span"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}

/**
 * Escapa caracteres especiales HTML para prevenir inyección
 * cuando se inserta texto plano en el DOM.
 * @param {string} text - Texto a escapar.
 * @returns {string} Texto con entidades HTML escapadas.
 */
export function escapeHtml(text) {
  if (typeof text !== "string") return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Valida que una URL use un protocolo seguro.
 * Previene ataques XSS a través de javascript: URIs.
 * @param {string} url - URL a validar.
 * @returns {string} URL original si es segura, o "#" si no lo es.
 */
export function sanitizeUrl(url) {
  if (typeof url !== "string") return "#";
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    const allowedProtocols = ["http:", "https:", "mailto:"];
    if (allowedProtocols.includes(parsed.protocol)) {
      return trimmed;
    }
    return "#";
  } catch {
    // Si no es una URL absoluta válida, verificar que no tenga protocolos peligrosos
    if (/^(javascript|data|vbscript):/i.test(trimmed)) {
      return "#";
    }
    return trimmed;
  }
}

/**
 * Sanitiza un objeto de datos completo, escapando todos los valores string.
 * Útil para datos que provienen de fuentes externas (APIs, formularios, etc.).
 * @param {Object} data - Objeto con datos a sanitizar.
 * @returns {Object} Objeto con todos los strings escapados.
 */
export function sanitizeData(data) {
  if (typeof data !== "object" || data === null) return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitized[key] = escapeHtml(value);
    } else if (typeof value === "object") {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
