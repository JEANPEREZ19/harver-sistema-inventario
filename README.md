# Sistema de Gestión Bibliotecaria

Este proyecto es una aplicación React creada con Vite.

## Requisitos
- Node.js 18 o superior

## Instalación
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el modo desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

## Compilación
Para generar los archivos estáticos de producción ejecuta:
```bash
npm run build
```
El resultado se guardará en la carpeta `dist/` y puede ser alojado en cualquier subcarpeta de un servidor estático.

## Publicación
La configuración de Vite usa `base: './'` y el enrutamiento se basa en `HashRouter`, por lo que no requiere redirecciones del servidor.
