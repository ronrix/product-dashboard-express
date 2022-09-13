const ProductModel = require("../models/ProductModel");

const has_user_logged_in = require("./utils/check_user_logged");

class ProductController {

	constructor() {
		this.Product = new ProductModel();
	}

	add_product = (req, res) => { 
		const msg = req.session.add_product_msg;
		delete req.session.add_product_msg;
		has_user_logged_in(req).then(user => {
			if(user && user.is_admin) {
				res.render("../views/dashboard/add-new", {msg});
				return;
			}

			res.redirect("/dashboard");
		});
		
	}

	edit_product = (req, res) => {
		const msg = req.session.edit_product_msg;
		const id = req.params.id;
		delete req.session.edit_product_msg;

		has_user_logged_in(req).then(user => {
			if(user && user.is_admin) {
				// fetch product by id
				this.Product.fetch_product_by_id(id).then(product => {
					res.render("../views/dashboard/edit", {msg, id, product});
				}).catch(err => {
					console.log(err);
					res.redirect("/dashboard");
				});
				return;

			}
			res.redirect("/dashboard");
		});

	}

	confirmation = (req, res) => {
		has_user_logged_in(req).then(user => {
			if(user && user.is_admin) {
				res.render("../views/confirmation/confirmation", {id: req.params.id});
				return;
			}
			res.redirect("/dashboard");
		})
	}

	product_show = (req, res) => {
		const ids = req.params.id.split(":");
		const msg = req.session.comment_msg;
		delete req.session.comment_msg;

		// get the product info
		this.Product.fetch_product_by_id(ids).then(product => {
			res.render("../views/dashboard/show-product", {msg, ids, product: product.product, date: product.date });
		}).catch(err => {
			console.log(err);
			res.redirect("/dashboard");
		});
	}

	process_edit_product = (req, res) => {

		const fields = req.body; 
		this.Product.edit_product(fields, req.session.user.id).then(result => {
			req.session.edit_product_msg = result;
			res.redirect("/dashboard");
		}).catch(err => {
			req.session.edit_product_msg = result;
			res.redirect("/dashboard");
		});
		
	}

	remove_product = (req, res) => {
		this.Product.remove_product(req.session.user.id, req.params.id).then((result)=> {
			req.session.remove_product_msg = result;
			res.redirect("/dashboard");
		}).catch(err => {
			req.session.remove_product_msg = err;
			res.redirect("/dashboard");
		});
	}

	process_add_product = (req, res) => {
		const fields = req.body;

		// add product
		this.Product.add_new_product(fields, req.session.user.id).then(result => {
			req.session.add_product_msg = result;
			res.redirect("/product/new");
		}).catch(err => {
			req.session.add_product_msg = err;
			res.redirect("/product/new");
		});
	}

}

module.exports = new ProductController();