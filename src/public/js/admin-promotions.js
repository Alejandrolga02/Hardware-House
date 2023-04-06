"use-strict";

const form = document.querySelector("#form");
const btnAgregar = document.querySelector("#btnAgregar");
const btnConsultar = document.querySelector("#btnConsultar");
const results = document.querySelector("#results");

function showAlert(message, title) {
    const modalToggle = document.getElementById("alertModal");
    const myModal = new bootstrap.Modal("#alertModal", { keyboard: false });
    document.getElementById("alertTitle").innerHTML = title;
    document.getElementById("alertMessage").innerHTML = message;
    myModal.show(modalToggle);
}

const getInputs = () => {
    return {
        id: form['codigo'].value.trim(),
        nombre: form['nombre'].value.trim(),
        fechaInicio: form['fechaInicio'].value.trim(),
        fechaFin: form['fechaFin'].value.trim(),
        porcentajeDescuento: parseFloat(form['porcentajeDescuento'].value.trim()),
        idCategoria: parseInt(form['idCategoria'].value.trim())
    };
};

async function insertPromotion(event) {
    event.preventDefault();
    try {
        let { id, nombre, fechaInicio, fechaFin, porcentajeDescuento, idCategoria} = getInputs();

        if (!id || !nombre || !fechaInicio || !fechaFin || !porcentajeDescuento) {
            return showAlert("Existen campos vacios", "Error");
        }

        await axios.post('/admin/promociones/add', {
            id,
            nombre,
            fechaInicio,
            fechaFin,
            porcentajeDescuento,
            idCategoria
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        showAlert("Se insertaron con exito los datos", "Resultado");

        setTimeout(() => {
            window.location.href = '/admin/promociones/';
        }, 2000);
    }
    catch (error) {
        if (error.response.data === "Sucedio un error") {
            showAlert("Existe un error con el servidor", "Error");
        } else if (error.response.data === "Existe un registro con ese código") {
            showAlert("Ya existe un producto con ese código", "Error");
        } else {
            showAlert("Sucedio un error desconocido", "Error");
        }
    }
}

async function lookUpPromotion(event) {
	try {
		event.preventDefault();

		let promocion = getInputs();

		let nuevabusqueda = {};

		if (promocion.id) {
			nuevabusqueda.id = promocion.id;
		}

		if (promocion.nombre) {
			nuevabusqueda.nombre = promocion.nombre;
		}

		if (promocion.fechaInicio) {
			nuevabusqueda.  fechaInicio = promocion.fechaInicio;
		}

		if (promocion.fechaFin) {
			nuevabusqueda.fechaFin = promocion.fechaFin;
		}

		if (promocion.porcentajeDescuento) {
			if (isNaN(parseFloat(promocion.porcentajeDescuento)) || parseFloat(promocion.porcentajeDescuento) <= 0) return showAlert("Introduzca un porcentaje valido", "Error");

			nuevabusqueda.porcentajeDescuento = promocion.porcentajeDescuento;
		}

		if (promocion.idCategoria !== 0) {
            if (isNaN(parseFloat(promocion.idCategoria)) || parseFloat(promocion.idCategoria) <= 0) return showAlert("Introduzca una categoría valida", "Error");

			nuevabusqueda.idCategoria = promocion.idCategoria;
		}

		await axios.post('/admin/promociones/', { nuevabusqueda }, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		window.location.pathname = window.location.pathname;
	} catch (error) {
		showAlert(error.response.data, "Error");
	}
}

btnAgregar.addEventListener("click", insertPromotion);
btnConsultar.addEventListener("click", lookUpPromotion);