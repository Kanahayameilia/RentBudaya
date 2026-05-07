

document.addEventListener("DOMContentLoaded", function () {

  // --- Cek login ---
  const isLoggedIn  = localStorage.getItem("isLoggedIn");
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (!isLoggedIn || !currentUser) {
    window.location.href = "login.html";
    return;
  }

  // --- Isi form dengan data user saat ini ---
  const nameInput      = document.querySelector('input[type="text"]');
  const emailInput     = document.querySelector('input[type="email"]');
  const addressTextarea= document.querySelector("textarea");

  if (nameInput)       nameInput.value       = currentUser.nama   || "";
  if (emailInput)      emailInput.value      = currentUser.email  || "";
  if (addressTextarea) addressTextarea.value = currentUser.alamat || "";

  // --- Simpan Perubahan ---
  const saveBtn = document.querySelector(".confirm");

  if (saveBtn) {
    saveBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      const nama         = nameInput?.value.trim()  || "";
      const email        = emailInput?.value.trim() || "";
      const alamat       = addressTextarea?.value.trim() || "";
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      const passwordLama = passwordInputs[0]?.value || "";
      const passwordBaru = passwordInputs[1]?.value || "";

      // Validasi
      if (!nama) { alert("Nama tidak boleh kosong!"); return; }
      if (!email) { alert("Email tidak boleh kosong!"); return; }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) { alert("Format email tidak valid!"); return; }
      if (passwordBaru && !passwordLama) {
        alert("Masukkan password lama untuk mengubah password!");
        return;
      }

      try {
        const res = await fetch("api/editprofil.php", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            user_id:       currentUser.id,
            nama,
            email,
            alamat,
            password_lama: passwordLama,
            password_baru: passwordBaru
          })
        });

        const json = await res.json();

        if (json.success) {
          // Update localStorage dengan data terbaru
          localStorage.setItem("currentUser", JSON.stringify(json.user));
          alert("Profil berhasil diperbarui!");
          window.location.href = "caritoko.html";
        } else {
          alert("Gagal: " + json.message);
        }

      } catch (err) {
        console.error(err);
        alert("Tidak bisa terhubung ke server. Pastikan XAMPP berjalan.");
      }
    });
  }

  // --- Kembali ---
  const backBtn = document.querySelector(".back");
  if (backBtn) {
    backBtn.addEventListener("click", () => window.location.href = "caritoko.html");
  }

  // --- Profile Dropdown ---
  setupProfileDropdown();

  // --- Logout ---
  setupLogout();
});

function setupProfileDropdown() {
  const profileDropdown = document.querySelector(".profile-dropdown");
  const profileBtn      = document.querySelector(".profile-btn");
  const profileMenu     = document.querySelector(".profile-menu");

  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });
    document.addEventListener("click", function (e) {
      if (profileDropdown && !profileDropdown.contains(e.target)) {
        profileMenu.style.display = "none";
      }
    });
  }
}

function setupLogout() {
  const logoutLink = document.querySelector(".logout");
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }
}
