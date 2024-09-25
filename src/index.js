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

    let loadingCircAmt = 10;
    let loadingCircs = [];
    for(let i=0; i<loadingCircAmt; i++){
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
      delay(Globals.BEAT_DUR*loadingCircAmt*j, _=>{
        for(let i=0; i<loadingCircAmt; i++){
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
    delay(Globals.BEAT_DUR*loadingCircAmt*4, _=>{
      for(let i=0; i<loadingCircAmt; i++){
        loadingCircs[i].visible = false;
      }
    });

    let layer2 = new Layer();
    let pseudoCube = new Path.RegularPolygon(view.center, 6, view.size.height/8);
    pseudoCube.strokeColor = Globals.palette[3];
    pseudoCube.strokeWidth = view.size.height/96;
    pseudoCube.visible = false;
    let otherCubeAmt = 15;
    let otherCubes = [];
    for(let i=0; i<otherCubeAmt; i++){otherCubes.push(pseudoCube.clone());}
    delay(Globals.BEAT_DUR*loadingCircAmt*4, _=>{
      pseudoCube.visible = true;
      pseudoCube.tween(Globals.BEAT_DUR*loadingCircAmt*8).onUpdate = event => {
        let ease = n => n>0.5?1:Math.sin(n*TAU-PI/2)*.5+.5;
        let t = event.factor;
        let i_t = ~~(t*16), f_t = (t*16)%1;
        t = i_t + ease(f_t);

        let verts = [[1,-1,-1],[-1,-1,-1],[-1,-1,1],[-1,1,1],[1,1,1],[1,1,-1]];
        for(let vert of verts){
          let p = new Point(vert[0], vert[2]);
          p = p.rotate(45+Math.cos(t*2.25)*20);
          vert[0] = p.x; vert[2] = p.y;
          p = new Point(vert[1], vert[2]);
          p = p.rotate(-45+Math.sin(t*1.75)*20);
          vert[1] = p.x; vert[2] = p.y;
        }

        for(let i=0; i<6; i++){
          pseudoCube.segments[i].point = view.center.add( proj(verts[i],4).multiply(view.size.height/2) );
        }
      };
    });
    delay(Globals.BEAT_DUR*loadingCircAmt*(4+4), _=>{
      for(let i=0; i<otherCubeAmt; i++) {
        let x = i%5, y = ~~(i/5);
        otherCubes[i].strokeColor = Globals.palette[2];
        otherCubes[i].visible = !(x==2 && y==1);
        let off = (new Point(x+(y%2==0?0:0.5)-2.5, y-1)).multiply(view.size.height/2);
        otherCubes[i].tween(Globals.BEAT_DUR*loadingCircAmt*4).onUpdate = event => {
          for(let j=0; j<6; j++){
            otherCubes[i].segments[j].point = pseudoCube.segments[j].point.add(off);
          }
        };
      }
    });
    delay(Globals.BEAT_DUR*loadingCircAmt*12, _=>{
      pseudoCube.tween(Globals.BEAT_DUR*loadingCircAmt*4).onUpdate = event => {
        pseudoCube.rotate(event.factor*30, view.center);
      };
      for(let i=0; i<otherCubeAmt; i++) {
        let x = i%5, y = ~~(i/5);
        otherCubes[i].strokeColor = Globals.palette[2];
        otherCubes[i].closed = false;
        otherCubes[i].visible = !(x==2 && y==1);
        let off = (new Point(x+(y%2==0?0:0.5)-2.5, y-1)).multiply(view.size.height/2);
        otherCubes[i].tween(Globals.BEAT_DUR*loadingCircAmt*4).onUpdate = event => {
          for(let j=0; j<6; j++){
            otherCubes[i].segments[j].point = view.center.add(off).add(
              (new Point((j-3)*2, Math.sin(i*2.0+j*0.8+event.factor*30.0))).rotate(30).multiply(view.size.height/16)
            );
          }
        };
      }
    });
    delay(Globals.BEAT_DUR*loadingCircAmt*16, _=>{
      pseudoCube.visible = false;
      for(let i=0; i<otherCubeAmt; i++) {
        otherCubes[i].visible = false;
      }
    });

    foregroundLayer.activate();
    let typo = new PointText({
      fillColor: Globals.palette[1],
      fontFamily: 'Kaukhia',
      fontSize: 72,
      justification: "center",
      point: new Point(view.center.x,0),
      // point: view.center,
      applyMatrix: false
    });
    let scroller = [
      "¡Hola todos!", "Ta̍k ke hó!", "Soy CIOSAI de Taiwán", "no puedo viajar a allá", 
      "¡pero yo puedo hacer demo!", "¡Divertirse la party!"
    ];
    delay(Globals.BEAT_DUR*loadingCircAmt*4, _=>{
      for(let i=0; i<6; i++){
        delay(Globals.BEAT_DUR*20*i, _=>{
          typo.content = scroller[i];
          typo.tween({
            "position.y": 0-36
          }, {
            "position.y": view.size.height+36
          }, {
            easing: "easeInOutCubic",
            duration: Globals.BEAT_DUR*20
          });
        });
      }
    });

    let beeAmt = 160;
    let beehive = [];
    for(let i=0; i<beeAmt; i++) {
      let x = i%16, y = ~~(i/16);
      let bee = new Path.RegularPolygon(
        view.center.add( (new Point(x+(y%2==0?0:0.5)-8, (y-4.5)*Math.sqrt(3)/2)).multiply(view.size.height/8) ),
        6, view.size.height/16
      );
      bee.applyMatrix = false;
      bee.visible = false;
      bee.scaling = 0.0001;
      bee.fillColor = Globals.palette[1+(~~(Math.sin(i*66.463)*2+1))%3];
      beehive.push(bee);
    }
    delay(Globals.BEAT_DUR*loadingCircAmt*16, _=>{
      let noiseMap = (p, t) => {
        let s = n => Math.sin(n*TAU)*.5+.5;
        let acc = 0;
        acc += s(p.x*0.01+t*4);
        acc += s(p.x*s((p.y-t)*0.033)*0.05);

        let ease = n => 1-Math.sqrt(n);
        let t_offset = ~~(s(p.x*.01+s(s(p.x*.01)+p.y*4))*5);
        let f_t = (t*loadingCircAmt*8/5 + t_offset/5)%1;

        acc += ease(f_t);
        return acc/3;
      };
      for(let i=0; i<beeAmt; i++) {
        beehive[i].visible = true;
        beehive[i].tween(Globals.BEAT_DUR*loadingCircAmt*8).onUpdate = event=>{
          beehive[i].scaling = Math.max(0.0001,noiseMap(beehive[i].position, event.factor));
        };
      }
    });
    delay(Globals.BEAT_DUR*loadingCircAmt*(16+8), _=>{
      for(let i=0; i<beeAmt; i++) {
        beehive[i].visible = false;
      }
    });

    
    //, "Hicelo con paper.js", "La fuente llama Kaukhia"

    view.draw();
	}
});