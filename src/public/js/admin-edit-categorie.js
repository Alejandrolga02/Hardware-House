"use strict";

// Declarar elementos del DOM
const form = document.querySelector("#form");
const btnActualizar = document.querySelector("#btnActualizar");

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
        id: form['id'].value.trim().substring(0, 20),
        nombre: form['nombre'].value.trim().substring(0, 60)
    };
};


async function updateCategorie(event) {
	try {
		event.preventDefault();

		// Llamada a funcion para obtener datos del formulario
		let { id, nombre} = getInputs();

        if (!id || !nombre) {
            return showAlert("Existen campos vacios", "Error");
        }

		// Creación de objeto a mandar petición
		let categoriaModificada = {
			id,
			nombre,
		}

        await axios.post(window.location.pathname, categoriaModificada, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

		showAlert("Se actualizó el registro con exito", "Resultado");

		setTimeout(() => {
			window.location.href = '/admin/categorias/';
		}, 2000);

	} catch (error) {
		// Captura de error y mandar retroalimentación al usuario
		showAlert(error.response.data, "Error");
	}
}

btnActualizar.addEventListener("click", updateProduct)