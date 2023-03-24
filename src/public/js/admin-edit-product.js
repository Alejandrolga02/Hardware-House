"use strict";

// Declarar elementos del DOM
const form = document.querySelector("#form");
const btnActualizar = document.querySelector("#btnActualizar");
const imagen = document.querySelector("#urlImagen");
const ulrImagenDefault = document.querySelector("#imgPreview").src;

// Creacion de funciones necesarias
// Funcion para mostrar alertas al usuario
function showAlert(message, title) {
	const modalToggle = document.getElementById("alertModal");
	const myModal = new bootstrap.Modal("#alertModal", { keyboard: false });
	document.getElementById("alertTitle").innerHTML = title;
	document.getElementById("alertMessage").innerHTML = message;
	myModal.show(modalToggle);
}

// Obtener variables del formulario
const getInputs = () => {
	return {
		codigo: form['codigo'].value.trim(),
		precio: form['precio'].value.trim(),
		nombre: form['nombre'].value.trim(),
		descripcion: form['descripcion'].value.trim(),
		idCategoria: form['idCategoria'].value.trim(),
		disponibilidad: form['disponibilidad'].value.trim(),
		estado: form['estado'].value.trim(),
	};
};

// Evento de cambiar imagen muestra thumbnail
const imagenChange = () => {
	document.querySelector("#imgPreview").src = URL.createObjectURL(imagen.files[0]);
	document.querySelector("#imgPreview").classList.remove("d-none");
};

async function updateProduct(event) {
	try {
		event.preventDefault();

		// Llamada a funcion para obtener datos del formulario
		let { codigo, precio, nombre, descripcion, idCategoria, disponibilidad, estado } = getInputs();

		// Validación de campos
		if (!codigo || !nombre || !descripcion || !estado) return showAlert("Existen campos vacios", "Error");
		if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0 ||
			isNaN(parseInt(idCategoria)) || parseInt(idCategoria) <= 0 ||
			isNaN(parseInt(disponibilidad)) || parseInt(disponibilidad) < 0 ||
			isNaN(parseInt(estado)) || parseInt(estado) < 0) return showAlert("Introduzca valores validos", "Error");

		// Creación de objeto a mandar petición
		let productoModificado = {
			codigo,
			precio,
			nombre,
			descripcion,
			idCategoria,
			disponibilidad,
			estado
		}

		if (imagen.value) { // Existe una imagen
			// Validacion de la imagen
			const imageFormats = ["image/png", "image/jpeg"];
			if (!imageFormats.includes(imagen.files[0].type)) return showAlert("Sube una imagen en el campo", "Error");
			if (imagen.files[0].size > 2000000) return showAlert("Las imagenes no deben pesar mas de 2MB", "Error");

			// Añadir imagen al objeto
			productoModificado['urlImagen'] = imagen.files[0];

			console.log(productoModificado);
			console.log(window.location.pathname);

			// Petición a la api para actualizar el registro
			await axios.post(window.location.pathname, productoModificado, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
		} else { // No existe imagen
			// Petición de actualizacion de registro sin imagen
			await axios.post(window.location.pathname, productoModificado, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
		}

		showAlert("Se actualizó el registro con exito", "Resultado");

		setTimeout(() => {
			window.location.href = '/admin/productos/';
		}, 2000);

	} catch (error) {
		// Captura de error y mandar retroalimentación al usuario
		showAlert(error.response.data, "Error");
	}
}

// Creacion de escuchadores de eventos
imagen.addEventListener("change", imagenChange);
btnActualizar.addEventListener("click", updateProduct)
form.addEventListener("reset", (event) => {
	document.querySelector("#imgPreview").src = ulrImagenDefault;
})