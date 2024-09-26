window.onload = function() {
	paper.setup('myCanvas');
}

let canvas = document.querySelector('#myCanvas');
canvas.addEventListener('fullscreenchange', ()=>{
  with (paper) {
    if (document.fullscreenElement == null) { return; }

    let background = new Path.Rectangle(new Point(0,0),view.size);
    background.fillColor = Globals.palette[0];

    let foregroundLayer = new Layer();
    let layer2 = new Layer();

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

        acc += ease(f_t)*.5;
        return acc/2.5;
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

    delay(Globals.BEAT_DUR*loadingCircAmt*24, _=>{
      for(let i=0; i<loadingCircAmt; i++){
        loadingCircs[i].visible = true;
        loadingCircs[i].scaling = 1;
        loadingCircs[i].tween(Globals.BEAT_DUR*loadingCircAmt*8).onUpdate = event=>{
          let off = (new Point(1,0)).rotate(i*360/20 + event.factor*360);
          let phase = event.factor*5+i*3/5;
          off = off.multiply( Math.sign(Math.sin(phase*TAU)) * Math.sin(Math.abs(Math.sin(phase*TAU)) * PI/2) );
          off = off.multiply(view.size.height/3);
          loadingCircs[i].position = view.center.add(off);
        };
      }
    });
    delay(Globals.BEAT_DUR*loadingCircAmt*24, _=>{
      for(let i=0; i<loadingCircAmt * 8; i++){
        delay(Globals.BEAT_DUR*i, _=>{
          background.fillColor = Globals.palette[i%2?3:0];
          for(let circ of loadingCircs) {circ.fillColor = Globals.palette[i%2?0:3];}
        });
      }
    });
    delay(Globals.BEAT_DUR*loadingCircAmt*24, _=>{
      typo.fillColor = null;
      typo.strokeColor = Globals.palette[0];
      typo.strokeWidth = view.size.height/360;
      typo.position = view.center;
      delay(0, _=>{
        typo.content = "Hicelo con paper.js";
      });
      delay(Globals.BEAT_DUR*loadingCircAmt*2, _=>{
        typo.content = "La fuente llama Kaukhia";
      });
      delay(Globals.BEAT_DUR*loadingCircAmt*4, _=>{
        typo.visible = false;
      });
    });

    foregroundLayer.activate();

    let activeSquares = [];
    let dim = new Size(16*2,9*2);
    let maxLen = 6;
    // randomly generate squares of different sizes and position
    for(let i=0; i<(dim.width-1)*(dim.height-1)/2; i++){
      let rand = n => Math.sin(93.153+n*133.561)*0.5+0.5;

      // let l = ~~(rand(i*3)*maxLen)+1, x = ~~(rand(i*300)*(dim.width-l)), y = ~~(rand(i*9000)*(dim.height-l));
      let x = i%dim.width, y = ~~(i/dim.height);
      let l = ~~(rand(i)*maxLen)+1;
      l = Math.min(l, Math.min(dim.width-x, dim.height-y));
      let rect = new Rectangle(x, y, l, l);

      let hit = false;
      for(let other of activeSquares){
        if(rect.intersects(other)){
          hit = true;
          break;
        }
      }

      if(!hit){
        activeSquares.push(rect);
      }
    }
    // fill up the rest of the dim with squares of size 1
    for(let x=0; x<dim.width; x++){
      for(let y=0; y<dim.height; y++){
        let rect = new Rectangle(x, y, 1, 1);

        let hit = false;
        for(let other of activeSquares){
          if(rect.intersects(other)){
            hit = true;
            break;
          }
        }

        if(!hit) {
          activeSquares.push(rect);
        }
      }
    }
    let packedSquares = [];
    for(let rect of activeSquares){
      let path = new Path.Rectangle(
        rect.point.multiply(view.size.height/dim.height).add(0.5*view.size.height/72), 
        rect.size.multiply(view.size.height/dim.height).subtract(view.size.height/72)
      );
      path.fillColor = null;
      path.strokeColor = Globals.palette[2];
      path.visible = false;
      packedSquares.push(path);
    }

    let greetTypos = [];
    let greetz = [
      "mocoo", "wrighter", "yx", "jay", "goose", "OhLi",
      "cpdt", "alkama", "evvvvil", "cmdr homer", "med", "slerpy", "limp ninja",
      "viktor", "shhra", "raccoon violet", "sp4ghet", "NuSan", "0b5vr", "totetmatt",
      "luna", "poobrain", "still", "Resistance", "psenough", "kb", "darya", "desire"
    ];
    let margin = 24*8;
    for(let i=0; i<greetz.length; i++){
      let greet = typo.clone();
      greet.fontSize = 24;
      greet.point = new Point(-margin,(Math.sin(i*14.833)*0.3+0.5)*view.size.height);
      greet.content = greetz[i];
      greet.visible = false;
      greetTypos.push(greet);
    }
    delay(Globals.BEAT_DUR*loadingCircAmt*24, _=>{
      for(let i=0; i<greetTypos.length; i++){
        greetTypos[i].visible = true;
        greetTypos[i].tween(Globals.BEAT_DUR*loadingCircAmt*8).onUpdate = event => {
          let t = (Math.sin(i*46.861)*0.5+0.5 + event.factor)%1;
          t = (Math.sin(t*PI-PI/2))*0.5+0.5;
          t = (Math.sin(t*PI-PI/2))*0.5+0.5;
          let a = -margin, b = view.size.width+margin;
          let n = a+(b-a)*t;
          greetTypos[i].point.x = n;
          greetTypos[i].scaling = Math.max(0.0001, Math.sin((t-0.5)*2*PI/2+PI/2));
        };
      }
    });
    delay(Globals.BEAT_DUR*loadingCircAmt*(24+4), _=>{
      for(let i=0; i<packedSquares.length; i++){
        packedSquares[i].visible = true;
        let sq = packedSquares[i].clone({insert: false});
        let cr = new Path.Circle(packedSquares[i].bounds.center, packedSquares[i].bounds.width/2);
        packedSquares[i].tween(Globals.BEAT_DUR*loadingCircAmt*4).onUpdate = event => {
          let repeat = 5;
          let seed = ~~(event.factor*repeat)*547 + i*664;
          let t = (event.factor*repeat)%1;
          t = (t>0.5?1-t:t)*2;
          t = Math.sin(t*PI-PI/2)*0.5+0.5;
          if(Math.sin(463.692+seed*876.582)<.5) { t = 0; }
          packedSquares[i].interpolate(sq, cr, t);
        };
      }
    });

    view.draw();
	}
});