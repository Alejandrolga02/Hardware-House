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

const getInputs = ()=> {
    return {
        codigo: form['codigo'].value.trim(),
        nombre: form['nombre'].value.trim()
    };
};

async function insertCategorie(event) {
    event.preventDefault();
    try {
        let {codigo, nombre} = getInputs();

        if(!codigo || !nombre) {
            return showAlert("Existen campos vacios", "Error");
        }
        
        await axios.post('/admin/categorias/add', {
            codigo,
            nombre 
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        showAlert("Se insertaron con exito los datos", "Resultado");

        setTimeout(()=> {
            window.location.href = '/admin/categorias';
        }, 2000);
    }
    catch(error) {
		if (error.response.data === "Sucedio un error") {
			showAlert("Existe un error con el servidor", "Error");
		} else if (error.response.data === "Existe un registro con ese código") {
			showAlert("Ya existe un producto con ese código", "Error");
		} else {
            console.log(nombre);
			showAlert("Sucedio un error desconocido", "Error");
		}
    }
}

async function lookUpCategorie(event) {
    try {
        event.preventDefault();

        let {codigo} = getInputs();
        if(codigo === "") return showAlert("Introduzca un código", "Error");

        const dbref = ref(db);
        const snapshot = await get(child(dbref, "categorias/" + codigo));

        if(snapshot.exists()) {
            let nombre = snapshot.val().nombre;

            fillInputs({codigo, nombre});
        }
        else {
            showAlert("No se encontró el registro", "Error");
        }
    }
    catch(error) {
        if(error.code === "PERMISSION_DENIED") {
            showAlert("No estás autenticado", "Error");
        }
        else {
            console.error(error);
        }
    }
}

btnAgregar.addEventListener("click", insertCategorie);
btnConsultar.addEventListener("click", lookUpCategorie);