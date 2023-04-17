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
        fechaInicio: form['fechaInicio'].value.trim(),
        fechaFin: form['fechaFin'].value.trim(),
        porcentajeDescuento: parseFloat(form['porcentajeDescuento'].value.trim()),
        idCategoria: parseInt(form['idCategoria'].value.trim()),
		estado: parseInt(form['estado'].value.trim()),
    };
};

async function updatePromotion(event) {
	try {
		event.preventDefault();

        let { id, nombre, fechaInicio, fechaFin, porcentajeDescuento, idCategoria, estado} = getInputs();


		if (!id || !nombre || !fechaInicio || !fechaFin || !porcentajeDescuento) {
            return showAlert("Existen campos vacios", "Error");
        }

		let promocionModificada = {
			id,
			nombre,
			fechaInicio,
			fechaFin,
			porcentajeDescuento,
			idCategoria, 
			estado
		}

        await axios.post(window.location.pathname, promocionModificada, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

		showAlert("Se actualizó el registro con exito", "Resultado");

		setTimeout(() => {
			window.location.href = '/admin/promociones/';
		}, 2000);

	} catch (error) {
		showAlert(error.response.data, "Error");
	}
}

btnActualizar.addEventListener("click", updatePromotion)