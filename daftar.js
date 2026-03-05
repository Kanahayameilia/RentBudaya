document.getElementById("daftarForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(email !== "" && password !== "") {
    window.location.href = "caritoko.html";
  }
});