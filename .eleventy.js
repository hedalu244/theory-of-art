const asciidoc = require("eleventy-plugin-asciidoc")

module.exports = function(eleventyConfig){
  eleventyConfig.addPlugin(asciidoc, {
    attributes: {
      stem: "latexmath"
    }
  });
  
  // HTML上の sketch::name[] をdivに変換するフィルター
  eleventyConfig.addFilter("processSketchMacro", function(content){
    return content.replace(
      /<p>sketch::([^\[\]]+)\[\]<\/p>/g,
      '<div class="sketch" sketch-name="$1"></div>'
    );
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