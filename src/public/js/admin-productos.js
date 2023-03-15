"use strict";
// Import cloudinary credentials
const api_key = "379625484436796"
const cloud_name = "dzlemvbvt"

// Declarar elementos del DOM
const results = document.querySelector("#results");
const imagen = document.querySelector("#urlImagen");
const form = document.querySelector("#form");

const clearInputs = () => {
	event.preventDefault();
	document.querySelector("#codigo").value = "";
	document.querySelector("#nombre").value = "";
	document.querySelector("#precio").value = "";
	document.querySelector("#descripcion").value = "";
	document.querySelector("#url").value = "";
	document.querySelector("#imgPreview").classList.add("d-none");
	imagen.value = "";
};

const fillInputs = ({ codigo, nombre, descripcion, precio, url }) => {
	document.querySelector("#codigo").value = codigo;
	document.querySelector("#nombre").value = nombre;
	document.querySelector("#descripcion").value = descripcion;
	document.querySelector("#precio").value = precio.slice(1);
	document.querySelector("#url").value = url;
	document.querySelector("#imgPreview").src = url;
	document.querySelector("#imgPreview").classList.remove("d-none");
};

const imagenChange = () => {
	document.querySelector("#imgPreview").src = URL.createObjectURL(imagen.files[0]);
	document.querySelector("#imgPreview").classList.remove("d-none");
};

async function insertProduct() {
	try {
		event.preventDefault();

		let { codigo, nombre, descripcion, precio } = getInputs();
		const dbref = ref(db);
		const storageRef = refStorage(storage, "productos/" + codigo);

		if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) return showAlert("Introduzca un precio valido", "Error");
		if (!codigo || !nombre || !descripcion || !imagen.value) return showAlert("Existen campos vacios", "Error");

		const snapshot = await get(child(dbref, "productos/" + codigo));
		if (snapshot.exists()) return showAlert("Ya existe un producto con ese código", "Error");

		await uploadBytes(storageRef, imagen.files[0]);
		let url = await getDownloadURL(storageRef);

		await set(ref(db, "productos/" + codigo), { nombre, descripcion, precio: "$" + precio, url, status: "0" });

		showAlert("Se insertaron con exito los datos", "Resultado");
	} catch (error) {
		if (error.code === "PERMISSION_DENIED" || error.code === "storage/unauthorized") {
			showAlert("No estás autentificado", "Error");
		} else {
			console.error(error);
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

async function showProducts() {
	event.preventDefault();

	try {
		const dbref = ref(db, "productos");

		const storageRef = refStorage(storage, "imagenVacia.svg");
		let urlDefault = await getDownloadURL(storageRef);

		await onValue(dbref, snapshot => {
			results.innerHTML = `<caption>Lista de productos</caption><thead><tr>
					<th scope="col" width="5%" class="text-center">Código</th>
					<th scope="col" width="30%" class="text-center">Nombre</th>
					<th scope="col" width="30%" class="text-center">Descripción</th>
					<th scope="col" width="15%" class="text-center">Precio</th>
					<th scope="col" width="15%" class="text-center">Imagen</th>
					<th scope="col" width="5%" class="text-center">Estado</th>
				</tr></thead><tbody></tbody>`;

			snapshot.forEach(childSnapshot => {
				const childKey = childSnapshot.key;
				const childData = childSnapshot.val();

				let imgURL = childData.url;
				let status = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-check" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					<rect x="4" y="4" width="16" height="16" rx="2" />
					<path d="M9 12l2 2l4 -4" />
				</svg>`;

				if (childData.url === undefined) imgURL = urlDefault;

				if (childData.status === "1") {
					status = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-x" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
						<rect x="4" y="4" width="16" height="16" rx="2" />
						<path d="M10 10l4 4m0 -4l-4 4" />
					</svg>`;
				}

				results.lastElementChild.innerHTML += `<tr>
					<th class="text-center" scope="row">${childKey}</th>
					<td class="text-center">${childData.nombre}</td>
					<td class="text-center">${childData.descripcion}</td>
					<td class="text-center">${childData.precio}</td>
					<td class="text-center p-0"><img class="w-100" src="${imgURL}" alt="Imagen de ${childData.nombre}"/></td>
					<td class="text-center">${status}</td>
				</tr>`;
			});
		});

		results.classList.remove("d-none");
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

async function disableProduct() {
	try {
		event.preventDefault();

		let { codigo } = getInputs();
		if (codigo === "") return showAlert("Introduzca un código", "Error");
		const dbref = ref(db);

		const snapshot = await get(child(dbref, "productos/" + codigo));
		if (!snapshot.exists()) {
			return showAlert("No existe un producto con ese código", "Error");
		}

		if (snapshot.val().status === "1") {
			await update(ref(db, "productos/" + codigo), { status: "0" });
			showAlert("El registro fue habilitado", "Resultado");
		} else {
			await update(ref(db, "productos/" + codigo), { status: "1" });
			showAlert("El registro fue deshabilitado", "Resultado");
		}

		await showProducts();
	} catch (error) {
		if (error.code === "PERMISSION_DENIED") {
			showAlert("No estás autentificado", "Error");
		} else {
			console.error(error);
		}
	}
}

form.addEventListener("submit", insertProduct);
form.addEventListener("reset", clearInputs);
imagen.addEventListener("change", imagenChange);
