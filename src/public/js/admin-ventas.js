"use strict";

//Declarar los elementos del DOM
const form = document.querySelector('#form');
const btnConsultarIdUser = document.querySelector('#btnConsultarIdUser');
const btnConsultarFecha = document.querySelector('#btnConsultarFecha');
const btnConsultarTotales = document.querySelector('#btnConsultarTotales');
const userModal = new bootstrap.Modal("#user-info-modal", { backdrop: 'static', keyboard: false });
const results = document.querySelector("#results");

//FUNCIONES NECESARIAS
function showUserInfo(fragment) {
    // Funcion para mostrar carrito al usuario
    try {
        const modalToggle = document.getElementById("user-info-modal");
        document.getElementById("user-info-body").innerHTML = "";
        document.getElementById("user-info-body").appendChild(fragment);

        userModal.show(modalToggle);
    } catch (error) {
        console.log(error);
    }
}

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

async function showInfo(id) {
    if (isNaN(id) || id <= 0) {
        return;
    }

    let { data } = await axios.get('/admin/ventas/getUser/' + id);

    let div = document.createElement("div");
    div.innerHTML = `
    <div class="row mb-0 mb-md-2">
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label class="form-label">Usuario</label>
            <input type="text" value="${data.usuario}" class="form-control" disabled />
        </div>
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label for="precio" class="form-label">Rol</label>
            <input type="text" value="${data.esAdmin === 1 ? 'Administrador' : 'Cliente'}" class="form-control" disabled />
        </div>
    </div>
    <div class="row mb-0 mb-md-2">
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label class="form-label">Nombre</label>
            <input type="text" value="${data.nombre}" class="form-control" disabled />
        </div>
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label for="precio" class="form-label">Apellidos</label>
            <input type="text" value="${data.apellidos}" class="form-control" disabled />
        </div>
    </div>
    <div class="row mb-0 mb-md-2">
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label class="form-label">Correo</label>
            <input type="text" value="${data.correo}" class="form-control" disabled />
        </div>
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label for="precio" class="form-label">Telefono</label>
            <input type="text" value="${data.telefono}" class="form-control" disabled />
        </div>
    </div>    
    <div class="row mb-0 mb-md-2">
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label class="form-label">Estado</label>
            <input type="text" value="${data.estado}" class="form-control" disabled />
        </div>
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label for="precio" class="form-label">Municipio</label>
            <input type="text" value="${data.municipio}" class="form-control" disabled />
        </div>
    </div>
    <div class="row mb-0 mb-md-2">
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label class="form-label">Colonia</label>
            <input type="text" value="${data.colonia}" class="form-control" disabled />
        </div>
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label for="precio" class="form-label">Codigo Postal</label>
            <input type="text" value="${data.CP}" class="form-control" disabled />
        </div>
    </div>
    <div class="row mb-0 mb-md-2">
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label for="precio" class="form-label">Calle</label>
            <input type="text" value="${data.calle}" class="form-control" disabled />
        </div>
        <div class="col-12 col-md-6 mb-2 mb-md-0">
            <label class="form-label">Numero Exterior</label>
            <input type="text" value="${data.numeroExterior}" class="form-control" disabled />
        </div>
    </div>
    `;

    showUserInfo(div);
}

//Botones necesarios
btnConsultarIdUser.addEventListener("click", divisionFunciones);
form.addEventListener("reset", (event) => {
    event.preventDefault();
    window.location.pathname = window.location.pathname;
});
