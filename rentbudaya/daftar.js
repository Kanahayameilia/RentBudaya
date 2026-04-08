// ============================================================
//  daftar.js — Terhubung ke API PHP (api/daftar.php)
// ============================================================

document.getElementById("daftarForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nama     = document.getElementById("nama")?.value.trim()     || "";
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // --- Validasi sisi klien ---
  if (!email || !password) {
    alert("Mohon isi email dan password!");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Format email tidak valid!");
    return;
  }

  if (password.length < 6) {
    alert("Password minimal 6 karakter!");
    return;
  }

  // --- Kirim ke API ---
  try {
    const res = await fetch("api/daftar.php", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        nama:     nama || email.split("@")[0],
        email:    email,
        password: password
      })
    });

    const json = await res.json();

    if (json.success) {
      alert("Pendaftaran berhasil! Silakan login dengan akun Anda.");
      window.location.href = "login.html";
    } else {
      alert("Gagal: " + json.message);
    }

  } catch (err) {
    console.error(err);
    alert("Tidak bisa terhubung ke server. Pastikan XAMPP berjalan.");
  }
});
