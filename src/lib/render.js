function render(paper) {
  paper.view.autoUpdate = false;
  setInterval(_=>{
    paper.view.update();
  }, 1000/60);
}