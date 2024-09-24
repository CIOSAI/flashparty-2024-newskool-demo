window.onload = function() {
	paper.setup('myCanvas');
}

let canvas = document.querySelector('#myCanvas');
canvas.addEventListener('fullscreenchange', ()=>{
  with (paper) {
    if (document.fullscreenElement == null) { return; }

    // kept for reminder

    // let typo = new PointText({
    //   fillColor: Globals.palette[1],
    //   fontFamily: 'Kaukhia',
    //   fontSize: 144,
    //   content: 'This is the Kaukhia font'
    // });

    let background = new Path.Rectangle(new Point(0,0),view.size);
    background.fillColor = Globals.palette[0];

    let foregroundLayer = new Layer();

    let loadingCircs = [];
    for(let i=0; i<10; i++){
      let circ = new Path.Circle({
        center: (new Point(1+i,0)).multiply(view.size.height/16),
        radius: view.size.height/32,
        scaling: 0.00001,
        fillColor: Globals.palette[3],
        applyMatrix: false
      });
      loadingCircs.push(circ);
    }
    for(let j=0; j<4; j++){
      delay(Globals.BEAT_DUR*10*j, _=>{
        for(let i=0; i<10; i++){
          loadingCircs[i].position.y += view.size.height/16;
          loadingCircs[i].visible = false;
          delay(Globals.BEAT_DUR*i, _=>{
            loadingCircs[i].tween({
              visible: false
            }, {
              visible: true
            }, {
              duration: 1
            });
          });
          delay(Globals.BEAT_DUR*i, _=>{
            loadingCircs[i].tween({
              scaling: 0.0001
            }, {
              scaling: 1
            }, {
              duration: Globals.BEAT_DUR, 
              easing: 'easeOutQuint'
            });
          });
        }
      });
    }

    view.draw();
	}
});