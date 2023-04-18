"use strict";

//Declarar los elementos del DOM
const form = document.querySelector('#form');
const btnConsultarIdUser = document.querySelector('#btnConsultarIdUser');
const btnConsultarFecha = document.querySelector('#btnConsultarFecha');
const btnConsultarTotales = document.querySelector('#btnConsultarTotales');
const results = document.querySelector("#results");

//FUNCIONES NECESARIAS

//Función para alertar errores
function showAlert(message, title) {
    const modalToggle = document.getElementById("alertModal");
    const myModal = new bootstrap.Modal("#alertModal", { keyboard: false });
    document.getElementById("alertTitle").innerHTML = title;
    document.getElementById("alertMessage").innerHTML = message;
    myModal.show(modalToggle);
}

//Obtener los valores de los inputs
const getInputs = () => {
    return {
        id: parseInt(form['id'].value.trim()),
        Usuario: form['usuario'].value.trim().substring(0, 60),
        fechaIni: form['fechaIni'].value.trim(),
        fechaFin: form['fechaFin'].value.trim(),
        totalIni: parseFloat(form['totalIni'].value.trim()),
        totalFin: parseFloat(form['totalFin'].value.trim())
    };
};

//Función para llamar a otras funciones
async function divisionFunciones(event) {
    try {
        event.preventDefault();

        let { Usuario, id, fechaIni, fechaFin, totalIni, totalFin } = getInputs();

        if (totalIni > 0 && !isNaN(totalIni) && totalFin > 0 && !isNaN(totalFin)) {
            obtencionTotales(totalIni, totalFin);
        } else if (fechaIni !== "" && fechaFin !== "") {
            obtencionFecha(fechaIni, fechaFin);
        } else if (Usuario !== "" || !isNaN(id)) {
            obtencionIdUser(Usuario, id);
        } else {
            showAlert("Rellene solo los campos necesarios", "Error")
        }
    } catch (error) {
        showAlert(error.response.data, "Error");
    }
}

//Función para validar datos de fecha
async function obtencionFecha(fechaIni, fechaFin) {
    try {
        await axios.post('/admin/ventas/busqueda-fecha', {
            busqueda: {
                fechaIni,
                fechaFin
            }
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        window.location.pathname = window.location.pathname;

    } catch (error) {
        showAlert(error.response.data, "Error");
    }
}

//Función para validar las cantidades
async function obtencionTotales(totalIni, totalFin) {
    try {
        if (totalIni >= totalFin) {
            return showAlert("El total final debe ser mayor que el total inicial", "Mensaje")
        }
        await axios.post('/admin/ventas/busqueda-total', {
            busqueda: {
                totalIni,
                totalFin
            }
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        window.location.pathname = window.location.pathname;

    } catch (error) {
        showAlert(error.response.data, "Error");
    }
}

//Función para validar los datos.
async function obtencionIdUser(Usuario, id) {
    try {
        await axios.post('/admin/ventas/busqueda-id', {
            busqueda: {
                Usuario,
                id
            }
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        window.location.pathname = window.location.pathname;
    } catch (error) {
        showAlert(error.response.data, "Error");
    }
}

//Botones necesarios
btnConsultarIdUser.addEventListener("click", divisionFunciones);
form.addEventListener("reset", (event) => {
    event.preventDefault();
    window.location.pathname = window.location.pathname;
});
