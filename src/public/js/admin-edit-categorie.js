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
        nombre: form['nombre'].value.trim().substring(0, 60),
        estado: parseInt(form['estado'].value.trim())
    };
};

async function updateCategorie(event) {
	try {
		event.preventDefault();

		let { id, nombre, estado} = getInputs();

        if (!id || !nombre) {
            return showAlert("Existen campos vacios", "Error");
        }
		if(isNaN(estado) || estado < 0 || estado > 1) {
			return showAlert("Introduzca valores validos", "Error");
		}

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