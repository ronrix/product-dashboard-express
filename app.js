const express = require("express");
const session = require("express-session");
const {PORT} = require("./config");
const PSQLConnection = require("./connection/PSQLConnection");
const app = express();
const redis_client = require("redis").createClient({
	host: "localhost", 
	port: 6379,
	legacyMode: true, // setting this to stop the server from freezing
});
const redis_store = require("connect-redis")(session);

/*
	DOCU: connecting databases
*/ 
PSQLConnection.connect();

/*
	DOCU: connecting redis 
	OWNER: ronrix
*/ 
redis_client.connect();
redis_client.on("connect", () => {
	console.log("Redis connected");
});

/*
	DOCU: set the redis to controller 
		you can use redic client by doing req.redis on your controller
	OWNER: ronrix
*/ 
app.use((req, res, next) => {
	req.redis = redis_client;
	next();
});

app.use(express.static("assets"));
app.use(express.urlencoded({extended: true})); // for now (install body-parser)
// setup session
app.use(session({
	secret: "supersecret",
	resave: false,
	saveUninitialized: true,
	store: new redis_store({ client: redis_client  }),
}));

/*
	DOCU: setting up profiler to get the data to be dispplayed, you can turn the profile by doing
		req.enable_profiler = true
	OWNER: ronrix
*/
const Profiler = require("./modules/profiler/Profiler");
app.use(new Profiler().setup);

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