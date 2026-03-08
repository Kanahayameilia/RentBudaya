// DROPDOWN PROFIL
const profileBtn = document.querySelector(".profile-btn");
const profileMenu = document.querySelector(".profile-menu");

profileBtn.addEventListener("click", function () {
    profileMenu.classList.toggle("show");
});


// LOGOUT
const logoutBtn = document.querySelector(".logout");

logoutBtn.addEventListener("click", function () {

    const konfirmasi = confirm("Apakah Anda yakin ingin logout?");

    if (konfirmasi) {
        alert("Anda berhasil logout");
        window.location.href = "login.html";
    }

});


// COPY NOMOR PESANAN
const orderNumber = document.querySelector(".order-number strong");

orderNumber.addEventListener("click", function () {

    const text = orderNumber.innerText;

    navigator.clipboard.writeText(text);

    alert("Nomor pesanan berhasil disalin!");

});


// BUTTON NAVIGASI
const btnHome = document.querySelector(".btn-secondary");
const btnRent = document.querySelector(".btn-primary");

btnHome.addEventListener("click", function () {

    window.location.href = "beranda.html";

});

btnRent.addEventListener("click", function () {

    window.location.href = "katalog.html";

});


// NOTIFIKASI PEMBAYARAN BERHASIL
window.addEventListener("load", function(){

    setTimeout(function(){

        alert("Pembayaran berhasil dikonfirmasi!");

    },1000);

});