//https://julien-decharentenay.medium.com/how-to-save-html-canvas-animation-as-a-video-421157c2203b
let mediaRecorder;
function initRender(paper) {
  paper.view.autoUpdate = false;
  let canvas = document.querySelector("#myCanvas");
  let chunks = [];
  mediaRecorder = new MediaRecorder(canvas.captureStream(30), { mimeType: "video/webm; codecs=h264" });
  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };
  mediaRecorder.onstop = () => {
    var blob = new Blob(chunks, {type: "video/webm" });
    const recording_url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style = "display: none;";
    a.href = recording_url;
    a.download = "elpapelyelautor-ciosai-flash24.webm";
    document.body.appendChild(a);
    a.click();
  };
}
function render(paper) {
  mediaRecorder.start();
  setInterval(_=>{
    paper.view.update();
  }, 1000/30);
  setTimeout(_=>{
    mediaRecorder.stop();    
  }, 
    1000*130
  );
}