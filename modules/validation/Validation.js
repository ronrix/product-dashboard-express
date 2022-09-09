

class FormValidation {
	
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
		return empty ? 0 : 1;
	}

	// is_email_already_exists(query, cb) {

	// }
}

module.exports = FormValidation;