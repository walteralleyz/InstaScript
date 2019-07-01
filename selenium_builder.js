const { Builder, until } = require("selenium-webdriver"),

{ builderAccess } = require("./components/access"),

{
	readFile,
	writeFile,
	getUsersFromAccountFollowers

} = require("./components/general"),

{ follow, accessUserProfile } = require("./components/user"),

dotenv = require("dotenv").config();

const builder = new Builder()
	.forBrowser(
		process.env.BROWSER, 
		process.env.BROWSER_VERSION, 
		process.env.OS_PLATFORM
	)
	.build();

const builderConstructor = async (username, password, accounts) => {

	let file = process.env.DB_TXT;

	builder.then(async res => {

		await builderAccess(
			res, 
			username, 
			password, 
			`${process.env.URL_IG}/accounts/login/?source=auth_switcher`
		);

		await res.wait(until.titleIs(process.env.IG_TITLE), 5000)
		.then(async result => {
			let getUsers = await getUsersFromAccountFollowers(
				res, 
				accounts, 
				file, 
				writeFile
			);

			await readFile(res, file, accessUserProfile, follow);
		});
	});
};

module.exports = builderConstructor;
