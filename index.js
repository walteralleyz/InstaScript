const express = require("express"),
app = express();
http = require("http"),
bodyParser = require("body-parser"),
dotenv = require("dotenv").config(),
port = process.env.PORT || 2500,
path = require("path"),	
sessionRouter = require("./routes/main");

app.use(bodyParser.json());
app.use("/", sessionRouter);
app.set("port", port || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "./public/")));

http.createServer(app).listen(app.get("port"), 
() => {
	console.log("Listening on port ", app.get("port"));
}); 



