document.getElementById("loginPenjualForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.textContent = "";

    if (!email || !password) {
        errorMsg.textContent = "Isi email dan password!";
        return;
    }

    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Memproses...";

    try {
        const res = await fetch("api/login_penjual.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const json = await res.json();

        if (json.success && json.user.role === 'seller') {
            // 🔥 SIMPAN KE LOKALSTORAGE dengan lengkap
            localStorage.clear(); // Bersihkan dulu
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("isSellerLoggedIn", "true");
            localStorage.setItem("currentUser", JSON.stringify(json.user));
            localStorage.setItem("currentSeller", JSON.stringify(json.user));
            
            console.log('Login berhasil, data tersimpan:', json.user);
            console.log('Redirect ke dashboard_penjual.html');
            
            // Redirect ke dashboard
            window.location.href = "dashboard_penjual.html";
        } else {
            errorMsg.textContent = json.message || "Akun bukan penjual";
        }
    } catch (err) {
        console.error(err);
        errorMsg.textContent = "Tidak bisa terhubung ke server";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});