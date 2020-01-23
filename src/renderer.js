// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron');
const namer = require('color-namer');
let active_color = undefined;

ipcRenderer.on("color", (event, arg) => {
  arg = JSON.parse(arg);
  let elColorSquares = document.getElementById("colorsquares");
  elColorSquares.innerHTML = "";
  let middle = Math.floor(Object.keys(arg).length / 2);
  Object.keys(arg).forEach(function(key, index) {
    let color_row = arg[key];
    let tr = document.createElement("tr");
    let o = 0;
    for(let k in color_row){
      let td = document.createElement("td");
      td.setAttribute("style","background: #"+color_row[k].color+";");
      if(middle == index && middle == o){
        td.classList.add("center");
        active_color = color_row[k].color;
        const hexColor = "#"+active_color.toUpperCase();
        document.getElementById("a").innerHTML = namer(hexColor, { pick: ['pantone'] }).pantone[0].name+": "+hexColor ;
      }
      tr.appendChild(td);
      o++;
    }
    elColorSquares.appendChild(tr);
  });
});

window.addEventListener("click", function(event) {
  console.log("user clicked");
  document.getElementById("a").innerHTML = "Copied";
  ipcRenderer.send("clicked", active_color);
});

window.addEventListener("keyup", function(event) {
  if(event.key === "Escape" || event.key === "Esc" || event.keyCode === 27){
    ipcRenderer.send("esc");
  }
  if(event.keyCode === 39){
    //right
    if(event.shiftKey){
      ipcRenderer.send("move-right", "shift");
    }
    else{
      ipcRenderer.send("move-right");
    }
  }
  if(event.keyCode === 37){
    //left
    if(event.shiftKey){
      ipcRenderer.send("move-left", "shift");
    }
    else{
      ipcRenderer.send("move-left");
    }
  }
  if(event.keyCode === 38){
    //up
    if(event.shiftKey){
      ipcRenderer.send("move-up", "shift");
    }
    else{
      ipcRenderer.send("move-up");
    }
  }
  if(event.keyCode === 40){
    //down
    if(event.shiftKey){
      ipcRenderer.send("move-down", "shift");
    }
    else{
      ipcRenderer.send("move-down");
    }
  }
  if (['-', 'Minus'].includes(event.code)) {
    //minus decreases loop size
    ipcRenderer.send("loop-size", "picker-decrease");
  }
  if (event.key == "+") {
    //plus Increase loop size
    ipcRenderer.send("loop-size", "picker-increase");
  }
});