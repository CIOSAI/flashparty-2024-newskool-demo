//https://julien-decharentenay.medium.com/how-to-save-html-canvas-animation-as-a-video-421157c2203b
function render(paper) {
  paper.view.autoUpdate = false;
  let canvas = document.querySelector("#myCanvas");
  let chunks = [];
  let mediaRecorder = new MediaRecorder(canvas.captureStream(), { mimeType: "video/mp4; codecs=h264" });
  mediaRecorder.start();
  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };
  mediaRecorder.onstop = () => {
    var blob = new Blob(chunks, {type: "video/mp4" });
    const recording_url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style = "display: none;";
    a.href = recording_url;
    a.download = "elpapelyelautor-ciosai-flash24.mp4";
    document.body.appendChild(a);
    a.click();
  };
  setInterval(_=>{
    paper.view.update();
  }, 1000/60);
  setTimeout(_=>{
    mediaRecorder.stop();    
  }, 
    // 1000*130
    1000*5
  );
}