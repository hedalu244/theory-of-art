const esbuild = require("esbuild")
const watch = process.argv.includes("--watch")
async function run(){
  const ctx = await esbuild.context({
    entryPoints: ["src/_script/main.ts"],
    bundle: true,
    outfile: "docs/_script/main.js",
    format: "esm",
    sourcemap: true
  })
  if(watch){
    await ctx.watch()
  }else{
    await ctx.rebuild()
    process.exit()
  }
}
run()