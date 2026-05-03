const asciidoc = require("eleventy-plugin-asciidoc")

// GitHub Pages の公開先サブパス（変更する場合はここだけ直せばOK）
const GITHUB_PAGES_PATH_PREFIX = "/theory-of-art/"

// `npm run build` から呼ばれる専用スクリプト時のみ prefix を有効化
const isPagesBuild = process.env.npm_lifecycle_event === "build:site:pages"

function escapeAttribute(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function resolvePath(base, relative) {
  if (relative.startsWith("/")) {
    return relative;
  }
  
  const stack = base.split("/").slice(0, -1);

  const parts = relative.split("/");
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      stack.pop();
    } else {
      stack.push(part);
    }
  }

  return stack.join("/");
}

module.exports = function(eleventyConfig){
  eleventyConfig.addPlugin(asciidoc, {
    attributes: {
      stem: "latexmath"
    }
  });
  
  // HTML上の {% sketch "name", options... %} をdivに変換するフィルター
  eleventyConfig.addNunjucksFilter("processSketchMacro", function(content) {
    // ./src/を除去
    const inputPath = (this.ctx?.page?.inputPath || "").replace(/^(\.\/)?src\//, "");
    if (!inputPath) return content;
    
    const withSketchDiv = content.replace(/{%\s*sketch\s+"([^"]+)"(?:\s*,([\s\S]*?))?\s*%}/g, (_match, rawRelativePath, rawOptions) => {
      const relativePath = escapeAttribute(String(rawRelativePath).trim())
      const options = String(rawOptions ?? "").trim()

      let attrs = `data-path="${resolvePath(inputPath, relativePath)}"`;
      
      if (options) {
        attrs += ` data-options="${escapeAttribute(options)}"`
      }

      return `<div class="sketch" ${attrs}></div>`
    })

    return withSketchDiv.replace(/<p>\s*((?:<div class="sketch"[^>]*><\/div>\s*)+)<\/p>/g, "$1")
  });
  
  // src配下の全ファイルをパススルーコピー対象に
  // その他のファイル(css, 画像, その他アセット)をコピーします
  eleventyConfig.addPassthroughCopy('src/.nojekyll');
  eleventyConfig.addPassthroughCopy('src/**/*.!(md|adoc|njk|ts|sketch.ts)');

  return {
    pathPrefix: isPagesBuild ? GITHUB_PAGES_PATH_PREFIX : "/",
    dir: {
      input: "src",
      output: "docs",
      includes: "_layouts"
    }
  };
}