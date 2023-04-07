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
        id: form['id'].value.trim(),
        nombre: form['nombre'].value.trim(),
        estado: parseInt(form['estado'].value.trim())
    };
};

async function updateCategorie(event) {
    console.log("HOLA");
	try {
		event.preventDefault();

		// Llamada a funcion para obtener datos del formulario
		let { id, nombre, estado} = getInputs();

        if (!id || !nombre || !estado) {
            return showAlert("Existen campos vacios", "Error");
        }

		// Creación de objeto a mandar petición
		let categoriaModificada = {
			id,
			nombre,
            estado
		}

        console.log(window.location.pathname);
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

btnActualizar.addEventListener("click", updateCategorie)