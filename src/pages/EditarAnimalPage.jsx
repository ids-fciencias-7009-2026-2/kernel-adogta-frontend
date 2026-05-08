import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { animalApi } from '../api/animalApi';
import { uploadApi } from '../api/uploadApi';
import { razaApi } from '../api/razaApi';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Checkbox from '../components/common/Checkbox';
import LoadingSpinner from '../components/common/LoadingSpinner';
import dashboardBg from '../assets/Adogta_dashboard.png';

const MAX_NOMBRE = 100;
const MAX_DESCRIPCION = 2000;
const MAX_EDAD_MESES = 360;
const MAX_PADECIMIENTOS = 20;
const MAX_FOTOS = 10;
const CP_REGEX = /^\d{5}$/;
const URL_REGEX = /^https?:\/\/\S+$/;
const NIVEL_LABELS = { 1: "Muy bajo", 2: "Bajo", 3: "Medio", 4: "Alto", 5: "Muy alto" };
const SLIDERS = [
  { key: "nivelEnergia",      overrideKey: "overrideEnergia",            label: "⚡ Nivel de energía" },
  { key: "independencia",     overrideKey: "overrideIndependencia",      label: "🧘 Independencia" },
  { key: "sociableNiños",     overrideKey: "overrideSociableNiños",      label: "👶 Sociable con niños" },
  { key: "sociableMascotas",  overrideKey: "overrideSociableMascotas",   label: "🐶 Sociable con mascotas" },
];

export default function EditarAnimalPage() {
  const { idAnimal } = useParams();
  const navigate = useNavigate();

  // Carga de datos
  const [loadingAnimal, setLoadingAnimal] = useState(true);
  const [errorAnimal, setErrorAnimal] = useState('');
  const [razas, setRazas] = useState([]);
  const [loadingRazas, setLoadingRazas] = useState(true);
  const [errorRazas, setErrorRazas] = useState('');

  // Formulario
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [errores, setErrores] = useState({});
  const [razaSeleccionada, setRazaSeleccionada] = useState(null);

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
  const [nuevoPadecimiento, setNuevoPadecimiento] = useState('');
  const [fotos, setFotos] = useState([]);
  const [nuevaFoto, setNuevaFoto] = useState('');
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [errorFoto, setErrorFoto] = useState('');

  /* Las razas */
  useEffect(() => {
    let cancelado = false;
    setLoadingRazas(true);
    setErrorRazas('');
    razaApi.getAll()
      .then(d => { if (!cancelado) setRazas(Array.isArray(d) ? d : []); })
      .catch(e => { if (!cancelado) setErrorRazas(e.response?.data?.error || e.message || 'Error al cargar razas'); })
      .finally(() => { if (!cancelado) setLoadingRazas(false); });
    return () => { cancelado = true; };
  }, []);

  /* Cargamos el animal. */
  useEffect(() => {
    let cancelado = false;
    setLoadingAnimal(true);
    animalApi.obtenerParaEditar(idAnimal)
      .then(animal => {
        if (cancelado) return;
        const raza = razas.find(r => r.idRaza === animal.idRaza) || null;
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
      .catch(e => { if (!cancelado) setErrorAnimal(e.response?.data?.error || 'Error al cargar animal'); })
      .finally(() => { if (!cancelado) setLoadingAnimal(false); });
    return () => { cancelado = true; };
  }, [idAnimal, razas]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errores[name]) setErrores(prev => { const n = { ...prev }; delete n[name]; return n; });
    if (errorGeneral) setErrorGeneral('');
  };

  const handleSlider = (name, value) => setForm(prev => ({ ...prev, [name]: Number(value) }));

  /**Padecimientos. */
  const agregarPadecimiento = () => {
    const v = nuevoPadecimiento.trim();
    if (!v || padecimientos.includes(v)) return;
    if (padecimientos.length >= MAX_PADECIMIENTOS) {
      setErrorGeneral(`Máximo ${MAX_PADECIMIENTOS} padecimientos.`);
      return;
    }
    setPadecimientos(prev => [...prev, v]);
    setNuevoPadecimiento('');
  };

  const quitarPadecimiento = (i) => setPadecimientos(prev => prev.filter((_, idx) => idx !== i));
  const quitarFoto = (i) => setFotos(prev => prev.filter((_, idx) => idx !== i));

  /**Fotos. */
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
    setFotos(prev => [...prev, v]);
    setNuevaFoto('');
    setErrorFoto('');
  };

  /** Selector de archivos. */
  const handleFileSelect = async (e) => {
    const archivos = Array.from(e.target.files || []);
    if (!archivos.length) return;
    setSubiendoFoto(true);
    setErrorFoto('');
    try {
      for (const archivo of archivos) {
        if (fotos.length >= MAX_FOTOS) { setErrorFoto(`Máximo ${MAX_FOTOS} fotos.`); break; }
        const { url } = await uploadApi.uploadFile(archivo);
        setFotos(prev => prev.includes(url) ? prev : [...prev, url]);
      }
    } catch (err) {
      setErrorFoto(err.response?.data?.error || 'Error al subir foto.');
    } finally {
      setSubiendoFoto(false);
      e.target.value = '';
    }
  };

  /** Cambio de raza del animal. */
  const handleRazaChange = (e) => {
    const idRaza = parseInt(e.target.value, 10);
    const raza = razas.find(r => r.idRaza === idRaza) || null;
    setRazaSeleccionada(raza);
    setForm(prev => ({
      ...prev,
      idRaza,
      nivelEnergia: raza?.nivelEnergia ?? prev.nivelEnergia,
      independencia: raza?.independencia ?? prev.independencia,
      sociableNiños: raza?.sociableNiños ?? prev.sociableNiños,
      sociableMascotas: raza?.sociableMascotas ?? prev.sociableMascotas,
    }));
  };

  /** Validaciones. */
  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'Requerido.';
    else if (form.nombre.trim().length > MAX_NOMBRE) errs.nombre = `Máx. ${MAX_NOMBRE} caracteres.`;

    const edad = Number(form.edad);
    if (form.edad === '' || isNaN(edad)) errs.edad = 'Ingresa una edad.';
    else if (!Number.isInteger(edad) || edad < 0 || edad > MAX_EDAD_MESES) errs.edad = `Entre 0 y ${MAX_EDAD_MESES} meses.`;

    if (!CP_REGEX.test(form.codigoPostal)) errs.codigoPostal = '5 dígitos.';
    if (form.descripcion.length > MAX_DESCRIPCION) errs.descripcion = `Máx. ${MAX_DESCRIPCION} caracteres.`;
    if (!['Completo','Parcial'].includes(form.estadoVacunacion)) errs.estadoVacunacion = 'Inválido.';
    if (!form.esterilizado) errs.esterilizado = 'Confirmar esterilización.';
    if (!form.idRaza) errs.idRaza = 'Selecciona una raza.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral('');
    setErrores({});
    const errs = validar();
    if (Object.keys(errs).length) { setErrores(errs); setErrorGeneral('Revisa los campos'); return; }

    const payload = {
      nombre: form.nombre.trim(),
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
      payload[overrideKey] = form[key] !== (razaSeleccionada?.[key] ?? 3) ? form[key] : null;
    });

    setEnviando(true);
    try {
      await animalApi.editar(idAnimal, payload);
      setExito(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setErrorGeneral(err.response?.data?.error || 'Error al guardar.');
    } finally {
      setEnviando(false);
    }
  };

  if (loadingAnimal || loadingRazas) return <LoadingSpinner message="Cargando datos..." />;
  if (errorAnimal) return <AuthLayout title="Error" backgroundImage={dashboardBg} showBackButton backPath="/dashboard"><div className="text-red-700 mt-10">{errorAnimal}</div></AuthLayout>;
  if (errorRazas) return <AuthLayout title="Error" backgroundImage={dashboardBg} showBackButton backPath="/dashboard"><div className="text-red-700 mt-10">{errorRazas}</div></AuthLayout>;
  if (exito) return <AuthLayout title="Éxito" backgroundImage={dashboardBg} showBackButton backPath="/dashboard"><div className="text-adogta-primary text-xl mt-10">Animal actualizado.</div></AuthLayout>;

  return (
    <AuthLayout title="Editar animal" backgroundImage={dashboardBg} showBackButton backPath="/dashboard">
      <fieldset disabled={enviando} className="max-w-2xl w-full disabled:opacity-70">

        <h1 className="text-3xl font-bold text-amber-900 mb-2">Editar publicación </h1>
        <p className="text-amber-700 mb-6">Modifica los datos de tu mascota.</p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Raza */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Raza *</label>
            <select value={form.idRaza || ''} onChange={handleRazaChange}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="" disabled>Selecciona una raza</option>
              {razas.filter(r => !r.tipo || r.tipo === form.tipo).map(r => <option key={r.idRaza} value={r.idRaza}>{r.nombre}</option>)}
            </select>
            {errores.idRaza && <p className="text-xs text-red-600 mt-1">{errores.idRaza}</p>}
          </div>

          {/* Nombre y Edad */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre *" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre de la mascota" required disabled={enviando} error={errores.nombre} />
            <Input label="Edad (meses) *" name="edad" type="number" value={form.edad} onChange={handleChange} placeholder="0-360" required disabled={enviando} error={errores.edad} />
          </div>

          {/* Código Postal y Descripción */}
          <Input label="Código Postal *" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} placeholder="5 dígitos" maxLength="5" required disabled={enviando} error={errores.codigoPostal} />

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} maxLength={MAX_DESCRIPCION}
              className={`border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-amber-400 ${errores.descripcion ? 'border-red-400' : 'border-amber-300'}`} />
            <div className="text-xs text-gray-500 text-right">{form.descripcion.length}/{MAX_DESCRIPCION}</div>
          </div>

          {/* Vacunación */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Estado vacunación *</label>
            <select name="estadoVacunacion" value={form.estadoVacunacion} onChange={handleChange}
              className={`border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-amber-400 ${errores.estadoVacunacion ? 'border-red-400' : 'border-amber-300'}`}>
              <option value="Completo">Completo</option>
              <option value="Parcial">Parcial</option>
            </select>
            {errores.estadoVacunacion && <p className="text-xs text-red-600 mt-1">{errores.estadoVacunacion}</p>}
          </div>

          {/* Checkboxes con componente */}
          <Checkbox name="esterilizado" checked={form.esterilizado} onChange={handleChange} label="Esterilizado *" required disabled={enviando} />
          {errores.esterilizado && <p className="text-xs text-red-600 -mt-4">{errores.esterilizado}</p>}
          <Checkbox name="entrenado" checked={form.entrenado} onChange={handleChange} label="Entrenado" disabled={enviando} />

          {/* Sliders de personalidad */}
          <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-amber-900">Personalidad</h3>
            {SLIDERS.map(({ key, label }) => (
              <div key={key}>
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-semibold text-amber-600">{NIVEL_LABELS[form[key]]}</span>
                </div>
                <input type="range" min="1" max="5" value={form[key]} onChange={(e) => handleSlider(key, e.target.value)} className="w-full accent-amber-500" />
              </div>
            ))}
          </div>

          {/* Padecimientos */}
          <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-amber-900">Padecimientos ({padecimientos.length}/{MAX_PADECIMIENTOS})</h3>
            <div className="flex gap-2">
              <input value={nuevoPadecimiento} onChange={(e) => setNuevoPadecimiento(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarPadecimiento())} maxLength={100} placeholder="Ej: Displasia" className="flex-1 border border-amber-300 rounded-xl px-4 py-2" />
              <button type="button" onClick={agregarPadecimiento} className="px-4 py-2 bg-amber-100 rounded-xl">Agregar</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {padecimientos.map((p, i) => (
                <span key={i} className="bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  {p}
                  <button type="button" onClick={() => quitarPadecimiento(i)} className="text-amber-600">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Fotos */}
          <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-amber-900">Fotos ({fotos.length}/{MAX_FOTOS})</h3>
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 rounded-xl cursor-pointer hover:bg-amber-200">
              <span>{subiendoFoto ? 'Subiendo...' : '📷  Subir desde el dispositivo'}</span>
              <input type="file" accept="image/*" multiple onChange={handleFileSelect} disabled={subiendoFoto} className="hidden" />
            </label>
            {errorFoto && <p className="text-sm text-red-700">{errorFoto}</p>}
            <div className="text-xs text-gray-500 text-center">o pega una URL:</div>
            <div className="flex gap-2">
              <input value={nuevaFoto} onChange={(e) => setNuevaFoto(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarFoto())} placeholder="https://..." className="flex-1 border border-amber-300 rounded-xl px-4 py-2" />
              <button type="button" onClick={agregarFoto} className="px-4 py-2 bg-amber-100 rounded-xl">Agregar</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {fotos.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt={`foto ${i+1}`} className="w-full h-24 object-cover rounded-xl border" onError={(e) => e.currentTarget.style.opacity = 0.3} />
                  <button type="button" onClick={() => quitarFoto(i)} className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center">×</button>
                </div>
              ))}
            </div>
          </div>

          {errorGeneral && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{errorGeneral}</div>}

          <Button type="submit" disabled={enviando} loading={enviando} fullWidth icon="🐾">
            Guardar cambios
          </Button>
        </form>
      </fieldset>
    </AuthLayout>
  );
}