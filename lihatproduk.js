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
    // Semua produk dengan berbagai ukuran dan harga
    const allProducts = [
        // Size S - semua range harga
        {
            id: 1,
            name: 'Kebaya Brokat S',
            price: 450000,
            size: 'S',
            image: 'Assets/image/imageproduk.jpeg',
            description: 'Kebaya brokat mewah untuk pengantin.',
            models: ['Wanita'],
            colors: ['Emas', 'Putih', 'Merah']
        },
        {
            id: 2,
            name: 'Kebaya Encim S',
            price: 280000,
            size: 'S',
            image: 'Assets/image/imagebiru.jpeg',
            description: 'Kebaya encim batik khas.',
            models: ['Wanita'],
            colors: ['Biru', 'Merah', 'Kuning']
        },
        {
            id: 3,
            name: 'Baju Adat S',
            price: 180000,
            size: 'S',
            image: 'Assets/image/imagehijau.jpeg',
            description: 'Baju adat lengkap untuk acara formal.',
            models: ['Pria', 'Wanita'],
            colors: ['Merah', 'Hijau']
        },
        
        // Size M - semua range harga
        {
            id: 4,
            name: 'Kebaya Beskap Jawa',
            price: 41000,
            size: 'M',
            image: 'Assets/image/imageproduk.jpeg',
            description: 'Kebaya tradisional Jawa klasik.',
            models: ['Pria', 'Wanita'],
            colors: ['Hitam', 'Merah', 'Biru']
        },
        {
            id: 5,
            name: 'Beskap Putih Polos',
            price: 120000,
            size: 'M',
            image: 'Assets/image/imagebiru.jpeg',
            description: 'Beskap putih cocok untuk acara formal.',
            models: ['Pria'],
            colors: ['Putih']
        },
        {
            id: 6,
            name: 'Jas Adat M',
            price: 380000,
            size: 'M',
            image: 'Assets/image/imagehijau.jpeg',
            description: 'Jas adat Indonesia berkualitas.',
            models: ['Pria'],
            colors: ['Hitam', 'Abu']
        },
        
        // Size L - semua range harga
        {
            id: 7,
            name: 'Kebaya Beskap Solo',
            price: 91000,
            size: 'L',
            image: 'Assets/image/imagebiru.jpeg',
            description: 'Kebaya Beludru hitam emas.',
            models: ['Pria', 'Wanita'],
            colors: ['Hitam', 'Biru', 'Hijau']
        },
        {
            id: 8,
            name: 'Baju Adat Bali',
            price: 350000,
            size: 'L',
            image: 'Assets/image/imagehijau.jpeg',
            description: 'Baju adat Bali lengkap dengan aksesoris.',
            models: ['Pria', 'Wanita'],
            colors: ['Merah', 'Hijau', 'Emas']
        },
        
        // Size XL - semua range harga
        {
            id: 9,
            name: 'Jawa Jawi Kebaya',
            price: 180000,
            size: 'XL',
            image: 'Assets/image/imageproduk.jpeg',
            description: 'Kebaya modern sentuhan Jawa.',
            models: ['Wanita'],
            colors: ['Pink', 'Merah', 'Biru']
        },
        {
            id: 10,
            name: 'Jas Adat XL',
            price: 420000,
            size: 'XL',
            image: 'Assets/image/imagebiru.jpeg',
            description: 'Jas adat premium kualitas tinggi.',
            models: ['Pria'],
            colors: ['Hitam', 'Abu']
        },
        
        // Size XXL - semua range harga
        {
            id: 11,
            name: 'Jas Adat Indonesia',
            price: 380000,
            size: 'XXL',
            image: 'Assets/image/imageproduk.jpeg',
            description: 'Jas adat Indonesia berkualitas tinggi.',
            models: ['Pria'],
            colors: ['Hitam', 'Abu']
        },
        {
            id: 12,
            name: 'Baju Adat XXL',
            price: 500000,
            size: 'XXL',
            image: 'Assets/image/imagehijau.jpeg',
            description: 'Baju adat exclusive XXL.',
            models: ['Pria'],
            colors: ['Merah', 'Emas']
        },
        
        // Produk tambahan untuk fill semua range
        {
            id: 13,
            name: 'Kebaya Modern',
            price: 95000,
            size: 'S',
            image: 'Assets/image/imagebiru.jpeg',
            description: 'Kebaya modern terbaru.',
            models: ['Wanita'],
            colors: ['Pink', 'Biru']
        },
        {
            id: 14,
            name: 'Beskap Premium',
            price: 220000,
            size: 'L',
            image: 'Assets/image/imageproduk.jpeg',
            description: 'Beskap premium berkualitas.',
            models: ['Pria'],
            colors: ['Hitam', 'Abu']
        },
        {
            id: 15,
            name: 'Kebaya Cantik',
            price: 310000,
            size: 'M',
            image: 'Assets/image/imagehijau.jpeg',
            description: 'Kebaya cantik untuk acara pernikahan.',
            models: ['Wanita'],
            colors: ['Merah', 'Pink']
        },
        {
            id: 16,
            name: 'Jas Formal',
            price: 480000,
            size: 'XL',
            image: 'Assets/image/imagebiru.jpeg',
            description: 'Jas formal premium.',
            models: ['Pria'],
            colors: ['Hitam']
        }
    ];
    
    // ====== FILTER PRODUK BERDASARKAN FILTER ======
    let products = allProducts;
    
    // Ambil data filter dari localStorage
    const filterData = localStorage.getItem('filterData');
    let appliedFilter = null;
    
    if (filterData) {
        appliedFilter = JSON.parse(filterData);
        
        // Filter berdasarkan ukuran
        if (appliedFilter.size) {
            products = products.filter(p => p.size === appliedFilter.size);
        }
        
        // Filter berdasarkan range harga
        if (appliedFilter.priceRange) {
            const priceRange = appliedFilter.priceRange;
            products = products.filter(p => {
                if (priceRange === '> 400.000') {
                    return p.price > 400000;
                } else if (priceRange === '300.000 - 400.000') {
                    return p.price >= 300000 && p.price <= 400000;
                } else if (priceRange === '150.000 - 300.000') {
                    return p.price >= 150000 && p.price <= 300000;
                } else if (priceRange === '< 150.000') {
                    return p.price < 150000;
                }
                return true;
            });
        }
        
        // Tampilkan pesan filter aktif
        const filterInfo = document.querySelector('.filter-info');
        if (filterInfo) {
            let filterText = 'Filter: ';
            if (appliedFilter.size) filterText += 'Ukuran ' + appliedFilter.size;
            if (appliedFilter.priceRange) filterText += (appliedFilter.size ? ' | ' : '') + appliedFilter.priceRange;
            filterInfo.textContent = filterText;
        }
    }
    
    // ====== RENDER PRODUK ======
    const productGrid = document.querySelector('.product-grid');
    
    function renderProducts() {
        if (!productGrid) return;
        
        // Jika tidak ada produk yang sesuai filter
        if (products.length === 0) {
            productGrid.innerHTML = '<p style="text-align:center;padding:20px;color:#666;">Tidak ada produk yang sesuai dengan filter Anda.</p>';
            return;
        }
        
        productGrid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image" style="background-image: url('${product.image}');"></div>
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

