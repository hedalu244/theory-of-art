const asciidoc = require("eleventy-plugin-asciidoc")

function escapeAttribute(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

module.exports = function(eleventyConfig){
  eleventyConfig.addPlugin(asciidoc, {
    attributes: {
      stem: "latexmath"
    }
  });
  
  // HTML上の {% sketch "name", options... %} をdivに変換するフィルター
  eleventyConfig.addNunjucksFilter("processSketchMacro", function(content) {
    const pageUrl = this.ctx?.page?.url || ""
    const articlePath = pageUrl.replace(/\/$/, "").replace(/index\.html$/, "").replace(/\.html$/, "")

    const withSketchDiv = content.replace(/{%\s*sketch\s+"([^"]+)"(?:\s*,([\s\S]*?))?\s*%}/g, (_match, rawName, rawOptions) => {
      const name = escapeAttribute(String(rawName).trim())
      const options = String(rawOptions ?? "").trim()

      let attrs = `data-name="${name}"`
      if (articlePath) {
        attrs += ` data-article-path="${escapeAttribute(articlePath)}"`
      }
      if (options) {
        attrs += ` data-options="${escapeAttribute(options)}"`
      }

      return `<div class="sketch" ${attrs}></div>`
    })

    return withSketchDiv.replace(/<p>\s*((?:<div class="sketch"[^>]*><\/div>\s*)+)<\/p>/g, "$1")
  });
  
  // src配下の全ファイルをパススルーコピー対象に
  // その他のファイル(css, 画像, その他アセット)をコピーします
  eleventyConfig.addPassthroughCopy('src/**/*.!(md|adoc|njk|ts)');

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_layouts"
    }
  };
}