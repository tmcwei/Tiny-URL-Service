var express = require("express");
var router = express.Router();
var urlService = require("../services/urlService");
var statsService = require("../services/statsService");
var path = require('path');
// here is the lookup(from short to long) part, so it is http get
router.get("*", function (req, res) {
	var shortUrl = req.originalUrl.slice(1);
	//var longUrl = urlService.getLongUrl(shortUrl);
	urlService.getLongUrl(shortUrl, function(url) {
		if (url) {
			res.redirect(url.longUrl);
			// log request info
			statsService.logRequest(shortUrl, req);
		} else {
			//res.send('No such url')
			res.status(200).sendFile('index.html', { root: path.join(__dirname, '../public/')});
		}
	});	
});

module.exports = router;