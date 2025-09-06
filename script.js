// Firebase конфигурация — твой!
const firebaseConfig = {
  apiKey: "AIzaSyBq1BglnwEogeSM9z5EvqoUkCY-zC8pHG4",
  authDomain: "vadimopedia.firebaseapp.com",
  databaseURL: "https://vadimopedia-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vadimopedia",
  storageBucket: "vadimopedia.firebasestorage.app",
  messagingSenderId: "1039495553835",
  appId: "1:1039495553835:web:167a83b24d608658e3db6e",
  measurementId: "G-Q3YV9RQY0Z"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const vadimsRef = database.ref("vadims");

// Отображение Вадимов с тегами и описанием
function renderVadims(snapshot) {
  const list = document.getElementById("vadim-list");
  list.innerHTML = "";
  const data = snapshot.val();
  if (!data) return;
  const vadims = Object.values(data);
  vadims.forEach(v => {
    const li = document.createElement("li");

    // Форматируем дату
    const date = new Date(v.dob);
    const formattedDate = isNaN(date.getTime()) ? v.dob : date.toLocaleDateString("ru-RU");

    // Генерируем теги
    const tags = [];
    if (v.type === "cool") tags.push("Крутой");
    if (v.type === "normal") tags.push("Средний");
    if (v.type === "funny") tags.push("Странный");
    if (v.type === "fictional") tags.push("Вымышленный");

    const lowerName = v.name.toLowerCase();
    if (lowerName.includes("школов") || lowerName.includes("shkolv")) {
      tags.push("Известный", "Гений");
    }
    if (lowerName.includes("титов")) tags.push("Музыкант");
    if (lowerName.includes("ревенко")) tags.push("Учёный");
    if (lowerName.includes("венедск")) tags.push("Древний");
    if (v.city) tags.push(v.city);

    const tagsHTML = tags.map(tag => `<span class="badge">${tag}</span>`).join("");

    // Описание
    const descHTML = v.description ? `<div class="description">${v.description}</div>` : '';

    li.innerHTML = `
      <strong>${v.name}</strong> — ${formattedDate}<br>
      <div class="tags">${tagsHTML}</div>
      ${descHTML}
    `;
    list.appendChild(li);
  });
}

// Слушаем изменения
vadimsRef.on("value", renderVadims);

// Поиск
function filterVadims() {
  const input = document.getElementById("search");
  const filter = input.value.toLowerCase();
  const items = document.querySelectorAll("#vadim-list li");
  items.forEach(item => {
    const txt = item.textContent.toLowerCase();
    item.style.display = txt.includes(filter) ? "" : "none";
  });
}

// Добавление / обновление Вадима
function addVadim(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value;
  const city = document.getElementById("city").value.trim();
  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value.trim();

  if (!name || !dob || !city) {
    alert("⚠️ Заполните обязательные поля");
    return;
  }

  // Сначала ищем, есть ли уже такой Вадим
  vadimsRef.orderByChild("name").equalTo(name).once("value", (snapshot) => {
    if (snapshot.exists()) {
      // Нашли — обновляем (даже если это Вадим Школов)
      const key = Object.keys(snapshot.val())[0];
      vadimsRef.child(key).update({
        dob, city, type, 
        typeLabel: type === "cool" ? "Крутой" : 
                  type === "funny" ? "Странный" : 
                  type === "fictional" ? "Вымышленный" : "Средний",
        description
      }).then(() => {
        alert(`✅ Обновлено: ${name}`);
        document.getElementById("add-vadim-form").reset();
      }).catch(err => {
        alert("❌ Ошибка при обновлении: " + err.message);
      });
    } else {
      // Нет в базе — проверяем, не пытаемся ли добавить Вадима Шкова
      const lowerName = name.toLowerCase();
      if ((lowerName.includes("школов") || lowerName.includes("shkolv")) && dob === "2006-04-21") {
        alert('⚠️ Новый Вадим Школов не может быть добавлен — он уже в базе. Но можно обновить его через форму.');
        return;
      }

      // Добавляем нового Вадима
      vadimsRef.push({
        name, dob, city, type,
        typeLabel: type === "cool" ? "Крутой" : 
                  type === "funny" ? "Странный" : 
                  type === "fictional" ? "Вымышленный" : "Средний",
        description
      }).then(() => {
        alert(`✅ Добавлен: ${name}`);
        document.getElementById("add-vadim-form").reset();
      }).catch(err => {
        alert("❌ Ошибка при добавлении: " + err.message);
      });
    }
  });
}

// Переключение вкладок
function showSection(section) {
  const sections = ['all-vadims', 'history', 'vadimism', 'popular'];
  sections.forEach(sec => {
    const el = document.getElementById(`${sec}-section`);
    if (el) el.style.display = 'none';
  });

  if (section !== 'home') {
    document.querySelector('.hero').style.display = 'none';
  } else {
    document.querySelector('.hero').style.display = 'flex';
  }

  const target = document.getElementById(`${section}-section`);
  if (target) {
    target.style.display = 'block';
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  const activeLink = document.querySelector(`[onclick="showSection('${section}')"]`);
  if (activeLink) activeLink.classList.add('active');
}

// Популярные Вадимы
const details = {
  shkolv: {
    title: "Вадим Школов Вадим Алексеевич",
    img: "img/vadim-shkolv.jpg",
    text: "Основатель Вадимопедии, гений, философ. Родился 21.04.2006 в Днепре. Создал учение Вадимизма. Его слово — закон."
  },
  titov: {
    title: "Вадим Титов",
    img: "img/vadim-titov.jpg",
    text: "Известный российский музыкант. Участник группы 'На-На'. Символ стиля и харизмы."
  },
  revchenko: {
    title: "Вадим Ревенко",
    img: "img/vadim-revchenko.jpg",
    text: "Учёный-физик из Беларуси. Автор работ по квантовой механике. Постоянный участник международных конференций."
  },
  ancient: {
    title: "Вадим Венедский",
    img: "img/vadim-ancient.jpg",
    text: "Легендарный вождь венедов III века. Восстал против тирании. Первый известный носитель имени 'Вадим'."
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

function closeDetailIfClickOnOverlay(event) {
  if (event.target === document.getElementById("detail-modal")) {
    closeDetail();
  }
}

// Загрузка
document.addEventListener("DOMContentLoaded", () => {
  showSection('home');
});