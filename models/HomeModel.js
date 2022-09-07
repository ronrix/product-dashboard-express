
/*
	DOCU: business logic here, or databases you can use MonogodB, MysSQL, PostGres, etc.
	OWNER: ronrix
*/ 

const Connection = require("../connection/Connection");

class HomeModel extends Connection {
	constructor() {
		super();
	}
	
	login(fields) {

		const query = this.format_query(`
		SELECT users.id, users.first_name, users.email, users.password
		FROM users
		WHERE users.email = ? AND users.password = ? LIMIT 1;`, fields);

		return new Promise((resolve, reject) => {
			this.connection.query(query, (err, result) => {

				if(err) {
					throw err;
					return;
				}

				if(result.length === 0) {
					reject("No user found!");
				}
				else {
					resolve(result);
				}
			});
		});
	}
}

module.exports = HomeModel;