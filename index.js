const express = require("express"),
app = express();
http = require("http"),
bodyParser = require("body-parser"),
dotenv = require("dotenv").config(),
port = process.env.PORT || 2500,
path = require("path"),
sessionRouter = require("./routes/main"),
fs = require("fs"),
websocket = require("ws");

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

const wss = new websocket.Server({server: http});

wss.on("connection", client => {
	fs.watchFile(process.env.LOG_TXT, (curr, prev) => {
		let file = fs.readFileSync(process.env.LOG_TXT);
		file = file.toString();
		client.send(file);
	});
});