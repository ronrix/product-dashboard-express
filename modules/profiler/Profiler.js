

class Profiler {

	static body = {
		post_data: {},
		get_data: {},
		uri_string: "",
		query: "",
		benchmarks: {},
		class: {},
		headers: {},
		config: {}
	};

	get() {
		return Profiler.body;
	}

	enable_profiler = (controller, req, is_enable) => {
		Profiler.body.class = controller.constructor.name + "/" + req.route.stack[0].name;
		req.enable = is_enable;
		// Profiler.body.benchmarks.end = new Date().getUTCMilliseconds();
		req.profiler = this.get();
	}

	setup = (req, res, next) => {
		if(Object.keys(req.body).length) {
			Profiler.body.post_data = req.body;
			Profiler.body.get_data = req.params;
			Profiler.body.uri_string = req.originalUrl;
		}
		// get the time of the first execution
		if(!Profiler.body.benchmarks.start) {
			Profiler.body.benchmarks.start = new Date().getTime(); 
		}
		// setting fixed values of profilers
		Profiler.body.headers = req.headers;
		Profiler.body.config = require("../../config");
	
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