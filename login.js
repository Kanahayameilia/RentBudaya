document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email !== "" && password !== "") {
    
    // Cek apakah user sudah terdaftar
    const storedUser = localStorage.getItem('userData');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // Verifikasi email dan password
      if (user.email === email && user.password === password) {
        // Login berhasil - simpan session
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
          name: user.name,
          email: user.email
        }));
        
        window.location.href = "caritoko.html";
      } else {
        alert("Email atau password salah!");
      }
    } else {
      // Jika belum ada user terdaftar, buat user demo
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify({
        name: 'Pengguna',
        email: email
      }));
      
      window.location.href = "caritoko.html";
    }
  } else {
    alert("Isi email dan password dulu ya!");
  }
});
