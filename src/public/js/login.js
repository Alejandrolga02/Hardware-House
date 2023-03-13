import { signIn, showAlert } from "./config.js";

const btnLogin = document.querySelector("#login");

btnLogin.addEventListener("click", async () => {
	event.preventDefault();
	let user = document.querySelector("#email").value;
	let pass = document.querySelector("#password").value;

	if (!user || !pass) return showAlert("Existen campos vacios", "Error");

	try {
		await signIn(user, pass);
	} catch (error) {
		showAlert("Usuario y/o contraseña incorrectas", "Error");
	}
});
