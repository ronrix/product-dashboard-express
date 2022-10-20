const PSQLConnection = require("../connection/PSQLConnection");


class CommentModel extends PSQLConnection {

	leave_review = async (fields, user) => {
		const query = {
			text: "SELECT * FROM user_products WHERE user_id=$1",
			values: [fields.product_user_id]
		};

		return await this._query(query).then(({rows})=> {
			if(rows.length > 0) {
				let products = rows[0].products;
				// add review property
				if(products[fields.product_id].hasOwnProperty("reviews")) {
					products[fields.product_id]["reviews"].push({user: user.id, name: user.first_name + " " + user.last_name, comment: fields.review, created_at: new Date()});
				}
				else {
					const new_products = products[fields.product_id];
					new_products.reviews = [ { user: user.id, name: user.first_name + " " + user.last_name, comment: fields.review, created_at: new Date() } ];
					products[fields.product_id] = new_products;
				}

				const query = {
					text: "UPDATE user_products SET products=$1 WHERE user_id=$2",
					values: [JSON.stringify(products), fields.product_user_id]
				};

				return this._query(query).then(() => {
					return {msg: "Successuflly adding a review", status: 200};
				}).catch(err => {
					throw {msg: err, status: 400}
				});
			}
		}).catch(() => {
			throw {msg: "Something went wrong!", status: 400};
		});
	}

	leave_reply = async (fields, user) => {

		const query = {
			text: "SELECT * FROM user_products WHERE user_id=$1",
			values: [fields.product_user_id]
		};

		return await this._query(query).then(({rows})=> {
			if(rows.length > 0) {
				let products = rows[0].products;
				// add review property
				if(products[fields.product_id].reviews[fields.review_id].hasOwnProperty("replies")) {
					products[fields.product_id].reviews[fields.review_id].replies.push({user: user.id, name: user.first_name + " " + user.last_name, reply: fields.reply, created_at: new Date()});
				}
				else {
					const new_review = products[fields.product_id].reviews[fields.review_id];
					new_review.replies = [ { user: user.id, name: user.first_name + " " + user.last_name, reply: fields.reply, created_at: new Date() } ];
					products[fields.product_id].reviews[fields.review_id] = new_review;
				}

				const query = {
					text: "UPDATE user_products SET products=$1 WHERE user_id=$2",
					values: [JSON.stringify(products), fields.product_user_id]
				};

				return this._query(query).then(() => {
					return {msg: "Successuflly adding a reply", status: 200};
				}).catch(err => {
					throw {msg: err, status: 400}
				});
			}
		}).catch(() => {
			throw {msg: "Something went wrong!", status: 400};
		});
	}

}

module.exports = CommentModel;