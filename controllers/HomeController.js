/*
	DOCU: Add a class to handle routes that can access model and views folder
		you can create more file that has specific routing handlers

		use arrow function (recommended) to enable profiler properly
	OWNER: ronrix
*/ 
const HomeModel = require("../models/HomeModel");

class HomeController {

	constructor() {
		// instance of models
		this.model = new HomeModel();
	}

	// route methods
	index = (req, res) => {
		const msg = req.session.msg

		// use res.view instead of render to use profiler
		req.enable_profiler(this, req, true);
		res.view("../views/index", msg);

		// res.render("../views/index", {msg});
	}

	profile = (req, res) => {
		const data = req.session.data;
		req.enable_profiler(this, req, true);

		if(data) {	
			// use res.view instead of render to use profiler
			res.view("../views/profile", data);
			return;
		}
		res.redirect("/");
	}

	login = (req, res) => {
		const fields = req.body;
		this.model.login(fields).then(result => {
			req.session.data = result;
			req.session.msg = null;
			res.redirect("/profile");
		}).catch(err => {
			req.session.msg = err;
			res.redirect("/");
		});
	}

}

module.exports = new HomeController();