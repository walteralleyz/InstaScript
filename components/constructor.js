const { Builder, until } = require("selenium-webdriver"),

{ builderAccess } = require("../components/access"),

{
    readFile,
    writeFile,
    getUsersFromAccountFollowers,
    getUsersFromHashes

} = require("../components/general"),

{ follow, accessUserProfile } = require("../components/user"),

dotenv = require("dotenv").config();

exports.builder = (username, password) => {
    const builder_init = new Builder()
    .forBrowser(
        process.env.BROWSER,
        process.env.BROWSER_VERSION,
        process.env.OS_PLATFORM
    ).build()
    .then(async res => {
        await builderAccess(
            res,
            username,
            password,
            `${process.env.URL_IG}/accounts/login/?source=auth_switcher`
        );
        return res;
    });

    return builder_init;
};

exports.followTargetFollowers = async (builder, accounts) => {
    await builder.wait(until.titleIs(process.env.IG_TITLE), 5000)
    .then(result => {
        let success_obj = [...accounts].map(async account => {
            try {
                let getUsers = await getUsersFromAccountFollowers(
                    builder,
                    account,
                    process.env.DB_TXT,
                    writeFile
                );

                await readFile(
                    builder,
                    process.env.DB_TXT,
                    accessUserProfile,
                    follow
                );

                return { [account]: true };
            } catch (error) { return { [account]: false } };
        });
    });
};

exports.followHashesFollowers = async (builder, hashes) => {
    await builder.wait(until.titleIs(process.env.IG_TITLE), 5000)
    .then(result => {
        let success_obj = [...hashes].map(async hash => {
            try {
                let getUsers = await getUsersFromHashes(
                    builder,
                    hash,
                    process.env.DB_TXT,
                    writeFile
                )

                await readFile(
                    builder,
                    process.env.DB_TXT,
                    accessUserProfile,
                    follow
                );
                
                return {[hash]: true};
            } catch(error) { return {[hash]: false} };
        });
    });
};