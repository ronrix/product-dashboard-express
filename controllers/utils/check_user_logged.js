
/*
	DOCU: this function access the redis storage that has the use information, if there's user that was logged in.
	OWNER: ronrix
*/ 
const has_user_logged_in = (req) => {
	return new Promise((resolver, reject) => {
		req.redis.get("sess:"+req.session.id, (err, object) => {
			if(err) {
				reject(err);
			}

			// parsing the obj string from redis
			const parsed_object = JSON.parse(object);
			resolver(parsed_object.user);
		});
	});
}

module.exports = has_user_logged_in;