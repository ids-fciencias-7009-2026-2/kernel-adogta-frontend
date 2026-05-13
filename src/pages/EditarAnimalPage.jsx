import { useParams } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Checkbox from '../components/common/Checkbox';
import Slider from '../components/common/Slider';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAnimalForm } from '../hooks/useAnimalForm';
import { NIVEL_LABELS, SLIDERS, MAX_PADECIMIENTOS, MAX_FOTOS } from '../utils/animalFormHelpers';
import dashboardBg from '../assets/Adogta_dashboard.png';

/**
 * Página para editar los datos de un animal publicado.
 * Carga los datos existentes y permite modificarlos.
 */
export default function EditarAnimalPage() {
  const { idAnimal } = useParams();

  const {
    form,
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
    loadingAnimal,
    errorAnimal,
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
    handleRazaChange,
    handleSubmit,
  } = useAnimalForm({ esEdicion: true, idAnimal: Number(idAnimal) });

  // Pantalla de carga.
  if (loadingRazas || loadingAnimal) {
    return <LoadingSpinner message="Cargando datos..." />;
  }

  // Error.
  if (errorAnimal || errorRazas) {
    return (
      <AuthLayout title="Error" backgroundImage={dashboardBg} showBackButton backPath="/dashboard">
        <div className="text-adogta-secondary mt-10 text-center">
          {errorAnimal || errorRazas}
        </div>
      </AuthLayout>
    );
  }

  // Pantalla de exito.
  if (exito) {
    return (
      <AuthLayout title="Éxito" backgroundImage={dashboardBg} showBackButton backPath="/dashboard">
        <div className="text-adogta-primary text-xl mt-10 text-center">
          Animal actualizado correctamente.
        </div>
      </AuthLayout>
    );
  }

  // Formulario
  return (
    <AuthLayout title="Editar animal" backgroundImage={dashboardBg} showBackButton backPath="/dashboard">
      <fieldset disabled={enviando} className="max-w-2xl w-full disabled:opacity-70">
        <h1 className="text-3xl font-bold text-adogta-primary mb-2">Editar publicación</h1>
        <p className="text-adogta-primary mb-6">Modifica los datos de tu mascota.</p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Selector de raza */}
          <div>
            <label className="block text-sm font-medium text-adogta-primary mb-1">Raza *</label>
            <select
              value={form.idRaza || ''}
              onChange={handleRazaChange}
              className="w-full border border-adogta-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-adogta-secondary bg-white text-adogta-primary"
            >
              <option value="" disabled>Selecciona una raza</option>
              {razas
                .filter(r => !r.tipo || r.tipo === form.tipo)
                .map(r => (
                  <option key={r.idRaza} value={r.idRaza}>{r.nombre}</option>
                ))
              }
            </select>
            {errores.idRaza && <p className="text-xs text-adogta-secondary mt-1">{errores.idRaza}</p>}
          </div>

          {/* Nombre y Edad */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre *" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre de la mascota" required disabled={enviando} error={errores.nombre} />
            <Input label="Edad (meses) *" name="edad" type="number" value={form.edad} onChange={handleChange} placeholder="0-360" required disabled={enviando} error={errores.edad} />
          </div>

          {/* Código Postal */}
          <Input label="Código Postal *" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} placeholder="5 dígitos" maxLength="5" required disabled={enviando} error={errores.codigoPostal} />

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-adogta-primary mb-1">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} maxLength={2000} placeholder="Describe a tu mascota..."
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-adogta-secondary bg-white text-adogta-primary ${errores.descripcion ? 'border-adogta-secondary' : 'border-adogta-border'}`} />
            <div className="flex justify-between text-xs text-adogta-primary/70 mt-1">
              <span>{errores.descripcion}</span>
              <span>{form.descripcion.length}/2000</span>
            </div>
          </div>

          {/* Vacunación */}
          <div>
            <label className="block text-sm font-medium text-adogta-primary mb-1">Estado vacunación *</label>
            <select name="estadoVacunacion" value={form.estadoVacunacion} onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-adogta-secondary bg-white text-adogta-primary ${errores.estadoVacunacion ? 'border-adogta-secondary' : 'border-adogta-border'}`}>
              <option value="Completo">Completo</option>
              <option value="Parcial">Parcial</option>
            </select>
            {errores.estadoVacunacion && <p className="text-xs text-adogta-secondary mt-1">{errores.estadoVacunacion}</p>}
          </div>

          {/* Checkboxes */}
          <Checkbox name="esterilizado" checked={form.esterilizado} onChange={handleChange} label="Esterilizado *" required disabled={enviando} />
          {errores.esterilizado && <p className="text-xs text-adogta-secondary -mt-4">{errores.esterilizado}</p>}
          <Checkbox name="entrenado" checked={form.entrenado} onChange={handleChange} label="Entrenado" disabled={enviando} />

          {/* Sliders */}
          <div className="bg-adogta-white border border-adogta-border rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-adogta-primary">Personalidad</h3>
            {SLIDERS.map(({ key, label }) => (
              <Slider key={key} label={label} value={form[key]} onChange={(val) => handleSlider(key, val)} labels={NIVEL_LABELS} disabled={enviando} />
            ))}
          </div>

          {/* Padecimientos */}
          <div className="bg-adogta-white border border-adogta-border rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-adogta-primary">Padecimientos ({padecimientos.length}/{MAX_PADECIMIENTOS})</h3>
            <div className="flex gap-2">
              <input value={nuevoPadecimiento} onChange={(e) => setNuevoPadecimiento(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregarPadecimiento(); } }}
                maxLength={100} placeholder="Ej: Displasia"
                className="flex-1 border border-adogta-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-adogta-secondary bg-white text-adogta-primary" />
              <button type="button" onClick={agregarPadecimiento}
                className="px-4 py-2 border border-adogta-border rounded-xl bg-adogta-white text-adogta-primary hover:bg-adogta-background transition-colors">Agregar</button>
            </div>
            {padecimientos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {padecimientos.map((p, i) => (
                  <span key={i} className="bg-adogta-background border border-adogta-border rounded-full px-3 py-1 text-sm flex items-center gap-1 text-adogta-primary">
                    {p}
                    <button type="button" onClick={() => quitarPadecimiento(i)} className="text-adogta-secondary hover:text-red-600">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Fotos */}
          <div className="bg-adogta-white border border-adogta-border rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-adogta-primary">Fotos ({fotos.length}/{MAX_FOTOS})</h3>
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-adogta-background border border-adogta-border rounded-xl cursor-pointer hover:bg-adogta-white transition-colors">
              <span className="text-adogta-primary">{subiendoFoto ? 'Subiendo...' : '📷 Subir desde el dispositivo'}</span>
              <input type="file" accept="image/*" multiple onChange={handleFileSelect} disabled={subiendoFoto || fotos.length >= MAX_FOTOS} className="hidden" />
            </label>
            {errorFoto && <p className="text-sm text-adogta-secondary">{errorFoto}</p>}
            <div className="text-xs text-adogta-primary text-center">o pega una URL:</div>
            <div className="flex gap-2">
              <input value={nuevaFoto} onChange={(e) => setNuevaFoto(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregarFoto(); } }}
                placeholder="https://..."
                className="flex-1 border border-adogta-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-adogta-secondary bg-white text-adogta-primary" />
              <button type="button" onClick={agregarFoto}
                className="px-4 py-2 border border-adogta-border rounded-xl bg-adogta-white text-adogta-primary hover:bg-adogta-background transition-colors">Agregar</button>
            </div>
            {fotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fotos.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt={`foto ${i + 1}`} className="w-full h-24 object-cover rounded-xl border border-adogta-border" onError={(e) => { e.currentTarget.style.opacity = 0.3; }} />
                    <button type="button" onClick={() => quitarFoto(i)} className="absolute top-1 right-1 bg-white border border-adogta-border rounded-full w-6 h-6 flex items-center justify-center text-adogta-secondary hover:text-red-600">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorGeneral && (
            <div className="bg-adogta-error text-adogta-secondary border border-adogta-secondary/30 rounded-xl px-4 py-3 text-sm">{errorGeneral}</div>
          )}

          <Button type="submit" disabled={enviando} loading={enviando} fullWidth icon="🐾">Guardar cambios</Button>
        </form>
      </fieldset>
    </AuthLayout>
  );
}