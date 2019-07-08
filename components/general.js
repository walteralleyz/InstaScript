const fs = require("fs"),
{ until, By, Key } = require("selenium-webdriver"),
dotenv = require("dotenv").config(),
{treatNumbers, ioSet} = require("./tools");

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

		ioSet("InstaScript new Session Started!");
	});
};

exports.follow = async (res, maxf, minf, user) => {
	await res.wait(until.elementsLocated(By.className("g47SY")), 3000)
	.then(async elements => {
		let followers = await elements[1].getText();
		let following = await elements[2].getText();
		
		let temp_text = treatNumbers(followers, following);

		ioSet(`
			followers: ${temp_text[0]}
			following: ${temp_text[1]}
		`);

		if(maxf < parseInt(temp_text[0]) || minf > parseInt(temp_text[1])) {
			ioSet(`I can't follow ${user.username}`);
			return false;
		};

		try {
			await res.wait(until.elementLocated(By.className(process.env.BUTTON_FOLLOW_USER_PROFILE)), 3000)
			.then(async button => {
				await button.click();
				ioSet(`Now Following ${user.username}!`)
			});
		} catch(error) {
			ioSet(`I can't follow ${user.username}`);
			return false;
		}; 
	});
};

exports.accessUserProfile = async (res, userObj, next, ...args) => {
	let users = JSON.parse(userObj);
	let [mf, maxf, minf] = [...args];
	for (let i=0; i<mf; i++) {

		await res.get(users[i].href);
		ioSet(`Get in user ${users[i].username}`);
		
		await res.sleep(4000)
		.then(async result => {
			await next(res, maxf, minf, users[i]);
		});
	};

	ioSet("Process Finished!");
	res.quit();
};

exports.comment = async (res, minLikes, comment) => {
	try {
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
	} catch(error) { resp = false };
};

exports.accessPostHref = async (res, postObj, next, ...args) => {
	let posts = JSON.parse(postObj);
	let [mf, maxf, minf] = [...args];
	for (let i = 0; i < mf; i++) {
		try {
			await res.sleep(3000)
			.then(async () => {
				await res.get(posts[i].href);
				ioSet(`Get in Post page`);

				await res.sleep(4000)
				.then(async result => {
					await next(res, maxf, minf);
				});
			});
		} catch(error) {continue};
	};

	ioSet("Process Finished!");
	res.quit();
};