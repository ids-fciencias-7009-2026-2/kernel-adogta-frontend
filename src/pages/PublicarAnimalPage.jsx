import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { razaApi } from "../api/razaApi";
import { animalApi } from "../api/animalApi";
import { uploadApi } from "../api/uploadApi";
import AuthLayout from "../layouts/AuthLayout";
import dashboardBg from "../assets/Adogta_dashboard.png";

const layoutProps = {
  title: "Publicar Animal",
  backgroundImage: dashboardBg,
  showBackButton: true,
  backPath: "/dashboard",
};

const NIVEL_LABELS = {
  1: "Muy bajo",
  2: "Bajo",
  3: "Medio",
  4: "Alto",
  5: "Muy alto",
};

const RAZAS_MOCK = [
  { idRaza: 1, nombre: "Chihuahua",  tipo: "Perro", talla: 1, independencia: 3, nivelEnergia: 4, personalidad: "Pequeño, valiente y muy leal. Puede ser nervioso con extraños.", sociableNiños: 2, sociableMascotas: 2, esHipoalergenico: 0 },
  { idRaza: 2, nombre: "Mestizo",    tipo: "Perro", talla: 3, independencia: 3, nivelEnergia: 3, personalidad: "Adaptable y resistente. Personalidad única según su herencia.",     sociableNiños: 4, sociableMascotas: 4, esHipoalergenico: 0 },
  { idRaza: 3, nombre: "Pug",        tipo: "Perro", talla: 2, independencia: 2, nivelEnergia: 2, personalidad: "Cariñoso, juguetón y muy social. Le encanta la compañía humana.",   sociableNiños: 5, sociableMascotas: 4, esHipoalergenico: 0 },
  { idRaza: 4, nombre: "Siamés",     tipo: "Gato",  talla: 2, independencia: 3, nivelEnergia: 4, personalidad: "Vocal, cariñoso y muy social. Demanda atención constante.",         sociableNiños: 4, sociableMascotas: 3, esHipoalergenico: 1 },
  { idRaza: 5, nombre: "Persa",      tipo: "Gato",  talla: 3, independencia: 4, nivelEnergia: 1, personalidad: "Tranquilo, dulce y sedentario. Disfruta los ambientes calmados.",   sociableNiños: 3, sociableMascotas: 3, esHipoalergenico: 0 },
  { idRaza: 6, nombre: "Maine Coon", tipo: "Gato",  talla: 5, independencia: 3, nivelEnergia: 3, personalidad: "Gigante gentil. Cariñoso, juguetón y muy social con su familia.",   sociableNiños: 5, sociableMascotas: 4, esHipoalergenico: 0 },
];

const SLIDERS = [
  { key: "nivelEnergia",      overrideKey: "overrideEnergia",            label: "⚡ Nivel de energía" },
  { key: "independencia",     overrideKey: "overrideIndependencia",      label: "🧘 Independencia" },
  { key: "sociableNiños",     overrideKey: "overrideSociableNiños",      label: "👶 Sociable con niños" },
  { key: "sociableMascotas",  overrideKey: "overrideSociableMascotas",   label: "🐶 Sociable con mascotas" },
];

export default function PublicarAnimalPage() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);

  const [razas, setRazas] = useState([]);
  const [cargandoRazas, setCargandoRazas] = useState(true);
  const [errorRazas, setErrorRazas] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [razaSeleccionada, setRazaSeleccionada] = useState(null);

  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    edad: "",
    descripcion: "",
    codigoPostal: "",
    estadoVacunacion: "Ninguno",
    esterilizado: false,
    entrenado: false,
    nivelEnergia: 3,
    independencia: 3,
    sociableNiños: 3,
    sociableMascotas: 3,
  });

  const [padecimientos, setPadecimientos] = useState([]);
  const [nuevoPadecimiento, setNuevoPadecimiento] = useState("");
  const [fotos, setFotos] = useState([]);
  const [nuevaFoto, setNuevaFoto] = useState("");
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [errorFoto, setErrorFoto] = useState("");

  useEffect(() => {
    setRazas(RAZAS_MOCK);
    setCargandoRazas(false);
  }, []);

  function seleccionarTipo(tipo) {
    setTipoSeleccionado(tipo);
    setForm((prev) => ({ ...prev, tipo }));
    setPaso(2);
  }

  function seleccionarRaza(raza) {
    setRazaSeleccionada(raza);
    setForm((prev) => ({
      ...prev,
      nivelEnergia: raza.nivelEnergia,
      independencia: raza.independencia,
      sociableNiños: raza.sociableNiños,
      sociableMascotas: raza.sociableMascotas,
    }));
    setPaso(3);
  }

  function volverAElegirTipo() {
    setPaso(1);
    setTipoSeleccionado(null);
    setRazaSeleccionada(null);
    setForm((prev) => ({ ...prev, tipo: "" }));
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSlider(name, value) {
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  }

  function agregarPadecimiento() {
    const v = nuevoPadecimiento.trim();
    if (!v || padecimientos.includes(v)) return;
    setPadecimientos((prev) => [...prev, v]);
    setNuevoPadecimiento("");
  }

  function quitarPadecimiento(i) {
    setPadecimientos((prev) => prev.filter((_, idx) => idx !== i));
  }

  function agregarFoto() {
    const v = nuevaFoto.trim();
    if (!v || fotos.includes(v)) return;
    setFotos((prev) => [...prev, v]);
    setNuevaFoto("");
  }

  function quitarFoto(i) {
    setFotos((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleFileSelect(e) {
    const archivos = Array.from(e.target.files || []);
    if (archivos.length === 0) return;
    setSubiendoFoto(true);
    setErrorFoto("");
    try {
      for (const archivo of archivos) {
        const { url } = await uploadApi.uploadFile(archivo);
        setFotos((prev) => (prev.includes(url) ? prev : [...prev, url]));
      }
    } catch (err) {
      setErrorFoto(err.response?.data?.error || err.message || "Error al subir la foto.");
    } finally {
      setSubiendoFoto(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.nombre.trim()) return setError("El nombre del animal es obligatorio.");
    if (!form.edad || isNaN(form.edad) || Number(form.edad) < 0)
      return setError("Ingresa una edad válida en meses.");
    if (!/^\d{5}$/.test(form.codigoPostal))
      return setError("El código postal debe tener exactamente 5 dígitos.");
    if (form.tipo !== "Perro" && form.tipo !== "Gato")
      return setError("Selecciona si es Perro o Gato.");

    const payload = {
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      edad: Number(form.edad),
      descripcion: form.descripcion,
      codigoPostal: form.codigoPostal,
      estadoVacunacion: form.estadoVacunacion,
      esterilizado: form.esterilizado,
      entrenado: form.entrenado,
      idRaza: razaSeleccionada.idRaza,
      padecimientos,
      fotos,
    };

    SLIDERS.forEach(({ key, overrideKey }) => {
      payload[overrideKey] = form[key] !== razaSeleccionada[key] ? form[key] : null;
    });

    setEnviando(true);
    try {
      await animalApi.publicar(payload);
      setExito(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Error al publicar.");
    } finally {
      setEnviando(false);
    }
  }

  const razasFiltradas = razas.filter((r) => r.tipo === tipoSeleccionado);

  if (exito) {
    return (
      <AuthLayout {...layoutProps}>
        <div className="text-center space-y-4">
          <div className="text-6xl">🐾</div>
          <h2 className="text-2xl font-bold text-amber-800">¡Publicación exitosa!</h2>
          <p className="text-amber-700">Tu mascota ya está lista para encontrar un hogar.</p>
        </div>
      </AuthLayout>
    );
  }

  if (paso === 1) {
    return (
      <AuthLayout {...layoutProps}>
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Publicar animal</h1>
          <p className="text-amber-700 mb-6">¿Qué tipo de mascota quieres publicar?</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => seleccionarTipo("Perro")}
              className="bg-white border border-amber-200 rounded-2xl p-10 text-center hover:shadow-md hover:border-amber-400 transition-all"
            >
              <div className="text-6xl mb-3">🐶</div>
              <span className="text-xl font-bold text-amber-900">Perro</span>
            </button>
            <button
              onClick={() => seleccionarTipo("Gato")}
              className="bg-white border border-amber-200 rounded-2xl p-10 text-center hover:shadow-md hover:border-amber-400 transition-all"
            >
              <div className="text-6xl mb-3">🐱</div>
              <span className="text-xl font-bold text-amber-900">Gato</span>
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (paso === 2) {
    return (
      <AuthLayout {...layoutProps}>
        <div className="max-w-3xl w-full">
          <button
            onClick={volverAElegirTipo}
            className="text-amber-600 hover:underline text-sm mb-4 block"
          >
            ← Cambiar tipo
          </button>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            Razas de {tipoSeleccionado === "Perro" ? "perro" : "gato"}
          </h1>
          <p className="text-amber-700 mb-6">Selecciona la raza de tu mascota.</p>

          {cargandoRazas && (
            <p className="text-amber-700">Cargando razas...</p>
          )}

          {errorRazas && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {errorRazas}
            </div>
          )}

          {!cargandoRazas && !errorRazas && razasFiltradas.length === 0 && (
            <p className="text-amber-700">No hay razas disponibles para este tipo.</p>
          )}

          {!cargandoRazas && !errorRazas && razasFiltradas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {razasFiltradas.map((raza) => (
                <button
                  key={raza.idRaza}
                  onClick={() => seleccionarRaza(raza)}
                  className="text-left bg-white border border-amber-200 rounded-2xl p-5 hover:shadow-md hover:border-amber-400 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-amber-900">{raza.nombre}</span>
                    {raza.esHipoalergenico === 1 && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Hipoalergénica
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{raza.personalidad}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                    <span>⚡ Energía: {NIVEL_LABELS[raza.nivelEnergia]}</span>
                    <span>🧘 Independencia: {NIVEL_LABELS[raza.independencia]}</span>
                    <span>👶 Niños: {NIVEL_LABELS[raza.sociableNiños]}</span>
                    <span>🐶 Mascotas: {NIVEL_LABELS[raza.sociableMascotas]}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout {...layoutProps}>
      <div className="max-w-2xl w-full">

        <button
          onClick={() => setPaso(2)}
          className="text-amber-600 hover:underline text-sm mb-4 block"
        >
          ← Cambiar raza
        </button>
        <h1 className="text-3xl font-bold text-amber-900 mb-1">Detalles de tu mascota</h1>
        <p className="text-amber-700 mb-6">
          {tipoSeleccionado} ·{" "}
          <span className="font-semibold">{razaSeleccionada?.nombre}</span>
        </p>

        {/* Personalidad de la raza, read-only */}
        <div className="bg-white border border-amber-200 rounded-2xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-amber-900 mb-1">Sobre la raza</h3>
          <p className="text-sm text-gray-700">{razaSeleccionada?.personalidad}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                Nombre del animal *
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Luna"
                className="w-full border border-amber-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                Edad (meses) *
              </label>
              <input
                name="edad"
                type="number"
                min="0"
                value={form.edad}
                onChange={handleChange}
                placeholder="Ej: 18"
                className="w-full border border-amber-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">
              Código postal *
            </label>
            <input
              name="codigoPostal"
              value={form.codigoPostal}
              onChange={handleChange}
              maxLength={5}
              placeholder="Ej: 06600"
              className="w-full border border-amber-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Cuéntanos sobre tu mascota: cómo es, qué le gusta, cualquier cosa especial..."
              className="w-full border border-amber-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">
              Estado de vacunación
            </label>
            <select
              name="estadoVacunacion"
              value={form.estadoVacunacion}
              onChange={handleChange}
              className="w-full border border-amber-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              <option value="Completo">Completo</option>
              <option value="Parcial">Parcial</option>
              <option value="Ninguno">Ninguno</option>
            </select>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="esterilizado"
                checked={form.esterilizado}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="text-sm text-amber-900">Esterilizado/a</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="entrenado"
                checked={form.entrenado}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="text-sm text-amber-900">Entrenado/a</span>
            </label>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-amber-900">
              Personalidad{" "}
              <span className="text-xs text-gray-400 font-normal">
                (valores por defecto de la raza, puedes ajustarlos)
              </span>
            </h3>

            {SLIDERS.map(({ key, label }) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-amber-900">{label}</span>
                  <span className="font-semibold text-amber-600">
                    {NIVEL_LABELS[form[key]]}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={form[key]}
                  onChange={(e) => handleSlider(key, e.target.value)}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>Muy bajo</span>
                  <span>Muy alto</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-amber-900">Padecimientos</h3>
            <div className="flex gap-2">
              <input
                value={nuevoPadecimiento}
                onChange={(e) => setNuevoPadecimiento(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    agregarPadecimiento();
                  }
                }}
                placeholder="Ej: Displasia de cadera"
                className="flex-1 border border-amber-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={agregarPadecimiento}
                className="px-4 py-2 bg-amber-100 text-amber-800 rounded-xl border border-amber-300 hover:bg-amber-200"
              >
                Agregar
              </button>
            </div>
            {padecimientos.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {padecimientos.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-sm text-amber-900"
                  >
                    {p}
                    <button
                      type="button"
                      onClick={() => quitarPadecimiento(i)}
                      className="text-amber-600 hover:text-amber-900"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-amber-900">Fotos</h3>

            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 text-amber-800 rounded-xl border border-amber-300 hover:bg-amber-200 cursor-pointer">
              <span>📷</span>
              <span>{subiendoFoto ? "Subiendo..." : "Subir desde el dispositivo"}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={subiendoFoto}
                className="hidden"
              />
            </label>

            {errorFoto && (
              <p className="text-sm text-red-700">{errorFoto}</p>
            )}

            <div className="text-xs text-gray-500 text-center">o pega una URL:</div>

            <div className="flex gap-2">
              <input
                value={nuevaFoto}
                onChange={(e) => setNuevaFoto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    agregarFoto();
                  }
                }}
                placeholder="https://..."
                className="flex-1 border border-amber-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={agregarFoto}
                className="px-4 py-2 bg-amber-100 text-amber-800 rounded-xl border border-amber-300 hover:bg-amber-200"
              >
                Agregar
              </button>
            </div>
            {fotos.length > 0 && (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fotos.map((url, i) => (
                  <li key={i} className="relative">
                    <img
                      src={url}
                      alt={`foto ${i + 1}`}
                      className="w-full h-24 object-cover rounded-xl border border-amber-200"
                      onError={(e) => { e.currentTarget.style.opacity = 0.3; }}
                    />
                    <button
                      type="button"
                      onClick={() => quitarFoto(i)}
                      className="absolute top-1 right-1 bg-white text-amber-700 border border-amber-300 rounded-full w-6 h-6 flex items-center justify-center hover:bg-amber-100"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {enviando ? "Publicando..." : "Publicar mascota 🐾"}
          </button>

        </form>
      </div>
    </AuthLayout>
  );
}
