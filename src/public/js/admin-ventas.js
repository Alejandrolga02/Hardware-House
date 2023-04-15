"use strict";

//Declarar los elementos del DOM
const form = document.querySelector('#form');
const btnConsultar = document.querySelector('#btnConsultar');
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
const getInputs = () =>{
    return {
        id: parseInt(form['id'].value.trim()),
        usuario: form['usuario'].value.trim().substring(0, 60),
        fechaIni: form['fechaIni'].value.trim(),
        fechaFin: form['fechaFin'].value.trim(),
        totalIni: parseFloat(form['totalIni'].value.trim()),
        totalFin: parseFloat(form['totalFin'].value.trim())
    };
};

//Función para validar los datos.
async function lookUpVentas(event) {
    try {
        event.preventDefault();

        let venta = getInputs();
        let busqueda = {};

        if (venta.id){
            busqueda.id = venta.id;
        }

        if (venta.usuario) {
            busqueda.usuario = venta.usuario;
        }

        if (venta.fechaIni) {
            busqueda.fechaIni = venta.fechaIni;
        }

        if (venta.fechaFin) {
            busqueda.fechaFin = venta.fechaFin;
        }

        if (venta.totalIni) {
            if (isNaN(parseFloat(venta.totalIni)) || parseFloat(venta.totalIni) <= 0) return showAlert("Ingrese un total inicial valido", "Error");

            busqueda.totalIni = venta.totalIni;
        }

        if (venta.totalFin) {
            if (isNaN(parseFloat(venta.totalFin)) || parseFloat(venta.totalFin) <= 0) return showAlert("Ingrese un total final valido", "Error");
        
            busqueda.totalFin = venta.totalFin;
        }

        await axios.post('/admin/ventas/', { busqueda }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        window.location.pathname = window.location.pathname;
    }catch (error){
        showAlert(error.response.data, "Error");
    }
}

//Botones necesarios
btnConsultar.addEventListener("click", lookUpVentas);
form.addEventListener("reset", (event) => {
    event.preventDefault();
    window.location.pathname = window.location.pathname;
});