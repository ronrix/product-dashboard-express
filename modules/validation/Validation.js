

class FormValidation {
	
	is_password_valid(password) {
		return password.length >= 8;
	}

	is_email_valid(email) {
		return email.includes("@") && email.includes(".com");
	}

	is_empty(fields) {
		let empty = false;
		Object.values(fields).forEach(val => {
			if(val.length === 0) {
				empty = true;
			}
		});
		// if res has empty values return 0 for "not valid" else "valid"
		return empty;
	}

	// is_email_already_exists(query, cb) {

	// }
}

module.exports = FormValidation;