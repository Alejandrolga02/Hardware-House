"use strict";

// Creacion de funciones necesarias
function showAlert(message, title) {
	const modalToggle = document.getElementById("alertModal");
	const myModal = new bootstrap.Modal("#alertModal", { keyboard: false });
	document.getElementById("alertTitle").innerHTML = title;
	document.getElementById("alertMessage").innerHTML = message;
	myModal.show(modalToggle);
}

const loginForm = document.querySelector("#loginForm");
loginForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	try {
		const usuario = loginForm['usuario'].value;
		const contrasena = loginForm['contrasena'].value;

		if (!usuario || !contrasena) return showAlert("Existen campos vacios", "Error");

		let result = await axios.post('/admin/auth/login', {
			usuario: usuario,
			contrasena: contrasena
		}, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		window.location.href = '/admin/';
	} catch (error) {
		if (error.response.data === "Usuario o contraseña incorrectas") {
			showAlert("Usuario o contraseña incorrectas", "Error");
		} else if (error.response.data === "Sucedio un error") {
			showAlert("Existe un error con el servidor", "Error");
		} else {
			showAlert("Sucedio un error desconocido", "Error");
		}
	}
});
