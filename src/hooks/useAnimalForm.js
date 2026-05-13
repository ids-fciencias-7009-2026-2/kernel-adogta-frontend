import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalApi } from '../api/animalApi';
import { razaApi } from '../api/razaApi';
import { uploadApi } from '../api/uploadApi';
import {
  MAX_PADECIMIENTOS,
  MAX_FOTOS,
  NIVEL_LABELS,
  SLIDERS,
  URL_REGEX,
  validarAnimal,
} from '../utils/animalFormHelpers';

/**
 * Hook que encapsula el estado y la lógica de los formularios de publicación
 * y edición de animales.
 *
 * @param {Object}  opciones
 * @param {boolean} opciones.esEdicion  - Si es true, se carga el animal existente para edición.
 * @param {number}  opciones.idAnimal   - ID del animal cuando es edición.
 * @returns {Object} Estados, funciones de manipulación y envío del formulario.
 */
export function useAnimalForm({ esEdicion = false, idAnimal = null } = {}) {
  const navigate = useNavigate();

  // ─────────── Estados del formulario ───────────
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    edad: '',
    descripcion: '',
    codigoPostal: '',
    estadoVacunacion: 'Completo',
    esterilizado: false,
    entrenado: false,
    nivelEnergia: 3,
    independencia: 3,
    sociableNiños: 3,
    sociableMascotas: 3,
    idRaza: null,
  });

  const [padecimientos, setPadecimientos] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [nuevoPadecimiento, setNuevoPadecimiento] = useState('');
  const [nuevaFoto, setNuevaFoto] = useState('');
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [errorFoto, setErrorFoto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [errores, setErrores] = useState({});

  // Estado de razas.
  const [razas, setRazas] = useState([]);
  const [loadingRazas, setLoadingRazas] = useState(true);
  const [errorRazas, setErrorRazas] = useState('');
  const [razaSeleccionada, setRazaSeleccionada] = useState(null);

  // Carga de datos en caso de edición.
  const [loadingAnimal, setLoadingAnimal] = useState(esEdicion);
  const [errorAnimal, setErrorAnimal] = useState('');

  // Cargamos las razas.
  useEffect(() => {
    let cancelado = false;
    setLoadingRazas(true);
    setErrorRazas('');
    razaApi
      .getAll()
      .then((data) => {
        if (!cancelado) setRazas(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelado)
          setErrorRazas(
            err.response?.data?.error || err.message || 'No se pudieron cargar las razas.'
          );
      })
      .finally(() => {
        if (!cancelado) setLoadingRazas(false);
      });
    return () => { cancelado = true; };
  }, []);

  // Cargamos el animal si se trata de una edición.
  useEffect(() => {
    if (!esEdicion || !idAnimal) return;
    let cancelado = false;
    setLoadingAnimal(true);
    setErrorAnimal('');
    animalApi
      .obtenerParaEditar(idAnimal)
      .then((animal) => {
        if (cancelado) return;
        // Buscar la raza en las razas ya cargadas
        const raza = razas.find((r) => r.idRaza === animal.idRaza) || null;
        setRazaSeleccionada(raza);
        setForm({
          nombre: animal.nombre || '',
          tipo: animal.tipo || '',
          edad: animal.edad?.toString() || '',
          descripcion: animal.descripcion || '',
          codigoPostal: animal.codigoPostal || '',
          estadoVacunacion: animal.estadoVacunacion || 'Completo',
          esterilizado: animal.esterilizado || false,
          entrenado: animal.entrenado || false,
          nivelEnergia: animal.overrideEnergia ?? (raza?.nivelEnergia ?? 3),
          independencia: animal.overrideIndependencia ?? (raza?.independencia ?? 3),
          sociableNiños: animal.overrideSociableNiños ?? (raza?.sociableNiños ?? 3),
          sociableMascotas: animal.overrideSociableMascotas ?? (raza?.sociableMascotas ?? 3),
          idRaza: animal.idRaza || null,
        });
        setPadecimientos(animal.padecimientos || []);
        setFotos(animal.fotos || []);
      })
      .catch((err) => {
        if (!cancelado) setErrorAnimal(err.response?.data?.error || 'Error al cargar animal');
      })
      .finally(() => {
        if (!cancelado) setLoadingAnimal(false);
      });
    return () => { cancelado = true; };
  }, [esEdicion, idAnimal, razas]);


  // Manejo de cambios (uso de helpers)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errores[name]) setErrores((prev) => { const n = { ...prev }; delete n[name]; return n; });
    if (errorGeneral) setErrorGeneral('');
  };

  const handleSlider = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: Number(value) }));


  // Manejo de padecimientos.
  const agregarPadecimiento = () => {
    const v = nuevoPadecimiento.trim();
    if (!v || padecimientos.includes(v)) return;
    if (padecimientos.length >= MAX_PADECIMIENTOS) {
      setErrorGeneral(`Máximo ${MAX_PADECIMIENTOS} padecimientos.`);
      return;
    }
    setPadecimientos((prev) => [...prev, v]);
    setNuevoPadecimiento('');
  };

  const quitarPadecimiento = (i) =>
    setPadecimientos((prev) => prev.filter((_, idx) => idx !== i));


  // Manejo de fotos.
  const agregarFoto = () => {
    const v = nuevaFoto.trim();
    if (!v || !URL_REGEX.test(v)) {
      setErrorFoto('URL inválida (debe empezar con http:// o https://)');
      return;
    }
    if (fotos.includes(v)) return;
    if (fotos.length >= MAX_FOTOS) {
      setErrorFoto(`Máximo ${MAX_FOTOS} fotos.`);
      return;
    }
    setFotos((prev) => [...prev, v]);
    setNuevaFoto('');
    setErrorFoto('');
  };

  const quitarFoto = (i) =>
    setFotos((prev) => prev.filter((_, idx) => idx !== i));

  const handleFileSelect = async (e) => {
    const archivos = Array.from(e.target.files || []);
    if (!archivos.length) return;
    setSubiendoFoto(true);
    setErrorFoto('');
    try {
      for (const archivo of archivos) {
        if (fotos.length >= MAX_FOTOS) {
          setErrorFoto(`Máximo ${MAX_FOTOS} fotos.`);
          break;
        }
        const { url } = await uploadApi.uploadFile(archivo);
        setFotos((prev) => (prev.includes(url) ? prev : [...prev, url]));
      }
    } catch (err) {
      setErrorFoto(err.response?.data?.error || err.message || 'Error al subir la foto.');
    } finally {
      setSubiendoFoto(false);
      e.target.value = '';
    }
  };

  // Cambio de raza
  const handleRazaChange = (e) => {
    const idRaza = parseInt(e.target.value, 10);
    const raza = razas.find((r) => r.idRaza === idRaza) || null;
    setRazaSeleccionada(raza);
    setForm((prev) => ({
      ...prev,
      idRaza,
      nivelEnergia: raza?.nivelEnergia ?? prev.nivelEnergia,
      independencia: raza?.independencia ?? prev.independencia,
      sociableNiños: raza?.sociableNiños ?? prev.sociableNiños,
      sociableMascotas: raza?.sociableMascotas ?? prev.sociableMascotas,
    }));
  };

  // Validamos el envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral('');
    setErrores({});

    const errs = validarAnimal(form, razaSeleccionada);
    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      setErrorGeneral('Revisa los campos marcados.');
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      edad: Number(form.edad),
      descripcion: form.descripcion.trim(),
      codigoPostal: form.codigoPostal,
      estadoVacunacion: form.estadoVacunacion,
      esterilizado: form.esterilizado,
      entrenado: form.entrenado,
      idRaza: form.idRaza,
      padecimientos,
      fotos,
    };

    SLIDERS.forEach(({ key, overrideKey }) => {
      payload[overrideKey] =
        form[key] !== (razaSeleccionada?.[key] ?? 3) ? form[key] : null;
    });

    setEnviando(true);
    try {
      if (esEdicion) {
        await animalApi.editar(idAnimal, payload);
      } else {
        await animalApi.publicar(payload);
      }
      setExito(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || 'Error al guardar.';
      setErrorGeneral(msg);
    } finally {
      setEnviando(false);
    }
  };


  return {
    form,
    setForm,
    padecimientos,
    fotos,
    enviando,
    exito,
    errorGeneral,
    errores,
    razas,
    loadingRazas,
    errorRazas,
    razaSeleccionada,
    setRazaSeleccionada,
    loadingAnimal,
    errorAnimal,

    //inputs secundarios
    nuevoPadecimiento,
    setNuevoPadecimiento,
    nuevaFoto,
    setNuevaFoto,
    subiendoFoto,
    errorFoto,

    // Funciones
    handleChange,
    handleSlider,
    agregarPadecimiento,
    quitarPadecimiento,
    agregarFoto,
    quitarFoto,
    handleFileSelect,
    handleRazaChange,
    handleSubmit,
  };
}