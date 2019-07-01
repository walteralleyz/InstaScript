const {
	until,
	By
} = require("selenium-webdriver"),
dotenv = require("dotenv").config();

exports.follow = async res => {
	await res.wait(until.elementLocated(By.className(process.env.BUTTON_FOLLOW_USER_PROFILE)), 4000)
	.then(element => element.click());
};

exports.accessUserProfile = async (res, userObj, next) => {
	let users = JSON.parse(userObj);
	
	for(let user of users) {
		await res.get(user.href);
		console.log(`Get in user ${user.username}`);
		try {
			await next(res);
			console.log(`Now following ${user.username}`);
		} catch(error) {
			console.log("I can't follow this profile."); 
			continue;
		};
	};
};
