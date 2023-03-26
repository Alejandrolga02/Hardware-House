"use strict";

const carrito = document.querySelector("#shopping-cart");
const productsToast = new bootstrap.Toast(document.getElementById('productsToast'));
const alertModal = new bootstrap.Modal("#alertModal", { keyboard: false });
const carritoModal = new bootstrap.Modal("#shopping-cart-modal", { keyboard: false });

// Creacion de funciones necesarias
function showAlert(message, title) {
	const modalToggle = document.getElementById("alertModal");
	document.getElementById("alertTitle").innerHTML = title;
	document.getElementById("alertMessage").innerHTML = message;
	alertModal.show(modalToggle);
}

function showShoppingCart(fragment) {
	const modalToggle = document.getElementById("shopping-cart-modal");
	document.getElementById("shopping-cart-body").innerHTML = "";
	document.getElementById("shopping-cart-body").appendChild(fragment);
	carritoModal.show(modalToggle);
}

function showProductsToast(message, title) {
	document.querySelector("#productsToastBody").innerHTML = message;
	document.querySelector("#productsToastTitle").innerHTML = title;
	productsToast.show();
}

function validateString(cadena) {
	let regex = new RegExp(/^[A-Za-z0-9\s]+$/g);
	return regex.test(cadena);	//Retorna 'true' si no contiene caracteres especiales
}

function deleteItem(index) {
	// Obtención de carrito de localStorage
	let shoppingCart = localStorage.getItem("shopping-cart");
	shoppingCart = JSON.parse(shoppingCart);

	shoppingCart.splice(index, 1);
	carritoModal.hide(document.getElementById("shopping-cart-modal"));

	localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
	mostrarCarrito();
}

function increaseItem(index) {
	// Obtención de carrito de localStorage
	let shoppingCart = localStorage.getItem("shopping-cart");
	shoppingCart = JSON.parse(shoppingCart);

	if (shoppingCart[index].cantidad <= 0) {
		shoppingCart[index].cantidad = 1;
	} else {
		shoppingCart[index].cantidad += 1;
	}

	if (shoppingCart[index].cantidad > shoppingCart[index].disponibilidad) {
		shoppingCart[index].cantidad = shoppingCart[index].disponibilidad;
	}

	document.querySelectorAll(".item-counter")[index].value = shoppingCart[index].cantidad;

	// Guardar carrito en el localStorage
	localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
}

function decreaseItem(index) {
	// Obtención de carrito de localStorage
	let shoppingCart = localStorage.getItem("shopping-cart");
	shoppingCart = JSON.parse(shoppingCart);

	if (shoppingCart[index].cantidad <= 1) {
		return deleteItem(index);
	} else {
		shoppingCart[index].cantidad -= 1;
	}

	if (shoppingCart[index].cantidad > shoppingCart[index].disponibilidad) {
		shoppingCart[index].cantidad = shoppingCart[index].disponibilidad;
	}

	document.querySelectorAll(".item-counter")[index].value = shoppingCart[index].cantidad;

	// Guardar carrito en el localStorage
	localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
}

function clearCarrito() {
	// Eliminación de carrito de localStorage
	localStorage.removeItem('shopping-cart');

	carritoModal.hide(document.getElementById("shopping-cart-modal"));
	mostrarCarrito();
}

function changeCantidadItem(index) {
	// Obtención de carrito de localStorage
	let shoppingCart = localStorage.getItem("shopping-cart");
	shoppingCart = JSON.parse(shoppingCart);

	shoppingCart[index].cantidad = document.querySelectorAll(".item-counter")[index].value;

	if (shoppingCart[index].cantidad > shoppingCart[index].disponibilidad) {
		shoppingCart[index].cantidad = shoppingCart[index].disponibilidad;
	} else if (shoppingCart[index].cantidad <= 0) {
		deleteItem(index)
	}

	document.querySelectorAll(".item-counter")[index].setAttribute("value", shoppingCart[index].cantidad);
	document.querySelectorAll(".item-counter")[index].value = shoppingCart[index].cantidad;

	// Guardar carrito en el localStorage
	localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
}

// Funcion para agregar productos al carrito
async function addProductToCart(codigo) {
	try {
		// Validar codigo
		if (!validateString(codigo)) return showAlert("Introduzca un articulo valido", "Error");

		// Obtención de carrito de localStorage
		let shoppingCart = localStorage.getItem("shopping-cart");
		shoppingCart = JSON.parse(shoppingCart);

		if (shoppingCart === null || shoppingCart.length === 0) shoppingCart = []; // Si el carrito es nulo

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

		localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
		carrito.classList.add("shake");

		showProductsToast("Producto añadido al carrito con exito", "Carrito de compras");

		setTimeout(() => {
			carrito.classList.remove("shake");
		}, 800);
	} catch (error) {
		console.log(error);
		showAlert(error.response.data, "Error");
	}
}

async function mostrarCarrito() {
	try {
		// Obtener información del localStorage
		let shoppingCart = localStorage.getItem("shopping-cart");
		shoppingCart = JSON.parse(shoppingCart);
		const div = document.createElement('div');

		if (shoppingCart === null || shoppingCart.length === 0) { // Validar si el carro está vacio
			div.innerHTML = `<p class="fs-3">Carrito vacio</p><p class="fs-5">Añade productos al carrito para poder continuar</p>`;
		} else {
			div.classList.add("scrollable");
			div.innerHTML = `<table class="table table-light table-hover table-bordered mt-2 mb-0 align-middle">
				<thead>
					<tr>
						<th scope="col" width="20%" class="text-center">Imagen</th>
						<th scope="col" width="30%" class="text-center">Nombre</th>
						<th scope="col" width="20%" class="text-center">Precio</th>
						<th scope="col" width="20%" class="text-center">Cantidad</th>
						<th scope="col" width="10%" class="text-center">Acciones</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>`;
			let table = div.lastElementChild;

			// For para obtener informacion de cada item del inventario
			let i = 0;
			let corregidos = 0;
			for (const item of shoppingCart) {
				try {
					let { data } = await axios.post('/productos/get', {
						codigo: item.codigo
					}, {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					});

					item.disponibilidad = data.disponibilidad;
					item.nombre = data.nombre;
					item.precio = data.precio;
					item.urlImagen = data.urlImagen;
					item.precioFinal = data.precioFinal;
					console.log(item);

					if (data.disponibilidad < item.cantidad) {
						item.cantidad = data.disponibilidad;
					}

					if (item.precio === item.precioFinal) {
						table.lastElementChild.innerHTML += `<tr>
							<td class="text-center p-0">
								<img class="w-100" src="http://res.cloudinary.com/dzlemvbvt/image/upload/w_215,h_215,c_fill,q_90/${item.urlImagen}" alt="Imagen de ${item.nombre}" />
							</td>
							<td class="text-center" scope="row">
								${item.nombre}
							</td>
							<td class="text-center">
								<span class="badge bg-dark fs-5 me-0">$${item.precioFinal}</span>
							</td>
							<td class="text-center">
								<div class="d-flex justify-content-center gap-2">
									<a class="btn btn-dark" onClick="decreaseItem(${i})">
										<img src="/img/decrease.svg">
									</a>
									<input type="number" class="form-control item-counter" value="${item.cantidad}" onChange="changeCantidadItem(${i})">
									<a class="btn btn-dark" onClick="increaseItem(${i})">
										<img src="/img/increase.svg">
									</a>
								</div>
								<p>Disponibles: ${item.disponibilidad}</p>
							</td>
							<td class="text-center p-0">
								<a class="btn btn-danger">
									<img src="/img/eliminar.svg" onClick="deleteItem(${i})">
								</a>
							</td>
						</tr>`;
					} else {
						table.lastElementChild.innerHTML += `<tr>
							<td class="text-center p-0">
								<img class="w-100" src="http://res.cloudinary.com/dzlemvbvt/image/upload/w_215,h_215,c_fill,q_90/${item.urlImagen}" alt="Imagen de ${item.nombre}" />
							</td>
							<td class="text-center" scope="row">
								${item.nombre}
							</td>
							<td class="text-center">
								<span class="badge bg-dark ms-2 fs-5">$${item.precioFinal}</span>
								<br>
								<span class="crossed-out">$${item.precio}</span>
							</td>
							<td class="text-center">
								<div class="d-flex justify-content-center gap-2">
									<a class="btn btn-dark" onClick="decreaseItem(${i})">
										<img src="/img/decrease.svg">
									</a>
									<input type="number" class="form-control item-counter" value="${item.cantidad}" onChange="changeCantidadItem(${i})">
									<a class="btn btn-dark" onClick="increaseItem(${i})">
										<img src="/img/increase.svg">
									</a>
								</div>
								<p>Disponibles: ${item.disponibilidad}</p>
							</td>
							<td class="text-center p-0">
								<a class="btn btn-danger">
									<img src="/img/eliminar.svg" onClick="deleteItem(${i})">
								</a>
							</td>
						</tr>`;
					}
					i++;
				} catch (error) {
					console.error(error);
					shoppingCart.splice(i, 1);
					corregidos++;
					i++;
				}
			}

			if (corregidos > 0) {
				showAlert("Eliminanos " + corregidos + "producto(s) del carrito ya que no se encuentran disponibles", "Error");
			}
			localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
		}

		return showShoppingCart(div);
	} catch (error) {
		showAlert(error.response.data, "Error");
	}
}

carrito.addEventListener("click", (event) => {
	event.preventDefault();
	mostrarCarrito();
});
document.querySelector("#clearCarrito").addEventListener("click", (event) => {
	event.preventDefault();

	clearCarrito();
})