const textarea = document.querySelector("textarea"),
  voicelist = document.querySelector("select"),
  resetbtn = document.getElementById("reset"),
  countdownDisplay = document.getElementById("countdown-display");

let synth = speechSynthesis;
let isSpeaking = true;
let timeout;
let countdownTimer;

synth.addEventListener("voiceschanged", voiceSpeech);

function voiceSpeech() {
  const voices = synth.getVoices();
  const arabicVoice = voices.find(voice => voice.name.toLowerCase().includes("rana") && voice.lang === "ar-IQ");

  if (arabicVoice) {
    let option = `<option value="${arabicVoice.name}" selected>${arabicVoice.name} (${arabicVoice.lang})</option>`;
    voicelist.innerHTML = '';
    voicelist.insertAdjacentHTML("beforeend", option);
  } else {
    console.log('Microsoft Rana voice not available');
  }
}

function textToSpeech(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = synth.getVoices().find(voice => voice.name === voicelist.value);

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    synth.speak(utterance);
  }
}

function startCountdown() {
  let countdown = 5;
  countdownDisplay.textContent = countdown;

  countdownTimer = setInterval(() => {
    countdown--;
    countdownDisplay.textContent = countdown;

    if (countdown <= 0) {
      clearInterval(countdownTimer);
      if (textarea.value.trim() !== "") {
        textToSpeech(textarea.value);
      }
    }
  }, 1000);
}

function detectLanguage(text) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

textarea.addEventListener("input", () => {
  clearTimeout(timeout);
  clearInterval(countdownTimer);

  if (detectLanguage(textarea.value)) {
    textarea.setAttribute("dir", "rtl");
  } else {
    textarea.setAttribute("dir", "ltr");
  }

  timeout = setTimeout(() => {
    startCountdown();
  }, 500);
});

resetbtn.addEventListener("click", (event) => {
  event.preventDefault();
  resetEverything();
});

function resetEverything() {
  synth.cancel();
  isSpeaking = true;
  textarea.value = "";
  countdownDisplay.textContent = "5";
  resetbtn.style.display = "none";
}

document.getElementById("year").textContent = new Date().getFullYear();
