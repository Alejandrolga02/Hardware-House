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