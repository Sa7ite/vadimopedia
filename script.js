const firebaseConfig = {
  apiKey: "AIzaSyBq1BglnwEogeSM9z5EvqoUkCY-zC8pHG4",
  authDomain: "vadimopedia.firebaseapp.com",
  projectId: "vadimopedia",
  storageBucket: "vadimopedia.firebasestorage.app",
  messagingSenderId: "1039495553835",
  appId: "1:1039495553835:web:167a83b24d608658e3db6e",
  measurementId: "G-Q3YV9RQY0Z"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const vadimsRef = database.ref("vadims");

const defaultVadims = [
  { name: "Вадим Школов", dob: "21.04.2006", city: "Днепр, Украина", type: "cool", typeLabel: "Крутой" },
  { name: "Вадим Титов", dob: "1973-05-12", city: "Москва, Россия", type: "normal", typeLabel: "Музыкант" },
  { name: "Вадим Ревенко", dob: "1985-08-23", city: "Минск, Беларусь", type: "normal", typeLabel: "Учёный" },
  { name: "Вадим из племени венедов", dob: "0200-01-01", city: "Европа", type: "ancient", typeLabel: "Древний" }
];

vadimsRef.once("value", (snapshot) => {
  if (!snapshot.exists()) vadimsRef.set(defaultVadims);
});

function renderVadims(snapshot) {
  const list = document.getElementById("vadim-list");
  list.innerHTML = "";
  const data = snapshot.val();
  if (!data) return;
  const vadims = Object.values(data);
  vadims.forEach(v => {
    const date = new Date(v.dob);
    const formattedDate = isNaN(date.getTime()) ? v.dob : date.toLocaleDateString("ru-RU");
    const li = document.createElement("li");
    li.innerHTML = `<strong>${v.name}</strong> — ${formattedDate}, ${v.city}`;
    list.appendChild(li);
  });
}

vadimsRef.on("value", renderVadims);

function filterVadims() {
  const filter = document.getElementById("search").value.toLowerCase();
  const items = document.querySelectorAll("#vadim-list li");
  items.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(filter) ? "" : "none";
  });
}

function addVadim(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value;
  const city = document.getElementById("city").value.trim();
  const type = document.getElementById("type").value;

  const lowerName = name.toLowerCase();
  if ((lowerName.includes("школов") || lowerName.includes("shkolv")) && dob === "2006-04-21") {
    alert('⚠️ Вадим Школов уже в базе.');
    return;
  }

  const typeLabel = { cool: "Крутой", funny: "Странный", fictional: "Вымышленный" }[type] || "Нормальный";
  vadimsRef.push({ name, dob, city, type, typeLabel })
    .then(() => {
      document.getElementById("add-vadim-form").reset();
      alert(`✅ Добавлен: ${name}`);
    });
}

// Переключение вкладок
function showSection(section) {
  ["quotes-section", "vadimism-section", "popular-section", "memes-section"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
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

// Цитаты
function showRandomQuote() {
  const quotes = document.querySelectorAll(".quotes-list blockquote");
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quotes.forEach(q => q.style.display = "none");
  random.style.display = "block";
  setTimeout(() => quotes.forEach(q => q.style.display = ""), 3000);
}

// Мемы
const memes = [
  "https://i.imgflip.com/7q5c36.jpg",
  "https://i.imgflip.com/3qxqhr.jpg",
  "https://i.imgflip.com/4t8a5j.jpg",
  "https://i.imgflip.com/56gk3q.jpg",
  "https://i.imgflip.com/6x4j4z.jpg"
];

function showRandomMeme() {
  document.getElementById("meme-img").src = memes[Math.floor(Math.random() * memes.length)];
}

// Популярные
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

document.addEventListener("DOMContentLoaded", () => showSection('home'));