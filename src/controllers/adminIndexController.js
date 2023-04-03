export const renderIndex = async (req, res) => {
	try {
		let { token } = req;
		res.render("admin/menu.html", {
			title: "Admin - Menu Principal",
			navLinks: [
				{ class: "nav-link active", link: "/", title: "Inicio" },
				{ class: "nav-link", link: "/admin/productos/", title: "Productos" },
				{ class: "nav-link", link: "/admin/ventas/", title: "Ventas" },
				{ class: "nav-link", link: "/admin/categorias/", title: "Categorias" },
				{ class: "nav-link", link: "/admin/promociones/", title: "Promociones" },
			],
			url: '/admin/',
			token
		});
	} catch (error) {
		console.log(error);
	}
};