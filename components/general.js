const fs = require("fs"),
{ until, By } = require("selenium-webdriver"),
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

exports.getUsersFromAccountFollowers = async (res, account, file, next) => {
	let user_attr_href = [];

	await res.get(`${process.env.URL_IG}/${account}`)
	await res.wait(until.elementLocated(By.css("a[href='/"+account+"/followers/']")), 3000)
	.then(element => {
		element.click()
		console.log("Target profile accessed, receiving followers.");
	});

	await res.wait(until.elementsLocated(By.className(process.env.DIV_PROFILE_FOLLOWER_USERS)), 2000)
	.then(async elements => {
		for(let element of elements) {
			let username, href;

			await element.getAttribute("title")
			.then(value => username = value);

			await element.getAttribute("href")
			.then(value => href = value);

			user_attr_href.push({username, href});
		};
	});

	try {	
		next(file, user_attr_href);
		return true;
	} catch(error) { return false };
};

exports.getUsersFromHashes = async (res, hash, file, next) => {
	let user_attr_href = [];

	await res.get(`${process.env.URL_IG}/explore/tags/${hash}`);
	await res.wait(until.elementsLocated(By.className("_bz0w")), 3000)
	.then(async elements => {
		for(let element of elements) {
			element.click();
			await res.wait(until.elementLocated(By.className("FPmhX")), 3000)
			.then(async innerElement => {
				let username, href;

				await innerElement.getAttribute("title")
				.then(value => username = value);

				await innerElement.getAttribute("href")
				.then(value => href = value);

				user_attr_href.push({username, href});
			});
			
			await res.wait(until.elementLocated(By.className("ckWGn")), 3000)
			.then(element => element.click());
		}
	});

	try {
		next(file, user_attr_href);
		return true;
	} catch (error) { return false };
};