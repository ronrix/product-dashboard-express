const PORT = 8000;

const db_config = {
	server_name: "localhost",
	username: "wp_user",
	password: "WP_password12",
	dbname: "express_debugger",
	port: 3306,
}

const DB_CONFIG_POSTGRE = {
	host:  "localhost",
	user: "ronrix",
	password: "root",
	database: "product_dashboard",
	post: 5432
}

module.exports = {
	PORT,
	db_config,
	DB_CONFIG_POSTGRE 
}

/*
	DOCU: this file is for db configuration and other global variables
	OWNER: ronrix
*/ 