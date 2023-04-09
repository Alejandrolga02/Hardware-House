"use strict";

let estadoSelect = document.querySelector("#estado");
let municipioSelect = document.querySelector("#municipio");

estados.forEach((element, index) => {
	estadoSelect.innerHTML += `<option value="${index}">${element.nombre}</option>`;
});

estadoSelect.addEventListener("change", () => {
	let municipios = [...estados[estadoSelect.value].municipios];

	let municipiosContent = municipios.reduce((accumulator, value, index) => {
		return accumulator + `<option value="${index}">${value}</option>`;
	}, '<option value="-1" disabled selected>Seleccione un municipio</option>');

	municipioSelect.innerHTML = municipiosContent;
});


// Creacion de funciones necesarias
function showAlert(message, title) {
	const modalToggle = document.getElementById("alertModal");
	const myModal = new bootstrap.Modal("#alertModal", { keyboard: false });
	document.getElementById("alertTitle").innerHTML = title;
	document.getElementById("alertMessage").innerHTML = message;
	myModal.show(modalToggle);
}

const registerForm = document.querySelector("#registerForm");
registerForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	// Obtencion de Informacion del formulario
	const usuario = registerForm['usuario'].value.trim();
	const contrasena = registerForm['contrasena'].value.trim();
	const contrasenaC = registerForm['contrasenaC'].value.trim();
	const nombre = registerForm['nombre'].value.trim();
	const apellidos = registerForm['apellidos'].value.trim();
	const correo = registerForm['correo'].value.trim();
	const telefono = registerForm['telefono'].value.trim();
	const calle = registerForm['calle'].value.trim();
	const colonia = registerForm['colonia'].value.trim();
	const numeroExterior = registerForm['numeroExterior'].value.trim();
	const CP = registerForm['CP'].value.trim();
	const estado = estadoSelect.value;
	const municipio = municipioSelect.value;

	try {
		// Usuario vacio
		if (!usuario || usuario.length === 0)
			return showAlert("El usuario es obligatorio", "Error");

		// Contraseña vacia
		if (!contrasena || contrasena.length === 0)
			return showAlert("La contraseña es obligatoria", "Error");

		// Contraseña vacia
		if (!contrasenaC || contrasenaC.length === 0)
			return showAlert("La contraseña es obligatoria", "Error");

		// nombre vacio
		if (!nombre || nombre.length === 0)
			return showAlert("El nombre es obligatorio", "Error");

		// correo vacio
		if (!correo || correo.length === 0)
			return showAlert("El correo es obligatorio", "Error");

		// apellido vacio
		if (!apellidos || apellidos.length === 0)
			return showAlert("El apellido es obligatorio", "Error");

		// telefono vacio
		if (!telefono || telefono.length === 0)
			return showAlert("El telefono es obligatorio", "Error");

		// calle vacia
		if (!calle || calle.length === 0)
			return showAlert("La calle es obligatoria", "Error");

		// colonia vacia
		if (!colonia || colonia.length === 0)
			return showAlert("La colonia es obligatoria", "Error");

		// numero exterior vacio
		if (!numeroExterior || numeroExterior.length === 0)
			return showAlert("El numero exterior es obligatoria", "Error");

		// numero exterior vacio
		if (!CP || CP.length === 0)
			return showAlert("El codigo postal es obligatorio", "Error");

		// municipio invalido
		if (!municipio || municipio == "-1")
			return showAlert("El municipio es obligatorio", "Error");

		// estado invalido
		if (!estado || estado == "-1")
			return showAlert("El estado es obligatorio", "Error");

		// Contraseñas no coinciden
		if (contrasena !== contrasenaC)
			return showAlert("Las contraseña no coinciden", "Error");


		let { data } = await axios.post('/register', {
			nombre,
			apellidos,
			usuario,
			contrasena,
			estado,
			municipio,
			numeroExterior,
			colonia,
			CP,
			calle,
			correo,
			telefono
		}, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		showAlert(data.message, "Mensaje");

		setTimeout(async () => {
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
