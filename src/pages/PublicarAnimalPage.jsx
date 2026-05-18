import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Checkbox from "../components/common/Checkbox";
import Slider from "../components/common/Slider";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAnimalForm } from "../hooks/useAnimalForm";
import { razaApi } from "../api/razaApi";
import { NIVEL_LABELS, SLIDERS, MAX_PADECIMIENTOS, MAX_FOTOS } from "../utils/animalFormHelpers";
import dashboardBg from "../assets/Adogta_dashboard.png";

const layoutProps = {
  title: "Publicar Animal",
  backgroundImage: dashboardBg,
  showBackButton: true,
  backPath: "/dashboard",
};

export default function PublicarAnimalPage() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);

  const {
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
    recargarRazas,
    razaSeleccionada,
    setRazaSeleccionada,
    nuevoPadecimiento,
    setNuevoPadecimiento,
    nuevaFoto,
    setNuevaFoto,
    subiendoFoto,
    errorFoto,
    handleChange,
    handleSlider,
    agregarPadecimiento,
    quitarPadecimiento,
    agregarFoto,
    quitarFoto,
    handleFileSelect,
    handleSubmit,
  } = useAnimalForm({ esEdicion: false });

  const tipoSeleccionado = form.tipo || null;

  const [nuevaRaza, setNuevaRaza] = useState("");
  const [agregandoRaza, setAgregandoRaza] = useState(false);
  const [errorAgregarRaza, setErrorAgregarRaza] = useState("");
  const [exitoAgregarRaza, setExitoAgregarRaza] = useState("");

  // Filtro de razas
  const razasFiltradas = useMemo(() => {
    if (!razas.length) return [];
    if (razas.some((r) => r.tipo)) return razas.filter((r) => r.tipo === tipoSeleccionado);
    return razas;
  }, [razas, tipoSeleccionado]);

  // Navegación entre las fases del formulario
  function seleccionarTipo(tipo) {
    setForm((prev) => ({ ...prev, tipo }));
    setPaso(2);
  }

  function volverAElegirTipo() {
    setPaso(1);
    setForm((prev) => ({ ...prev, tipo: "" }));
    setRazaSeleccionada(null);
  }

  function seleccionarRaza(raza) {
    setRazaSeleccionada(raza);
    setForm((prev) => ({
      ...prev,
      nivelEnergia: raza.nivelEnergia,
      independencia: raza.independencia,
      sociableNiños: raza.sociableNiños,
      sociableMascotas: raza.sociableMascotas,
      idRaza: raza.idRaza,
    }));
    setPaso(3);
  }

  async function agregarRaza() {
    setErrorAgregarRaza("");
    setExitoAgregarRaza("");

    const nombreNormalizado = nuevaRaza
      .toLowerCase()
      .replace(/[^a-z ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const letrasSolo = nombreNormalizado.replace(/ /g, "");
    if (letrasSolo.length < 3) {
      setErrorAgregarRaza("La raza que buscas no existe");
      return;
    }

    setAgregandoRaza(true);
    try {
      const tipo = tipoSeleccionado === "Perro" ? "perro" : "gato";
      const respuesta = await razaApi.add({ nombre: nuevaRaza.trim(), tipo });
      await recargarRazas();
      setExitoAgregarRaza(`Raza añadida: ${respuesta.nombre}`);
      setNuevaRaza("");
    } catch (err) {
      const msg =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        "La raza que buscas no existe";
      setErrorAgregarRaza(msg);
    } finally {
      setAgregandoRaza(false);
    }
  }

  // Pantalla de éxito
  if (exito) {
    return (
      <AuthLayout {...layoutProps}>
        <div className="text-center space-y-4">
          <div className="text-6xl">🐾</div>
          <h2 className="text-2xl font-bold text-adogta-primary">¡Publicación exitosa!</h2>
          <p className="text-adogta-primary">Tu mascota ya está lista para encontrar un hogar.</p>
        </div>
      </AuthLayout>
    );
  }

  // 1 – Elegir tipo de animal
  if (paso === 1) {
    return (
      <AuthLayout {...layoutProps}>
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-adogta-primary mb-2">Publicar animal</h1>
          <p className="text-adogta-primary mb-6">¿Qué tipo de mascota quieres publicar?</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => seleccionarTipo("Perro")}
              className="bg-adogta-white border border-adogta-border rounded-2xl p-10 text-center hover:shadow-md hover:border-adogta-secondary transition-all"
            >
              <div className="text-6xl mb-3">🐶</div>
              <span className="text-xl font-bold text-adogta-primary">Perro</span>
            </button>
            <button
              onClick={() => seleccionarTipo("Gato")}
              className="bg-adogta-white border border-adogta-border rounded-2xl p-10 text-center hover:shadow-md hover:border-adogta-secondary transition-all"
            >
              <div className="text-6xl mb-3">🐱</div>
              <span className="text-xl font-bold text-adogta-primary">Gato</span>
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // 2 – Seleccionar raza
  if (paso === 2) {
    return (
      <AuthLayout {...layoutProps}>
        <div className="max-w-3xl w-full">
          <Button onClick={volverAElegirTipo} variant="secondary" icon="←">
            Cambiar tipo
          </Button>
          <h1 className="text-3xl font-bold text-adogta-primary mb-2">
            Razas de {tipoSeleccionado === "Perro" ? "perro" : "gato"}
          </h1>
          <p className="text-adogta-primary mb-6">Selecciona la raza de tu mascota.</p>

          {loadingRazas && <p className="text-adogta-primary">Cargando razas...</p>}

          {errorRazas && (
            <div className="bg-adogta-error text-adogta-secondary border border-adogta-secondary/30 rounded-xl px-4 py-3 text-sm">
              {errorRazas}
            </div>
          )}

          <div className="bg-adogta-white border border-adogta-border rounded-2xl p-5 mb-6 text-center">
            <h3 className="font-semibold text-adogta-primary mb-2">¿No encuentras la raza?</h3>
            <h3 className="text-sm text-adogta-primary/70 mt-4 mb-1"> Nombre de la raza </h3>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center justify-center ml-4">
              <Input
                name="nuevaRaza"
                value={nuevaRaza}
                onChange={(e) => setNuevaRaza(e.target.value)}
                placeholder="Ej: Golden Retriever"
                disabled={agregandoRaza}
              />
              <div className="flex items-end justify-center">
                <Button
                  type="button"
                  onClick={agregarRaza}
                  disabled={agregandoRaza || !nuevaRaza.trim()}
                  loading={agregandoRaza}
                >
                  Añadir raza
                </Button>
              </div>
            </div>
            {errorAgregarRaza && (
              <p className="text-sm text-adogta-secondary mt-3">{errorAgregarRaza}</p>
            )}
            {exitoAgregarRaza && (
              <p className="text-sm text-adogta-primary mt-3">{exitoAgregarRaza}</p>
            )}
          </div>

          {!loadingRazas && !errorRazas && razasFiltradas.length === 0 && (
            <p className="text-adogta-primary">No hay razas disponibles.</p>
          )}

          {!loadingRazas && !errorRazas && razasFiltradas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {razasFiltradas.map((raza) => (
                <button
                  key={raza.idRaza}
                  onClick={() => seleccionarRaza(raza)}
                  className="text-left bg-adogta-white border border-adogta-border rounded-2xl p-5 hover:shadow-md hover:border-adogta-secondary transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-adogta-primary">{raza.nombre}</span>
                    {raza.esHipoalergenico === 1 && (
                      <span className="text-xs bg-adogta-background text-adogta-primary px-2 py-0.5 rounded-full">
                        Hipoalergénica
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-adogta-primary mb-3">{raza.personalidad}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-adogta-primary/70">
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

  // 3 – Formulario de detalles
  return (
    <AuthLayout {...layoutProps}>
      <fieldset disabled={enviando} className="max-w-2xl w-full disabled:opacity-70">
        <Button onClick={() => setPaso(2)} variant="secondary" icon="←">
          Cambiar raza
        </Button>
        <h1 className="text-3xl font-bold text-adogta-primary mb-1">Detalles de tu mascota</h1>
        <p className="text-adogta-primary mb-6">
          {tipoSeleccionado} ·{" "}
          <span className="font-semibold">{razaSeleccionada?.nombre}</span>
        </p>

        <div className="bg-adogta-white border border-adogta-border rounded-2xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-adogta-primary mb-1">Sobre la raza</h3>
          <p className="text-sm text-adogta-primary/70">{razaSeleccionada?.personalidad}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre *"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Luna"
              required
              disabled={enviando}
              error={errores.nombre}
            />
            <Input
              label="Edad (meses) *"
              name="edad"
              type="number"
              value={form.edad}
              onChange={handleChange}
              placeholder="Ej: 18"
              required
              disabled={enviando}
              error={errores.edad}
            />
          </div>

          <Input
            label="Código Postal *"
            name="codigoPostal"
            value={form.codigoPostal}
            onChange={handleChange}
            placeholder="5 dígitos"
            maxLength="5"
            required
            disabled={enviando}
            error={errores.codigoPostal}
          />

          <div>
            <label className="block text-sm font-medium text-adogta-primary mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              maxLength={2000}
              placeholder="Cuéntanos sobre tu mascota..."
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-adogta-secondary bg-white text-adogta-primary ${
                errores.descripcion ? "border-adogta-secondary" : "border-adogta-border"
              }`}
            />
            <div className="flex justify-between text-xs text-adogta-primary/70 mt-1">
              <span>{errores.descripcion}</span>
              <span>{form.descripcion.length}/2000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-adogta-primary mb-1">
              Estado de vacunación *
            </label>
            <select
              name="estadoVacunacion"
              value={form.estadoVacunacion}
              onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-adogta-secondary bg-white text-adogta-primary ${
                errores.estadoVacunacion ? "border-adogta-secondary" : "border-adogta-border"
              }`}
            >
              <option value="Completo">Completo</option>
              <option value="Parcial">Parcial</option>
            </select>
            {errores.estadoVacunacion && (
              <p className="text-xs text-adogta-secondary mt-1">{errores.estadoVacunacion}</p>
            )}
          </div>

          <div className="bg-adogta-background border border-adogta-border rounded-xl px-4 py-3 text-sm text-adogta-primary">
            <p className="mb-2">Solo se aceptan animales esterilizados para promover una adopción responsable.</p>
            <Checkbox
              name="esterilizado"
              checked={form.esterilizado}
              onChange={handleChange}
              label="Confirmo que el animal está esterilizado. *"
              required
              disabled={enviando}
            />
            {errores.esterilizado && (
              <p className="text-xs text-adogta-secondary mt-1">{errores.esterilizado}</p>
            )}
          </div>

          <Checkbox
            name="entrenado"
            checked={form.entrenado}
            onChange={handleChange}
            label="Entrenado/a"
            disabled={enviando}
          />

          {/* Sliders de personalidad */}
          <div className="bg-adogta-white border border-adogta-border rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-adogta-primary">
              Personalidad{" "}
              <span className="text-xs text-adogta-primary/60 font-normal">
                (valores por defecto de la raza, puedes ajustarlos)
              </span>
            </h3>
            {SLIDERS.map(({ key, label }) => (
              <Slider
                key={key}
                label={label}
                value={form[key]}
                onChange={(val) => handleSlider(key, val)}
                labels={NIVEL_LABELS}
                disabled={enviando}
              />
            ))}
          </div>

          {/* Padecimientos */}
          <div className="bg-adogta-white border border-adogta-border rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-adogta-primary">
              Padecimientos ({padecimientos.length}/{MAX_PADECIMIENTOS})
            </h3>
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
                maxLength={100}
                placeholder="Ej: Displasia"
                className="flex-1 border border-adogta-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-adogta-secondary bg-white text-adogta-primary"
              />
              <button
                type="button"
                onClick={agregarPadecimiento}
                className="px-4 py-2 border border-adogta-border rounded-xl bg-adogta-white text-adogta-primary hover:bg-adogta-background transition-colors"
              >
                Agregar
              </button>
            </div>
            {padecimientos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {padecimientos.map((p, i) => (
                  <span
                    key={i}
                    className="bg-adogta-background border border-adogta-border rounded-full px-3 py-1 text-sm flex items-center gap-1 text-adogta-primary"
                  >
                    {p}
                    <button
                      type="button"
                      onClick={() => quitarPadecimiento(i)}
                      className="text-adogta-secondary hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Fotos */}
          <div className="bg-adogta-white border border-adogta-border rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-adogta-primary">
              Fotos ({fotos.length}/{MAX_FOTOS})
            </h3>
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-adogta-background border border-adogta-border rounded-xl cursor-pointer hover:bg-adogta-white transition-colors">
              <span className="text-adogta-primary">
                {subiendoFoto ? "Subiendo..." : "📷 Subir desde el dispositivo"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={subiendoFoto || fotos.length >= MAX_FOTOS}
                className="hidden"
              />
            </label>
            {errorFoto && <p className="text-sm text-adogta-secondary">{errorFoto}</p>}
            <div className="text-xs text-adogta-primary text-center">o pega una URL:</div>
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
                className="flex-1 border border-adogta-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-adogta-secondary bg-white text-adogta-primary"
              />
              <button
                type="button"
                onClick={agregarFoto}
                className="px-4 py-2 border border-adogta-border rounded-xl bg-adogta-white text-adogta-primary hover:bg-adogta-background transition-colors"
              >
                Agregar
              </button>
            </div>
            {fotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fotos.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt={`foto ${i + 1}`}
                      className="w-full h-24 object-cover rounded-xl border border-adogta-border"
                      onError={(e) => { e.currentTarget.style.opacity = 0.3; }}
                    />
                    <button
                      type="button"
                      onClick={() => quitarFoto(i)}
                      className="absolute top-1 right-1 bg-white border border-adogta-border rounded-full w-6 h-6 flex items-center justify-center text-adogta-secondary hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorGeneral && (
            <div className="bg-adogta-error text-adogta-secondary border border-adogta-secondary/30 rounded-xl px-4 py-3 text-sm">
              {errorGeneral}
            </div>
          )}

          <Button type="submit" disabled={enviando} loading={enviando} fullWidth icon="🐾">
            Publicar mascota
          </Button>
        </form>
      </fieldset>
    </AuthLayout>
  );
}