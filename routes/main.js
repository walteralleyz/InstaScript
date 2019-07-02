const router = require("express").Router(),
path = require("path"),
{
    followFromUsers,
    followFromHashes
} = require("../controller/main");

router.get("/", (req, res) => {
	res.sendFile('index.html', { root: path.join(__dirname, '../public/') });
});

router.post("/followfromusers", followFromUsers);
router.post("/followfromhashes", followFromHashes);

module.exports = router;
