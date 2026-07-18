// Los assets generados por scripts/fetch-content.mjs (imágenes de proyectos,
// foto de hero, CV) se guardan como rutas absolutas de sitio (p.ej. "/cv.pdf").
// En GitHub Pages el sitio no vive en la raíz sino en `base` (vite.config.ts),
// así que hay que anteponerlo a mano: Vite solo reescribe automáticamente los
// imports y las referencias dentro de index.html, no strings dinámicos.
export function withBase(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
