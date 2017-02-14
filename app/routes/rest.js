var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlService = require("../services/urlService");
var statsService = require("../services/statsService");
var path = require('path');

// jsonParser is send as a parameter to the router and we then can get the body of the post cmd
router.post("/urls", jsonParser, function (req, res) {
	var longUrl = req.body.longUrl;

	// let database store the longurl with http prefix to make the system robust. Actually as long as the client side always put http in the body, 
	//it is fine, but we just want to double safe!!! 
	if (longUrl.indexOf("http") === -1) {
		longUrl = "http://" + longUrl;
	}
	urlService.getShortUrl(longUrl, function(url) {
		res.json(url);
	});
});
router.get('/urls/:shortUrl', function(req, res) {
	var shortUrl = req.params.shortUrl;
	urlService.getLongUrl(shortUrl, function(url) {
		if (url) {
			res.json(url);
		} else {
			res.status(200).sendFile('index.html', { root: path.join(__dirname, '../public/')});
		}
 	})
});

router.get('/urls/:shortUrl/:info', function(req, res) {
	var shortUrl = req.params.shortUrl;
	var info = req.params.info;
	statsService.getUrlInfo(shortUrl, info, function(data) {
		res.json(data);
 	})
});

module.exports = router;