const esbuild = require("esbuild")
const fs = require("node:fs")
const path = require("node:path")
const watch = process.argv.includes("--watch")

function walkFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return []

  const files = []
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath))
      continue
    }
    files.push(fullPath)
  }
  return files
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/")
}

function generateSketchManifest() {
  const srcRoot = path.resolve("src")
  const manifestPath = path.resolve("src", "_script", "sketch-manifest.ts")

  const entries = []
  const sketches = walkFiles(srcRoot).filter(f => f.endsWith(".sketch.ts"))
  const seenNames = new Map()

  for (const absPath of sketches) {
    const relFromSrc = toPosixPath(path.relative(srcRoot, absPath))
    const keyPath = relFromSrc.replace(/\.sketch\.ts$/, "")
    const displayName = path.basename(keyPath)
    const importPath = toPosixPath(".." + path.sep + relFromSrc)

    entries.push(`  ${JSON.stringify(keyPath)}: { loader: () => import(${JSON.stringify(importPath)}) },`)

    /*
    if (!seenNames.has(displayName)) {
      entries.push(`  ${JSON.stringify(displayName)}: { loader: () => import(${JSON.stringify(importPath)}) },`)
      seenNames.set(displayName, keyPath)
    }*/
  }

  entries.sort()

  const content = [
    "export const sketchManifest: Record<string, { loader: () => Promise<unknown> }> = {",
    ...entries,
    "}",
    "",
  ].join("\n")

  const current = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, "utf8") : ""
  if (current !== content) {
    fs.writeFileSync(manifestPath, content, "utf8")
  }
}

async function run(){
  generateSketchManifest()

  const ctx = await esbuild.context({
    entryPoints: ["src/_script/main.ts"],
    bundle: true,
    outfile: "docs/_script/main.js",
    format: "esm",
    sourcemap: true,
    plugins: [
      {
        name: "sketch-manifest-generator",
        setup(build) {
          build.onStart(() => {
            generateSketchManifest()
          })
        }
      }
    ]
  })
  if(watch){
    await ctx.watch()
  }else{
    await ctx.rebuild()
    process.exit()
  }
}
run()