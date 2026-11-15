const wordInput = document.querySelector("#word");
const translationInput = document.querySelector("#translation");
const addButton = document.querySelector("button");

const wordList = document.createElement("ul");
document.querySelector("main").appendChild(wordList);

// Загружаем ранее сохранённые слова.
const words = JSON.parse(localStorage.getItem("words") || "[]");

// Показываем одно слово на странице.
function showWord(word, translation) {
  const item = document.createElement("li");
  item.textContent = word + " — " + translation;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Удалить";
  deleteButton.type = "button";
  deleteButton.className = "delete-button";

  deleteButton.addEventListener("click", function () {
    const index = Array.from(wordList.children).indexOf(item);

    words.splice(index, 1);
    localStorage.setItem("words", JSON.stringify(words));
    item.remove();

    // Закрываем тренировку, если словарь изменился.
    training.hidden = true;
    selectedWord = null;
    wordList.hidden = false;
  });
const editButton = document.createElement("button");
editButton.textContent = "Изменить";
editButton.type = "button";
editButton.className = "delete-button";

editButton.addEventListener("click", function () {
  const index = Array.from(wordList.children).indexOf(item);
  const entry = words[index];

  const newTranslation = prompt(
    "Новый перевод для слова " + entry.word + ":",
    entry.translation
  );

  if (newTranslation === null) {
    return;
  }

  const cleanedTranslation = newTranslation.trim();

  if (cleanedTranslation === "") {
    alert("Перевод не должен быть пустым.");
    return;
  }

  entry.translation = cleanedTranslation;
  localStorage.setItem("words", JSON.stringify(words));

  // Обновляем текст, сохраняя кнопки.
  item.firstChild.textContent =
    entry.word + " — " + entry.translation;

  training.hidden = true;
  selectedWord = null;
  summary.hidden = true;
  wordList.hidden = false;

  // Повторно применяем поиск после изменения перевода.
  searchInput.dispatchEvent(new Event("input"));
});

item.appendChild(editButton);
  item.appendChild(deleteButton);
  wordList.appendChild(item);
}
// Показываем все сохранённые слова.
words.forEach(function (item) {
  showWord(item.word, item.translation);
});

// Добавляем новое слово при нажатии кнопки.
addButton.addEventListener("click", function () {
  const word = wordInput.value.trim();
  const translation = translationInput.value.trim();

  if (word === "" || translation === "") {
    alert("Введи и английское слово, и перевод.");
    return;
  }
const alreadyExists = words.some(function (item) {
  return item.word.toLowerCase() === word.toLowerCase();
});

if (alreadyExists) {
  alert("Это слово уже есть в словаре.");
  return;
}
  words.push({ word: word, translation: translation });

  localStorage.setItem("words", JSON.stringify(words));

  showWord(word, translation);

  wordInput.value = "";
  translationInput.value = "";
  wordInput.focus();
});
const trainButton = document.querySelector("#train-button");
const training = document.querySelector("#training");
const questionWord = document.querySelector("#question-word");
const answerInput = document.querySelector("#answer");
const checkButton = document.querySelector("#check-button");
const nextButton = document.querySelector("#next-button");
const result = document.querySelector("#result");

let selectedWord = null;
const trainingMode = document.querySelector("#training-mode");
let questionMode = "en-ru";
const score = document.querySelector("#score");
let correctCount = 0;
let answerCount = 0;
let mistakenWords = [];
let trainingWords = words;
function nextQuestion() {
  const availableWords = trainingWords.filter(function (item) {
  return item.word.toLowerCase() !==
    (selectedWord?.word || "").toLowerCase();
});

const choices = availableWords.length > 0 ? availableWords : trainingWords;

const randomIndex = Math.floor(Math.random() * choices.length);
selectedWord = choices[randomIndex];

  questionMode = trainingMode.value;
  speakButton.hidden = questionMode === "ru-en";

if (questionMode === "en-ru") {
  questionWord.textContent = selectedWord.word;
  answerInput.placeholder = "Введи перевод на русский";
} else {
  questionWord.textContent = selectedWord.translation;
  answerInput.placeholder = "Введи слово на английском";
}
  answerInput.value = "";
  result.textContent = "";
  checkButton.disabled = false;
  answerInput.focus();
}

trainButton.addEventListener("click", function () {
    trainingWords = words;
  if (words.length === 0) {
    alert("Сначала добавь хотя бы одно слово в словарь.");
    return;
  }
  summary.hidden = true
  training.hidden = false;
  correctCount = 0;
answerCount = 0;
score.textContent = "Верно: 0 из 0";
mistakenWords = []
  wordList.hidden = true;
  nextQuestion();
});

function checkAnswer() {
  if (selectedWord === null || checkButton.disabled) {
    return;
  }

  const answer = answerInput.value.trim().toLowerCase();
  const expectedAnswer = questionMode === "en-ru"
  ? selectedWord.translation
  : selectedWord.word;

const correctAnswer = expectedAnswer.trim().toLowerCase();

  if (answer === "") {
    result.textContent = "Сначала введи перевод.";
    result.style.color = "#b5bbd3";
    return;
  }
answerCount = answerCount + 1;
  if (answer === correctAnswer) {
    correctCount = correctCount +1;
    result.textContent = "Правильно! 🎉";
    result.style.color = "#86efac";
  } else {
    if (!mistakenWords.includes(selectedWord)) {
  mistakenWords.push(selectedWord);
}
    result.textContent = "Правильный ответ: " + expectedAnswer;
    result.style.color = "#fda4af";
  }

  checkButton.disabled = true;
  speakButton.hidden = false;
  score.textContent = "Верно: " + correctCount + " из " + answerCount;
}

checkButton.addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", function (event) {
  if (event.key !== "Enter" || event.repeat || event.isComposing) {
    return;
  }

  event.preventDefault();

  if (checkButton.disabled) {
    nextQuestion();
  } else {
    checkAnswer();
  }
});

nextButton.addEventListener("click", nextQuestion);
const summary = document.querySelector("#summary");
const summaryPercent = document.querySelector("#summary-percent");
const summaryDetails = document.querySelector("#summary-details");
const restartButton = document.querySelector("#restart-button");
const finishButton = document.querySelector("#finish-button");

finishButton.addEventListener("click", function () {
  training.hidden = true;
  wordList.hidden = false;
  selectedWord = null;

  if (answerCount > 0) {
    const percent = Math.round(correctCount / answerCount * 100);

    summaryPercent.textContent = percent + "%";
    summaryDetails.textContent =
      "Правильных ответов: " + correctCount + " из " + answerCount;
  } else {
    summaryPercent.textContent = "—";
    summaryDetails.textContent = "Ты пока не ответил ни на один вопрос.";
  }

  summary.hidden = false;
  summary.scrollIntoView({ behavior: "smooth", block: "center" });
});
restartButton.addEventListener("click", function () {
  trainButton.click();
});
const searchInput = document.querySelector("#search-word");
const searchMessage = document.createElement("p");
searchMessage.textContent = "Ничего не найдено. Попробуй другое слово.";
searchMessage.className = "note";
searchMessage.hidden = true;

wordList.after(searchMessage);
searchInput.addEventListener("input", function () {
  const query = searchInput.value.trim().toLowerCase();

  Array.from(wordList.children).forEach(function (item, index) {
    const entry = words[index];

    const matches =
      entry.word.toLowerCase().includes(query) ||
      entry.translation.toLowerCase().includes(query);

    item.style.display = matches ? "" : "none";
  });
});
const exportButton = document.querySelector("#export-button");

exportButton.addEventListener("click", function () {
  const data = JSON.stringify(words, null, 2);

  const file = new Blob([data], {
    type: "application/json"
  });

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "my-english-words.json";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 1000);
});
const importInput = document.querySelector("#import-file");

importInput.addEventListener("change", async function () {
  const file = importInput.files[0];

  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const importedWords = JSON.parse(text);

    // Проверяем, что файл содержит слова и переводы.
    const isValid =
      Array.isArray(importedWords) &&
      importedWords.every(function (item) {
        return (
          item !== null &&
          typeof item === "object" &&
          typeof item.word === "string" &&
          typeof item.translation === "string" &&
          item.word.trim() !== "" &&
          item.translation.trim() !== ""
        );
      });

    if (!isValid) {
      alert("Этот файл не похож на копию нашего словаря.");
      return;
    }

    const mergedWords = [...words];
    let addedCount = 0;

    importedWords.forEach(function (item) {
      const word = item.word.trim();
      const translation = item.translation.trim();

      const exists = mergedWords.some(function (savedWord) {
        return savedWord.word.toLowerCase() === word.toLowerCase();
      });

      if (!exists) {
        mergedWords.push({ word: word, translation: translation });
        addedCount = addedCount + 1;
      }
    });

    // Сначала сохраняем, затем обновляем страницу.
    localStorage.setItem("words", JSON.stringify(mergedWords));

    alert("Добавлено новых слов: " + addedCount);
    window.location.reload();
  } catch (error) {
    alert("Не удалось загрузить словарь. Проверь файл и попробуй ещё раз.");
  } finally {
    importInput.value = "";
  }
});
wordInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    translationInput.focus();
  }
});

translationInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addButton.click();
  }
});
const speakButton = document.querySelector("#speak-button");

speakButton.addEventListener("click", function () {
  if (selectedWord === null) {
    return;
  }

  if (!("speechSynthesis" in window)) {
    alert("В этом браузере озвучивание недоступно.");
    return;
  }

  const speech = new SpeechSynthesisUtterance(selectedWord.word);
  speech.lang = "en-US";
  speech.rate = 0.85;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
});
const dictionaryCount = document.querySelector("#dictionary-count");

function updateDictionaryCount() {
  dictionaryCount.textContent = "Слов в словаре: " + words.length;
}

// Показываем количество сразу после открытия страницы.
updateDictionaryCount();

// Обновляем счётчик, когда записи добавляются или удаляются.
const dictionaryObserver = new MutationObserver(function () {
  updateDictionaryCount();
});

dictionaryObserver.observe(wordList, {
  childList: true
});
function updateSearchMessage() {
  const hasQuery = searchInput.value.trim() !== "";

  const hasVisibleWords = Array.from(wordList.children).some(
    function (item) {
      return item.style.display !== "none";
    }
  );

  searchMessage.hidden =
    !hasQuery || hasVisibleWords || wordList.hidden;
}

searchInput.addEventListener("input", updateSearchMessage);

const searchObserver = new MutationObserver(updateSearchMessage);

searchObserver.observe(wordList, {
  childList: true,
  attributes: true,
  attributeFilter: ["hidden"]
});
const mistakesButton = document.querySelector("#mistakes-button");

finishButton.addEventListener("click", function () {
  mistakesButton.hidden = mistakenWords.length === 0;
});

mistakesButton.addEventListener("click", function () {
  if (mistakenWords.length === 0) {
    return;
  }

  // Берём копию ошибок предыдущей тренировки.
  trainingWords = [...mistakenWords];

  // Начинаем новый подсчёт результатов и ошибок.
  mistakenWords = [];
  correctCount = 0;
  answerCount = 0;
  selectedWord = null;
  score.textContent = "Верно: 0 из 0";

  summary.hidden = true;
  training.hidden = false;
  wordList.hidden = true;

  nextQuestion();
  training.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});