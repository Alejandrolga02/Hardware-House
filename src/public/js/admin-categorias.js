"use strict";

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
        id: form['id'].value.trim(),
        nombre: form['nombre'].value.trim()
    };
};

async function insertCategorie(event) {
    event.preventDefault();
    try {
        let { id, nombre } = getInputs();

        if (!id || !nombre) {
            return showAlert("Existen campos vacios", "Error");
        }

        await axios.post('/admin/categorias/add', {
            id,
            nombre
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        showAlert("Se insertaron con exito los datos", "Resultado");

        setTimeout(() => {
            window.location.href = '/admin/categorias';
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

async function lookUpCategorie(event) {
    try {
		event.preventDefault();

		let categoria = getInputs();

		let searchCategorie = {};

		if (categoria.id) {
			searchCategorie.id = categoria.id;
		}

		if (categoria.nombre) {
			searchCategorie.nombre = categoria.nombre;
		}
        
		await axios.post('/admin/categorias/', { searchCategorie }, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		window.location.pathname = window.location.pathname;
	} catch (error) {
		showAlert(error.response.data, "Error");
	}
}

btnAgregar.addEventListener("click", insertCategorie);
btnConsultar.addEventListener("click", lookUpCategorie);