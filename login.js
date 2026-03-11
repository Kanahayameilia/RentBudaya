document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  // Reset error messages
  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";

  if (email !== "" && password !== "") {
    
    // Cek apakah user sudah terdaftar
    const storedUser = localStorage.getItem('userData');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // Cek email terlebih dahulu
      if (user.email !== email) {
        // Email tidak terdaftar
        document.getElementById("emailError").textContent = "Email belum terdaftar";
        return;
      }
      
      // Email benar, cek password
      if (user.password !== password) {
        // Password salah
        document.getElementById("passwordError").textContent = "Password salah";
        return;
      }
      
      // Login berhasil - simpan session
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify({
        name: user.name,
        email: user.email
      }));
      
      window.location.href = "caritoko.html";
    } else {
      // Tidak ada user yang terdaftar
      document.getElementById("emailError").textContent = "Email belum terdaftar";
    }
  } else {
    alert("Isi email dan password dulu ya!");
  }
});
