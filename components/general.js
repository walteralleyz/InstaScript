const fs = require("fs"),
{ until, By, Key } = require("selenium-webdriver"),
dotenv = require("dotenv").config();

exports.readFile = (res, file, func, next) => {
	fs.readFile(file, (error, data) => {
		if(error) return false;
		return func(res, data.toString(), next);
	});
};

exports.writeFile = (file, fileContent) => {
	fs.writeFile(file, JSON.stringify(fileContent), 
	error => {
		if(error) return false;
		return true;
	})
};

exports.builderAccess = async (res, username, password, href) => {
	await res.get(href)
	.then(async result => {
		await res.wait(until.elementLocated(By.name(process.env.USERNAME_INPUT_NAME)), 2500)
			.then(element => element.sendKeys(username));

		await res.wait(until.elementLocated(By.name(process.env.PASSWORD_INPUT_NAME)), 2500)
			.then(element => element.sendKeys(password, Key.RETURN));

		console.log("InstaScript new Session Started!");
	});
};

exports.follow = async res => {
	await res.wait(until.elementLocated(By.className(process.env.BUTTON_FOLLOW_USER_PROFILE)), 4000)
	.then(element => element.click());
};

exports.accessUserProfile = async (res, userObj, next) => {
	let users = JSON.parse(userObj);

	for (let user of users) {
		await res.get(user.href);
		console.log(`Get in user ${user.username}`);
		try {
			await next(res);
			console.log(`Now following ${user.username}`);
		} catch (error) {
			console.log("I can't follow this profile.");
			continue;
		};
	};
};