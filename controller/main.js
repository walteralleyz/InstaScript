const {
    builder,
    followTargetFollowers,
    followHashesFollowers
} = require("../components/constructor");

exports.followFromUsers = async (req, res) => {
    const {username, password, accounts} = req.body;
    builder(username, password)
    .then(
        async result => {
            await followTargetFollowers(result, accounts);
            result.quit();
        }
    );

    res.send("Executando!");
}

exports.followFromHashes = (req, res) => {
    const {username, password, hashes} = req.body;
    builder(username, password)
    .then(
        async result => {
            await followHashesFollowers(result, hashes);
            result.quit();
    });

    res.send("Executando!");
};