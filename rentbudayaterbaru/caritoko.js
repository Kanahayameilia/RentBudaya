
document.addEventListener("DOMContentLoaded", init);

// STATE
const state = {
  selectedSize: "",
  selectedPrice: { min: 0, max: 0 },
  selectedKota: "Magelang"
};

// INIT APP
function init() {
  if (!checkLogin()) return;

  setupUser();
  setupDropdownLokasi();
  setupFilterUkuran();
  setupFilterHarga();
  setupButtons();
  setupProfileMenu();
  
  loadToko();
}

// AUTH
function checkLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function setupUser() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const profileBtn = document.querySelector(".profile-btn");

  if (profileBtn && user) {
    profileBtn.textContent = user.nama || user.email;
  }
}

// API CALL
async function loadToko() {
  const url = buildApiUrl();

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json.success) {
      renderTokoCards(json.data);
    } else {
      console.error("API Error:", json.message);
    }

  } catch (err) {
    console.error("Fetch error:", err);
    alert("Gagal terhubung ke server");
  }
}

function buildApiUrl() {
  let url = "api/toko.php?kota=" + encodeURIComponent(state.selectedKota);

  if (state.selectedSize) {
    url += "&ukuran=" + state.selectedSize;
  }

  if (state.selectedPrice.min > 0) {
    url += "&harga_min=" + state.selectedPrice.min;
  }

  if (state.selectedPrice.max > 0) {
    url += "&harga_max=" + state.selectedPrice.max;
  }

  return url;
}

// RENDER (PAKAI HTML LAMA — TIDAK DIUBAH)
function renderTokoCards(tokoList) {
  const cards = document.querySelectorAll(".store-card");

  cards.forEach((card, index) => {
    const toko = tokoList[index];

    if (!toko) {
      card.style.display = "none";
      return;
    }

    card.style.display = "block";

    const namaEl   = card.querySelector("h3");
    const alamatEl = card.querySelector("p");
    const btn      = card.querySelector("button");

    if (namaEl)   namaEl.textContent = toko.nama;
    if (alamatEl) alamatEl.textContent = toko.alamat;

    attachButtonEvent(card, btn, toko);
  });
}

// EVENT BUTTON (ANTI BUG VERSION)
function attachButtonEvent(card, btn, toko) {
  if (!btn) return;

  // reset event lama
  btn.replaceWith(btn.cloneNode(true));
  const newBtn = card.querySelector("button");

  newBtn.addEventListener("click", () => {
    saveSelectedStore(toko);
    saveFilterData();
    window.location.href = "lihatproduk.html";
  });
}

function saveSelectedStore(toko) {
  localStorage.setItem("selectedStore", JSON.stringify({
    id: toko.id,
    name: toko.nama,
    address: toko.alamat
  }));
}

function saveFilterData() {
  const locationBtn = document.querySelector(".location-btn");

  const filterData = {
    size: state.selectedSize,
    priceRange: getSelectedPriceLabel(),
    location: locationBtn 
      ? locationBtn.textContent.replace(" ▾", "") 
      : "Magelang"
  };

  localStorage.setItem("filterData", JSON.stringify(filterData));
}

function getSelectedPriceLabel() {
  const checked = document.querySelector('.category-group input[type="checkbox"]:checked');
  return checked ? checked.parentElement.textContent.trim() : "";
}


// FILTER
function setupFilterUkuran() {
  const buttons = document.querySelectorAll(".size-group button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      state.selectedSize = btn.textContent.trim();
    });
  });
}

function setupFilterHarga() {
  const checkboxes = document.querySelectorAll('.category-group input[type="checkbox"]');

  checkboxes.forEach(cb => {
    cb.addEventListener("change", function () {

      checkboxes.forEach(c => { if (c !== this) c.checked = false; });

      if (this.checked) {
        const label = this.parentElement.textContent;

        if (label.includes("100.000"))       state.selectedPrice = { min: 0,      max: 100000 };
        else if (label.includes("300.000"))  state.selectedPrice = { min: 100000, max: 300000 };
        else if (label.includes("500.000"))  state.selectedPrice = { min: 300000, max: 500000 };
        else if (label.includes("500.000+")) state.selectedPrice = { min: 500000, max: 0 };
      } else {
        state.selectedPrice = { min: 0, max: 0 };
      }
    });
  });
}

// DROPDOWN LOKASI
function setupDropdownLokasi() {
  const btn = document.querySelector(".location-btn");
  const menu = document.querySelector(".dropdown-menu");
  const wrapper = document.querySelector(".location-dropdown");

  if (!btn || !menu) return;

  btn.addEventListener("click", e => {
    e.stopPropagation();
    menu.style.display = toggle(menu.style.display);
  });

  menu.querySelectorAll("div").forEach(opt => {
    opt.addEventListener("click", () => {
      state.selectedKota = opt.textContent.trim();

      btn.textContent = state.selectedKota + " ▾";
      menu.style.display = "none";

      updateSubtitle(state.selectedKota);
    });
  });

  document.addEventListener("click", e => {
    if (wrapper && !wrapper.contains(e.target)) {
      menu.style.display = "none";
    }
  });
}

function updateSubtitle(kota) {
  const subtitle = document.querySelector(".page-title p");
  if (subtitle) {
    subtitle.textContent = "Menampilkan Toko Sekitar " + kota;
  }
}

// BUTTONS
function setupButtons() {
  const resetBtn = document.querySelector(".reset");
  const applyBtn = document.querySelector(".apply");

  if (resetBtn) {
    resetBtn.addEventListener("click", resetFilter);
  }

  if (applyBtn) {
    applyBtn.addEventListener("click", loadToko);
  }
}

function resetFilter() {
  document.querySelectorAll(".size-group button")
    .forEach(b => b.classList.remove("active"));

  document.querySelectorAll('.category-group input[type="checkbox"]')
    .forEach(c => c.checked = false);

  state.selectedSize  = "";
  state.selectedPrice = { min: 0, max: 0 };
  state.selectedKota  = "Magelang";

  const btn = document.querySelector(".location-btn");
  if (btn) btn.textContent = "Pilih Lokasi ▾";

  updateSubtitle("Magelang");

  loadToko();
}

// PROFILE & LOGOUT
function setupProfileMenu() {
  const btn = document.querySelector(".profile-btn");
  const menu = document.querySelector(".profile-menu");
  const wrapper = document.querySelector(".profile-dropdown");

  if (btn && menu) {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      menu.style.display = toggle(menu.style.display);
    });
  }

  document.addEventListener("click", e => {
    if (wrapper && !wrapper.contains(e.target)) {
      menu.style.display = "none";
    }
  });

  const logout = document.querySelector(".logout");
  if (logout) {
    logout.addEventListener("click", e => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
}

// UTILS
function toggle(val) {
  return val === "block" ? "none" : "block";
}