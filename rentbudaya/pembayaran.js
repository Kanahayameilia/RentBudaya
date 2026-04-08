// ============================================================
//  pembayaran.js — Konfirmasi pembayaran ke API PHP
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  // --- Cek login ---
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "login.html";
    return;
  }

  // --- Tampilkan ringkasan pesanan dari localStorage ---
  const orderData = localStorage.getItem("orderData");

  function formatDate(str) {
    if (!str) return "-";
    const d = new Date(str);
    return String(d.getDate()).padStart(2, "0") + "/" +
           String(d.getMonth() + 1).padStart(2, "0") + "/" +
           d.getFullYear();
  }

  if (orderData) {
    const order = JSON.parse(orderData);
    const summaryData = {
      "Ukuran":         order.size     || "M",
      "Warna":          order.color    || "Hitam",
      "Model":          order.model    || "Pria",
      "Tanggal Mulai":  formatDate(order.startDate),
      "Tanggal Selesai":formatDate(order.endDate),
      "Durasi":         (order.duration || 1) + " Hari",
      "No. Pesanan":    order.nomor_pesanan || "-"
    };

    document.querySelectorAll(".summary .row").forEach(function (row) {
      const labelSpan = row.querySelector("span:first-child");
      const valueSpan = row.querySelector("span:last-child");
      if (labelSpan && valueSpan && summaryData[labelSpan.textContent.trim()]) {
        valueSpan.textContent = summaryData[labelSpan.textContent.trim()];
      }
    });

    const totalEl = document.querySelector(".summary .total span:last-child");
    if (totalEl && order.total) {
      totalEl.textContent = "Rp " + order.total.toLocaleString("id-ID");
    }
  }

  // --- Tombol Sudah Bayar ---
  const bayarBtn = document.querySelector(".btn-bayar");

  if (bayarBtn) {
    bayarBtn.addEventListener("click", async function () {
      const order = orderData ? JSON.parse(orderData) : null;

      if (!order || !order.nomor_pesanan) {
        alert("Data pesanan tidak ditemukan!");
        return;
      }

      try {
        bayarBtn.disabled = true;
        bayarBtn.textContent = "Mengkonfirmasi...";

        const res = await fetch("api/pembayaran.php", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ nomor_pesanan: order.nomor_pesanan })
        });

        const json = await res.json();

        if (json.success) {
          // Simpan nomor pesanan untuk halaman detail
          localStorage.setItem("orderNumber", order.nomor_pesanan);
          localStorage.setItem("orderStatus", "confirmed");
          window.location.href = "Detailpesanan.html";
        } else {
          alert("Gagal konfirmasi: " + json.message);
        }

      } catch (err) {
        console.error(err);
        alert("Tidak bisa terhubung ke server. Pastikan XAMPP berjalan.");
      } finally {
        bayarBtn.disabled = false;
        bayarBtn.textContent = "Sudah Bayar";
      }
    });
  }

  // --- Kembali ---
  const backBtn = document.querySelector(".back");
  if (backBtn) backBtn.addEventListener("click", () => window.location.href = "sewa.html");

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
