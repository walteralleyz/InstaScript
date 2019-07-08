const {
	until,
	By,
	Key
} = require("selenium-webdriver"),
dotenv = require("dotenv").config(),
{ controlPhotoSession, postButtonExit } = require("./general"),
{ioSet} = require("./tools");

exports.getUsersFromAccountFollowers = async (res, account, file, next) => {
	let user_attr_href = [];
	let resp;

	try {
		await res.get(`${process.env.URL_IG}/${account}`)
		await res.wait(until.elementLocated(By.css("a[href='/" + account + "/followers/']")), 3000)
		.then(element => {
			element.click()
			ioSet("Target profile accessed, receiving followers.");
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
		resp = true;
	} catch(error) { resp = false }
	finally {
		if(resp) {
			try {
				await next(file, user_attr_href);
				return true;
			} catch (error) { return false };
		};
		return false;
	}
};

exports.getUsersFromHashes = async (res, hash, file, next) => {
	let user_attr_href = [];
	let resp;

	try {
		await res.get(`${process.env.URL_IG}/explore/tags/${hash}`);
		await res.wait(until.elementsLocated(By.className("_bz0w")), 3000)
		.then(async elements => {
			ioSet("Target Tag accessed, receiving followers!");
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
		resp = true;
	} catch(error) { resp = false }
	finally {
		if(resp) {
			try {
				next(file, user_attr_href);
				return true;
			} catch (error) { return false };
		};
		return false;
	}
};

exports.getPostsFromHashes = async (res, hash, file, next) => {
	let user_attr_href = [];
	let resp;

	try {
		await res.get(`${process.env.URL_IG}/explore/tags/${hash}`);
		await res.wait(until.elementsLocated(By.className("_bz0w")), 3000)
		.then(async elements => {
			ioSet("Target Tag accessed, receiving Posts!");
			for (let element of elements) {
				let temp = {};

				element.click();

				element.findElement(By.tagName("a"))
				.then(aElement => {
					aElement.getAttribute("href")
					.then(url => temp["href"] = url);
				});

				await res.wait(until.elementLocated(By.className("_8A5w5")), 3000)
				.then(button => {
					button.getText()
					.then(text => temp["likes"] = text)
				});

				user_attr_href.push(temp);

				await res.sleep(1200)
				.then(async () => {
					await res.wait(until.elementLocated(By.className("ckWGn")), 3000)
					.then(element => element.click());
				});
			}
		});
		resp = true;
	} catch(error) { resp = false }
	finally {
		if(resp) {
			try {
				next(file, user_attr_href);
				return true;
			} catch (error) { return false };
		};
		return false;
	};
};
