document.getElementById("daftarForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nama = document.getElementById("nama")?.value.trim() || "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  
  // Ambil role yang dipilih
  const roleRadio = document.querySelector('input[name="role"]:checked');
  const role = roleRadio ? roleRadio.value : "customer";

  // Validasi
  if (!nama) {
    alert("Mohon isi nama lengkap!");
    return;
  }
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

  // Disable button
  const submitBtn = document.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Memproses...";

  try {
    const res = await fetch("api/daftar.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: nama || email.split("@")[0],
        email: email,
        password: password,
        role: role
      })
    });

    const json = await res.json();

    if (json.success) {
      const roleText = role === 'seller' ? 'sebagai Penjual' : 'sebagai Customer';
      alert(`✅ Pendaftaran ${roleText} berhasil! Silakan login.`);
      
      // 🔥 PERUBAHAN: Redirect sesuai role
      if (role === 'seller') {
        // Penjual → login_penjual.html
        window.location.href = "login_penjual.html";
      } else {
        // Customer → login.html
        window.location.href = "login.html";
      }
    } else {
      alert("❌ Gagal: " + json.message);
    }

  } catch (err) {
    console.error(err);
    alert("❌ Tidak bisa terhubung ke server. Pastikan XAMPP berjalan.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});