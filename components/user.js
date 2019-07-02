const {
	until,
	By,
	Key
} = require("selenium-webdriver"),
dotenv = require("dotenv").config();

exports.getUsersFromAccountFollowers = async (res, account, file, next) => {
	let user_attr_href = [];

	await res.get(`${process.env.URL_IG}/${account}`)
	await res.wait(until.elementLocated(By.css("a[href='/" + account + "/followers/']")), 3000)
	.then(element => {
		element.click()
		console.log("Target profile accessed, receiving followers.");
	});

	await res.wait(until.elementsLocated(By.className(process.env.DIV_PROFILE_FOLLOWER_USERS)), 2000)
	.then(async elements => {
		for (let element of elements) {
			let username, href;

			await element.getAttribute("title")
			.then(value => username = value);

			await element.getAttribute("href")
			.then(value => href = value);

			user_attr_href.push({ username, href });
		};
		});

	try {
		await next(file, user_attr_href);
		return true;
	} catch (error) { return false };
};

exports.getUsersFromHashes = async (res, hash, file, next) => {
	let user_attr_href = [];

	await res.get(`${process.env.URL_IG}/explore/tags/${hash}`);
	await res.wait(until.elementsLocated(By.className("_bz0w")), 3000)
	.then(async elements => {
		for (let element of elements) {
			element.click();
			await res.wait(until.elementLocated(By.className("FPmhX")), 3000)
			.then(async innerElement => {
				let username, href;

				await innerElement.getAttribute("title")
					.then(value => username = value);

				await innerElement.getAttribute("href")
					.then(value => href = value);

				user_attr_href.push({ username, href });
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

exports.getPostsFromHashes = async (res, hash, comment) => {
	await res.get(`${process.env.URL_IG}/explore/tags/${hash}`);
	await res.wait(until.elementsLocated(By.className("_bz0w")), 3000)
	.then(async elements => {
		for (let element of elements) {
			await res.sleep(5000)
			.then(async response => {
				element.click();

				await res.wait(until.elementLocated(By.className("Ypffh")), 3000)
					.then(element => {
						element.sendKeys(comment, Key.RETURN);
					});

				await res.wait(until.elementLocated(By.className("ckWGn")), 3000)
					.then(element => element.click());
			});
		}
	});
};
