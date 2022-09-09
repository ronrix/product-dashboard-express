
/*
	DOCU: business logic here, or databases you can use MonogodB, MysSQL, PostGres, etc.
	OWNER: ronrix
*/ 

const Connection = require("../connection/Connection");
const FormValidation = require("../modules/validation/Validation");

class HomeModel extends Connection {
	constructor() {
		super();

		this.FormValidation = new FormValidation();
	}
	
	async login(fields) {

		// add form validation here
		if(this.FormValidation.is_empty(fields)) {
			throw {msg: "Please fill up the fields", status: 400};
		}
		if(!this.FormValidation.is_email_valid(fields.email)) {
			throw {msg: "Email is not valid", status: 400};
		}

		return await this._query(`
			SELECT users.id, users.first_name, users.email, users.password
			FROM users
			WHERE users.email = ? AND users.password = ? LIMIT 1`, 
			fields
		);
	}
}

module.exports = HomeModel;