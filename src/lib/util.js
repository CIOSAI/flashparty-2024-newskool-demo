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

function delay(seconds, func) {
  (new paper.Path()).tween(seconds+0.000001).then(func);
}