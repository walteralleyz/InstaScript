const express = require("express"),
app = express();
http = require("http"),
bodyParser = require("body-parser"),
dotenv = require("dotenv").config(),
port = process.env.PORT || 2500,
path = require("path"),
sessionRouter = require("./routes/main"),
socket = require("socket.io"),
{ stopApp } = require("./controller/main");

app.use(bodyParser.json());
app.use("/", sessionRouter);
app.set("port", port || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "./public/")));

http = http.createServer(app).listen(app.get("port"), 
() => {
	console.log("Listening on port", app.get("port"));
});

const wss = socket(http, {path: "/console"});

wss.on("connection", client => {
	client.on("transport", message => {
		wss.send(message);
	});

	client.on("eval", message => {
		if(message == "stop") {
			let msg = stopApp();
			wss.send(msg);
		};
	});
});