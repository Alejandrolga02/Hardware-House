"use strict";

const carrito = document.querySelector("#shopping-cart");
// Creacion de funciones necesarias
function showAlert(message, title) {
	const modalToggle = document.getElementById("alertModal");
	const myModal = new bootstrap.Modal("#alertModal", { keyboard: false });
	document.getElementById("alertTitle").innerHTML = title;
	document.getElementById("alertMessage").innerHTML = message;
	myModal.show(modalToggle);
}

// Funcion para agregar productos al carrito
async function addProductToCart(codigo) {
	try {
		// Validar codigo
		if (!validateString(codigo)) return showAlert("Introduzca un articulo valido", "Error");

		// Obtención de carrito de localStorage
		let shoppingCart = localStorage.getItem("shopping-cart");
		shoppingCart = JSON.parse(shoppingCart);

		if (shoppingCart === null) { // Si el carrito es nulo
			shoppingCart = [];

			// Consulta a la base de datos para obtener informacion del producto
			let result = await axios.post('/productos/get', { codigo }, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			// Añadir producto al carrito
			result.data.cantidad = 1;
			shoppingCart.push(result.data);
		} else {
			// For para verificar si existe el articulo en el carrito
			let found = false;
			for (const item of shoppingCart) {
				if (item.codigo === codigo) {
					item.cantidad += 1;
					found = true;
					break;
				}
			}

			// Articulo no existente en el carrito
			if (!found) {
				// Consulta a la base de datos para obtener informacion del producto
				let result = await axios.post('/productos/get', { codigo }, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});

				// Añadir producto al carrito
				result.data.cantidad = 1;
				shoppingCart.push(result.data);
			}
		}

		localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
		carrito.classList.add("shake");
		setTimeout(() => {
			carrito.classList.remove("shake");
		}, 800);
	} catch (error) {
		console.log(error);
		showAlert(error.response.data, "Error");
	}
}

function validateString(cadena) {
	let regex = new RegExp(/^[A-Za-z0-9\s]+$/g);
	return regex.test(cadena);	//Retorna 'true' si no contiene caracteres especiales
}

carrito.addEventListener("click", () => {
	let shoppingCart = localStorage.getItem("shopping-cart");
	shoppingCart = JSON.parse(shoppingCart);

	for (const item of shoppingCart) {

	}
});