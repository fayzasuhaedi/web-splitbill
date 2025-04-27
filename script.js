let menuList = [];
let people = [];

function formatRupiah(value) {
  return "Rp" + value.toLocaleString("id-ID");
}

function addMenu() {
  const name = document.getElementById("menuName").value.trim();
  const price = parseInt(document.getElementById("menuPrice").value);

  if (!name || isNaN(price)) {
    alert("Masukkan nama dan harga menu dengan benar!");
    return;
  }

  menuList.push({ name, price });
  document.getElementById("menuName").value = "";
  document.getElementById("menuPrice").value = "";

  renderMenuList();
  renderMenuCheckboxes();
  renderBill();
}

function renderMenuList() {
  const list = document.getElementById("menuList");
  list.innerHTML = "";
  menuList.forEach((menu, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${menu.name} - ${formatRupiah(menu.price)}
      <button class="action-btn" onclick="editMenu(${i})" title="Edit">&#9998;</button>
      <button class="action-btn delete" onclick="deleteMenu(${i})" title="Hapus">&#128465;</button>
    `;
    list.appendChild(li);
  });
}

function renderMenuCheckboxes() {
  const box = document.getElementById("menuCheckboxes");
  box.innerHTML = "";
  menuList.forEach((menu, i) => {
    const div = document.createElement("div");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = `menu-${i}`;
    cb.value = i;

    const label = document.createElement("label");
    label.htmlFor = `menu-${i}`;
    label.textContent = `${menu.name} (${formatRupiah(menu.price)})`;

    div.appendChild(cb);
    div.appendChild(label);
    box.appendChild(div);
  });
}

function editMenu(index) {
  const menu = menuList[index];
  document.getElementById("menuName").value = menu.name;
  document.getElementById("menuPrice").value = menu.price;
  menuList.splice(index, 1);
  renderMenuList();
  renderMenuCheckboxes();
  renderBill();
}

function deleteMenu(index) {
  if (confirm("Yakin ingin menghapus menu ini?")) {
    menuList.splice(index, 1);
    renderMenuList();
    renderMenuCheckboxes();
    renderBill();
  }
}

function addPerson() {
  const name = document.getElementById("personName").value.trim();
  if (!name) {
    alert("Masukkan nama orang!");
    return;
  }

  const selected = Array.from(document.querySelectorAll('#menuCheckboxes input[type="checkbox"]:checked'))
    .map(cb => parseInt(cb.value));

  if (selected.length === 0) {
    alert("Pilih minimal satu menu.");
    return;
  }

  const orderedMenus = selected.map(index => menuList[index]);
  people.push({ name, menus: orderedMenus });

  document.getElementById("personName").value = "";
  document.querySelectorAll('#menuCheckboxes input[type="checkbox"]').forEach(cb => cb.checked = false);

  renderBill();
}

function deletePerson(index) {
  if (confirm("Yakin ingin menghapus orang ini?")) {
    people.splice(index, 1);
    renderBill();
  }
}

function renderBill() {
  const container = document.getElementById("billResult");
  container.innerHTML = "";

  let totalAll = parseInt(document.getElementById("totalPrice").value) || 0;
  let totalUsed = 0;

  people.forEach((person, idx) => {
    const div = document.createElement("div");
    div.className = "person-block";
    let subtotal = 0;

    const list = person.menus.map(m => {
      subtotal += m.price;
      return `<li>${m.name} - ${formatRupiah(m.price)}</li>`;
    }).join('');

    totalUsed += subtotal;

    div.innerHTML = `
      <strong>${person.name}</strong>
      <ul>${list}</ul>
      <p><strong>Total: ${formatRupiah(subtotal)}</strong></p>
      <button class="action-btn delete" onclick="deletePerson(${idx})" title="Hapus Orang">&#128465;</button>
    `;

    container.appendChild(div);
  });

  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `
    <h3>Total yang Dihitung: ${formatRupiah(totalUsed)}</h3>
    <h3>Total Masukan: ${formatRupiah(totalAll)}</h3>
    <h3>Selisih: ${formatRupiah(totalAll - totalUsed)}</h3>
  `;
  container.appendChild(totalDiv);
}

// Toggle Dark Mode
const toggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');

toggle.addEventListener('change', function() {
  document.body.classList.toggle('dark');
  themeLabel.textContent = this.checked ? 'Gelap' : 'Terang';
});
