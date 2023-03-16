import session from '../session.js'

export const renderIndex = async (req, res) => {
	res.render("admin/menu.html", {
		title: "Admin - Menu Principal",
		scripts: [
			"/js/bootstrap.bundle.min.js",
		]
	});
	console.log(session)
};