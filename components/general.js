const fs = require("fs"),
{ until, By, Key } = require("selenium-webdriver"),
dotenv = require("dotenv").config(),
{treatNumbers, writeLog} = require("./tools");

exports.readFile = (res, file, func, next, ...args) => {
	let file_content = fs.readFileSync(file);
	file_content = file_content.toString();
	return func(res, file_content, next, ...args);
};

exports.writeFile = (file, fileContent) => {
	fs.writeFileSync(file, JSON.stringify(fileContent));
	return true;
};

exports.builderAccess = async (res, username, password, href) => {
	await res.get(href)
	.then(async result => {
		await res.wait(until.elementLocated(By.name(process.env.USERNAME_INPUT_NAME)), 2500)
			.then(element => element.sendKeys(username));

		await res.wait(until.elementLocated(By.name(process.env.PASSWORD_INPUT_NAME)), 2500)
			.then(element => element.sendKeys(password, Key.RETURN));

		writeLog("InstaScript new Session Started!");
	});
};

exports.follow = async (res, maxf, minf, user) => {
	await res.wait(until.elementsLocated(By.className("g47SY")), 3000)
	.then(async elements => {
		let followers = await elements[1].getText();
		let following = await elements[2].getText();
		
		let temp_text = treatNumbers(followers, following);

		writeLog(`
			followers: ${temp_text[0]}
			following: ${temp_text[1]}
		`);

		if(maxf < parseInt(temp_text[0]) || minf > parseInt(temp_text[1])) {
			writeLog(`I can't follow ${user.username}`);
			return false;
		};

		try {
			await res.wait(until.elementLocated(By.className(process.env.BUTTON_FOLLOW_USER_PROFILE)), 3000)
			.then(async button => {
				await button.click();
				writeLog(`Now Following ${user.username}!`)
			});
		} catch(error) {
			writeLog(`I can't follow ${user.username}`);
			return false;
		}; 
	});
};

exports.accessUserProfile = async (res, userObj, next, ...args) => {
	let users = JSON.parse(userObj);
	let [mf, maxf, minf] = [...args];
	for (let i=0; i<mf; i++) {

		await res.get(users[i].href);
		writeLog(`Get in user ${users[i].username}`);
		
		await res.sleep(4000)
		.then(async result => {
			await next(res, maxf, minf, users[i]);
		});
	};

	writeLog("Process Finished!");
	res.quit();
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