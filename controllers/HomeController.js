/*
	DOCU: Add a class to handle routes that can access model and views folder
		you can create more file that has specific routing handlers
	OWNER: ronrix
*/ 
const HomeModel = require("../models/HomeModel");

class HomeController {

	constructor() {
		// instance of models
		this.model = new HomeModel();

		// binding this to the methods
		this.login = this.login.bind(this)
	}

	// route methods
	index(req, res) {
		const msg = req.session.msg
		res.render("../views/index", {msg});
	}

	profile(req, res) {
		const data = req.session.data;
		if(data) {
			res.render("../views/profile", {data});
			return;
		}
		res.redirect("/");
	}

	login(req, res) {
		const fields = req.body;
		this.model.login(fields).then(result => {
			req.session.data = result;
			req.session.msg = null;
			res.redirect("/profile");
		}).catch(err => {
			req.session.msg = {err};
			res.redirect("/");
		});
	}

}

module.exports = new HomeController();