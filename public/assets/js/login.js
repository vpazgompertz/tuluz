const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Completa todos los campos");
    return;
  }

  // simulación login
  console.log("Login:", { email, password });

  // feedback visual
  alert("Inicio de sesión exitoso");

  // redirección
  window.location.href = "/";
});
