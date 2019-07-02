const {
    builder,
    followTargetFollowers,
    followHashesFollowers,
    commentHashesPosts
} = require("../components/constructor");

let builded = "";

exports.init = (req, res) => {
    const {username, password} = req.body;
    builder(username, password)
    .then(result => {
        builded = result;
    });

    res.send("Acessando perfil!")
};

exports.followFromUsers = async (req, res) => {
    const { accounts } = req.body;
    await followTargetFollowers(builded, accounts);
    res.send("Executando!");
};

exports.followFromHashes = async (req, res) => {
    const {hashes} = req.body;
    await followHashesFollowers(builded, hashes);
    res.send("Executando!");
};

exports.commentFromHashes = async (req, res) => {
    const {hashes, comment} = req.body;
    await commentHashesPosts(builded, hashes, comment);
    res.send("Executando!");
};