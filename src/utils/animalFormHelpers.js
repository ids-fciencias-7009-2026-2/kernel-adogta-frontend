/**
 * Constantes y helpers compartidos para formularios de animales.
 * Se utilizan en PublicarAnimalPage y EditarAnimalPage.
 */

// Límites de longitud y expresiones regulares.
export const MAX_NOMBRE = 100;
export const MAX_DESCRIPCION = 2000;
export const MAX_EDAD_MESES = 360;
export const MAX_PADECIMIENTOS = 20;
export const MAX_FOTOS = 10;
export const MAX_PADECIMIENTO_LEN = 100;
export const MAX_FOTO_URL_LEN = 255;
export const CP_REGEX = /^\d{5}$/;
export const URL_REGEX = /^https?:\/\/\S+$/;


// Etiquetas y configuración de sliders.
export const NIVEL_LABELS = {
  1: "Muy bajo",
  2: "Bajo",
  3: "Medio",
  4: "Alto",
  5: "Muy alto",
};

export const SLIDERS = [
  { key: "nivelEnergia",      overrideKey: "overrideEnergia",            label: "⚡ Nivel de energía" },
  { key: "independencia",     overrideKey: "overrideIndependencia",      label: "🧘 Independencia" },
  { key: "sociableNiños",     overrideKey: "overrideSociableNiños",      label: "👶 Sociable con niños" },
  { key: "sociableMascotas",  overrideKey: "overrideSociableMascotas",   label: "🐶 Sociable con mascotas" },
];


// Para manipular listas (padecimientos y fotos)
/**
 * Agrega un elemento a una lista.
 * @param {string} item - Elemento a agregar.
 * @param {string[]} lista - Lista actual.
 * @param {number} max - Máximo permitido.
 * @param {string} errorMsg - Mensaje de error si se excede el máximo.
 * @returns {{ ok: boolean, error?: string }} Resultado con ok=true o error.
 */
export function prepararAgregarItem(item, lista, max, errorMsg) {
  const v = item.trim();
  if (!v) return { ok: false };
  if (lista.includes(v)) return { ok: false };
  if (lista.length >= max) return { ok: false, error: errorMsg };
  return { ok: true, valor: v };
}

/**
 * Elimina un elemento de una lista.
 * @param {number} i - Índice a eliminar.
 * @param {Function} setLista - setter del estado.
 */
export function quitarItem(i, setLista) {
  setLista((prev) => prev.filter((_, idx) => idx !== i));
}

// Validación del formulario de animal
import {
  validateNombre,
  validateCodigoPostal,
} from "./validations";

/**
 * Valida los campos del formulario de animal (publicar/editar).
 * @param {Object} form - Estado del formulario.
 * @param {Object|null} razaSeleccionada - Raza actual.
 * @returns {Object} Mapa de errores { campo: mensaje }.
 */
export function validarAnimal(form, razaSeleccionada) {
  const errs = {};

  const nombreError = validateNombre(form.nombre, "Nombre");
  if (nombreError) errs.nombre = nombreError;
  else if (form.nombre.trim().length > MAX_NOMBRE)
    errs.nombre = `Máximo ${MAX_NOMBRE} caracteres.`;

  if (form.tipo !== "Perro" && form.tipo !== "Gato")
    errs.tipo = "Selecciona si es Perro o Gato.";

  const edadNum = Number(form.edad);
  if (form.edad === "" || isNaN(edadNum))
    errs.edad = "Ingresa una edad válida en meses.";
  else if (!Number.isInteger(edadNum) || edadNum < 0)
    errs.edad = "La edad debe ser un entero igual o mayor a 0.";
  else if (edadNum > MAX_EDAD_MESES)
    errs.edad = `Máximo ${MAX_EDAD_MESES} meses.`;

  const cpError = validateCodigoPostal(form.codigoPostal);
  if (cpError) errs.codigoPostal = cpError;

  if (form.descripcion.length > MAX_DESCRIPCION)
    errs.descripcion = `Máximo ${MAX_DESCRIPCION} caracteres.`;

  if (!["Completo", "Parcial"].includes(form.estadoVacunacion))
    errs.estadoVacunacion = "Estado de vacunación inválido.";

  if (form.esterilizado !== true)
    errs.esterilizado = "Debes confirmar que el animal está esterilizado.";

  if (!razaSeleccionada?.idRaza)
    errs.idRaza = "Selecciona una raza.";

  return errs;
}