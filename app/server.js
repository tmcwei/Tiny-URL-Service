
var express = require('express');
var app = express();
var restRouter = require("./routes/rest");
var redirectRouter = require("./routes/redirect");
var indexRouter = require("./routes/index");

var mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds145365.mlab.com:45365/tinyurltmcwei');

var useragent = require('express-useragent');
app.use(useragent.express());

app.get('/', indexRouter);

app.use("/api/v1", restRouter);

app.use(express.static('public'));

app.use("/:shortUrl", redirectRouter);

app.listen(3000, function () {
  console.log('TinyUrl app listening on port 3000!')
});



/* the following is the node js method without express framework
  
/*
var http = require("http");
var fs = require("fs");
http.createServer(function (req, res) {
	if (req.url == "/") {
		res.writeHead(200, {"Content-Type": "text-html"});
		var html = fs.readFileSync(__dirname + "/index.html");
		res.end(html);
	}
	if (req.url == "/json") {
		res.writeHead(200, {"Content-Type": "application/json"});
		var obj = {
			name: "zhe",
			age : 73
		};
		res.end(JSON.stringify(obj));
	}
	
}).listen(3000);
*/