# Plataforma de Adopción de Perros y Gatos: Adogta — Frontend

Plataforma web diseñada para facilitar la adopción responsable de perros y gatos, conectando a personas que desean dar en adopción animales con aquellas interesadas en adoptar.

## Tecnología

- **React 18** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite** - Herramienta de construcción y servidor de desarrollo ultrarrápido
- **JavaScript (JSX)** - Sintaxis de JavaScript con extensiones XML

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (incluido con Node.js)

Para verificar que tienes Node.js instalado, ejecuta:

```bash
node --version
npm --version
```

## Cómo ejecutar

Sigue estos pasos para levantar el proyecto localmente:

### 1. Clonar el repositorio

```bash
git clone https://github.com/ids-fciencias-7009-2026-2/kernel-adogta-frontend.git
cd kernel-adogta-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando descargará e instalará todas las dependencias necesarias definidas en `package.json`.

### 3. Levantar el servidor de desarrollo

```bash
npm run dev
```

### 4. Abrir en el navegador

Una vez que el servidor esté corriendo, abre tu navegador y visita:

```
http://localhost:5173
```

Deberías ver la página de inicio del proyecto Adogta (todavía no tiene nada xd).

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción localmente
- `npm run lint` - Ejecuta el linter para verificar el código

## Estructura del proyecto

```
kernel-adogta-frontend/
├── public/           # Archivos estáticos públicos
├── src/              # Código fuente de la aplicación
│   ├── assets/       # Imágenes, iconos y recursos
│   ├── App.jsx       # Componente principal
│   ├── main.jsx      # Punto de entrada de la aplicación
│   └── index.css     # Estilos globales
├── index.html        # Plantilla HTML principal
├── package.json      # Dependencias y scripts
└── vite.config.js    # Configuración de Vite
```

## Versionamiento

**Versión actual:** `0.0.1`

Esta versión representa el punto de partida del frontend: el proyecto existe, compila y levanta correctamente, aunque aún no tiene funcionalidades de negocio implementadas.

## Equipo

**Kernel Crew y La Sonora Dinamita**

---

Para más información sobre el backend del proyecto, visita el [repositorio backend](https://github.com/ids-fciencias-7009-2026-2/kernel-adogta-api).
