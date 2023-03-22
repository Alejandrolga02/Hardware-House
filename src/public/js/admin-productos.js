"use strict";

// Declarar elementos del DOM
const form = document.querySelector("#form");
const btnAgregar = document.querySelector("#btnAgregar");
const btnConsultar = document.querySelector("#btnConsultar");
const results = document.querySelector("#results");
const imagen = document.querySelector("#urlImagen");

// Creacion de funciones necesarias
function showAlert(message, title) {
	const modalToggle = document.getElementById("alertModal");
	const myModal = new bootstrap.Modal("#alertModal", { keyboard: false });
	document.getElementById("alertTitle").innerHTML = title;
	document.getElementById("alertMessage").innerHTML = message;
	myModal.show(modalToggle);
}

// Variables input
const getInputs = () => {
	return {
		codigo: form['codigo'].value.trim(),
		precio: form['precio'].value.trim(),
		nombre: form['nombre'].value.trim(),
		descripcion: form['descripcion'].value.trim(),
		idCategoria: form['idCategoria'].value.trim(),
		disponibilidad: form['disponibilidad'].value.trim(),
	};
};

// Evento de cambiar imagen muestra thumbnail
const imagenChange = () => {
	document.querySelector("#imgPreview").src = URL.createObjectURL(imagen.files[0]);
	document.querySelector("#imgPreview").classList.remove("d-none");
};

async function insertProduct(event) {
	try {
		event.preventDefault();

		let { codigo, precio, nombre, descripcion, idCategoria, disponibilidad } = getInputs();

		const imageFormats = ["image/png", "image/jpeg"];
		if (!codigo || !nombre || !descripcion || !imagen.value) return showAlert("Existen campos vacios", "Error");
		if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0 ||
			isNaN(parseInt(idCategoria)) || parseInt(idCategoria) <= 0 ||
			isNaN(parseInt(disponibilidad)) || parseInt(disponibilidad) < 0) return showAlert("Introduzca valores validos", "Error");
		if (!imageFormats.includes(imagen.files[0].type)) return showAlert("Sube una imagen en el campo", "Error");
		if (imagen.files[0].size > 2000000) return showAlert("Las imagenes no deben pesar mas de 2MB", "Error");

		await axios.post('/admin/productos/add', {
			codigo,
			precio,
			nombre,
			descripcion,
			idCategoria,
			disponibilidad,
			urlImagen: imagen.files[0]
		}, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});

		showAlert("Se insertaron con exito los datos", "Resultado");

		setTimeout(() => {
			window.location.href = '/admin/productos/';
		}, 2000);

	} catch (error) {
		// Captura de error y mandar retroalimentación al usuario
		showAlert(error.response.data, "Error");
	}
}

async function lookUpProduct() {
	try {
		event.preventDefault();

		let { codigo } = getInputs();
		if (codigo === "") return showAlert("Introduzca un código", "Error");

		const dbref = ref(db);
		const snapshot = await get(child(dbref, "productos/" + codigo));

		if (snapshot.exists()) {
			let nombre = snapshot.val().nombre;
			let descripcion = snapshot.val().descripcion;
			let precio = snapshot.val().precio;
			let url = snapshot.val().url;

			if (!url) url = await getDownloadURL(refStorage(storage, "imagenVacia.svg"));
			document.querySelector("#imagen").value = "";
			fillInputs({ codigo, nombre, descripcion, precio, url });
		} else {
			showAlert("No se encontró el registro", "Error");
		}
	} catch (error) {
		if (error.code === "PERMISSION_DENIED") {
			showAlert("No estás autentificado", "Error");
		} else {
			console.error(error);
		}
	}
}

btnAgregar.addEventListener("click", insertProduct);
btnConsultar.addEventListener("click", lookUpProduct);
imagen.addEventListener("change", imagenChange);