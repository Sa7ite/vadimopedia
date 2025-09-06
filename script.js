// Firebase конфигурация — ЗАМЕНИ НА СВОЙ!
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

// Стандартные Вадимы
const defaultVadims = [
  { name: "Вадим Школов", dob: "21.04.2006", city: "Днепр, Украина", type: "cool", typeLabel: "Крутой" },
  { name: "Вадим Титов", dob: "1973-05-12", city: "Москва, Россия", type: "normal", typeLabel: "Музыкант" },
  { name: "Вадим Ревенко", dob: "1985-08-23", city: "Минск, Беларусь", type: "normal", typeLabel: "Учёный" },
  { name: "Вадим из племени венедов", dob: "0200-01-01", city: "Европа", type: "ancient", typeLabel: "Древний" }
];

// Проверка: заполнить базу при первом запуске
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
    li.innerHTML = `<strong>${v.name}</strong> — ${formattedDate}, ${v.city}`;
    list.appendChild(li);
  });
}

// Слушаем изменения
vadimsRef.on("value", renderVadims);

// Поиск (работает в реальном времени)
function filterVadims() {
  const input = document.getElementById("search");
  const filter = input.value.toLowerCase();
  const items = document.querySelectorAll("#vadim-list li");
  items.forEach(item => {
    const txt = item.textContent.toLowerCase();
    item.style.display = txt.includes(filter) ? "" : "none";
  });
}

// Добавление Вадима
function addVadim(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value;
  const city = document.getElementById("city").value.trim();
  const type = document.getElementById("type").value;

  // Защита: нельзя добавить Вадима Шкова повторно
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
      alert(`✅ Вадим "${name}" добавлен в базу!`);
    })
    .catch(err => {
      alert("Ошибка: " + err.message);
    });
}

// Переключение вкладок
function showSection(section) {
  document.getElementById("vadimism-section").style.display = "none";
  document.getElementById("popular-section").style.display = "none";
  document.querySelector(".hero").style.display = "none";
  document.querySelector(".vadims-section").style.display = "none";
  document.querySelector(".add-section").style.display = "none";

  if (section === "home") {
    document.querySelector(".hero").style.display = "flex";
    document.querySelector(".vadims-section").style.display = "block";
    document.querySelector(".add-section").style.display = "block";
  } else {
    document.getElementById(section + "-section").style.display = "block";
  }

  document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
  document.querySelector(`[onclick="showSection('${section}')"]`).classList.add("active");
}

// Популярные Вадимы
const details = {
  shkolv: {
    title: "Вадим Школов Вадим Алексеевич",
    img: "vadim-shkolv.jpg",
    text: "Основатель Вадимопедии, гений, философ. Родился 21.04.2006 в Днепре. Создал учение Вадимизма. Его слово — закон."
  },
  titov: {
    title: "Вадим Титов",
    img: "https://via.placeholder.com/150?text=Вадим+Титов",
    text: "Известный российский музыкант. Участник группы 'На-На'. Символ стиля и харизмы."
  },
  revchenko: {
    title: "Вадим Ревенко",
    img: "https://via.placeholder.com/150?text=Вадим+Ревенко",
    text: "Учёный-физик из Беларуси. Автор работ по квантовой механике. Постоянный участник международных конференций."
  },
  ancient: {
    title: "Вадим Венедский",
    img: "https://via.placeholder.com/150?text=Древний+Вадим",
    text: "Легендарный вождь венедов III века. Согласно летописям, восстал против тирании. Первый известный носитель имени 'Вадим'."
  }
};

function showDetail(id) {
  const d = details[id];
  document.getElementById("detail-title").textContent = d.title;
  document.getElementById("detail-img").src = d.img;
  document.getElementById("detail-text").textContent = d.text;
  document.getElementById("detail-modal").style.display = "flex";
}

function closeDetail() {
  document.getElementById("detail-modal").style.display = "none";
}

// Загрузка
document.addEventListener("DOMContentLoaded", () => {
  showSection('home');
});