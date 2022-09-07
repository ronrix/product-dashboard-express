
class SurveyController {

	survey = (req, res) => {
		req.enable_profiler(this, req, true);

		res.view("../views/survey");
		
		// res.render("../views/survey");
	}

	result = (req, res) => {
		const survey = req.session.survey;
		req.enable_profiler(this, req, true);
		
		if(survey) {

			// access the keys using data ex(data.something)
			res.view("../views/result", survey);
			
			// res.render("../views/result", {data})
			return;
		}
		res.redirect("/survey");
	}

	submit = (req, res) => {
		if(req.body.name) {
			req.session.survey = req.body;
			res.redirect("/result");
			return;
		}
		res.redirect("/survey");
	}

}

module.exports = new SurveyController();