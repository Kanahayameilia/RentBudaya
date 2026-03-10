// sewa.js - Halaman Sewa Produk

// Variable global untuk menyimpan pilihan
let selectedModel = 'Pria';
let selectedColor = 'Hitam';

// Fungsi pilih model
function selectModel(element, model) {
    // Hapus active dari semua model
    const modelOptions = document.querySelectorAll('#model-options .tag');
    modelOptions.forEach(tag => tag.classList.remove('active'));
    
    // Tambah active ke yang diklik
    element.classList.add('active');
    selectedModel = model;
    console.log('Model dipilih:', selectedModel);
}

// Fungsi pilih warna
function selectColor(element, color) {
    // Hapus active dari semua warna
    const colorOptions = document.querySelectorAll('#color-options .tag');
    colorOptions.forEach(tag => tag.classList.remove('active'));
    
    // Tambah active ke yang diklik
    element.classList.add('active');
    selectedColor = color;
    console.log('Warna dipilih:', selectedColor);
    
    // Ganti gambar sesuai warna
    const productImage = document.getElementById('product-image');
    if (productImage) {
        // Ganti gambar berdasarkan warna
        let imagePath = 'Assets/image/image.png';
        
        switch(color) {
            case 'Hitam':
                imagePath = 'Assets/image/imageproduk.jpeg'; // baju hitam
                break;
            case 'Biru':
                imagePath = 'Assets/image/imagebiru.jpeg'; // baju biru
                break;
            case 'Hijau':
                imagePath = 'Assets/image/imagehijau.jpeg'; // baju hijau
                break;
        }
        
        productImage.src = imagePath;
        console.log('Gambar diganti ke:', imagePath);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== CEK LOGIN ======
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // ====== TAMPILKAN DATA PRODUK ======
    const storedProduct = localStorage.getItem('selectedProduct');
    let product = null;
    
    if (storedProduct) {
        product = JSON.parse(storedProduct);
        
        const productTitle = document.querySelector('.detail-card h2');
        const productDesc = document.querySelector('.desc');
        
        if (productTitle) productTitle.textContent = product.name;
        if (productDesc) productDesc.textContent = product.description;
    } else {
        const productTitle = document.querySelector('.detail-card h2');
        if (productTitle) productTitle.textContent = 'Kebaya Beskap Solo';
    }
    
    // ====== TANGGAL ======
    const startDateInput = document.querySelector('.date-field:first-child input');
    const endDateInput = document.querySelector('.date-field:last-child input');
    
    const today = new Date().toISOString().split('T')[0];
    if (startDateInput) startDateInput.min = today;
    if (endDateInput) endDateInput.min = today;
    
    if (startDateInput) {
        startDateInput.addEventListener('change', function() {
            if (endDateInput) {
                endDateInput.min = this.value;
                
                // BATAS MAKSIMAL 3 HARI
                const maxDate = new Date(this.value);
                maxDate.setDate(maxDate.getDate() + 3);
                const maxDateStr = maxDate.toISOString().split('T')[0];
                endDateInput.max = maxDateStr;
                
                if (endDateInput.value && endDateInput.value > maxDateStr) {
                    endDateInput.value = maxDateStr;
                }
            }
        });
    }
    
    // ====== HITUNG DURASI DAN TOTAL ======
    function calculateTotal() {
        if (!startDateInput || !endDateInput) return null;
        
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        
        if (startDateInput.value && endDateInput.value && endDate >= startDate) {
            const diffTime = endDate - startDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            
            if (product) {
                const total = diffDays * product.price;
                return {
                    days: diffDays,
                    total: total,
                    startDate: startDateInput.value,
                    endDate: endDateInput.value
                };
            }
        }
        return null;
    }
    
    // ====== TOMBOL LANJUT KE PEMBAYARAN ======
    const lanjutBtn = document.querySelector('.btn-lanjut');
    
    if (lanjutBtn) {
        lanjutBtn.addEventListener('click', function() {
            const calculation = calculateTotal();
            
            // Validasi
            if (!startDateInput.value || !endDateInput.value) {
                alert('Silakan pilih tanggal mulai dan selesai!');
                return;
            }
            
            if (!calculation) {
                alert('Tanggal selesai harus lebih dari atau sama dengan tanggal mulai!');
                return;
            }
            
            // BATAS MAKSIMAL 3 HARI
            if (calculation.days > 3) {
                alert('Maksimal sewa adalah 3 hari!');
                return;
            }
            
            // Simpan data pesanan ke localStorage
            const orderData = {
                product: product,
                model: selectedModel,
                color: selectedColor,
                size: product.size || '-',
                startDate: calculation.startDate,
                endDate: calculation.endDate,
                duration: calculation.days,
                total: calculation.total
            };
            
            localStorage.setItem('orderData', JSON.stringify(orderData));
            
            // Redirect ke halaman pembayaran
            window.location.href = 'pembayaran.html';
        });
    }
    
    // ====== KEMBALI ======
    const backBtn = document.querySelector('.back');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'lihatproduk.html';
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

