document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // 🔐 CEK LOGIN
    // ===============================
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // ===============================
    // 📦 STATE
    // ===============================
    let products = [];
    let filteredProducts = [];

    const grid = document.querySelector('.product-grid');

    // ===============================
    // 🏪 LOAD TOKO
    // ===============================
    loadStore();

    // ===============================
    // 🚀 FETCH PRODUK DARI API
    // ===============================
    fetchProducts();

    function fetchProducts() {
        // Ambil toko_id dari localStorage
        let tokoId = '';
        try {
            const store = JSON.parse(localStorage.getItem('selectedStore'));
            tokoId = store ? (store.id || store.toko_id || store.id_toko || '') : '';
        } catch(e) {}

        fetch('api/produk.php?toko_id=' + tokoId)
            .then(res => {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(data => {
                console.log('RAW API:', data);

                // Normalisasi: API bisa return array langsung atau {data:[...]} dll
                let raw = [];
                if (Array.isArray(data))             raw = data;
                else if (Array.isArray(data.data))   raw = data.data;
                else if (Array.isArray(data.produk)) raw = data.produk;
                else if (Array.isArray(data.items))  raw = data.items;

                if (raw.length === 0) {
                    showError('Tidak ada produk tersedia.');
                    return;
                }

                products = normalizeData(raw);
                applyFilter();
                renderProducts();
            })
            .catch(err => {
                console.error('Fetch gagal:', err);
                showError('Gagal memuat produk dari server.');
            });
    }

    // ===============================
    // 🔄 NORMALISASI DATA API
    // ===============================
    function normalizeData(raw) {
        return raw.map(item => {

            const name = item.nama
                      || item.nama_produk
                      || item.name
                      || item.judul
                      || 'Produk';

            const price = Number(
                item.harga_per_hari
             || item.harga
             || item.harga_sewa
             || item.price
             || item.tarif
             || 0
            );

            const size = item.ukuran
                      || item.size
                      || item.ukuran_baju
                      || '-';

            const rawImg = item.gambar
                        || item.foto
                        || item.foto_produk
                        || item.image
                        || item.img
                        || '';

            let image = 'Assets/image/default.jpg';
            if (rawImg) {
                if (rawImg.startsWith('http') || rawImg.startsWith('/') || rawImg.startsWith('Assets/')) {
                    image = rawImg;
                } else {
                    image = 'Assets/image/' + rawImg;
                }
            }

            return {
                id: item.id || item.id_produk || Math.random(),
                name,
                price,
                size,
                image
            };
        });
    }

    // ===============================
    // 🔍 FILTER
    // ===============================
    function applyFilter() {
        filteredProducts = [...products];

        let filterData = null;
        try { filterData = JSON.parse(localStorage.getItem('filterData')); }
        catch(e) { console.warn('filterData tidak valid'); }

        if (!filterData) {
            showFilterInfo(null);
            return;
        }

        if (filterData.size) {
            filteredProducts = filteredProducts.filter(p => p.size === filterData.size);
        }

        if (filterData.priceRange) {
            filteredProducts = filteredProducts.filter(p => {
                const r = filterData.priceRange;
                if (r === '> 400.000')         return p.price > 400000;
                if (r === '300.000 - 400.000') return p.price >= 300000 && p.price <= 400000;
                if (r === '150.000 - 300.000') return p.price >= 150000 && p.price <= 300000;
                if (r === '< 150.000')         return p.price < 150000;
                return true;
            });
        }

        showFilterInfo(filterData);
    }

    function showFilterInfo(filter) {
        const el = document.querySelector('.filter-info');
        if (!el) return;
        if (!filter) { el.textContent = ''; return; }

        let text = '';
        if (filter.size)       text += 'Ukuran ' + filter.size;
        if (filter.priceRange) text += (text ? ' | ' : '') + filter.priceRange;
        el.textContent = text ? 'Filter: ' + text : '';
    }

    // ===============================
    // 🎨 RENDER PRODUK
    // ===============================
    function renderProducts() {
        if (!grid) return;

        if (!filteredProducts.length) {
            grid.innerHTML = `
                <p style="text-align:center;padding:30px;color:#666;">
                    Tidak ada produk yang sesuai.
                </p>`;
            return;
        }

        grid.innerHTML = filteredProducts.map(p => `
            <div class="product-card">
                <div class="product-image"
                     style="background-image:url('${p.image}')">
                </div>
                <div class="product-info">
                    <p class="product-name">${p.name}</p>
                    <div class="bottom">
                        <div class="price">
                            Rp ${p.price.toLocaleString('id-ID')}
                            <span>per hari</span>
                        </div>
                        <button class="sewa" data-id="${p.id}">Sewa</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function showError(msg) {
        if (grid) grid.innerHTML = `
            <p style="color:#c0392b;text-align:center;padding:30px;">
                ${msg}
            </p>`;
    }

    // ===============================
    // 🖱️ EVENT — klik Sewa
    // ===============================
    if (grid) {
        grid.addEventListener('click', e => {
            if (!e.target.classList.contains('sewa')) return;

            const id      = e.target.dataset.id;
            const product = filteredProducts.find(p => String(p.id) === String(id));

            if (product) {
                localStorage.setItem('selectedProduct', JSON.stringify(product));
                window.location.href = 'sewa.html';
            }
        });
    }

    // ===============================
    // 🏪 LOAD DATA TOKO
    // ===============================
    function loadStore() {
        const card = document.querySelector('.store-card');
        if (!card) return;

        let data = null;
        try { data = JSON.parse(localStorage.getItem('selectedStore')); } catch(e) {}

        if (data) {
            card.innerHTML = `<h2>${data.name || data.nama || ''}</h2>
                              <p>${data.address || data.alamat || ''}</p>`;
        } else {
            card.innerHTML = `<h2>Toko Adat Jaya</h2>
                              <p>Penyewaan baju dan aksesoris adat lengkap</p>`;
        }
    }

    // ===============================
    // 🔙 NAVIGASI
    // ===============================
    document.querySelector('.back')?.addEventListener('click', () => {
        window.location.href = 'caritoko.html';
    });

    document.querySelector('.logout')?.addEventListener('click', e => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Dropdown profil
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileMenu     = document.querySelector('.profile-menu');
    const profileBtn      = document.querySelector('.profile-btn');

    profileBtn?.addEventListener('click', e => {
        e.stopPropagation();
        if (!profileMenu) return;
        profileMenu.style.display =
            profileMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', e => {
        if (profileMenu && profileDropdown && !profileDropdown.contains(e.target)) {
            profileMenu.style.display = 'none';
        }
    });

});