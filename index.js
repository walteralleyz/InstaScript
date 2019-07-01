const app = require("express")(),
bodyParser = require("body-parser")
dotenv = require("dotenv").config()


port = process.env.PORT || 2500,
builder = require("./selenium_builder");

app.use(bodyParser.json());

app.post("/session", (req, res) => {
	const {username, password, accounts} = req.body;
	builder(username, password, accounts);
});

app.listen(port, () => console.log("Server iniciado na porta ", port));
