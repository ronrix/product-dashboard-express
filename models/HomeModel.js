
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
		return this._query(`
			SELECT users.id, users.first_name, users.email, users.password
			FROM users
			WHERE users.email = ? AND users.password = ? LIMIT 1;`, 
			fields
		);
	}
}

module.exports = HomeModel;