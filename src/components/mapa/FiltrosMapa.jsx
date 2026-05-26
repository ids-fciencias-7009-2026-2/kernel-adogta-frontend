/**
 * Panel de filtros para el mapa de publicaciones.
 * Permite filtrar por tipo (Perro/Gato), raza y código postal.
 * El filtrado se realiza en el frontend sobre los datos ya cargados.
 *
 * @param {string}   filtroTipo       - "Perro", "Gato" o "" (todos).
 * @param {Function} setFiltroTipo    - Setter del filtro de tipo.
 * @param {string}   filtroRaza       - Nombre de raza o "" (todas).
 * @param {Function} setFiltroRaza    - Setter del filtro de raza.
 * @param {string}   filtroCP         - Código postal o "" (todos).
 * @param {Function} setFiltroCP      - Setter del filtro de CP.
 * @param {string[]} razasDisponibles - Lista de nombres de razas únicas del dataset.
 * @param {number}   totalVisible     - Cantidad de animales visibles tras el filtro.
 */
export default function FiltrosMapa({
  filtroTipo,
  setFiltroTipo,
  filtroRaza,
  setFiltroRaza,
  filtroCP,
  setFiltroCP,
  razasDisponibles,
  totalVisible,
}) {
  const limpiarFiltros = () => {
    setFiltroTipo('');
    setFiltroRaza('');
    setFiltroCP('');
  };

  const hayFiltros = filtroTipo || filtroRaza || filtroCP;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-wrap gap-3 items-end">
      {/* Filtro por tipo */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-adogta-primary uppercase tracking-wide">
          Tipo
        </label>
        <div className="flex gap-2">
          {['', 'Perro', 'Gato'].map((tipo) => (
            <button
              key={tipo || 'todos'}
              onClick={() => {
                setFiltroTipo(tipo);
                setFiltroRaza(''); // reinicia raza al cambiar tipo
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                filtroTipo === tipo
                  ? 'bg-adogta-secondary text-white'
                  : 'bg-adogta-background text-adogta-primary hover:bg-adogta-secondary/20'
              }`}
            >
              {tipo === '' ? 'Todos' : tipo === 'Perro' ? '🐶 Perros' : '🐱 Gatos'}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro por raza */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-adogta-primary uppercase tracking-wide">
          Raza
        </label>
        <select
          value={filtroRaza}
          onChange={(e) => setFiltroRaza(e.target.value)}
          className="border border-adogta-border rounded-xl px-3 py-1.5 text-sm text-adogta-primary bg-white focus:outline-none focus:ring-2 focus:ring-adogta-secondary"
        >
          <option value="">Todas las razas</option>
          {razasDisponibles.map((raza) => (
            <option key={raza} value={raza}>
              {raza}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por código postal */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-adogta-primary uppercase tracking-wide">
          Código Postal
        </label>
        <input
          type="text"
          value={filtroCP}
          onChange={(e) => setFiltroCP(e.target.value.replace(/\D/g, '').slice(0, 5))}
          placeholder="Ej: 06600"
          maxLength={5}
          className="border border-adogta-border rounded-xl px-3 py-1.5 text-sm text-adogta-primary bg-white w-32 focus:outline-none focus:ring-2 focus:ring-adogta-secondary"
        />
      </div>

      {/* Limpiar filtros y contador */}
      <div className="flex flex-col gap-1 ml-auto items-end">
        <span className="text-xs text-adogta-primary opacity-60">
          {totalVisible} mascota{totalVisible !== 1 ? 's' : ''} visible{totalVisible !== 1 ? 's' : ''}
        </span>
        {hayFiltros && (
          <button
            onClick={limpiarFiltros}
            className="text-xs text-adogta-secondary font-semibold hover:underline"
          >
            Limpiar filtros ✕
          </button>
        )}
      </div>
    </div>
  );
}