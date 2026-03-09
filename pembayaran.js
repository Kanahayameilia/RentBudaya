// pembayaran.js - Halaman Pembayaran

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== CEK LOGIN ======
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // ====== TAMPILKAN RINGKASAN PESANAN ======
    const orderData = localStorage.getItem('orderData');
    
    if (orderData) {
        const order = JSON.parse(orderData);
        
        // Update ringkasan pesanan
        const rows = document.querySelectorAll('.summary .row');
        
        // Mapping data ke elemen yang sesuai
        const summaryData = {
            'Ukuran': 'M', // Default, bisa dikembangkan
            'Warna': order.color || 'Hitam',
            'Model': order.model || 'Pria',
            'Tanggal Mulai': formatDate(order.startDate),
            'Tanggal Selesai': formatDate(order.endDate),
            'Durasi': (order.duration || 1) + ' Hari'
        };
        
        // Update elemen row dengan data
        rows.forEach(row => {
            const label = row.querySelector('span:first-child');
            const value = row.querySelector('span:last-child');
            
            if (label && value) {
                const labelText = label.textContent.trim();
                if (summaryData[labelText]) {
                    value.textContent = summaryData[labelText];
                }
            }
        });
        
        // Update total
        const totalElement = document.querySelector('.summary .total span:last-child');
        if (totalElement && order.total) {
            totalElement.textContent = order.total.toLocaleString('id-ID');
        }
    }
    
    // ====== FORMAT TANGGAL ======
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // ====== GENERATE NOMOR PESANAN ======
    function generateOrderNumber() {
        const random = Math.floor(Math.random() * 900000) + 100000;
        return 'RB' + random;
    }
    
    // ====== TOMBOL SUDAH BAYAR ======
    const bayarBtn = document.querySelector('.btn-bayar');
    
    if (bayarBtn) {
        bayarBtn.addEventListener('click', function() {
            // Generate nomor pesanan
            const orderNumber = generateOrderNumber();
            
            // Simpan nomor pesanan
            localStorage.setItem('orderNumber', orderNumber);
            
            // Simpan status pesanan
            localStorage.setItem('orderStatus', 'confirmed');
            
            // Redirect ke halaman detail pesanan
            window.location.href = 'Detailpesanan.html';
        });
    }
    
    // ====== KEMBALI ======
    const backBtn = document.querySelector('.back');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'sewa.html';
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

