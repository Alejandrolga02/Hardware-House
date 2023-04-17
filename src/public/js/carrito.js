"use strict";

const carrito = document.querySelector("#shopping-cart");
const productsToast = new bootstrap.Toast(document.getElementById('productsToast'));
const alertModal = new bootstrap.Modal("#alertModal", { backdrop: true, keyboard: true });
const carritoModal = new bootstrap.Modal("#shopping-cart-modal", { backdrop: 'static', keyboard: false });

// Creacion de funciones necesarias
function showAlert(message, title) {
	// Funcion necesaria para poder mostrar mensajes al usuario
	try {
		const modalToggle = document.getElementById("alertModal");
		document.getElementById("alertTitle").innerHTML = title;
		document.getElementById("alertMessage").innerHTML = message;
		alertModal.show(modalToggle);
	} catch (error) {
		console.log(error);
	}
}

function showShoppingCart(fragment, empty = false) {
	// Funcion para mostrar carrito al usuario
	try {
		const modalToggle = document.getElementById("shopping-cart-modal");
		document.getElementById("shopping-cart-body").innerHTML = "";
		document.getElementById("shopping-cart-body").appendChild(fragment);

		if (empty) {
			document.getElementById("shopping-cart-footer").innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>`;
		} else {
			document.getElementById("shopping-cart-footer").innerHTML = `<button class="btn btn-danger" onClick="clearCarrito()">
				<span>Vaciar carrito</span>
				<img src="/img/carritoDelete.svg" alt="Icono de vaciar carrito">
			</button>
			<button class="btn btn-success" onClick="completarCompra()">
				<span>Completar compra</span>
				<img src="/img/carrito.svg" alt="Icono de carrito">
			</button>`;
		}

		carritoModal.show(modalToggle);
	} catch (error) {
		console.log(error);
	}
}

function showProductsToast(message, title) {
	// Funcion para notificaciones al usuario
	try {
		document.querySelector("#productsToastBody").innerHTML = message;
		document.querySelector("#productsToastTitle").innerHTML = title;
		productsToast.show();
	} catch (error) {
		console.log(error);
	}
}

function validateString(cadena) {
	// Funcion para validar texto
	try {
		let regex = new RegExp(/^[A-Za-z0-9-áéíóúÁÉÍÓÚ\s]+$/g);
		return regex.test(cadena);	//Retorna 'true' si no contiene caracteres especiales
	} catch (error) {
		console.log(error);
		return false;
	}
}

function deleteItem(index) {
	try {
		// Obtención de carrito de localStorage
		let shoppingCart = localStorage.getItem("shopping-cart");
		shoppingCart = JSON.parse(shoppingCart);

		// Si el carrito es nulo o solo tiene un producto
		if (shoppingCart === null || shoppingCart.length <= 1) {
			localStorage.removeItem("shopping-cart");
		} else {
			// Eliminar producto del carrito
			shoppingCart.splice(index, 1);
			localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));

			let cartContent = document.querySelector("#shoppingCartContent");
			cartContent.removeChild(cartContent.children[index]);

		}
		mostrarCarrito();
	} catch (error) {
		console.log(error);
	}
}

function increaseItem(index) {
	// Obtención de carrito de localStorage
	let shoppingCart = localStorage.getItem("shopping-cart");

	try {
		shoppingCart = JSON.parse(shoppingCart);
	} catch (error) {
		localStorage.setItem("shopping-cart", '[]');
		return mostrarCarrito();
	}

	if (isNaN(shoppingCart[index].cantidad)) {
		shoppingCart[index].cantidad = 1;
		document.querySelectorAll(".item-counter")[index].value = shoppingCart[index].cantidad;
		return localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
	}

	if (shoppingCart[index].cantidad <= 0) {
		// Si item es menor o igual a cero se borra
		return deleteItem(index);
	}

	if (shoppingCart[index].cantidad >= shoppingCart[index].disponibilidad) {
		// Si el item es mayor que lo disponible te lo asigna a lo disponible
		shoppingCart[index].cantidad = shoppingCart[index].disponibilidad;
	} else {
		shoppingCart[index].cantidad += 1;
	}

	// Poner total correspondiente
	document.querySelector("#shopping-cart-total").value = calcularTotal(shoppingCart);

	// Cambiar valor de caja de texto
	document.querySelectorAll(".item-counter")[index].value = shoppingCart[index].cantidad;

	// Guardar carrito en el localStorage
	localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
}

function decreaseItem(index) {
	// Obtención de carrito de localStorage
	let shoppingCart = localStorage.getItem("shopping-cart");

	try {
		shoppingCart = JSON.parse(shoppingCart);
	} catch (error) {
		localStorage.setItem("shopping-cart", '[]');
		return mostrarCarrito();
	}

	if (isNaN(shoppingCart[index].cantidad)) {
		shoppingCart[index].cantidad = 2;
		document.querySelectorAll(".item-counter")[index].value = shoppingCart[index].cantidad;
		return localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
	}

	if (shoppingCart[index].cantidad <= 1) {
		// Si el item es menor a 1 lo elimina
		return deleteItem(index);
	}

	if (shoppingCart[index].cantidad > shoppingCart[index].disponibilidad) {
		// Si el item es mayor que lo disponible te lo asigna a lo disponible
		shoppingCart[index].cantidad = shoppingCart[index].disponibilidad;
	} else {
		shoppingCart[index].cantidad -= 1;
	}

	// Poner total correspondiente
	document.querySelector("#shopping-cart-total").value = calcularTotal(shoppingCart);

	// Cambiar valor de caja de texto
	document.querySelectorAll(".item-counter")[index].value = shoppingCart[index].cantidad;

	// Guardar carrito en el localStorage
	localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
}

function changeCantidadItem(index) {
	// Obtención de carrito de localStorage
	let shoppingCart = localStorage.getItem("shopping-cart");

	try {
		shoppingCart = JSON.parse(shoppingCart);
	} catch (error) {
		localStorage.setItem("shopping-cart", '[]');
		return mostrarCarrito();
	}

	if (isNaN(shoppingCart[index].cantidad)) {
		shoppingCart[index].cantidad = 1;
		return localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
	}

	shoppingCart[index].cantidad = parseInt(document.querySelectorAll(".item-counter")[index].value);

	if (shoppingCart[index].cantidad >= shoppingCart[index].disponibilidad) {
		shoppingCart[index].cantidad = shoppingCart[index].disponibilidad;
	} else if (shoppingCart[index].cantidad <= 0 || isNaN(shoppingCart[index].cantidad)) {
		return deleteItem(index);
	}

	// Poner total correspondiente
	document.querySelector("#shopping-cart-total").value = calcularTotal(shoppingCart);

	document.querySelectorAll(".item-counter")[index].setAttribute("value", shoppingCart[index].cantidad);
	document.querySelectorAll(".item-counter")[index].value = shoppingCart[index].cantidad;

	// Guardar carrito en el localStorage
	localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
}

// Funcion para agregar productos al carrito
async function addProductToCart(codigo) {
	try {
		if (!isLogged) {
			return window.location.pathname = "/login";
		}

		// Validar codigo
		if (!validateString(codigo)) return showAlert("Introduzca un articulo valido", "Error");

		// Obtención de carrito de localStorage
		let shoppingCart = localStorage.getItem("shopping-cart");

		try {
			shoppingCart = JSON.parse(shoppingCart);
		} catch (error) {
			localStorage.setItem("shopping-cart", '[]');
			return addProductToCart(codigo);
		}

		// Si el carrito es nulo lo declara como arreglo
		if (shoppingCart === null || shoppingCart.length === 0) shoppingCart = [];

		// For para verificar si existe el articulo en el carrito
		let found = false;
		for (const item of shoppingCart) {
			if (item.codigo === codigo) {
				if (item.cantidad <= 0) {
					item.cantidad = 1;
				} else {
					item.cantidad += 1;
				}
				found = true;
				break;
			}
		}

		// Articulo no existente en el carrito
		if (!found) {
			// Añadir producto al carrito
			let producto = {
				codigo,
				cantidad: 1
			}
			shoppingCart.push(producto);
		}

		// Guardar carrito
		localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));

		// Retroalimentacion al usuario
		showProductsToast("Producto añadido al carrito con exito", "Carrito de compras");
		carrito.classList.add("shake");
		setTimeout(() => {
			carrito.classList.remove("shake");
		}, 800);
	} catch (error) {
		console.log(error);
		showAlert(error.response.data, "Error");
	}
}

function calcularTotal(carrito = '[]') {
	let total = 0;

	carrito.forEach(item => {
		total += parseFloat(item.precioFinal) * parseFloat(item.cantidad);
	});

	return total;
}

async function mostrarCarrito() {
	// Obtener información del localStorage
	let shoppingCart = localStorage.getItem("shopping-cart");

	const div = document.createElement('div');

	try {
		shoppingCart = JSON.parse(shoppingCart);
	} catch (error) {
		localStorage.setItem("shopping-cart", '[]');
		return mostrarCarrito();
	}

	if (shoppingCart === null || shoppingCart.length === 0) { // Validar si el carro está vacio
		div.innerHTML = `
			<div id="shopping-cart-alerts"></div>
			<p class="fs-3">Carrito vacio</p><p class="fs-5">Añade productos al carrito para poder continuar</p>
		`;
		localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
		return showShoppingCart(div, true);
	}

	div.innerHTML = `
	<div id="shopping-cart-alerts"></div>

	<div class="row mb-0 mb-md-2">
		<div class="col-12 col-md-6 mb-2 mb-md-0">
			<label for="tipoPago" class="form-label">Método de pago</label>
			<select class="form-select" id="tipoPago">
				<option disabled selected>Seleccione un método de pago</option>
				<option value="Transferencia">Transferencia</option>
				<option value="Débito">Débito</option>
				<option value="Crédito">Crédito</option>
			</select>
		</div>
		<div class="col-12 col-md-6 mb-2 mb-md-0">
			<label for="precio" class="form-label">Total</label>
			<div class="input-group">
				<span class="input-group-text">$</span>
				<input type="text" id="shopping-cart-total" class="form-control" disabled required />
			</div>
		</div>
	</div>
	
	<table class="table table-light table-hover mt-2 mb-0 align-middle">
		<thead>
			<tr>
				<th scope="col" style="min-width: 125px" class="text-center">Imagen</th>
				<th scope="col" style="min-width: 200px" class="text-center">Nombre</th>
				<th scope="col" style="min-width: 100px" class="text-center">Precio</th>
				<th scope="col" style="min-width: 200px" class="text-center">Cantidad</th>
				<th scope="col" style="min-width: 100px" class="text-center">Acciones</th>
			</tr>
		</thead>
		<tbody id="shoppingCartContent" class="table-group-divider">
		</tbody>
	</table>`;
	let tableContent = div.querySelector("#shoppingCartContent");

	// For para obtener informacion de cada item del inventario
	let i = 0;
	let erroneos = [];
	for (const item of shoppingCart) {
		try {
			let { data } = await axios.post('/productos/get', {
				codigo: item.codigo
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			if (typeof data === "string") {
				window.location.pathname = "/login";
			}

			if (data.disponibilidad < item.cantidad) {
				item.cantidad = data.disponibilidad;
			}
			item.disponibilidad = data.disponibilidad;
			item.precioFinal = data.precioFinal;

			tableContent.innerHTML += `<tr>
				<td class="text-center p-0">
					<img class="w-100" src="http://res.cloudinary.com/dzlemvbvt/image/upload/w_150,h_150,c_fill,q_90/${data.urlImagen}" alt="Imagen de ${data.nombre}" />
				</td>
				<td class="text-center" scope="row">
					${data.nombre}
				</td>
				<td class="text-center">
					${data.precioFinal === data.precio
					? `<span class="badge bg-dark fs-6 m-0">$${data.precioFinal.toFixed(2).replace(".00", "")}</span>`
					: `<span class="badge bg-dark fs-6">$${data.precioFinal.toFixed(2).replace(".00", "")}</span><br><span class="mt-2 crossed-out">$${data.precio.toFixed(2).replace(".00", "")}</span>`}
				</td>
				<td class="text-center">
					<div class="d-flex justify-content-center gap-2">
						<a class="btn btn-dark" onClick="decreaseItem(${i})">
							<img src="/img/decrease.svg">
						</a>
						<input type="number" class="form-control item-counter" min="0" max="${data.disponibilidad}" value="${item.cantidad}" onChange="changeCantidadItem(${i})">
						<a class="btn btn-dark" onClick="increaseItem(${i})">
							<img src="/img/increase.svg">
						</a>
					</div>
					<p class="mb-0 mt-2 p-0">Disponibles: <span class="disponibilidadItem">${data.disponibilidad}</span></p>
				</td>
				<td class="text-center p-0">
					<button type="button" class="btn btn-danger">
						<img src="/img/eliminar.svg" onClick="deleteItem(${i})">
					</button>
				</td>
			</tr>`;
		} catch (error) {
			console.error(error);
			erroneos.push(i);
		}
		i++;
	}

	// Poner total correspondiente
	div.querySelector("#shopping-cart-total").value = calcularTotal(shoppingCart);

	// Elimina los elementos en orden inverso para no afectar los indices
	for (let i = erroneos.length - 1; i >= 0; i--) {
		shoppingCart.splice(erroneos[i], 1);
	}

	if (shoppingCart === null || shoppingCart.length === 0) { // Validar si el carro está vacio
		div.innerHTML = `
				<div id="shopping-cart-alerts"></div>
				<p class="fs-3">Carrito vacio</p><p class="fs-5">Añade productos al carrito para poder continuar</p>
			`;
		localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
		return showShoppingCart(div, true);
	}

	if (erroneos.length > 0) {
		let alert = div.querySelector("#shopping-cart-alerts");
		alert.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
				Eliminamos ${erroneos.length} productos del carrito ya que no estaban disponibles.
				<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
			</div>`;
	}


	localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
	return showShoppingCart(div);
}

async function completarCompra() {
	try {
		let productsList = localStorage.getItem("shopping-cart");
		let tipoPago = document.querySelector("#tipoPago").value;

		if (tipoPago !== "Transferencia" && tipoPago !== "Débito" && tipoPago !== "Crédito") {
			let shoppingCartAlerts = document.querySelector("#shopping-cart-alerts");
			return shoppingCartAlerts.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
				Seleccione un método de pago válido
				<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
			</div>`;
		}

		await axios.post('/buy', {
			productsList,
			tipoPago
		}, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		localStorage.removeItem('shopping-cart');
		carritoModal.hide(document.getElementById("shopping-cart-modal"));
		showAlert("Muchas gracias", "Venta Realizada con exito");
	} catch (error) {
		localStorage.removeItem('shopping-cart');
		carritoModal.hide(document.getElementById("shopping-cart-modal"));
		showAlert(error.response.data, "Error");
	}
}

function clearCarrito() {
	// Eliminación de carrito de localStorage
	localStorage.removeItem('shopping-cart');
	mostrarCarrito();
}