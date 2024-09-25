const Globals = {
  BMP: 196,
  BEAT_DUR: 1000 * 1/(196/60),
  palette: [
    new paper.Color('#fff923'),
    new paper.Color('#ff8d12'),
    new paper.Color('#568b24'),
    new paper.Color('#282828'),
  ]
};

const PI = Math.PI;
const TAU = PI*2;

function delay(seconds, func) {
  (new paper.Path()).tween(seconds+0.000001).then(func);
}

function scale3(vec3, sca) {
  return [vec3[0]*sca, vec3[1]*sca, vec3[2]*sca];
}

function proj(vec3, off=0) {
  return new paper.Point(vec3[0]/(vec3[2]+off), vec3[1]/(vec3[2]+off));
}