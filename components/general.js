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

exports.getUsersFromAccountFollowers = async (res, accounts, file, next) => {
	let user_attr_href = [];

	await res.get(`${process.env.URL_IG}/${accounts[0]}`)
	await res.wait(until.elementLocated(By.css("a[href='/"+accounts[0]+"/followers/']")), 3000)
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
