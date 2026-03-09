// lihatproduk.js - Halaman Lihat Produk

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== CEK LOGIN ======
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // ====== TAMPILKAN DATA TOKO ======
    const storeCard = document.querySelector('.store-card');
    
    // Ambil data toko dari localStorage
    const storedStore = localStorage.getItem('selectedStore');
    if (storedStore) {
        const store = JSON.parse(storedStore);
        if (storeCard) {
            storeCard.innerHTML = `
                <h2>${store.name}</h2>
                <p>${store.address}</p>
            `;
        }
    } else {
        // Default jika tidak ada data
        if (storeCard) {
            storeCard.innerHTML = `
                <h2>Toko Adat Jaya</h2>
                <p>Penyewaan baju dan aksesoris adat lengkap</p>
            `;
        }
    }
    
    // ====== DATA PRODUK ======
    const products = [
        {
            id: 1,
            name: 'Kebaya Beskap Jawa',
            price: 41000,
            image: 'kebaya.png',
            description: 'Kebaya tradisional Jawa dengan desain klasik. Sangat cocok untuk acara adat dan pernikahan.',
            models: ['Pria', 'Wanita'],
            colors: ['Hitam', 'Merah', 'Biru']
        },
        {
            id: 2,
            name: 'Kebaya Beskap Solo',
            price: 91000,
            image: 'kebaya.png',
            description: 'Kebaya Beludru dan Beskap Jawa bernuansa hitam emas. Elegan dan klasik.',
            models: ['Pria', 'Wanita'],
            colors: ['Hitam', 'Biru', 'Hijau']
        }
    ];
    
    // ====== RENDER PRODUK ======
    const productGrid = document.querySelector('.product-grid');
    
    function renderProducts() {
        if (!productGrid) return;
        
        productGrid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image"></div>
                <div class="product-info">
                    <p class="product-name">${product.name}</p>
                    <div class="bottom">
                        <div class="price">
                            Rp ${product.price.toLocaleString('id-ID')}
                            <span>per hari</span>
                        </div>
                        <button class="sewa" data-id="${product.id}">Sewa</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Tambahkan event listener untuk tombol sewa
        attachSewaListeners();
    }
    
    function attachSewaListeners() {
        const sewaButtons = document.querySelectorAll('.sewa');
        sewaButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    // Simpan data produk ke localStorage
                    localStorage.setItem('selectedProduct', JSON.stringify(product));
                    
                    // Redirect ke halaman sewa
                    window.location.href = 'sewa.html';
                }
            });
        });
    }
    
    // Render produk saat halaman dimuat
    renderProducts();
    
    // ====== KEMBALI ======
    const backBtn = document.querySelector('.back');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'caritoko.html';
        });
    }
    
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
            localStorage.clear();
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

