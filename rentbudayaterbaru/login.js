document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const emailError    = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  if (emailError)    emailError.textContent    = "";
  if (passwordError) passwordError.textContent = "";

  if (!email || !password) {
    alert("Isi email dan password dulu ya!");
    return;
  }

  try {
    const res = await fetch("api/login.php", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password })
    });

    const json = await res.json();

    if (json.success) {
      localStorage.setItem("isLoggedIn",   "true");
      localStorage.setItem("currentUser",  JSON.stringify(json.user));
      
      // Redirect berdasarkan role dari response
      if (json.user.role === 'seller') {
        window.location.href = "dashboard_penjual.html";
      } else {
        window.location.href = "caritoko.html";
      }
    } else {
      if (json.message === "Email belum terdaftar") {
        if (emailError) emailError.textContent = "Email belum terdaftar";
      } else if (json.message === "Password salah") {
        if (passwordError) passwordError.textContent = "Password salah";
      } else {
        alert("Login gagal: " + json.message);
      }
    }

  } catch (err) {
    console.error(err);
    alert("Tidak bisa terhubung ke server. Pastikan XAMPP berjalan.");
  }
});