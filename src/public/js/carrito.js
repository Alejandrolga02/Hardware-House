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

function showShoppingCart(fragment) {
	// Funcion para mostrar carrito al usuario
	try {
		const modalToggle = document.getElementById("shopping-cart-modal");
		document.getElementById("shopping-cart-body").innerHTML = "";
		document.getElementById("shopping-cart-body").appendChild(fragment);
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
		let regex = new RegExp(/^[A-Za-z0-9\s]+$/g);
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
	shoppingCart = JSON.parse(shoppingCart);

	if (shoppingCart[index].cantidad <= 0) {
		// Si item es menor o igual a cero se borra
		return deleteItem(index);
	}

	if (shoppingCart[index].cantidad > shoppingCart[index].disponibilidad) {
		// Si el item es mayor que lo disponible te lo asigna a lo disponible
		shoppingCart[index].cantidad = shoppingCart[index].disponibilidad;
	} else {
		shoppingCart[index].cantidad += 1;
	}

	// Cambiar valor de caja de texto
	document.querySelectorAll(".item-counter")[index].value = shoppingCart[index].cantidad;

	// Guardar carrito en el localStorage
	localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
}

function decreaseItem(index) {
	// Obtención de carrito de localStorage
	let shoppingCart = localStorage.getItem("shopping-cart");
	shoppingCart = JSON.parse(shoppingCart);

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

	// Cambiar valor de caja de texto
	document.querySelectorAll(".item-counter")[index].value = shoppingCart[index].cantidad;

	// Guardar carrito en el localStorage
	localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
}

function changeCantidadItem(index) {
	// Obtención de carrito de localStorage
	let shoppingCart = localStorage.getItem("shopping-cart");
	shoppingCart = JSON.parse(shoppingCart);

	shoppingCart[index].cantidad = document.querySelectorAll(".item-counter")[index].value;
	let disponibilidad = parseInt(document.querySelectorAll(".disponibilidadItem")[index].innerText);

	if (shoppingCart[index].cantidad > disponibilidad) {
		shoppingCart[index].cantidad = disponibilidad;
	} else if (shoppingCart[index].cantidad <= 0) {
		deleteItem(index);
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
			div.innerHTML = `<table class="table table-light table-hover mt-2 mb-0 align-middle">
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

					if (data.disponibilidad < item.cantidad) {
						item.cantidad = data.disponibilidad;
					}

					table.lastElementChild.innerHTML += `<tr>
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
								<input type="number" class="form-control item-counter" value="${item.cantidad}" onChange="changeCantidadItem(${i})">
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
					shoppingCart.splice(i, 1);
					corregidos++;
				}
				i++;
			}
			if (corregidos > 0) {
				showAlert("Eliminanos " + corregidos + "producto(s) del carrito ya que no se encuentran disponibles", "Error");
			}
		}

		localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
		return showShoppingCart(div);
	} catch (error) {
		showAlert(error.response.data, "Error");
	}
}

carrito.addEventListener("click", mostrarCarrito);

document.querySelector("#clearCarrito").addEventListener("click", () => {
	// Eliminación de carrito de localStorage
	localStorage.removeItem('shopping-cart');
	mostrarCarrito();
});

document.querySelector("#completarCompra").addEventListener("click", async () => {
	try {
		let productsList = localStorage.getItem("shopping-cart");

		let { data } = await axios.post('/buy', {
			productsList,
			tipoPago: 'Efectivo'
		}, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		localStorage.removeItem('shopping-cart');
		carritoModal.hide(document.getElementById("shopping-cart-modal"));
		showAlert("Muchas gracias", "Venta Realizada con exito");
	} catch (error) {
		carritoModal.hide(document.getElementById("shopping-cart-modal"));
		showAlert(error.response.data, "Error");
	}
});