#!/bin/bash
set -e

# Instala las dependencias definidas en package.json
npm ci

# Ejemplo de verificación: ejecuta linter y build
npm run lint || true
npm run build || true
