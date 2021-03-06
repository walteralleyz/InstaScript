const { Builder, until } = require("selenium-webdriver"),

{
    getUsersFromAccountFollowers,
    getUsersFromHashes,
    getPostsFromHashes

} = require("../components/user"),

{
    readFile,
    writeFile,
    builderAccess,
    follow,
    accessUserProfile,
    accessPostHref,
    comment
} = require("../components/general"),
dotenv = require("dotenv").config();

exports.builder = (username, password) => {
    const builder_init = new Builder()
    .forBrowser(
        process.env.BROWSER,
        process.env.BROWSER_VERSION,
        process.env.OS_PLATFORM
    )
    .build()
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

exports.followTargetFollowers = async (builder, t, mf, maxf, minf) => {
    await builder.wait(until.titleIs(process.env.IG_TITLE), 5000)
    .then(result => {
        [...t].map(async account => {
            try {
                await getUsersFromAccountFollowers(
                    builder,
                    account,
                    process.env.DB_TXT,
                    writeFile
                );

                await readFile(
                    builder,
                    process.env.DB_TXT,
                    accessUserProfile,
                    follow,
                    mf, maxf, minf
                );

                return { [account]: true };
            } catch (error) { return { [account]: false } };
        });
    });
};

exports.followHashesFollowers = async (builder, t, mf, maxf, minf) => {
    await builder.wait(until.titleIs(process.env.IG_TITLE), 5000)
    .then(result => {
        [...t].map(async hash => {
            try {
                await getUsersFromHashes(
                    builder,
                    hash,
                    process.env.DB_TXT,
                    writeFile
                )

                await readFile(
                    builder,
                    process.env.DB_TXT,
                    accessUserProfile,
                    follow,
                    mf, maxf, minf
                );
                
                return {[hash]: true};
            } catch(error) { return {[hash]: false} };
        });
    });
};

exports.commentHashesPosts = async (builder, t, mf, maxf, minf) => {
    await builder.wait(until.titleIs(process.env.IG_TITLE), 5000)
    .then(result => {
        [...t].map(async hash => {
            try {
                await getPostsFromHashes(
                    builder,
                    hash,
                    process.env.DB_TXT,
                    writeFile
                );

                await readFile(
                    builder,
                    process.env.DB_TXT,
                    accessPostHref,
                    comment,
                    mf, maxf, minf
                );

                return { [hash]: true };
            } catch (error) { return { [hash]: false } };
        });
    });
};