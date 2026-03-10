// detailpesanan.js - Halaman Detail Pesanan

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== CEK LOGIN ======
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // ====== TAMPILKAN NOMOR PESANAN ======
    const orderNumber = localStorage.getItem('orderNumber');
    const orderNumberElement = document.querySelector('.order-number strong');
    
    if (orderNumberElement) {
        if (orderNumber) {
            orderNumberElement.textContent = orderNumber;
        } else {
            // Generate random if no order number
            const random = Math.floor(Math.random() * 900000) + 100000;
            orderNumberElement.textContent = 'RB' + random;
        }
    }
    
    // ====== TAMPILKAN DETAIL PESANAN ======
    const orderData = localStorage.getItem('orderData');
    
    if (orderData) {
        const order = JSON.parse(orderData);
        
        // Update detail pesanan
        const detailRows = document.querySelectorAll('.detail-card .row');
        
        const detailData = {
            'Ukuran': order.size || 'M',
            'Warna': order.color || 'Hitam',
            'Model': order.model || 'Pria',
            'Tanggal Mulai': formatDate(order.startDate),
            'Tanggal Selesai': formatDate(order.endDate),
            'Durasi': (order.duration || 1) + ' Hari'
        };
        
        detailRows.forEach(row => {
            const label = row.querySelector('span:first-child');
            const value = row.querySelector('span:last-child');
            
            if (label && value) {
                const labelText = label.textContent.trim();
                if (detailData[labelText]) {
                    value.textContent = detailData[labelText];
                }
            }
        });
        
        // Update total
        const totalElement = document.querySelector('.detail-card .total .price');
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
    
    // ====== TIMELINE STATUS ======
    const orderStatus = localStorage.getItem('orderStatus');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length > 0) {
        // Reset all
        timelineItems.forEach(item => item.classList.remove('active'));
        
        // Activate based on status
        if (orderStatus === 'confirmed') {
            // Pembayaran terkonfirmasi - activate first item
            timelineItems[0].classList.add('active');
            
            // Set timestamp
            const timestamp = timelineItems[0].querySelector('small');
            if (timestamp) {
                const now = new Date();
                const formattedDate = formatDate(now.toISOString()) + ', ' + 
                    String(now.getHours()).padStart(2, '0') + '.' + 
                    String(now.getMinutes()).padStart(2, '0');
                timestamp.textContent = formattedDate;
            }
        }
    }
    
    // ====== TOMBOL KEMBALI KE BERANDA ======
    const btnSecondary = document.querySelector('.btn-secondary');
    if (btnSecondary) {
        btnSecondary.addEventListener('click', function() {
            // Hapus data pesanan
            localStorage.removeItem('orderData');
            localStorage.removeItem('orderNumber');
            localStorage.removeItem('orderStatus');
            
            // Redirect ke halaman caritoko (sebagai beranda)
            window.location.href = 'caritoko.html';
        });
    }
    
    // ====== TOMBOL LANJUT SEWA ======
    const btnPrimary = document.querySelector('.btn-primary');
    if (btnPrimary) {
        btnPrimary.addEventListener('click', function() {
            // Redirect ke lihatproduk untuk sewa lagi
            window.location.href = 'lihatproduk.html';
        });
    }
    
    // ====== KEMBALI ======
    const backBtn = document.querySelector('.back');
    if (backBtn) {
        backBtn.setAttribute('href', 'pembayaran.html');
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

