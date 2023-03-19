const loginForm = document.querySelector("#loginForm");

function showAlert(message, title) {
	const modalToggle = document.getElementById("alertModal");
	const myModal = new bootstrap.Modal("#alertModal", { keyboard: false });
	document.getElementById("alertTitle").innerHTML = title;
	document.getElementById("alertMessage").innerHTML = message;
	myModal.show(modalToggle);
}

loginForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	try {
		debugger;
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
		if (error.response.status === 500) {
			showAlert("Usuario y/o contraseña incorrectas", "Error");
		} else {
			showAlert("Sucedio un error", "Error");
		}
	}
});
