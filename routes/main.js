const router = require("express").Router(),
path = require("path"),
{ 
    init,
    followFromHashes,
    followFromUsers,
    commentFromHashes
} = require("../controller/main");

router.get("/", (req, res) => {
	res.render("index");
});

router.post("/access", init);
router.post("/followfromusers", followFromUsers);
router.post("/followfromhashes", followFromHashes);
router.post("/commentfromhashes", commentFromHashes)

module.exports = router;
