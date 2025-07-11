let words = [];
let index = 0;
let isPaused = false;
let baseWPM = 300;
let currentWPM = baseWPM;
let maxWPM = 600;
let increaseStep = 10;
let increaseEvery = 20;

const inputText = document.getElementById("inputText");
const speedInput = document.getElementById("speed");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const resetBtn = document.getElementById("resetBtn");
const wordDisplay = document.getElementById("wordDisplay");
const speedDisplay = document.getElementById("speedDisplay");
const overlay = document.getElementById("overlay");

window.onload = () => {
  document.getElementById('floatingScreen').classList.add('hidden');
  document.querySelector('.controls').classList.remove('hidden');
  inputText.classList.remove('hidden');
  overlay.classList.add('hidden');

  if (localStorage.getItem("savedText")) {
    inputText.value = localStorage.getItem("savedText");
  }
  if (localStorage.getItem("savedWPM")) {
    speedInput.value = localStorage.getItem("savedWPM");
  }
};

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

  localStorage.setItem("savedText", inputText.value);
  localStorage.setItem("savedWPM", baseWPM);

  updateSpeedDisplay();

  document.querySelector('.controls').classList.add('hidden');
  inputText.classList.add('hidden');
  document.getElementById('floatingScreen').classList.remove('hidden');
  overlay.classList.remove('hidden');

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

  let baseDelay = 60000 / currentWPM;
  let lastWord = chunk[chunk.length - 1];
  let delayMultiplier = 1;

  if (/[,.!?]$/.test(lastWord)) {
    if (lastWord.endsWith(',')) {
      delayMultiplier = 1.3;
    } else {
      delayMultiplier = 1.6;
    }
  }

  if (index % increaseEvery === 0 && currentWPM < maxWPM) {
    currentWPM += increaseStep;
  }

  updateSpeedDisplay();

  setTimeout(showNextChunk, baseDelay * delayMultiplier * chunk.length);
}

function getNextChunk() {
  const chunk = [];
  let maxChunkSize = 3;

  while (index < words.length && chunk.length < maxChunkSize) {
    let word = words[index];
    chunk.push(word);
    index++;

    if (/[,.!?]$/.test(word)) {
      break;
    }

    if (index < words.length && isConnector(words[index])) {
      chunk.push(words[index]);
      index++;
    }
  }
  return chunk;
}

function isConnector(word) {
  const connectors = ["de", "la", "el", "en", "y", "a", "con", "por", "para", "que", "del"];
  return connectors.includes(word.toLowerCase());
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
  updateSpeedDisplay();

  document.querySelector('.controls').classList.remove('hidden');
  inputText.classList.remove('hidden');
  document.getElementById('floatingScreen').classList.add('hidden');
  overlay.classList.add('hidden');
}

function updateSpeedDisplay() {
  speedDisplay.textContent = `Velocidad actual: ${Math.round(currentWPM)} WPM`;
}
