// ============================================================
//  Detailpesanan.js — Ambil detail pesanan dari API PHP
// ============================================================

document.addEventListener("DOMContentLoaded", async function () {

  // --- Cek login ---
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "login.html";
    return;
  }

  const nomorPesanan = localStorage.getItem("orderNumber");

  function formatDate(str) {
    if (!str) return "-";
    const d = new Date(str);
    return String(d.getDate()).padStart(2, "0") + "/" +
           String(d.getMonth() + 1).padStart(2, "0") + "/" +
           d.getFullYear();
  }

  function formatRupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
  }

  if (nomorPesanan) {
    try {
      const res  = await fetch("api/pesanan.php?nomor=" + encodeURIComponent(nomorPesanan));
      const json = await res.json();

      if (json.success) {
        const order = json.data;

        // Mapping elemen — sesuaikan selector dengan HTML kamu
        const setEl = (sel, val) => {
          const el = document.querySelector(sel);
          if (el) el.textContent = val;
        };

        setEl(".nomor-pesanan",    order.nomor_pesanan);
        setEl(".nama-produk",      order.nama_produk);
        setEl(".nama-toko",        order.nama_toko);
        setEl(".model-produk",     order.model);
        setEl(".warna-produk",     order.warna);
        setEl(".ukuran-produk",    order.ukuran);
        setEl(".tanggal-mulai",    formatDate(order.tanggal_mulai));
        setEl(".tanggal-selesai",  formatDate(order.tanggal_selesai));
        setEl(".durasi-hari",      order.durasi_hari + " Hari");
        setEl(".total-harga",      formatRupiah(order.total_harga));
        setEl(".status-pesanan",   order.status.replace(/_/g, " "));
        setEl(".metode-bayar",     order.metode || "QRIS");

        // Gambar produk
        const img = document.querySelector(".product-image");
        if (img && order.gambar) {
          img.src = "Assets/image/" + order.gambar;
        }

      } else {
        // Fallback: tampilkan dari localStorage jika API gagal
        loadFromLocalStorage();
      }

    } catch (err) {
      console.error("Gagal ambil data pesanan:", err);
      loadFromLocalStorage();
    }
  } else {
    loadFromLocalStorage();
  }

  // --- Fallback dari localStorage (data sementara) ---
  function loadFromLocalStorage() {
    const orderData = localStorage.getItem("orderData");
    if (!orderData) return;

    const order = JSON.parse(orderData);
    const setEl = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = val;
    };

    setEl(".nomor-pesanan",   localStorage.getItem("orderNumber") || "-");
    setEl(".nama-produk",     order.product?.nama || order.product?.name || "-");
    setEl(".model-produk",    order.model);
    setEl(".warna-produk",    order.color);
    setEl(".ukuran-produk",   order.size);
    setEl(".tanggal-mulai",   formatDate(order.startDate));
    setEl(".tanggal-selesai", formatDate(order.endDate));
    setEl(".durasi-hari",     (order.duration || 1) + " Hari");
    setEl(".total-harga",     formatRupiah(order.total));
    setEl(".status-pesanan",  "Pembayaran Dikonfirmasi");
    setEl(".metode-bayar",    "QRIS");
  }

  // --- Kembali ke beranda ---
  // Tombol "Kembali ke Beranda" 
const backToHomeBtn = document.querySelector("#backToHomeBtn, .btn-secondary");
if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", function() {
        window.location.href = "caritoko.html";
    });
}

// Tombol "Lanjut Sewa" - arahkan ke halaman sewa
const continueRentBtn = document.querySelector("#continueRentBtn, .btn-primary");
if (continueRentBtn) {
    continueRentBtn.addEventListener("click", function() {
        // Ambil data produk dari localStorage
        const orderData = localStorage.getItem("orderData");
        if (orderData) {
            const order = JSON.parse(orderData);
            if (order.product) {
                localStorage.setItem("selectedProduct", JSON.stringify(order.product));
            }
        }
        window.location.href = "lihatproduk.html";
    });
}

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
