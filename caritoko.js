// caritoko.js - Halaman Cari Toko

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== CEK LOGIN ======
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // ====== DROPDOWN LOKASI ======
    const locationDropdown = document.querySelector('.location-dropdown');
    const locationBtn = document.querySelector('.location-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const locationOptions = dropdownMenu.querySelectorAll('div');
    
    // Toggle dropdown lokasi
    if (locationBtn && dropdownMenu) {
        locationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
        
        // Pilih lokasi
        locationOptions.forEach(option => {
            option.addEventListener('click', function() {
                locationBtn.textContent = this.textContent + ' ▾';
                dropdownMenu.style.display = 'none';
                
                // Update teks di bawah title
                const subtitle = document.querySelector('.page-title p');
                if (subtitle) {
                    subtitle.textContent = 'Menampilkan Toko Sekitar ' + this.textContent;
                }
            });
        });
    }
    
    // ====== FILTER UKURAN ======
    const sizeButtons = document.querySelectorAll('.size-group button');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
        });
    });
    
    // ====== RESET FILTER ======
    const resetBtn = document.querySelector('.reset');
    const applyBtn = document.querySelector('.apply');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Reset ukuran
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Reset checkbox kategori
            const checkboxes = document.querySelectorAll('.category-group input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
            
            // Reset dropdown lokasi
            if (locationBtn) {
                locationBtn.textContent = 'Pilih Lokasi ▾';
            }
            const subtitle = document.querySelector('.page-title p');
            if (subtitle) {
                subtitle.textContent = 'Menampilkan Toko Sekitar Magelang';
            }
        });
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            // Get selected sizes
            const selectedSizes = [];
            sizeButtons.forEach(btn => {
                if (btn.classList.contains('active')) {
                    selectedSizes.push(btn.textContent);
                }
            });
            
            // Get selected categories
            const selectedCategories = [];
            const checkboxes = document.querySelectorAll('.category-group input[type="checkbox"]:checked');
            checkboxes.forEach(cb => {
                selectedCategories.push(cb.parentElement.textContent.trim());
            });
            
            // Tampilkan alert (bisa dikembangkan dengan filtering sebenarnya)
            console.log('Filter applied:', {
                sizes: selectedSizes,
                categories: selectedCategories
            });
        });
    }
    
    // ====== KARTU TOKO - LIHAT PRODUK ======
    const storeCards = document.querySelectorAll('.store-card button');
    storeCards.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // Simpan nama toko ke localStorage
            const storeName = this.parentElement.querySelector('h3').textContent;
            const storeAddress = this.parentElement.querySelector('p').textContent;
            
            localStorage.setItem('selectedStore', JSON.stringify({
                name: storeName,
                address: storeAddress
            }));
            
            // Redirect ke halaman produk
            window.location.href = 'lihatproduk.html';
        });
    });
    
    // ====== PROFILE DROPDOWN ======
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
            // Hapus semua data session
            localStorage.clear();
            // Redirect ke login
            window.location.href = 'login.html';
        });
    }
    
    // ====== TUTUP DROPDOWN KETIKA KLIK DI LUAR ======
    document.addEventListener('click', function(e) {
        if (dropdownMenu && !locationDropdown.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
        if (profileMenu && !profileDropdown.contains(e.target)) {
            profileMenu.style.display = 'none';
        }
    });
});

