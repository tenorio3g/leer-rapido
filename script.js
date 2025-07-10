let words = [];
let index = 0;
let interval = null;
let isPaused = false;

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
  const wpm = parseInt(speedInput.value);
  const intervalTime = 60000 / wpm;

  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    if (!isPaused && index < words.length) {
      wordDisplay.textContent = words[index];
      index++;
    } else if (index >= words.length) {
      clearInterval(interval);
    }
  }, intervalTime);
}

function pauseReading() {
  isPaused = true;
}

function resumeReading() {
  isPaused = false;
}

function resetReading() {
  clearInterval(interval);
  index = 0;
  wordDisplay.textContent = "";
}
