const session = {
	id: undefined,
	isAuth: false,
	isAdmin: false,

	setSession: (id, isAuth, isAdmin) => {
		session.id = id;
		session.isAuth = isAuth;
		session.isAdmin = isAdmin;
	},

	clearSession: () => {
		session.id = undefined;
		session.isAuth = false;
		session.isAdmin = false;
	},

	getAuth: () => {
		return session.isAdmin;
	},

	getId: () => {
		return session.id;
	},

	checkAdmin: (req, res, next) => {
		if (session.isAuth) {
			next();
		} else {
			res.redirect("/admin/auth");
		}
	}
};

export default session;