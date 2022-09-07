
class SurveyController {

	survey(req, res) {
		res.render("../views/survey");
	}

	result(req, res) {
		const data = req.session.survey;
		if(data) {
			res.render("result", {data})
			return;
		}
		res.redirect("/survey");
	}

	submit(req, res) {
		if(req.body.name) {
			req.session.survey = req.body;
			res.redirect("/result");
			return;
		}
		res.redirect("/survey");
	}

}

module.exports = new SurveyController();