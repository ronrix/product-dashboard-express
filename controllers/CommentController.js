
const CommentModel = require("../models/ComentModel");

class CommentController {

	constructor() {
		this.Comment = new CommentModel();
	}

	leave_review = (req, res) => {
		const fields = req.body;

		this.Comment.leave_review(fields, req.session.user).then(result => {
			req.session.comment_msg = result;
			res.redirect("/products/show/" + fields.product_user_id + ":" + fields.product_id);
		}).catch(err => {
			req.session.comment_msg = err;
			console.log(err);
			res.redirect("/products/show/" + fields.product_user_id + ":" + fields.product_id);
		});
	}

	leave_reply = (req, res) => {
		const fields = req.body;

		this.Comment.leave_reply(fields, req.session.user).then(result => {
			req.session.comment_msg = result;
			res.redirect("/products/show/" + fields.product_user_id + ":" + fields.product_id);
		}).catch(err => {
			req.session.comment_msg = err;
			res.redirect("/products/show/" + fields.product_user_id + ":" + fields.product_id);
		});
	}

}

module.exports = new CommentController();