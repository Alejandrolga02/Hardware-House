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
		codigo: form['codigo'].value.trim().substring(0, 20),
		nombre: form['nombre'].value.trim().substring(0, 60),
		descripcion: form['descripcion'].value.trim().substring(0, 200),
		precio: parseFloat(form['precio'].value.trim()),
		idCategoria: parseInt(form['idCategoria'].value.trim()),
		disponibilidad: parseInt(form['disponibilidad'].value.trim()),
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
		if (isNaN(precio) || precio <= 0 || precio > 99999999.99 ||
			isNaN(idCategoria) || idCategoria <= 0 || idCategoria > 100000000 ||
			isNaN(disponibilidad) || disponibilidad < 0 || disponibilidad > 100000000) return showAlert("Introduzca valores validos", "Error");
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

		let producto = getInputs();

		let searchProduct = {};

		if (producto.codigo) {
			searchProduct.codigo = producto.codigo;
		}

		if (producto.nombre) {
			searchProduct.nombre = producto.nombre;
		}

		if (producto.descripcion) {
			searchProduct.descripcion = producto.descripcion;
		}

		if (producto.precio) {
			if (isNaN(parseFloat(producto.precio)) || parseFloat(producto.precio) <= 0) return showAlert("Introduzca un precio valido", "Error");

			searchProduct.precio = producto.precio;
		}

		if (producto.idCategoria !== 0) {
			if (isNaN(parseFloat(producto.idCategoria)) || parseFloat(producto.idCategoria) <= 0) return showAlert("Introduzca una categoría valida", "Error");

			searchProduct.idCategoria = producto.idCategoria;
		}

		if (producto.disponibilidad) {
			if (isNaN(parseFloat(producto.disponibilidad)) || parseFloat(producto.disponibilidad) <= 0) return showAlert("Introduzca una categoría valida", "Error");

			searchProduct.disponibilidad = producto.disponibilidad;
		}

		await axios.post('/admin/productos/', { searchProduct }, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		window.location.pathname = window.location.pathname;
	} catch (error) {
		// Captura de error y mandar retroalimentación al usuario
		showAlert(error.response.data, "Error");
	}
}

async function deshabilitarProductos(codigo) {
	try {
		await axios.get(`/admin/productos/delete/${codigo}`);
		window.location.reload();
	} catch (error) {
		showAlert(error.response.data, "Error");
	}
}

btnAgregar.addEventListener("click", insertProduct);
btnConsultar.addEventListener("click", lookUpProduct);
form.addEventListener("reset", (event) => {
	event.preventDefault();

	window.location.pathname = window.location.pathname;
})
imagen.addEventListener("change", imagenChange);