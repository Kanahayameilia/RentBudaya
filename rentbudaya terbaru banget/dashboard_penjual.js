// Dashboard Penjual - Versi Testing

console.log('Dashboard penjual dimuat');

// Cek login saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM siap, cek localStorage...');
    
    // Debug: tampilkan isi localStorage
    console.log('localStorage content:');
    console.log('- isLoggedIn:', localStorage.getItem('isLoggedIn'));
    console.log('- isSellerLoggedIn:', localStorage.getItem('isSellerLoggedIn'));
    console.log('- currentUser:', localStorage.getItem('currentUser'));
    console.log('- currentSeller:', localStorage.getItem('currentSeller'));
    
    // Coba ambil data dari berbagai kemungkinan
    let seller = null;
    
    // Coba dari currentSeller
    const currentSeller = localStorage.getItem('currentSeller');
    if (currentSeller) {
        try {
            seller = JSON.parse(currentSeller);
            console.log('Dapat dari currentSeller:', seller);
        } catch(e) {}
    }
    
    // Coba dari currentUser
    if (!seller) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const user = JSON.parse(currentUser);
                if (user.role === 'seller') {
                    seller = user;
                    console.log('Dapat dari currentUser:', seller);
                }
            } catch(e) {}
        }
    }
    
    // Jika masih tidak ada, coba buat data dummy untuk testing
    if (!seller) {
        // Untuk testing, kita bisa bypass dulu
        console.log('TIDAK ADA DATA SELLER!');
        console.log('Silakan login sebagai penjual terlebih dahulu');
        
        // Tampilkan pesan di halaman
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="text-align:center; padding:50px; background:#F8F1EB; border-radius:20px;">
                    <h2>⚠️ Belum Login sebagai Penjual</h2>
                    <p>Silakan login terlebih dahulu:</p>
                    <a href="login_penjual.html" style="display:inline-block; margin-top:20px; padding:12px 24px; background:#C2764F; color:white; text-decoration:none; border-radius:10px;">Login Penjual</a>
                </div>
            `;
        }
        return;
    }
    
    // Validasi role
    if (seller.role !== 'seller') {
        alert('Akun ini bukan penjual!');
        window.location.href = 'login_penjual.html';
        return;
    }
    
    // Set data seller
    window.sellerData = seller;
    console.log('Seller valid:', seller.nama);
    
    // Tampilkan nama
    const sellerNameEl = document.getElementById('sellerName');
    if (sellerNameEl) {
        sellerNameEl.textContent = seller.nama || seller.email;
    }
    
    // Load data
    loadStore();
    loadStats();
    loadOrders();
    
    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Tab切换
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            window.currentTab = this.dataset.tab;
            loadOrders();
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isSellerLoggedIn');
            localStorage.removeItem('currentSeller');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'login_penjual.html';
        });
    }
    
    // Kelola toko
    const manageStoreBtn = document.getElementById('manageStoreBtn');
    if (manageStoreBtn) {
        manageStoreBtn.addEventListener('click', openStoreModal);
    }
    
    // Tambah produk
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', openProductModal);
    }
}

async function loadStore() {
    try {
        const res = await fetch(`api/toko_penjual.php?seller_id=${window.sellerData.id}`);
        const json = await res.json();
        if (json.success && json.data) {
            window.currentStore = json.data;
            console.log('Toko ditemukan:', window.currentStore.nama);
            document.getElementById('storeStatus').innerHTML = '✅ Toko sudah terdaftar';
        } else {
            console.log('Belum memiliki toko');
            document.getElementById('storeStatus').innerHTML = '⚠️ Belum memiliki toko. Silakan buat toko!';
        }
    } catch (err) {
        console.error('Gagal load toko:', err);
    }
}

async function loadStats() {
    try {
        const res = await fetch(`api/dashboard_penjual.php?seller_id=${window.sellerData.id}`);
        const json = await res.json();
        if (json.success) {
            document.getElementById('totalOrders').textContent = json.data.total_orders || 0;
            document.getElementById('pendingOrders').textContent = json.data.pending_orders || 0;
            document.getElementById('totalProducts').textContent = json.data.total_products || 0;
        }
    } catch (err) {
        console.error('Gagal load stats:', err);
    }
}

async function loadOrders() {
    try {
        const tab = window.currentTab || 'pending';
        let url;
        if (tab === 'pending') {
            url = `api/pesanan_penjual.php?seller_id=${window.sellerData.id}&status=menunggu_pembayaran`;
        } else {
            url = `api/pesanan_penjual.php?seller_id=${window.sellerData.id}&all=true`;
        }
        
        const res = await fetch(url);
        const json = await res.json();
        
        const tbody = document.querySelector('#orders-list tbody');
        if (!tbody) return;
        
        if (!json.success || json.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">📭 Tidak ada pesanan</td></tr>';
            return;
        }
        
        tbody.innerHTML = json.data.map(order => {
            let statusClass = 'status-menunggu';
            let statusText = '';
            let actionButton = '';
            
            if (order.status === 'menunggu_pembayaran') {
                statusText = 'Menunggu Validasi';
                statusClass = 'status-menunggu';
                actionButton = `<button class="btn-validasi" onclick="openValidationModal('${order.nomor_pesanan}', '${order.total_harga}')">✅ Validasi</button>`;
            } else if (order.status === 'pembayaran_dikonfirmasi') {
                statusText = '✅ Pembayaran Dikonfirmasi';
                statusClass = 'status-dikonfirmasi';
                actionButton = '✓ Terverifikasi';
            } else {
                statusText = order.status;
                actionButton = '-';
            }
            
            return `
                <tr>
                    <td>${order.nomor_pesanan}</td>
                    <td>${order.customer_name || '-'}</td>
                    <td>${order.nama_produk || '-'}</td>
                    <td>Rp ${Number(order.total_harga).toLocaleString('id-ID')}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                    <td>${actionButton}</td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error('Gagal load orders:', err);
    }
}

function openValidationModal(orderNumber, total) {
    document.getElementById('modalOrderNumber').textContent = orderNumber;
    document.getElementById('modalTotal').textContent = `Rp ${Number(total).toLocaleString('id-ID')}`;
    document.getElementById('validationModal').style.display = 'flex';
    document.getElementById('confirmValidationBtn').onclick = () => confirmPayment(orderNumber);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

async function confirmPayment(orderNumber) {
    try {
        const res = await fetch('api/validasi_pembayaran.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nomor_pesanan: orderNumber })
        });
        const json = await res.json();
        if (json.success) {
            alert('✅ Pembayaran berhasil divalidasi!');
            closeModal('validationModal');
            loadStats();
            loadOrders();
        } else {
            alert('❌ Gagal: ' + json.message);
        }
    } catch (err) {
        alert('❌ Error: ' + err.message);
    }
}

function openStoreModal() {
    const storeName = document.getElementById('storeName');
    const storeAddress = document.getElementById('storeAddress');
    const storeCity = document.getElementById('storeCity');
    
    if (window.currentStore) {
        storeName.value = window.currentStore.nama || '';
        storeAddress.value = window.currentStore.alamat || '';
        storeCity.value = window.currentStore.kota || 'Magelang';
    } else {
        storeName.value = '';
        storeAddress.value = '';
        storeCity.value = 'Magelang';
    }
    document.getElementById('storeModal').style.display = 'flex';
    document.getElementById('saveStoreBtn').onclick = saveStore;
}

async function saveStore() {
    const name = document.getElementById('storeName').value.trim();
    const address = document.getElementById('storeAddress').value.trim();
    const city = document.getElementById('storeCity').value;
    
    if (!name) {
        alert('Nama toko wajib diisi!');
        return;
    }
    
    const btn = document.getElementById('saveStoreBtn');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Menyimpan...';
    
    try {
        const res = await fetch('api/toko_penjual.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                seller_id: window.sellerData.id,
                nama: name,
                alamat: address,
                kota: city,
                toko_id: window.currentStore?.id || 0
            })
        });
        const json = await res.json();
        if (json.success) {
            alert('🏪 Toko berhasil disimpan!');
            closeModal('storeModal');
            loadStore();
            loadStats();
        } else {
            alert('❌ Gagal: ' + json.message);
        }
    } catch (err) {
        alert('❌ Error: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

function openProductModal() {
    if (!window.currentStore) {
        alert('⚠️ Silakan buat toko terlebih dahulu!');
        return;
    }
    document.getElementById('productName').value = '';
    document.getElementById('productDesc').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productSize').value = 'M';
    document.getElementById('productImage').value = '';
    document.getElementById('productModal').style.display = 'flex';
    document.getElementById('saveProductBtn').onclick = saveProduct;
}

async function saveProduct() {
    const name = document.getElementById('productName').value.trim();
    const desc = document.getElementById('productDesc').value.trim();
    const price = document.getElementById('productPrice').value;
    const size = document.getElementById('productSize').value;
    const imageFile = document.getElementById('productImage').files[0];
    
    if (!name || !price) {
        alert('Nama dan harga produk wajib diisi!');
        return;
    }
    
    const btn = document.getElementById('saveProductBtn');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Menyimpan...';
    
    const formData = new FormData();
    formData.append('toko_id', window.currentStore.id);
    formData.append('nama', name);
    formData.append('deskripsi', desc);
    formData.append('harga_per_hari', price);
    formData.append('ukuran', size);
    if (imageFile) formData.append('gambar', imageFile);
    
    try {
        const res = await fetch('api/produk_penjual.php', {
            method: 'POST',
            body: formData
        });
        const json = await res.json();
        if (json.success) {
            alert('✅ Produk berhasil ditambahkan!');
            closeModal('productModal');
            loadStats();
        } else {
            alert('❌ Gagal: ' + json.message);
        }
    } catch (err) {
        alert('❌ Error: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}