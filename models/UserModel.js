const PSQLConnection = require("../connection/PSQLConnection");
const bcrypt = require("bcrypt");

const FormValidation = require("../modules/validation/Validation");

class UserModel extends PSQLConnection {

	constructor() {
		super()	;
		this.FormValidation = new FormValidation();
	}

	/*	
		DOCU: this function logs in the user with the inputted fields, it query the user if exist and return the user to the controller 
			if the credential is not valid it returns an error
	*/
	login = async (fields) => {
		
		if(this.FormValidation.is_empty(fields)) {
			throw {msg: "Please fill up the fields", status: 400};
		}

		// validate the email field
		if(!this.FormValidation.is_email_valid(fields.email)) {
			throw {msg: "Email is not valid", status: 400};
		}

		// this is the use of procedural/parameter querying 
		const query = {
			text: "SELECT * FROM users WHERE email=$1",
			values: [fields.email],
		};

		// return a promise
		return await this._query(query).then(({rows: user}) => {
			const verified = bcrypt.compareSync(fields.password, user[0].password);
			if(verified){
				return {
					id: user[0].id, 
					first_name: user[0].first_name, 
					last_name: user[0].last_name, 
					email: user[0].email, 
					is_admin: user[0].is_admin, 
					status: 200
				};
			}

			return {msg: "Wrong email or password", status: 400};
		}).catch(err => {
			throw {msg: "No user found!", status: 400}
		});
	}

	register = async (fields) => {
		// check if fields are empty
		if(this.FormValidation.is_empty(fields)) {
			throw {msg: "Please fill up the fields", status: 400};
		}

		// validate the email field
		if(!this.FormValidation.is_email_valid(fields.email)) {
			throw {msg: "Email is not valid", status: 400};
		}

		// check if password input is valid
		if(!this.FormValidation.is_password_valid(fields.password)) {
			throw {msg: "Password must be 8 or more characters", status: 400};
		}

		/*
			DOCU: check if email is already exists
				if not proceed to inserting new user
		*/ 
		const email_exists_query = {
			text: "SELECT * FROM users WHERE email=$1",
			values: [fields.email]
		};
		return await this._query(email_exists_query).then(async ({rows}) => {
			if(rows.length > 0) {
				throw {msg: "Email already exist! Please use unique email address", msg: 400};
			}

			// check if this is the first user, then make it an admin, if the is_admin.count == 0, make it an adnmin
			const {rows: is_admin} = await this._query("SELECT count(*) FROM users");

			// insert new user
			const hashed_password = bcrypt.hashSync(fields.password, 10);
			const query = {
				text: "INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES($1, $2, $3, $4, $5)",
				values: [fields.fname, fields.lname, fields.email, hashed_password, is_admin.count == 0 ? true : false],
			};
			return await this._query(query).then(() => {
				return {msg: "Successfully created!", status: 200};
			}).catch(err => {
				throw {msg: "Something went wrong!", status: 400};
			});

		});
	}

	// edit user password 
	edit_user_password_by_id = async (fields, user) => {
		// check if fields are empty
		if(this.FormValidation.is_empty(fields)) {
			throw {msg: "Please fill up the fields", status: 400};
		}

		// check if password input is valid
		if(!this.FormValidation.is_password_valid(fields.new_password)) {
			throw {msg: "Password must be 8 or more characters", status: 400};
		}

		const new_hashed_password = bcrypt.hashSync(fields.new_password, 10);

		// get the user first and compare the hashed password
		const user_query = {
			text: "SELECT password FROM users WHERE id=$1",
			values: [user.id]
		};

		return await this._query(user_query).then(async ({rows}) => {
			const verified = bcrypt.compareSync(fields.old_password, rows[0].password);
			if(verified) {
				const query = {
					text: "UPDATE users SET password=$1 WHERE id=$2",
					values: [new_hashed_password, user.id],
				};

				return await this._query(query).then(() => {
					return {msg: "Successfully updated!", status: 200};
				}).catch(err => {
					console.log("error inside");
					throw {msg: err.msg, status: 400};
				});
			}

			// old password is not verified, return/throw error message
			return {msg: "Password is not correct", status: 400};
		}).catch(() => {
			// old password is not verified, return/throw error message
			throw {msg: "Something went wrong on query", status: 400};
		});

	}

	// edit user information
	edit_user_info_by_id = async (fields, user) => {
		// check if fields are empty
		if(this.FormValidation.is_empty(fields)) {
			throw {msg: "Please fill up the fields", status: 400};
		}

		// validate the email field
		if(!this.FormValidation.is_email_valid(fields.email)) {
			throw {msg: "Email is not valid", status: 400};
		}

		/*
			DOCU: check if email is already exists
				if not proceed to inserting new user
		*/ 
		const email_exists_query = {
			text: "SELECT * FROM users WHERE email=$1",
			values: [fields.email]
		};
		return await this._query(email_exists_query).then(async ({rows}) => {
			// if the email is the same as before, don't throw an error instead update the user informatio, first name and last name
			if(user.email !== fields.email && rows.length > 0) {
				throw {msg: "Email already exist! Please use unique email address", status: 400};
			}

			// update user with new email, last name and first name
			const query = {
				text: "UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id=$4",
				values: [fields.fname, fields.lname, fields.email, user.id],
			};

			return await this._query(query).then(() => {
				return {msg: "Successfully updated!", status: 200};
			}).catch(err => {
				throw {msg: err, status: 400};
			});

		});
	}

}

module.exports = UserModel;