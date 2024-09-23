window.onload = function() {
	paper.setup('myCanvas');
}

let canvas = document.querySelector('#myCanvas');
canvas.addEventListener('fullscreenchange', ()=>{
  with (paper) {
    let background = new Path.Rectangle(new Point(0,0),view.size);
    background.fillColor = Globals.palette[0];

    let foregroundLayer = new Layer();
    let typo = new PointText({
      fillColor: Globals.palette[1],
      fontFamily: 'Kaukhia',
      fontSize: 144,
      content: 'This is the Kaukhia font'
    });
    let path = new Path({
      strokeColor: Globals.palette[2],
      strokeWidth: 30,
    });
		let start = new Point(view.size.divide(2));
		path.moveTo(start);
		path.lineTo(start.add([ view.size.height / 8, 0 ]));
		
    view.draw();
		view.onFrame = function(event) {
      let TIME = event.time;
      let FRAMECOUNT = event.count;
      path.rotate(event.delta*32);
      typo.position = view.size.divide(2).add(
        (new Size(Math.cos(TIME), Math.sin(TIME))).multiply(200)
      );
		}
	}
});