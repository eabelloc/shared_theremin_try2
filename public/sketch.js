/*Oscillator Method*/
let osc1;
let osc2;
let setVolume1;
let setVolume2;
let selectType1, selectType2, bgColor;
let fft;
let socket;
let otherUserWaveform = [];
let audioContextStarted = false;

// myOscillator.amp(0.1);

function setup() {
  createCanvas(900, 480);
  
  /*OSCILLATOR 1*/  
  /*Select oscillator type*/
  
  osc1 = new p5.Oscillator()
  
  osc1 = new p5.Oscillator();
  selectType1 = createSelect();
  selectType1.position(630, 620);
  selectType1.option('sine');
  selectType1.option('triangle');
  selectType1.option('sawtooth');
  selectType1.option('square');
  selectType1.changed(updateOscillatorType1);
  
  setVolume1 = createSlider(0, 1, 0.1, 0).position(630, 640);
  setVolume1.input(updateOscillatorVolume1);
  
  /*OSCILLATOR 2*/
  /*Select oscillator type*/
  
  osc2 = new p5.Oscillator()
  
  osc2 = new p5.Oscillator();
  selectType2 = createSelect();
  selectType2.position(780, 620);
  selectType2.option('sine');
  selectType2.option('triangle');
  selectType2.option('sawtooth');
  selectType2.option('square');
  selectType2.changed(updateOscillatorType2);
  
  setVolume2 = createSlider(0, 1, 0.1, 0).position(780, 640);
  setVolume2.input(updateOscillatorVolume2);
  
  
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

function updateOscillatorType1() {
  const oscillatorType = selectType1.value();
  osc1.setType(oscillatorType);
  sendWaveformData(); // Send the updated data to the server
}

function updateOscillatorVolume1() {
  const volume = setVolume1.value();
  osc1.amp(volume, 0.01);
  sendWaveformData(); // Send the updated data to the server
}

function updateOscillatorType2() {
  const oscillatorType = selectType2.value();
  osc2.setType(oscillatorType);
  sendWaveformData(); // Send the updated data to the server
}

function updateOscillatorVolume2() {
  const volume = setVolume2.value();
  osc2.amp(volume, 0.01);
  sendWaveformData(); // Send the updated data to the server
}

// Function to send waveform data to the server
function sendWaveformData() {
  const waveform = fft.waveform();
  const data = { waveform };
  socket.emit('waveformData', data);
}

function draw() { 

 // Check if the mouse is inside the canvas
 if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
  // Calculate the background color based on the mouse position
  let r = map(mouseX, 0, width, 0, 255);
  let g = map(mouseY, 0, height, 0, 255);
  let b = map(mouseX + mouseY, 0, width + height, 255, 0);

  bgColor = color(r, g, b);

  // Set the background color
  background(bgColor);
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
  beginShape();
  strokeWeight(5);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
}


function mousePressedInsideCanvas() {
  if (document.activeElement === document.querySelector('canvas')) {
    if (!audioContextStarted) {
      getAudioContext().resume().then(() => {
        console.log('Audio context started.');
        audioContextStarted = true;
        osc1.start();
        osc2.start();
      });
    }
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    // Inside the canvas, start the oscillators
    if (!audioContextStarted) {
      getAudioContext().resume().then(() => {
        console.log('Audio context started.');
        audioContextStarted = true;
        osc1.start();
        osc2.start();
      });
    }
  }
}

function mouseReleased() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    // Inside the canvas, stop the oscillators
    if (audioContextStarted) {
      osc1.stop();
      osc2.stop();
      audioContextStarted = false; // Reset the audio context flag
    }
  }
}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

