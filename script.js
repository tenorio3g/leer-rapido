let words = [];
let index = 0;
let isPaused = false;
let baseWPM = 300; // Velocidad inicial
let currentWPM = baseWPM;
let maxWPM = 600;  // Velocidad máxima
let increaseStep = 10; // Incremento por ciclo
let increaseEvery = 20; // Cada cuántos chunks subir velocidad

const inputText = document.getElementById("inputText");
const speedInput = document.getElementById("speed");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const resetBtn = document.getElementById("resetBtn");
const wordDisplay = document.getElementById("wordDisplay");

startBtn.addEventListener("click", startReading);
pauseBtn.addEventListener("click", pauseReading);
resumeBtn.addEventListener("click", resumeReading);
resetBtn.addEventListener("click", resetReading);

function startReading() {
  words = inputText.value.trim().split(/\s+/);
  index = 0;
  isPaused = false;
  baseWPM = parseInt(speedInput.value);
  currentWPM = baseWPM;
  showNextChunk();
}

function showNextChunk() {
  if (index >= words.length) {
    wordDisplay.textContent = "[FIN]";
    return;
  }

  if (isPaused) {
    setTimeout(showNextChunk, 200);
    return;
  }

  const chunk = getNextChunk();
  wordDisplay.textContent = chunk.join(' ');

  // Base delay en milisegundos por palabra
  let baseDelay = 60000 / currentWPM;

  // Ajusta por puntuación
  let lastWord = chunk[chunk.length - 1];
  let delayMultiplier = 1;

  if (/[,.!?]$/.test(lastWord)) {
    if (lastWord.endsWith(',')) {
      delayMultiplier = 1.3;
    } else {
      delayMultiplier = 1.6;
    }
  }

  // Cada X chunks, sube velocidad
  if (index % increaseEvery === 0 && currentWPM < maxWPM) {
    currentWPM += increaseStep;
    console.log(`Nueva WPM: ${currentWPM}`);
  }

  setTimeout(showNextChunk, baseDelay * delayMultiplier * chunk.length);
}

function getNextChunk() {
  const chunk = [];
  let maxChunkSize = 3; // Máximo palabras por bloque
  while (index < words.length && chunk.length < maxChunkSize) {
    chunk.push(words[index]);
    let last = words[index];
    index++;

    // Si la palabra termina en punto o coma, corta el chunk aquí
    if (/[,.!?]$/.test(last)) {
      break;
    }
  }
  return chunk;
}

function pauseReading() {
  isPaused = true;
}

function resumeReading() {
  isPaused = false;
}

function resetReading() {
  index = 0;
  currentWPM = baseWPM;
  wordDisplay.textContent = "";
}
