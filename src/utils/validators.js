/**
 * Funciones puras para validación de datos.
 * Retornan un mensaje de error si falla, o un string vacío (falsy) si es válido.
 */

export const isRequired = (value) => {
    if (!value || value.trim() === "") {
        return "Este campo es obligatorio.";
    }
    return ""; // Sin error
};

export const isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return "El formato del correo no es válido.";
    }
    return "";
};

export const minLength = (value, min) => {
    if (value && value.trim().length < min) {
        return `Debe tener al menos ${min} caracteres.`;
    }
    return "";
};