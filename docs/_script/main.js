// src/_script/sketches/test-sketch.ts
function create(el) {
  const input = document.createElement("input");
  input.type = "range";
  input.min = "0";
  input.max = "90";
  input.value = "45";
  el.appendChild(input);
  el.appendChild(document.createElement("br"));
  new p5((p) => {
    p.setup = () => {
      p.createCanvas(400, 300, p.WEBGL);
    };
    p.draw = () => {
      p.background(230);
      p.rotateY(input.valueAsNumber * p.PI / 180);
      p.box(100);
    };
  }, el);
}

// src/_script/main.ts
var sketches = {
  "test-sketch": create
};
document.querySelectorAll(".sketch").forEach((el) => {
  const name = el.getAttribute("sketch-name");
  if (!name) return;
  const sketch = sketches[name];
  if (!sketch) return;
  sketch(el);
});
//# sourceMappingURL=main.js.map
