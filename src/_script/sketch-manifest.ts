export const sketchManifest: Record<string, { loader: () => Promise<unknown> }> = {
  "_script/sketches/test-sketch": { loader: () => import("../_script/sketches/test-sketch.sketch.ts") },
  "pages/3d-LSM-color": { loader: () => import("../pages/3d-LSM-color.sketch.ts") },
  "pages/sine-wave": { loader: () => import("../pages/sine-wave.sketch.ts") },
}
