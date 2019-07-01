const router = require("express").Router(),
{
    followFromUsers,
    followFromHashes
} = require("../controller/main");

router.post("/followfromusers", followFromUsers);
router.post("/followfromhashes", followFromHashes);

module.exports = router;