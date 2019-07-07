const fs = require("fs"),
{ until, By, Key } = require("selenium-webdriver"),
dotenv = require("dotenv").config();

exports.readFile = (res, file, func, next, ...args) => {
	fs.readFile(file, (error, data) => {
		if(error) return false;
		let new_data = data.toString();
		let [mf, maxf, minf] = [...args];
		return func(res, new_data, next, mf, maxf, minf);
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

exports.follow = async (res, maxf, minf, user) => {
	await res.wait(until.elementsLocated(By.className("g47SY")), 3000)
	.then(async elements => {
		let followers = await elements[1].getText()
		.then(text => parseInt(text));

		let following = await elements[2].getText()
		.then(text => parseInt(text));
		if(followers > maxf || following < minf) {
			console.log(`I can't follow ${user.username}!`)
			return false;
		};
		await res.wait(until.elementLocated(By.className(process.env.BUTTON_FOLLOW_USER_PROFILE)), 4000)
		.then(element => {
			element.click();
			console.log(`Following ${user.username} now!`);
		});
	});
};

exports.accessUserProfile = async (res, userObj, next, ...args) => {
	let users = JSON.parse(userObj);
	let [mf, maxf, minf] = [...args];
	for (let user of users) {
		await res.get(user.href);
		console.log(`Get in user ${user.username}`);
		try {
			await res.sleep(4000)
			.then(async result => {
				await next(res, maxf, minf, user);
			});
		} catch (error) {
			console.log("I can't follow this profile.");
			continue;
		};
	};
};

exports.controlPhotoSession = async (res, textContent, minLikes, comment) => {
	let actual_likes = parseInt(textContent);
	let expected_likes = parseInt(minLikes);

	if (actual_likes < expected_likes) return false;

	await res.wait(until.elementLocated(By.className("Ypffh")), 3000)
	.then(textElement => {
		textElement.click();
	});

	await res.sleep(2000)
	.then(result => {
		res.findElement(By.className("Ypffh"))
		.then(textElement => {
			textElement.sendKeys(comment, Key.RETURN);
		});
	})
};

exports.postButtonExit = async res => {
	await res.wait(until.elementLocated(By.className("ckWGn")), 3000)
	.then(xElement => xElement.click());
};