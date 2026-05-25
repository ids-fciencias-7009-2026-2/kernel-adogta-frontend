/**
 * Componente auxiliar para mostrar un campo (llave / valor) en una lista de detalles.
 * Es para mostrar un valor asociado a otro, por ejemplo, para mostrar los datos del usuario.
 *
 * @param {Object}   props
 * @param {string}   props.label  - Llave del campo.
 * @param {string}   props.valor  - Valor a mostrar.
 * @returns {JSX.Element}
 */
const Campo = ({ label, valor }) => (
    <div className="flex justify-between py-1.5 border-b border-gray-100">
      <span className="text-adogta-primary text-xs font-medium">{label}</span>
      <span className="text-adogta-primary text-sm opacity-90">{valor}</span>
    </div>
  );
  
  export default Campo;