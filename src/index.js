window.onload = function() {
	paper.setup('myCanvas');
}

let canvas = document.querySelector('#myCanvas');
canvas.addEventListener('fullscreenchange', ()=>{
  with (paper) {
    let background = new Path.Rectangle(new Point(0,0),view.size);
    background.fillColor = Globals.palette[3];

    let foregroundLayer = new Layer();
    let typo = new PointText({
      fillColor: Globals.palette[0],
      fontFamily: 'Kaukhia',
      content: 'This is the Kaukhia font'
    });
    let path = new Path();
		path.strokeColor = Globals.palette[1];
		let start = new Point(100, 100);
		path.moveTo(start);
		path.lineTo(start.add([ 200, -50 ]));
		
    view.draw();
		view.onFrame = function(event) {
      let TIME = event.time;
      let FRAMECOUNT = event.count;
      path.rotate(event.delta*32);
      typo.position = [600+Math.cos(TIME)*200, 600+Math.sin(TIME)*200];
		}
	}
});