// Фильтрация списка Вадимов
function filterVadims() {
  const input = document.getElementById('search');
  const filter = input.value.toLowerCase();
  const list = document.getElementById('vadim-list');
  const items = list.getElementsByTagName('li');

  for (let i = 0; i < items.length; i++) {
    const txt = items[i].textContent.toLowerCase();
    items[i].style.display = txt.includes(filter) ? '' : 'none';
  }
}

// Добавление нового Вадима
function addVadim(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value;
  const city = document.getElementById('city').value.trim();
  const type = document.getElementById('type').value;

  // Проверка: не пытается ли пользователь добавить самого Вадима Шкова?
  const lowerName = name.toLowerCase();
  if (
    (lowerName.includes('школов') || lowerName.includes('shkolv')) &&
    dob === '2006-04-21'
  ) {
    alert('⚠️ Внимание!\n\nВадим Школов Вадим Алексеевич уже в базе как легендарный основатель. Добавление запрещено.');
    return;
  }

  const dateObj = new Date(dob);
  const formattedDate = dateObj.toLocaleDateString('ru-RU');

  const list = document.getElementById('vadim-list');
  const li = document.createElement('li');

  let typeLabel = 'Нормальный';
  let typeClass = '';

  if (type === 'cool') {
    typeLabel = 'Крутой';
    typeClass = 'cool';
  } else if (type === 'funny') {
    typeLabel = 'Странный';
    typeClass = 'funny';
  } else if (type === 'fictional') {
    typeLabel = 'Вымышленный';
    typeClass = 'funny';
  }

  li.innerHTML = `
    <strong>${name}</strong> — ${formattedDate}, ${city}
    <span class="tag ${typeClass}">${typeLabel}</span>
  `;

  list.appendChild(li);

  // Сброс формы
  document.getElementById('add-vadim-form').reset();

  alert(`Спасибо! Вадим "${name}" добавлен в базу.`);
}