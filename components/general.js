const fs = require("fs"),
{ until, By, Key } = require("selenium-webdriver"),
dotenv = require("dotenv").config();

const treatNumbers = (string_1, string_2) => {
	let temp_text = [string_1.split(""), string_2.split("")];
	let num_1, num_2;

	temp_text = [...temp_text].map(x => {
		let temp_nan = "";
		[...x].map(y => {
			if (y == "," || y == ".") {
				return false;
			};
			temp_nan += parseInt(y);
		});
		return temp_nan;
	});

	num_1 = temp_text[0];
	num_2 = temp_text[1];

	if (num_1.indexOf("NaN") != -1) {
		num_1 = temp_text[0].replace(/NaN/g, "");
		num_1 = `${num_1}00`;

		if (num_1.indexOf(",") != -1 || num_1.indexOf(".") != -1) {
			num_1 = num_1.replace(",", "");
		};

		num_1 = parseInt(num_1);
	};

	if (num_2.indexOf("NaN") != -1) {
		num_2 = temp_text[1].replace(/NaN/g, "");
		num_2 = `${num_2}00`;

		if (num_2.indexOf(",") != -1 || num_2.indexOf(".") != -1) {
			num_2 = num_2.replace(",", "");
		}

		num_2 = parseInt(num_2);
	};

	temp_text = [num_1, num_2];
	return temp_text;
};

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
		let followers = await elements[1].getText();
		let following = await elements[2].getText();
		
		let temp_text = treatNumbers(followers, following);

		console.log(`
			followers: ${temp_text[0]}
			following: ${temp_text[1]}
		`);

		if(maxf < parseInt(temp_text[0]) || minf > parseInt(temp_text[1])) {
			console.log(`I can't follow ${user.username}`);
			return false;
		};

		try {
			await res.wait(until.elementLocated(By.className(process.env.BUTTON_FOLLOW_USER_PROFILE)), 3000)
			.then(async button => {
				await button.click();
				console.log(`Ǹow Following ${user.username}!`)
			});
		} catch(error) {
			console.log(`I can't follow ${user.username}`);
			return false;
		}; 
	});
};

exports.accessUserProfile = async (res, userObj, next, ...args) => {
	let users = JSON.parse(userObj);
	let [mf, maxf, minf] = [...args];
	for (let i=0; i<mf; i++) {

		await res.get(users[i].href);
		console.log(`Get in user ${users[i].username}`);
		
		await res.sleep(4000)
		.then(async result => {
			await next(res, maxf, minf, users[i]);
		});
	};

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