/**
 * Helpers compartidos para presentación de animales (Card y Detail).
 * Mapeos y formateadores de display.
 */

export const TALLA_LABEL = {
  1: 'Muy pequeño (menos de 5 kg)',
  2: 'Pequeño (de 5 a 10 kg)',
  3: 'Mediano (de 10 a 25 kg)',
  4: 'Grande (de 25 a 45 kg)',
  5: 'Muy grande (más de 45 kg)',
};

export const FALLBACK_IMG_PERRO =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=70';
export const FALLBACK_IMG_GATO =
  'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&q=70';

export function fallbackImg(tipo) {
  return tipo === 'Gato' ? FALLBACK_IMG_GATO : FALLBACK_IMG_PERRO;
}

export function caracterDesdeEnergia(nivelEnergia) {
  if (nivelEnergia >= 4) return 'Activo';
  if (nivelEnergia <= 2) return 'Tranquilo';
  return 'Equilibrado';
}

export function formatEdad(meses) {
  if (meses == null) return '';
  if (meses < 12) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  const anios = Math.floor(meses / 12);
  return `${anios} ${anios === 1 ? 'año' : 'años'}`;
}

/**
 * Recorta un texto a un máximo de caracteres y le agrega '...' si lo supera.
 * @param {string} texto - Texto a recortar.
 * @param {number} max - Máximo de caracteres (por defecto 50).
 * @returns {string} Texto recortado, o '' si no hay texto.
 */
export function truncarTexto(texto, max = 50) {
  if (!texto) return '';
  const limpio = texto.trim();
  if (limpio.length > max) return limpio.slice(0, max) + '...';
  return limpio;
}
