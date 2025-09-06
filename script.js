// Firebase конфигурация — ЗАМЕНИ НА СВОЮ ИЗ КОНСОЛИ Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDp8Z-XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "vadimopedia.firebaseapp.com",
  databaseURL: "https://vadimopedia-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vadimopedia",
  storageBucket: "vadimopedia.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const vadimsRef = database.ref("vadims");

// Стандартные Вадимы (первый раз)
const defaultVadims = [
  {
    name: "Вадим Школов",
    dob: "21.04.2006",
    city: "Днепр, Украина",
    type: "cool",
    typeLabel: "Крутой"
  },
  {
    name: "Вадим Титов",
    dob: "1973-05-12",
    city: "Москва, Россия",
    type: "normal",
    typeLabel: "Музыкант"
  },
  {
    name: "Вадим Ревенко",
    dob: "1985-08-23",
    city: "Минск, Беларусь",
    type: "normal",
    typeLabel: "Учёный"
  },
  {
    name: "Вадим из племени венедов",
    dob: "0200-01-01",
    city: "Европа",
    type: "ancient",
    typeLabel: "Древний"
  }
];

// Проверка: заполнить базу, если пусто
vadimsRef.once("value", (snapshot) => {
  if (!snapshot.exists()) {
    vadimsRef.set(defaultVadims);
  }
});

// Отображение Вадимов
function renderVadims(snapshot) {
  const list = document.getElementById("vadim-list");
  list.innerHTML = "";

  const data = snapshot.val();
  if (!data) return;

  const vadims = Object.values(data);

  vadims.forEach(v => {
    const li = document.createElement("li");
    const date = new Date(v.dob);
    const formattedDate = isNaN(date.getTime()) ? v.dob : date.toLocaleDateString("ru-RU");

    let typeClass = "";
    if (v.type === "cool") typeClass = "cool";
    else if (v.type === "funny" || v.type === "fictional") typeClass = "funny";
    else if (v.type === "ancient") typeClass = "ancient";

    li.innerHTML = `
      <strong>${v.name}</strong> — ${formattedDate}, ${v.city}
      <span class="tag ${typeClass}">${v.typeLabel}</span>
    `;
    list.appendChild(li);
  });
}

// Слушаем изменения в реальном времени
vadimsRef.on("value", renderVadims);

// Фильтрация
function filterVadims() {
  const input = document.getElementById("search");
  const filter = input.value.toLowerCase();
  const list = document.getElementById("vadim-list");
  const items = list.getElementsByTagName("li");

  for (let i = 0; i < items.length; i++) {
    const txt = items[i].textContent.toLowerCase();
    items[i].style.display = txt.includes(filter) ? "" : "none";
  }
}

// Добавление нового Вадима
function addVadim(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value;
  const city = document.getElementById("city").value.trim();
  const type = document.getElementById("type").value;

  const lowerName = name.toLowerCase();
  if ((lowerName.includes("школов") || lowerName.includes("shkolv")) && dob === "2006-04-21") {
    alert('⚠️ Вадим Школов уже в базе. Добавление запрещено.');
    return;
  }

  let typeLabel = "Нормальный";
  if (type === "cool") typeLabel = "Крутой";
  else if (type === "funny") typeLabel = "Странный";
  else if (type === "fictional") typeLabel = "Вымышленный";

  const newVadim = { name, dob, city, type, typeLabel };

  vadimsRef.push(newVadim)
    .then(() => {
      document.getElementById("add-vadim-form").reset();
      alert(`✅ Вадим "${name}" добавлен ВСЕМ пользователям!`);
    })
    .catch(err => {
      alert("Ошибка: " + err.message);
    });
}

// Переключение вкладок
function showSection(section) {
  document.getElementById("quotes-section").style.display = "none";
  document.querySelector(".hero").style.display = "none";
  document.querySelector(".vadims-section").style.display = "none";
  document.querySelector(".add-section").style.display = "none";

  if (section === "quotes") {
    document.getElementById("quotes-section").style.display = "block";
  } else {
    document.querySelector(".hero").style.display = "flex";
    document.querySelector(".vadims-section").style.display = "block";
    document.querySelector(".add-section").style.display = "block";
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
  });
  document.querySelector(`.nav-link[onclick="showSection('${section}')"]`).classList.add("active");
}

// Случайная цитата
function showRandomQuote() {
  const quotes = document.querySelectorAll(".quotes-list blockquote");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  
  quotes.forEach(q => q.style.display = "none");
  quotes[randomIndex].style.display = "block";

  setTimeout(() => {
    quotes.forEach(q => q.style.display = "");
  }, 3000);
}

// Загрузка при старте
document.addEventListener("DOMContentLoaded", () => {
  showSection('home'); // Показать главную
});