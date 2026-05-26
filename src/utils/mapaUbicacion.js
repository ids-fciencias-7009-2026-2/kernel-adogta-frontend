/**
 * Utilidades de ubicación compartidas por las vistas del mapa
 * (MapaPage de pantalla completa y MapaDashboardSection embebido).
 *
 * Centraliza la tabla CP → coordenadas, las coordenadas de fallback
 * y la función que resuelve unas coordenadas a partir de un código postal,
 * para evitar duplicar esta lógica en cada vista.
 */

// Coordenadas de fallback: CDMX centro
export const LAT_FALLBACK = 19.4326;
export const LNG_FALLBACK = -99.1332;

// Tabla de CP → coordenadas (coincide con la del backend)
export const CP_COORDS = {
  '06600': [19.4264, -99.1456],
  '06700': [19.4220, -99.1600],
  '03100': [19.3900, -99.1456],
  '04000': [19.3435, -99.1624],
  '11100': [19.4200, -99.2100],
  '11000': [19.4317, -99.2119],
  '14000': [19.3117, -99.1833],
  '09000': [19.3467, -99.0600],
  '07000': [19.4800, -99.1100],
  '08000': [19.4040, -99.0880],
  '57000': [19.4664, -99.0286],
  '54000': [19.6333, -99.2333],
  '55000': [19.6400, -99.1700],
  '50000': [19.2939, -99.6536],
  '62000': [18.9261, -99.2342],
  '64000': [25.6866, -100.3161],
  '44100': [20.6597, -103.3496],
  '72000': [19.0437, -98.1987],
};

export function obtenerCoordsPorCP(cp) {
  if (CP_COORDS[cp]) return CP_COORDS[cp];
  const prefijo = cp.slice(0, 3);
  const clave = Object.keys(CP_COORDS).find((k) => k.startsWith(prefijo));
  return clave ? CP_COORDS[clave] : [LAT_FALLBACK, LNG_FALLBACK];
}
