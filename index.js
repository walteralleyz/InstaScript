const app = require("express")(),
bodyParser = require("body-parser")
dotenv = require("dotenv").config()


port = process.env.PORT || 2500,
	
sessionRouter = require("./routes/main");

app.use(bodyParser.json());

app.use("/", sessionRouter);

app.listen(port, () => console.log("Server iniciado na porta ", port));
