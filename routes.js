
const path = require("path");
const fs = require("fs");

class Routes {

	get() {
		const routes = [];
		return this.get_all_routes_file().then(files => {
			files.forEach(file => {
				routes.push(require(__dirname + "/routes/" + `${path.basename(file)}`));
			});
			return routes;
		});	
	}

	get_all_routes_file() {
		return new Promise((resolve, reject) => {
			fs.readdir(__dirname + "/routes/", (err, files) => {
				if(err) reject(err);
				resolve(files);
			});
		});
	}

	
}

module.exports = new Routes();

/*
	NOTE: don't change this

	DOCU: this class handles all the routes file to be included in the route of the express (app.use(routes))
		all the files inside routes folder are routes ("/routes")

		add routes on routes folder and it will be included

	OWNER: ronrix

*/ 