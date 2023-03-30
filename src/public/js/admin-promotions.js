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
        codigo: form['codigo'].value.trim(),
        nombre: form['nombre'].value.trim(),
        fechaInicio: form['fechaInicio'].value.trim(),
        fechaFin: form['fechaFin'].value.trim(),
        porcentajeDescuento: form['porcentajeDescuento'].value.trim(),
        idCategoria: form['idCategoria'].value.trim()
    };
};

async function insertPromotion(event) {
    event.preventDefault();
    try {
        let { codigo, nombre, fechaInicio, fechaFin, porcentajeDescuento, idCategoria} = getInputs();

        if (!codigo || !nombre || !fechaInicio || !fechaFin || !porcentajeDescuento) {
            return showAlert("Existen campos vacios", "Error");
        }

        await axios.post('/admin/promociones/add', {
            codigo,
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

btnAgregar.addEventListener("click", insertPromotion);