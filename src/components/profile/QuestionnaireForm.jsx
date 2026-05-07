import { useMemo, useState } from 'react';
import Button from '../common/Button';
import { formularioApi } from '../../api/formularioApi';
import { preguntasCuestionario, mapearCuestionarioAPayload } from '../../utils/questionnaire';

const FormularioCuestionario = ({ alEnviarExitoso }) => {
  const respuestasIniciales = useMemo(() => (
    preguntasCuestionario.reduce((acumulador, pregunta) => {
      acumulador[pregunta.id] = '';
      return acumulador;
    }, {})
  ), []);

  const [respuestas, setRespuestas] = useState(respuestasIniciales);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');

  const manejarCambioOpcion = (idPregunta, valor) => {
    setRespuestas((previo) => ({
      ...previo,
      [idPregunta]: valor
    }));

    if (errores[idPregunta]) {
      setErrores((previo) => ({
        ...previo,
        [idPregunta]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    preguntasCuestionario.forEach((pregunta) => {
      if (!respuestas[pregunta.id]) {
        nuevosErrores[pregunta.id] = 'Selecciona una opción.';
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setErrorServidor('');

    if (!validarFormulario()) {
      return;
    }

    const payload = mapearCuestionarioAPayload(respuestas);
    console.log('Payload a enviar:', payload);

    try {
      setCargando(true);
      await formularioApi.guardar(payload);
      alEnviarExitoso?.();
    } catch (error) {
      console.error('Error enviando cuestionario:', error);
      setErrorServidor('No se pudo enviar el cuestionario. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-[720px] w-full border border-adogta-border">
      <div className="px-6 py-5 bg-adogta-primary/10 text-center">
        <h3 className="text-adogta-primary text-lg font-semibold m-0">Completar cuestionario</h3>
        <p className="text-adogta-primary/80 text-sm mt-1">
          Ayúdanos a encontrar la mejor mascota para ti.
        </p>
      </div>

      <form onSubmit={manejarEnvio} className="p-6 flex flex-col gap-6">
        {errorServidor && (
          <div className="bg-adogta-error text-adogta-secondary px-4 py-3 rounded-xl text-[13px] flex items-center gap-2 border border-adogta-secondary/30">
            <span>⚠️</span> {errorServidor}
          </div>
        )}

        {preguntasCuestionario.map((pregunta) => (
          <fieldset key={pregunta.id} className="text-center border border-adogta-border rounded-2xl px-4 py-4">
            <legend className="px-2 text-adogta-primary text-sm font-semibold">
              {pregunta.label}
            </legend>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {pregunta.options.map((opcion) => {
                const estaSeleccionado = respuestas[pregunta.id] === opcion.value;
                return (
                  <label
                    key={opcion.value}
                    className="flex items-center gap-2 text-sm cursor-pointer transition-all duration-200"
                  >
                    <input
                      type="radio"
                      name={pregunta.id}
                      value={opcion.value}
                      checked={estaSeleccionado}
                      onChange={() => manejarCambioOpcion(pregunta.id, opcion.value)}
                      className="peer sr-only"
                    />
                    <span className={`w-5 h-5 border-2 rounded-[4px] flex items-center justify-center transition-all duration-200 ${
                      estaSeleccionado
                        ? 'bg-adogta-secondary border-adogta-secondary'
                        : 'bg-white border-adogta-border'
                    }`}>
                      {estaSeleccionado && <span className="text-white text-xs font-bold">✓</span>}
                    </span>
                    <span className={`font-medium ${estaSeleccionado ? 'text-adogta-primary' : 'text-adogta-primary/80'}`}>
                      {opcion.label}
                    </span>
                  </label>
                );
              })}
            </div>
            {errores[pregunta.id] && (
              <p className="text-adogta-secondary text-xs mt-3">{errores[pregunta.id]}</p>
            )}
          </fieldset>
        ))}

        <div className="flex justify-end">
          <Button type="submit" loading={cargando} disabled={cargando}>
            Enviar cuestionario
          </Button>
        </div>
      </form>
    </section>
  );
};

export default FormularioCuestionario;
