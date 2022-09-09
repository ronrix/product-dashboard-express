
/*
	DOCU: set here your Database connections
	OWNER: ronrix
*/ 
const mysql = require("mysql2");
const {db_config} = require("../config");

const Profiler = require("../modules/profiler/Profiler");

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
	
	_query(query, fields = []) {

		query = this.format_query(query, fields);
		// set the query to the profiler
		Profiler.body.query.push(query);

		return new Promise((resolve, reject) => {
			this.connection.query(query, (err, result) => {

				if(err) {
					throw err;
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

module.exports = Connection;