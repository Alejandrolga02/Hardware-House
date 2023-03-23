export const renderIndex = async (req, res) => {
	res.render("admin/menu.html", {
		title: "Admin - Menu Principal",
		navLinks: [
			{ class: "nav-link active", link: "/", title: "Inicio" },
			{ class: "nav-link", link: "/admin/productos/", title: "Productos" },
			{ class: "nav-link", link: "/admin/ventas/", title: "Ventas" },
			{ class: "nav-link", link: "/admin/categorias/", title: "Categorias" },
			{ class: "nav-link", link: "/admin/promociones/", title: "Promociones" },
		],
		scripts: [
			"/js/bootstrap.bundle.min.js",
		]
	});
};