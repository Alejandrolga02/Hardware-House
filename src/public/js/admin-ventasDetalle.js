const userModal = new bootstrap.Modal("#user-info-modal", {
	backdrop: 'static',
	keyboard: false
});

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

async function showInfo(id) {
	if (isNaN(id) || id <= 0) {
		return;
	}

	let {
		data
	} = await axios.get('/admin/ventas/getUser/' + id);

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