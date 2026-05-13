/**
 * Componente deslizante para valores numéricos.
 *
 * @param {Object}   props
 * @param {string}   props.label       - Etiqueta del slider.
 * @param {number}   props.value       - Valor actual.
 * @param {Function} props.onChange    - Callback cuando cambia el valor (recibe el número).
 * @param {number}   [props.min=1]     - Valor mínimo.
 * @param {number}   [props.max=5]     - Valor máximo.
 * @param {Object}   [props.labels]    - Etiquetas para los valores (ej: {1:"Muy bajo", 5:"Muy alto"}).
 * @param {boolean}  [props.disabled]  - Si está deshabilitado.
 * @returns {JSX.Element}
 */
const Slider = ({
    label,
    value,
    onChange,
    min = 1,
    max = 5,
    labels = {},
    disabled = false,
  }) => {
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-adogta-primary">
          <span>{label}</span>
          <span className="font-semibold text-adogta-secondary">
            {labels[value] || value}
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full accent-adogta-secondary disabled:opacity-50"
        />
      </div>
    );
  };
  
  export default Slider;