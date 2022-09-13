const { parse } = require("pg-protocol");
const UserModel = require("../models/UserModel");

class UsersController {
	
	constructor() {
		this.User = new UserModel();
	}

	// redirecting to login when the path is "/"
	index = (req, res) => {
		
		// redirect user to admin page if admin
		req.redis.get("sess:"+req.session.id, (err, object) => {
			if(err) {
				res.redirect("/login");
				return;
			}

			// parsing the obj string from redis
			const parsed_object = JSON.parse(object);
			if(parsed_object.user) { // go to dashboard
				res.redirect("/dashboard");
				return;
			}
			else {
				res.redirect("/login");
			}

		});
	}

	login = (req, res) => {
		const msg = req.session.msg;
		delete req.session.msg;

		res.render("users/login", {msg});
	}

	register = (req, res) => {
		const msg = req.session.msg;
		delete req.session.msg;

		res.render("users/register", {msg});
	}

	handle_login = (req, res) => {

		const fields = req.body;
		this.User.login(fields).then(result => {
			if(result.status === 400) {
				req.session.msg = result;  // exprected to return error message
				res.redirect("/login");
				return;
			}

			// login successful, redirect to the dashboard;
			req.session.user = result;
			res.redirect("/dashboard");
		}).catch(err => {
			req.session.msg = err;
			res.redirect("/");
		});

	}
	handle_register = (req, res) => {

		const fields = req.body;
		if(fields.password === fields.confirm_password) {
			this.User.register(fields).then(success_msg => {
				req.session.msg = success_msg;
				res.redirect("/register");
			}).catch(err => {
				req.session.msg = err;
				res.redirect("/register");
			});
			return;
		}

		req.session.msg = {msg: "password not matched", status: 400};
		res.redirect("/register");
	}

}

module.exports = new UsersController();