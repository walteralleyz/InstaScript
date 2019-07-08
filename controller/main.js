const {
    builder,
    followTargetFollowers,
    followHashesFollowers,
    commentHashesPosts
} = require("../components/constructor");

let builded = "";

exports.init = (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) return res.status(404).json({
        error: "Username and password are required!"
    })

    builder(username, password)
    .then(result => {
        builded = result;
    });

    res.json({ message: "Starting..."});
};

exports.followFromUsers = async (req, res) => {
    const { target, max_follow, max_followers, min_followers } = req.body;
    if(!target || !max_follow || !max_followers || !min_followers) return res.status(404).json({ error: "At least one Target profile is required!" })
    await followTargetFollowers(
        builded,
        target,
        max_follow,
        max_followers,
        min_followers
    );

    res.json({ message: "Running..." });
};

exports.followFromHashes = async (req, res) => {
    const { target, max_follow, max_followers, min_followers } = req.body;
    if(!target || !max_follow || !max_followers || !min_followers) return res.status(404).json({ error: "At least one Tag is required!" })
    await followHashesFollowers(
        builded, 
        target,
        max_follow,
        max_followers,
        min_followers    
    );

    res.json({ message: "Running..." });
};

exports.commentFromHashes = async (req, res) => {
    const { target, max_follow, max_followers, min_followers } = req.body;
    if(!target || !max_follow || !max_followers || !min_followers) return res.status(404).json({ error: "Tags and comment are required!" })
    await commentHashesPosts(
        builded,
        target,
        max_follow,
        max_followers,
        min_followers
    );

    res.json({ message: "Running..." });
};

exports.stopApp = () => {
    console.log("WebDriver stopped!");
    try {
        builded.quit();
        return "Process Finished!";
    } catch(error) { return "Empty Process!" };
};