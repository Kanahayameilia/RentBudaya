

let selectedModel = "Pria";
let selectedColor = "Hitam";

function selectModel(element, model) {
  document.querySelectorAll("#model-options .tag").forEach(t => t.classList.remove("active"));
  element.classList.add("active");
  selectedModel = model;
}

function selectColor(element, color) {
  document.querySelectorAll("#color-options .tag").forEach(t => t.classList.remove("active"));
  element.classList.add("active");
  selectedColor = color;

  const productImage = document.getElementById("product-image");
  if (productImage) {
    const map = {
      Hitam: "Assets/image/imageproduk.jpeg",
      Biru:  "Assets/image/imagebiru.jpeg",
      Hijau: "Assets/image/imagehijau.jpeg"
    };
    productImage.src = map[color] || "Assets/image/image.png";
  }
}

document.addEventListener("DOMContentLoaded", function () {

  // --- Cek login ---
  const isLoggedIn  = localStorage.getItem("isLoggedIn");
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!isLoggedIn || !currentUser) {
    window.location.href = "login.html";
    return;
  }

  // --- Tampilkan data produk ---
  const storedProduct = localStorage.getItem("selectedProduct");
  let product = null;

  if (storedProduct) {
    product = JSON.parse(storedProduct);
    const productTitle = document.querySelector(".detail-card h2");
    const productDesc  = document.querySelector(".desc");
    if (productTitle) productTitle.textContent = product.nama  || product.name  || "";
    if (productDesc)  productDesc.textContent  = product.deskripsi || product.description || "";
  }

  // --- Tanggal ---
  const startDateInput = document.querySelector(".date-field:first-child input");
  const endDateInput   = document.querySelector(".date-field:last-child input");
  const today = new Date().toISOString().split("T")[0];
  if (startDateInput) startDateInput.min = today;
  if (endDateInput)   endDateInput.min   = today;

  if (startDateInput) {
    startDateInput.addEventListener("change", function () {
      if (endDateInput) {
        endDateInput.min = this.value;
        const maxDate = new Date(this.value);
        maxDate.setDate(maxDate.getDate() + 3);
        const maxStr = maxDate.toISOString().split("T")[0];
        endDateInput.max = maxStr;
        if (endDateInput.value && endDateInput.value > maxStr) {
          endDateInput.value = maxStr;
        }
      }
    });
  }

  function calculateTotal() {
    if (!startDateInput || !endDateInput || !startDateInput.value || !endDateInput.value) return null;
    const start = new Date(startDateInput.value);
    const end   = new Date(endDateInput.value);
    if (end < start) return null;
    const days  = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const price = product ? (product.harga_per_hari || product.price || 0) : 0;
    return { days, total: days * price, startDate: startDateInput.value, endDate: endDateInput.value };
  }

  // --- Tombol Lanjut ke Pembayaran ---
  const lanjutBtn = document.querySelector(".btn-lanjut");
  if (lanjutBtn) {
    lanjutBtn.addEventListener("click", async function () {
      if (!startDateInput?.value || !endDateInput?.value) {
        alert("Silakan pilih tanggal mulai dan selesai!");
        return;
      }
      const calc = calculateTotal();
      if (!calc) {
        alert("Tanggal selesai harus lebih dari atau sama dengan tanggal mulai!");
        return;
      }
      if (calc.days > 3) {
        alert("Maksimal sewa adalah 3 hari!");
        return;
      }
      if (!product) {
        alert("Data produk tidak ditemukan, kembali dan pilih produk.");
        return;
      }

      // --- Kirim ke API ---
      try {
        lanjutBtn.disabled = true;
        lanjutBtn.textContent = "Memproses...";

        const res = await fetch("api/pesanan.php", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            user_id:        currentUser.id,
            produk_id:      product.id,
            model:          selectedModel,
            warna:          selectedColor,
            ukuran:         product.ukuran || product.size || "M",
            tanggal_mulai:  calc.startDate,
            tanggal_selesai:calc.endDate,
            durasi_hari:    calc.days,
            total_harga:    calc.total,
            metode_bayar:   "QRIS"
          })
        });

        const json = await res.json();

        if (json.success) {
          // Simpan data order ke localStorage untuk halaman pembayaran
          localStorage.setItem("orderData", JSON.stringify({
            product:       product,
            model:         selectedModel,
            color:         selectedColor,
            size:          product.ukuran || product.size || "M",
            startDate:     calc.startDate,
            endDate:       calc.endDate,
            duration:      calc.days,
            total:         calc.total,
            nomor_pesanan: json.nomor_pesanan,
            pesanan_id:    json.pesanan_id
          }));
          window.location.href = "pembayaran.html";
        } else {
          alert("Gagal membuat pesanan: " + json.message);
        }

      } catch (err) {
        console.error(err);
        alert("Tidak bisa terhubung ke server. Pastikan XAMPP berjalan.");
      } finally {
        lanjutBtn.disabled = false;
        lanjutBtn.textContent = "Lanjut";
      }
    });
  }

  // --- Kembali ---
  const backBtn = document.querySelector(".back");
  if (backBtn) backBtn.addEventListener("click", () => window.location.href = "lihatproduk.html");

  // --- Profile Dropdown & Logout ---
  const profileDropdown = document.querySelector(".profile-dropdown");
  const profileBtn      = document.querySelector(".profile-btn");
  const profileMenu     = document.querySelector(".profile-menu");

  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });
  }
  document.addEventListener("click", function (e) {
    if (profileMenu && profileDropdown && !profileDropdown.contains(e.target)) {
      profileMenu.style.display = "none";
    }
  });

  const logoutLink = document.querySelector(".logout");
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }
});
