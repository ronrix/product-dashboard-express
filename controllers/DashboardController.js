const ProductModel = require("../models/ProductModel");
const UserModel = require("../models/UserModel");
const has_user_logged_in = require("./utils/check_user_logged");


class DashboardController {

	constructor() {
		this.Product = new ProductModel();
		this.User = new UserModel();
	}

	index = (req, res) => {
		
		// redirect user to admin page if admin
		has_user_logged_in(req).then(user => {
			if(user) {
				if(user.is_admin) {
					res.redirect("/dashboard/admin");
					return;
				}

				// fetch all products of the user admin
				this.Product.fetch_all().then(products => {
					// normal user dashboard
					res.render("../views/dashboard/index", {data: products});
				}).catch(() => {
					res.render("../views/dashboard/index", {data: null});
				});

				return;
			}

			res.redirect("/login");
		});

	}

	admin = (req, res) => {

		has_user_logged_in(req).then(user => {
			if(user) {
				// normal user dashboard
				const msg = req.session.remove_product_msg || req.session.edit_product_msg;
				delete req.session.remove_product_msg;
				delete req.session.edit_product_msg;

				if(user.is_admin) {
					this.Product.fetch_all_by_user_id(user.id).then(products => {
						// normal user dashboard
						res.render("../views/dashboard/admin", {msg, products});
					}).catch(err => {
						res.render("../views/dashboard/admin", {msg: err});
					});

					return;
				}

				// normal user dashboard
				res.redirect("/");
			}

			res.redirect("/login");
		});

	}

	profile = (req, res) => {

		has_user_logged_in(req).then(user => {
			if(user) {
				// normal user dashboard
				const msg = req.session.edit_info_msg || req.session.edit_pass_msg;
				delete req.session.edit_info_msg;
				delete req.session.edit_pass_msg;
				res.render("../views/dashboard/profile", {msg});
				return;
			}

			res.redirect("/login");
		});

	}

	logoff = (req, res) => {
		req.session.user = null;
		req.redis.del("sess:" + req.session.id, (err, response) => {
			if(err) {
				console.log(err);
				return;
			}
			console.log("User logged out: ", response);
		});
		res.redirect("/login");
	}

	/*
		DOCU: this function handles the editing of the user's information as well as password
		OWNER: ronrix	
	*/
	process_edit_user_info = (req, res) => {
		const fields = req.body;
		this.User.edit_user_info_by_id(fields, req.session.user).then(result => {
			req.session.edit_info_msg = result;
			res.redirect("/users/edit");
		}).catch(err => {
			req.session.edit_info_msg = err;
			res.redirect("/users/edit");
		});
	}

	process_edit_user_password = (req, res) => {
		const fields = req.body;
		if(fields.new_password === fields.confirm_new_password) {
			this.User.edit_user_password_by_id(fields, req.session.user).then(result => {
				req.session.edit_pass_msg = result;
				res.redirect("/users/edit");
			}).catch(err => {
				req.session.edit_pass_msg = err;
				res.redirect("/users/edit");
			});
			return;
		}

		req.session.edit_pass_msg = {msg: "Password not matched!", status: 400};
		res.redirect("/users/edit");
	}

}

module.exports = new DashboardController();