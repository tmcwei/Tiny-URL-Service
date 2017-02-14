var express = require("express");
var router = express.Router();
var urlService = require("../services/urlService");
var path = require('path');

// here is the lookup(from short to long) part, so it is http get
router.get("*", function (req, res) {
    res.sendFile('index.html', { root : path.join(__dirname, '../public')});
});

module.exports = router;