document.getElementById("loginPenjualForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.style.display = "none";
    errorMsg.textContent = "";

    if (!email || !password) {
        errorMsg.textContent = "Isi email dan password!";
        errorMsg.style.display = "block";
        return;
    }

    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Memproses...";

    try {
        console.log("Mencoba login ke API...");
        
        const res = await fetch("api/login_penjual.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const json = await res.json();
        console.log("Response login:", json);

        if (json.success) {
            // Hapus semua data lama
            localStorage.clear();
            
            // Simpan data dengan benar
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("isSellerLoggedIn", "true");
            localStorage.setItem("currentUser", JSON.stringify(json.user));
            localStorage.setItem("currentSeller", JSON.stringify(json.user));
            
            console.log("Login berhasil, data tersimpan");
            console.log("Redirect ke dashboard_penjual.html");
            
            // Redirect ke dashboard
            window.location.href = "dashboard_penjual.html";
        } else {
            errorMsg.textContent = json.message || "Login gagal. Pastikan akun Anda adalah penjual.";
            errorMsg.style.display = "block";
        }
    } catch (err) {
        console.error("Error:", err);
        errorMsg.textContent = "Tidak bisa terhubung ke server. Pastikan XAMPP berjalan.";
        errorMsg.style.display = "block";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});