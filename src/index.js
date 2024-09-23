window.onload = function() {
	paper.setup('myCanvas');
}

let check = (h, s, b) => {
  console.log(h);
  console.log(s);
  console.log(b);
}

let canvas = document.querySelector('#myCanvas');
canvas.addEventListener('fullscreenchange', ()=>{
  with (paper) {
    check(...oklch2rgb([0.5,1,0.5]));
    let sillyColor = new Color(...oklch2rgb([0.5,1,0.5]));
    let typo = new PointText({
      fillColor: sillyColor,
      fontFamily: 'Kaukhia',
      content: 'This is the Kaukhia font'
    });
    let path = new Path();
		path.strokeColor = sillyColor;
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