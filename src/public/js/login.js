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

	// Obtencion de Informacion del formulario
	const usuario = loginForm['usuario'].value.trim();
	const contrasena = loginForm['contrasena'].value.trim();

	try {
		// Usuario vacio
		if (!usuario || usuario.length === 0)
			return showAlert("El usuario es obligatorio", "Error");

		// Contraseña vacia
		if (!contrasena || usuario.length === 0)
			return showAlert("La contraseña es obligatoria", "Error");

		// Usuario largo
		if (usuario.length > 60) {
			loginForm['usuario'].value = loginForm['usuario'].value.substring(0, 60);
			return showAlert("El usuario es muy largo", "Error");
		}

		// Contraseña larga
		if (contrasena.length > 60) {
			loginForm['contrasena'].value = loginForm['contrasena'].value.substring(0, 60);
			return showAlert("La contraseña es muy larga", "Error");
		}

		let { data } = await axios.post('/login', {
			usuario: usuario,
			contrasena: contrasena
		}, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		showAlert(data.message, "Mensaje");
		localStorage.setItem('token', `Bearer ${data.token}`);

		setTimeout(() => {
			if (data.isAdmin === 1) {
				window.location.pathname = '/admin/'
			} else {
				window.location.pathname = '/'
			}
		}, 1000);

	} catch (error) {
		showAlert(error.response.data, "Error");
	}
});
