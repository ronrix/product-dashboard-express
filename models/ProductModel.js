const PSQLConnection = require("../connection/PSQLConnection");

class ProductModel extends PSQLConnection {
	constructor() {
		super();
	}

	remove_product = async (user_id, product_id) => {

		// check if the user has already product table, then just add the product to the products column JSON
		const check_query = {
			text: "SELECT * FROM user_products WHERE user_id=$1",
			values: [user_id]
		}
		return await this._query(check_query).then(({rows})=> {

			if(rows.length > 0) {
				const products = rows[0].products;
				products.splice(product_id, 1);
				const query = {
					text: "UPDATE user_products SET products=$1 ",
					values: [JSON.stringify(products)]
				};

				// executing the updated product
				return this._query(query).then(() => {
					return {msg: "Successuflly deleted a product", status: 200};
				});
			}

		}).catch(err => ({msg: err, status: 400}));
	}

	edit_product = async (fields, user_id) => {

		// check if the user has already product table, then just add the product to the products column JSON
		const check_query = {
			text: "SELECT * FROM user_products WHERE user_id=$1",
			values: [user_id]
		}

		return await this._query(check_query).then(({rows})=> {
			const product_id = fields.product_id;
			if(rows.length > 0) {
				const products = rows[0].products;
				products[product_id] = {product_name: fields.product_name, description: fields.description, price: fields.price, inventory_count: fields.inventory_count, quantity_sold: 0};

				const query = {
					text: "UPDATE user_products SET products=$1 ",
					values: [JSON.stringify(products)]
				};

				// executing the updated product
				return this._query(query).then(() => {
					return {msg: "Successuflly editing a product", status: 200};
				});
			}

		}).catch(err => ({msg: err, status: 400}));

	}

	add_new_product = async (fields, user_id) => {
		
		// check if the user has already product table, then just add the product to the products column JSON
		const check_query = {
			text: "SELECT * FROM user_products WHERE user_id=$1",
			values: [user_id]
		}
		return  await this._query(check_query).then(({rows})=> {
			if(rows.length > 0) {
				const products = Array.isArray(rows[0].products) ? rows[0].products : Array(rows[0].products);
				products.push({product_name: fields.product_name, description: fields.description, price: fields.price, inventory_count: fields.inventory_count, quantity_sold: 0});
				const query = {
					text: "UPDATE user_products SET products=$1 ",
					values: [JSON.stringify(products)]
				};

				return this._query(query).then(() => {
					return {msg: "Successuflly adding a product", status: 200};
				});
			}
			else {
				const query = {
					text: "INSERT INTO user_products (user_id, products) VALUES($1, $2)",
					values: [user_id, {product_name: fields.product_name, description: fields.description, price: fields.price, inventory_count: fields.inventory_count}]
				};

				return this._query(query).then(() => {
					return {msg: "Successuflly adding a product", status: 200};
				});
			}
		}).catch(err => ({msg: err, status: 400}));

	}

	fetch_all_by_user_id = async (user_id) => {
		const query = {
			text: "SELECT * FROM user_products WHERE user_id=$1",
			values: [user_id]
		};

		return await this._query(query).then(({rows}) => rows).catch(err => err);
	}

	fetch_all = async () => {
		return await this._query("SELECT * FROM user_products").then(({rows}) => rows).catch(err => err);
	}

	fetch_product_by_id = async (id) => {
		const user_id = id[0];
		const product_id = id[1];

		const query = {
			text: "SELECT * FROM user_products WHERE user_id=$1",
			values: [user_id]
		};

		return await this._query(query).then(({rows}) => ({product: rows[0].products[product_id], date: rows[0].created_at })).catch(err => err);
	}

}

module.exports = ProductModel;