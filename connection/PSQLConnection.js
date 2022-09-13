
const {Client} = require("pg");
const {DB_CONFIG_POSTGRE} = require("../config");

class PSQLConnection {

	static client = new Client(DB_CONFIG_POSTGRE);

	static connect() {
		PSQLConnection.client.connect().then(() => console.log("PostgreSQL connected")).catch((err) => console.log(`Something went wrong! ${err}`));
	}

	_query(query) {
		return PSQLConnection.client.query(query);
	}
}

module.exports = PSQLConnection;
