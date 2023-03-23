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

async function lookUpProduct(event) {
	try {
		event.preventDefault();

		let { codigo, precio, nombre, descripcion, idCategoria, disponibilidad } = getInputs();

		let nuevabusqueda = {};

		if (codigo) {
			nuevabusqueda.codigo = codigo;
		}

		if (nombre) {
			nuevabusqueda.nombre = nombre;
		}

		if (descripcion) {
			nuevabusqueda.descripcion = descripcion;
		}

		if (precio) {
			if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) return showAlert("Introduzca un precio valido", "Error");

			nuevabusqueda.precio = precio;
		}

		if (idCategoria !== "0") {
			if (isNaN(parseFloat(idCategoria)) || parseFloat(idCategoria) <= 0) return showAlert("Introduzca una categoría valida", "Error");

			nuevabusqueda.idCategoria = idCategoria;
		}

		if (disponibilidad) {
			if (isNaN(parseFloat(disponibilidad)) || parseFloat(disponibilidad) <= 0) return showAlert("Introduzca una categoría valida", "Error");

			nuevabusqueda.disponibilidad = disponibilidad;
		}

		console.log(nuevabusqueda);

		let result = await axios.post('/admin/productos/search', nuevabusqueda, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	} catch (error) {
		// Captura de error y mandar retroalimentación al usuario
		showAlert(error.response.data, "Error");
	}
}

btnAgregar.addEventListener("click", insertProduct);
btnConsultar.addEventListener("click", lookUpProduct);
imagen.addEventListener("change", imagenChange);