/*Oscillator Method*/
let osc1;
let osc2;
let setVolume1;
let setVolume2;
let selectType, bgColor;
let fft;
let socket;
let otherUserWaveform = [];

// myOscillator.amp(0.1);

function setup() {
  createCanvas(1000, 550);
  
  /*OSCILLATOR 1*/  
  /*Select oscillator type*/
  
  osc1 = new p5.Oscillator()
  
  selectType = createSelect();
  selectType.position(30, 560);
  selectType.option('sine');
  selectType.option('triangle');
  selectType.option('sawtooth');
  selectType.option('square');
  selectType.changed(function () {
    osc1.setType(selectType.value());
    fill(selectType.value());
  });
  
  setVolume1 = createSlider(0, 1, 0.1, 0).position(30, 580);
  setVolume1.input(function () {
    osc1.amp(setVolume1.value(), 0.01)
  });
  
  /*OSCILLATOR 2*/
  /*Select oscillator type*/
  
  osc2 = new p5.Oscillator()
  
  selectType = createSelect();
  selectType.position(200, 560);
  selectType.option('sine');
  selectType.option('triangle');
  selectType.option('sawtooth');
  selectType.option('square');
  selectType.changed(function () {
    osc2.setType(selectType.value());
    fill(selectType.value());
  });
  
  setVolume2 = createSlider(0, 1, 0.1, 0).position(200, 580);
  setVolume2.input(function () {
    osc2.amp(setVolume1.value(), 0.01)
  });
  
  
  /*FFT FOR WAVEFORM*/
  fft = new p5.FFT();
  bgColor = color(100);
  noStroke();

  // Connect to the Socket.IO server
  socket = io.connect();
  
  // Listen for waveform data from the server and update the local canvas
  socket.on('waveformData', (data) => {
    otherUserWaveform = data.waveform;
  });

  // Send initial waveform data to the server
  sendWaveformData();
}

// Function to send waveform data to the server
function sendWaveformData() {
  const waveform = fft.waveform();
  const data = { waveform };
  socket.emit('waveformData', data);
}

function draw() { 
  
  background(bgColor);
  if(osc1.getType() == 'sine') {
    bgColor = color(64, 224, 208)
  } if (osc1.getType() == 'triangle') {
    bgColor = color(34, 139, 34)
  } if (osc1.getType() == 'sawtooth') {
    bgColor = color(255,105,180)
  } if (osc1.getType() == 'square') {
    bgColor = color(91,51, 255)
  }
  
  /*Wave Shape*/
  let myWaveform = fft.waveform();
  beginShape();
  strokeWeight(5);
  for (let i = 0; i < myWaveform.length; i++) {
    let x = map(i, 0, myWaveform.length, 0, width);
    let y = map(myWaveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
  
  /*OSCILLATOR 1*/  
  /*change oscillator frequency based on the coordinates of mouseX*/
  let osc1Freq = map(mouseX, 0, width, 180, 880);
  osc1.freq(osc1Freq);
  
  /*OSCILLATOR 2*/
  let osc2Freq = map(mouseY, 0, width, 180, 880);
  osc2.freq(osc2Freq);

  const data = {
    osc1Type: osc1.getType(),
    osc1Volume: setVolume1.value(),
    osc2Type: osc2.getType(),
    osc2Volume: setVolume2.value(),
  };
  socket.emit('oscillatorData', data);

  sendWaveformData();
  // Only draw the other user's waveform on the canvas
  drawWaveform(otherUserWaveform);
  
}

function drawWaveform(waveform) {
  // Draw the waveform on the canvas
  background(bgColor);
  if (osc1.getType() == 'sine') {
    bgColor = color(64, 224, 208);
  } else if (osc1.getType() == 'triangle') {
    bgColor = color(34, 139, 34);
  } else if (osc1.getType() == 'sawtooth') {
    bgColor = color(255, 105, 180);
  } else if (osc1.getType() == 'square') {
    bgColor = color(91, 51, 255);
  }

  beginShape();
  strokeWeight(5);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume(); // Corrected the function call here
  }
}

function mousePressed() {
  osc1.start();
  osc2.start();
}

function mouseReleased() {
  osc1.stop();
  osc2.stop();
}