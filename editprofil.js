// editprofil.js - Halaman Edit Profil

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== CEK LOGIN ======
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // ====== Muat Data User dari localStorage ======
    const userData = localStorage.getItem('userData');
    
    if (userData) {
        const user = JSON.parse(userData);
        
        // Isi form dengan data yang tersimpan
        const nameInput = document.querySelector('input[type="text"]');
        const emailInput = document.querySelector('input[type="email"]');
        const addressTextarea = document.querySelector('textarea');
        
        if (nameInput && user.name) {
            nameInput.value = user.name;
        }
        if (emailInput && user.email) {
            emailInput.value = user.email;
        }
        if (addressTextarea && user.address) {
            addressTextarea.value = user.address;
        }
    }
    
    // ====== Simpan Perubahan ======
    const saveBtn = document.querySelector('.confirm');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const nameInput = document.querySelector('input[type="text"]');
            const emailInput = document.querySelector('input[type="email"]');
            const currentPassword = document.querySelectorAll('input[type="password"]')[0];
            const newPassword = document.querySelectorAll('input[type="password"]')[1];
            const addressTextarea = document.querySelector('textarea');
            
            // Validasi
            if (!nameInput.value.trim()) {
                alert('Nama tidak boleh kosong!');
                return;
            }
            
            if (!emailInput.value.trim()) {
                alert('Email tidak boleh kosong!');
                return;
            }
            
            // Validasi format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                alert('Format email tidak valid!');
                return;
            }
            
            // Jika ingin ubah password, harus isi password lama
            if (newPassword.value && !currentPassword.value) {
                alert('Masukkan password lama untuk mengubah password!');
                return;
            }
            
            // Ambil password lama dari localStorage
            const currentUserData = localStorage.getItem('userData');
            let oldPassword = '';
            if (currentUserData) {
                const parsedUser = JSON.parse(currentUserData);
                oldPassword = parsedUser.password || '';
            }
            
            // Simpan data ke localStorage
            const updatedUser = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                address: addressTextarea ? addressTextarea.value.trim() : '',
                password: newPassword.value || oldPassword
            };
            
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            
            // Tampilkan pesan sukses
            alert('Profil berhasil diperbarui!');
            
            // Redirect ke caritoko
            window.location.href = 'caritoko.html';
        });
    }
    
    // ====== KEMBALI ======
    const backBtn = document.querySelector('.back');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'caritoko.html';
        });
    }
    
    // ====== PROFILE DROPDOWN (jika ada) ======
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileBtn = document.querySelector('.profile-btn');
    const profileMenu = document.querySelector('.profile-menu');
    
    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // ====== LOGOUT ======
    const logoutLink = document.querySelector('.logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Hapus session 
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
    
    // ====== TUTUP DROPDOWN KETIKA KLIK DI LUAR ======
    document.addEventListener('click', function(e) {
        if (profileMenu && profileDropdown && !profileDropdown.contains(e.target)) {
            profileMenu.style.display = 'none';
        }
    });
});

