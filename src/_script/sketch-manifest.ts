export const sketchManifest: Record<string, { loader: () => Promise<unknown> }> = {
  "_script/sketches/test-sketch": { loader: () => import("../_script/sketches/test-sketch.sketch.ts") },
  "color-and-light/sketches/2d-gamut-test": { loader: () => import("../color-and-light/sketches/2d-gamut-test.sketch.ts") },
  "color-and-light/sketches/3d-LSM-color": { loader: () => import("../color-and-light/sketches/3d-LSM-color.sketch.ts") },
  "color-and-light/sketches/gamut-convex-hull": { loader: () => import("../color-and-light/sketches/gamut-convex-hull.sketch.ts") },
  "color-and-light/sketches/metamerism": { loader: () => import("../color-and-light/sketches/metamerism.sketch.ts") },
  "color-and-light/sketches/photometry": { loader: () => import("../color-and-light/sketches/photometry.sketch.ts") },
  "color-and-light/sketches/sine-wave": { loader: () => import("../color-and-light/sketches/sine-wave.sketch.ts") },
}
