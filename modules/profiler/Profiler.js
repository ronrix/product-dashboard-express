
const process = require("process");
const {performance} = require("perf_hooks");

class Profiler {

	static body = {
		post_data: {},
		get_data: {},
		uri_string: "",
		query: [],
		memory: null,
		benchmarks: {},
		class: {},
		session: {},
		cookies: {},
		headers: {},
		config: {}
	};

	get() {
		return Profiler.body;
	}

	enable_profiler = (controller, req, is_enable) => {
		Profiler.body.class = controller.constructor.name + "/" + req.route.stack[0].name;
		req.enable = is_enable;
		req.profiler = this.get();
	}

	setup = (req, res, next) => {
		if(Object.keys(req.body).length) {
			Profiler.body.post_data = req.body;
			Profiler.body.get_data = req.params;
			Profiler.body.uri_string = req.originalUrl;
		}

		Profiler.body.benchmarks.start = performance.now()/1000; 

		// setting fixed values of profilers
		Profiler.body.headers = req.headers;
		Profiler.body.config = require("../../config");
		Profiler.body.memory = process.memoryUsage().heapTotal/1024/1024;
		Profiler.body.session = req.session;
	
		req.profiler = this.get();
		req.enable = false;
		req.enable_profiler = this.enable_profiler;
	
		res.view = function(view_name, data) {
			res.render(view_name, {enable_profiler: req.enable, profiler: req.profiler, data});
		}
		next();																																																																																																							
	}

}

module.exports = Profiler;