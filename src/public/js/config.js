"use strict";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

export const firebaseConfig = {
	apiKey: "AIzaSyDDG__NXwuBiuiJimbogM-FJOQVl2nJhlc",
	authDomain: "alejandrolga-webfinal.firebaseapp.com",
	projectId: "alejandrolga-webfinal",
	storageBucket: "alejandrolga-webfinal.appspot.com",
	messagingSenderId: "527030299000",
	appId: "1:527030299000:web:a1c1c54973bf2a9211008d",
	measurementId: "G-13ZX3GTW9G",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase();
export const storage = getStorage();
export const auth = getAuth(app);

export async function signIn(user, pass) {
	try {
		await signInWithEmailAndPassword(auth, user, pass);
	} catch (error) {
		throw new Error(error);
	}
}

export function showAlert(message, title) {
	const modalToggle = document.getElementById("alertModal");
	const myModal = new bootstrap.Modal("#alertModal", { keyboard: false });
	document.getElementById("alertTitle").innerHTML = title;
	document.getElementById("alertMessage").innerHTML = message;
	myModal.show(modalToggle);
}

onAuthStateChanged(auth, async user => {
	if (user) {
		if (window.location.pathname.includes("/admin/") && !window.location.pathname.includes("/admin/admin")) {
			window.location.href = "/admin/admin.html";
		}
	} else {
		if (window.location.pathname.includes("/admin/admin")) {
			window.location.href = "/admin/index.html";
		}
	}
});
