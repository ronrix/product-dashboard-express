const express = require("express");
const session = require("express-session");
const {PORT} = require("./config");
const app = express();

app.use(express.static("assets"));
app.use(express.urlencoded({extended: true})); // for now (install body-parser)
// setup session
app.use(session({
	secret: "supersecret",
	resave: false,
	saveUninitialized: true
}));

// set up view engine, you can change this based on your view engine preferrence
app.set("views",__dirname + "/views");
app.set("view engine", "ejs");

// including all route files (DON'T CHANGE THIS)
const Routes = require("./routes");
Routes.get().then(routes => {
	app.use([...routes]);
});


app.listen(PORT, () => console.log(`Server running in PORT ${PORT}`));


/*
	DOCU: this file is the server file which handles all files and run it
		include here other libraries to be used
	OWNER: ronrix
*/ 