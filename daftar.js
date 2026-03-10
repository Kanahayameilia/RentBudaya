document.getElementById("daftarForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(email !== "" && password !== "") {
    
    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Format email tidak valid!");
      return;
    }
    
    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }
    
    // Simpan data user ke localStorage
    const userData = {
      name: email.split('@')[0], 
      email: email,
      password: password,
      address: ''
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify({
      name: userData.name,
      email: userData.email
    }));
    
    alert("Pendaftaran berhasil! Silakan login dengan akun Anda.");
    window.location.href = "login.html";
  } else {
    alert("Mohon isi email dan password!");
  }
});
