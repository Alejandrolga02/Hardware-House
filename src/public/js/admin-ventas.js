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
const getInputs = () =>{
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
async function divisionFunciones (event){
    try{
        event.preventDefault();

        let venta = getInputs();
        console.log(venta.fechaIni.length);
        console.log(venta.id);
        console.log(venta.Usuario.length);
        console.log(venta.fechaFin.length);
        console.log((venta.id === NaN) && (venta.Usuario.length === 0) && (venta.fechaIni.length === 0) && (venta.fechaFin.length === 0));
        if(venta.id === NaN && venta.Usuario.length === 0 && venta.fechaIni.length === 0 && venta.fechaFin.length === 0){
            obtencionTotales;
        }else if(venta.id === NaN && venta.Usuario.length === 0 && venta.totalIni.length === 0 && venta.totalFin.length === 0){
            obtencionFecha;
        }else if(venta.totalIni.length === 0 && venta.totalFin.length === 0 && venta.fechaIni.length === 0 && venta.fechaFin.length === 0){
            obtencionIdUser;
        }else{
            showAlert("Rellene solo los campos necesarios", "Error")
        }

    }catch(error){
        showAlert(error.response.data, "Error");
    }
}

//Función para validar datos de fecha
async function obtencionFecha(event){
    try{
        event.preventDefault();

        let venta = getInputs();
        let busqueda = {};

        if (venta.fechaIni) {
            busqueda.fechaIni = venta.fechaIni;
        }

        if (venta.fechaFin) {
            busqueda.fechaFin = venta.fechaFin;
        }

        await axios.post('/admin/ventas/busqueda-fecha', { busqueda }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        window.location.pathname = window.location.pathname;

    }catch(error){
        showAlert(error.response.data, "Error");
    }
}

//Función para validar las cantidades
async function obtencionTotales(event) {
    try{
        event.preventDefault();

        let venta = getInputs();
        let busqueda = {};

        if (venta.totalIni) {
            if (isNaN(parseFloat(venta.totalIni)) || parseFloat(venta.totalIni) < 0) return showAlert("Ingrese un total inicial valido", "Error");

            busqueda.totalIni = venta.totalIni;
        }

        if (venta.totalFin) {
            if (isNaN(parseFloat(venta.totalFin)) || parseFloat(venta.totalFin) <= 0) return showAlert("Ingrese un total final valido", "Error");
        
            busqueda.totalFin = venta.totalFin;
        }

        await axios.post('/admin/ventas/busqueda-total', { busqueda }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        window.location.pathname = window.location.pathname;

    }catch(error){
        showAlert(error.response.data, "Error");
    }
}

//Función para validar los datos.
async function obtencionIdUser(event) {
    try {
        event.preventDefault();

        let venta = getInputs();
        let busqueda = {};

        if (venta.id){
            busqueda.id = venta.id;
        }

        if (venta.Usuario) {
            busqueda.Usuario = venta.Usuario;
        }

        await axios.post('/admin/ventas/busqueda-id', { busqueda }, {
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
btnConsultarIdUser.addEventListener("click", divisionFunciones);
form.addEventListener("reset", (event) => {
    event.preventDefault();
    window.location.pathname = window.location.pathname;
});
