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

const fillInputs = ({ codigo, nombre, descripcion, precio, url }) => {
	document.querySelector("#codigo").value = codigo;
	document.querySelector("#nombre").value = nombre;
	document.querySelector("#descripcion").value = descripcion;
	document.querySelector("#precio").value = precio.slice(1);
	document.querySelector("#url").value = url;
	document.querySelector("#imgPreview").src = url;
	document.querySelector("#imgPreview").classList.remove("d-none");
};

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
	console.log(imagen.files[0].size);
};

async function insertProduct() {
	try {
		event.preventDefault();

		let { codigo, precio, nombre, descripcion, idCategoria, disponibilidad } = getInputs();

		if (!codigo || !nombre || !descripcion || !imagen.value) return showAlert("Existen campos vacios", "Error");
		if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0 ||
			isNaN(parseInt(idCategoria)) || parseInt(idCategoria) <= 0 ||
			isNaN(parseInt(disponibilidad)) || parseInt(disponibilidad) < 0) return showAlert("Introduzca valores validos", "Error");
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
		window.location.href = '/admin/productos/';

	} catch (error) {
		if (error.response.data === "No se subió una imagen") {
			showAlert("Debes insertar una imagen", "Error");
		} else if (error.response.data === "La imagen excede el tamaño limite") {
			showAlert("Las imagenes no deben pesar mas de 2MB", "Error");
		} else if (error.response.data === "Sucedio un error") {
			showAlert("Existe un error con el servidor", "Error");
		} else if (error.response.data === "Los datos no son del tipo correcto") {
			showAlert("Los datos no son del tipo correcto", "Error");
		} else if (error.response.data === "Existe un registro con ese código") {
			showAlert("Ya existe un producto con ese código", "Error");
		} else {
			showAlert("Sucedio un error desconocido", "Error");
		}
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

async function updateProduct() {
	try {
		event.preventDefault();

		let { codigo, nombre, descripcion, precio } = getInputs();
		const storageRef = refStorage(storage, "productos/" + codigo);

		if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) return showAlert("Introduzca un precio valido", "Error");
		if (!codigo || !nombre || !descripcion) return showAlert("Existen campos vacios", "Error");

		if (!imagen.value) {
			await update(ref(db, "productos/" + codigo), { nombre, descripcion, precio: "$" + precio });
			return showAlert("Se realizó una actualización", "Resultado");
		}

		await uploadBytes(storageRef, imagen.files[0]);
		let url = await getDownloadURL(storageRef);

		await update(ref(db, "productos/" + codigo), { nombre, descripcion, precio: "$" + precio, url });
		return showAlert("Se realizó una actualización", "Resultado");
	} catch (error) {
		if (error.code === "PERMISSION_DENIED" || error.code === "storage/unauthorized") {
			showAlert("No estás autentificado", "Error");
		} else {
			console.error(error);
		}
	}
}

btnAgregar.addEventListener("click", insertProduct);
btnConsultar.addEventListener("click", lookUpProduct);
imagen.addEventListener("change", imagenChange);