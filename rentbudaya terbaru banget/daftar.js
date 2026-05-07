document.getElementById("daftarForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Ambil nilai dari input
    const nama = document.getElementById("nama")?.value.trim() || "";
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    
    // Ambil role dengan cara yang PASTI benar
    let role = "customer";
    const roleCustomer = document.getElementById("role_customer");
    const roleSeller = document.getElementById("role_seller");
    
    if (roleSeller && roleSeller.checked) {
        role = "seller";
    } else if (roleCustomer && roleCustomer.checked) {
        role = "customer";
    }
    
    // TAMPILKAN ALERT UNTUK DEBUG - Ini penting!
    alert("Role yang dipilih: " + role);
    console.log("Role yang dipilih:", role);
    console.log("Customer checked:", roleCustomer?.checked);
    console.log("Seller checked:", roleSeller?.checked);

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

    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Memproses...";

    try {
        const requestBody = {
            nama: nama,
            email: email,
            password: password,
            role: role
        };
        
        console.log("Mengirim data:", requestBody);
        
        const res = await fetch("api/daftar.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const json = await res.json();
        console.log("Response:", json);

        if (json.success) {
            alert("✅ Pendaftaran berhasil! Role tersimpan: " + (json.role || role));
            
            if (role === 'seller') {
                window.location.href = "login_penjual.html";
            } else {
                window.location.href = "login.html";
            }
        } else {
            alert("❌ Gagal: " + json.message);
        }

    } catch (err) {
        console.error("Error:", err);
        alert("❌ Error: " + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});