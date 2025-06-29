# Sistema de Gestión de Biblioteca (harver-sistema-inventario)

Este es un sistema de gestión de biblioteca desarrollado con React, TypeScript, Vite y Tailwind CSS.

## Desarrollo

1.  Clona el repositorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    Esto abrirá la aplicación en `http://localhost:5173` (o el puerto que Vite designe).

## Build

Para crear una compilación de producción:

```bash
npm run build
```
Los archivos compilados se encontrarán en el directorio `dist`.

## Despliegue en GitHub Pages

Este proyecto está configurado para ser desplegado en GitHub Pages.

1.  **Configuración del Repositorio:**
    *   Ve a la configuración de tu repositorio en GitHub.
    *   En la sección "Pages", asegúrate de que la fuente de despliegue esté configurada para "GitHub Actions". Si es una configuración más antigua o manual, podrías estar usando una rama (como `main` o `gh-pages`) y una carpeta (`/root` o `/docs`). Para proyectos Vite, es común que el proceso de build genere los archivos en la carpeta `dist`, y esta carpeta sea la que se despliegue.

2.  **Base URL:**
    *   El archivo `vite.config.ts` ha sido configurado con `base: '/harver-sistema-inventario/'`.
    *   El archivo `package.json` incluye `"homepage": "https://jeanperez19.github.io/harver-sistema-inventario"`.

3.  **Flujo de Despliegue (Recomendado con GitHub Actions):**
    *   GitHub Actions puede automatizar el proceso de build y despliegue. Usualmente, se crea un workflow (un archivo `.yml` en `.github/workflows`) que se activa en cada push a la rama principal.
    *   Este workflow ejecuta `npm run build` y luego despliega el contenido de la carpeta `dist` a GitHub Pages.
    *   Si no tienes un workflow de GitHub Actions para Pages, puedes crear uno o seguir los pasos para despliegue manual (subir el contenido de `dist` a una rama `gh-pages`).

4.  **Acceder al Sitio:**
    *   Una vez desplegado, el sitio estará disponible en `https://jeanperez19.github.io/harver-sistema-inventario`.

    **Nota:** Después de hacer push de los cambios (incluyendo la configuración de `base` en `vite.config.ts`), GitHub Actions (si está configurado para Pages) debería construir y desplegar automáticamente. Si no, asegúrate de que tu configuración de GitHub Pages en el repositorio esté apuntando a la fuente correcta después de que hayas hecho el build y subido los archivos.
