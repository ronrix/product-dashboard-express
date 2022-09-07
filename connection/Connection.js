
/*
	DOCU: set here your Database connections
	OWNER: ronrix
*/ 
const mysql = require("mysql2");
const {db_config} = require("../config");

class Connection {
	constructor() {
		this.connection = mysql.createConnection({
			"host": db_config.server_name,
			"user": db_config.username,
			"password": db_config.password,
			"database": db_config.dbname,
			"port": db_config.port
		});

		this.connection.connect(function(err) {
			if (err) {
				console.log(err);
				return;
			}
			console.log("mysql connection");
		});
	}

	format_query(query, fields) {
		return mysql.format(query, Object.values(fields));
	}
	
}

module.exports = Connection;