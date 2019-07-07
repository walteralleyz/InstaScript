const textModel = {
	target: {
		textarea: "Write the target(s) profile(s) to colect users. If more than one target, split them with spaces: target1 target2 target3 targetN.",
		input_0: "N. Max users to follow per Target",
		input_1: "N. Max user followers",
		input_2: "N. Min user following",
		name: "target"
	},

	hash: {
		textarea: "Write the tags to colect users. If more than one tag, split them with spaces: tag1 tag2 tag3 tagN.",
		input_0: "N. Max users to follow per Tag",
		input_1: "N. Max user followers",
		input_2: "N. Min user following",
		name: "hash"
	},

	comment: {
		textarea: "Write the tags to comment in. If more than one tag, split them with spaces: tag1 tag2 tag3 tagN.",
		input_0: "N. of photos to comment per tag",
		input_1: "N. min photo likes",
		input_2: "Write the comment",
		name: "comment"
	}
};

const fieldModel = texts => {
	let div = document.createElement("div");
	let target_field = document.createElement("textarea");
	let max_users_to_follow = document.createElement("input");
	let max_users_followers = document.createElement("input");
	let min_users_followers = document.createElement("input");
	let button_execute = document.createElement("button");
	let div_max_follow = document.createElement("div");
	let div_max_followers = document.createElement("div");
	let div_min_followers = document.createElement("div");

	div.id = "wrapper-div";
	div.name = texts.name;
	div_max_follow.classList.add(
		"form-group", 
		"d-inline-block", 
		"col-lg-6",
		"mt-3", "mb-3"
	);

	div_max_followers.classList.add(
		"form-group", 
		"d-inline-block", 
		"col-lg-6",
		"mt-3", "mb-3"
	);

	div_min_followers.classList.add(
		"form-group", 
		"d-inline-block", 
		"col-lg-12",
		"mt-3", "mb-3"
	);

	button_execute.classList.add(
		"btn", 
		"btn-info", 
		"btn-raised",
		"mt-3"
	);

	button_execute.textContent = "Execute";
	button_execute.setAttribute("type", "submit");

	target_field.setAttribute("placeholder", `${texts.textarea}`);
	target_field.name = "target";
	target_field.style.width = "100%";
	target_field.style.resize = "none";

	max_users_to_follow.setAttribute("placeholder", `${texts.input_0}`);
	max_users_to_follow.classList.add("form-control");
	max_users_to_follow.name  = "max_follow";

	max_users_followers.setAttribute("placeholder", `${texts.input_1}`);
	max_users_followers.classList.add("form-control");
	max_users_followers.name = "max_followers";

	min_users_followers.setAttribute("placeholder", `${texts.input_2}`);
	min_users_followers.classList.add("form-control");
	min_users_followers.name = "min_followers";

	div_max_follow.appendChild(max_users_to_follow);
	div_max_followers.appendChild(max_users_followers);
	div_min_followers.appendChild(min_users_followers);

	div.appendChild(target_field);
	div.appendChild(div_max_follow);
	div.appendChild(div_max_followers);
	div.appendChild(div_min_followers);
	div.appendChild(button_execute);

	
	return div;
};

const createTargetField = obj => {
	return appendToOptionDiv(obj);
};

const createHashField = obj => {
	return appendToOptionDiv(obj);
};

const createCommentField = obj => {
	return appendToOptionDiv(obj);
};

const appendToOptionDiv = obj => {
	let choosen_div = document.querySelector("#choosen-option-box");

	try {
		let wrapper_div = document.querySelector("#wrapper-div");
		choosen_div.removeChild(wrapper_div);
	} catch(error) { 
		console.error("Object '#wrapper-div' not created Yet!") 
		console.info("It happens when the view change.");
	}
	finally {
		choosen_div.append(obj);
	};
};

const handleSelectChange = event => {
	let select = event.currentTarget;
	switch(select.value) {
		case "target":
			createTargetField(fieldModel(textModel.target));
			break;

		case "hash":
			createHashField(fieldModel(textModel.hash));
			break;

		case "comment":
			createCommentField(fieldModel(textModel.comment));
			break;

		default:
			appendToOptionDiv("");
			break;
	};
};

const isValid = obj => {
	let div = document.querySelector("#wrapper-div");

	if(obj.target.length < 1) return false; 
	if(isNaN(obj.max_follow)) return false;
	if(isNaN(obj.max_followers)) return false;

	if(div.name != "comment") {
		if(isNaN(obj.min_followers)) return false;
	}
	
	if(obj.min_followers.length < 1) return false;

	return true;
};

const isLoginValid = obj => {
	if(obj.username.length < 1) return false;
	if(obj.password.length < 1) return false;
	return true;
};

const sendData = (link, data) => {
	return fetch(link, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			Accept: "*"
		}
	})
	.then(response => { return response.json()})
	.catch(error => { return error });
};

const holdLogin = event => {
	event.preventDefault();
	let form = event.currentTarget;
	let login = document.querySelector("#alert-login");
	let select = document.querySelector(".custom-select");
	let [username, password] = [...form];
	let temp_obj = {
		username: username.value, 
		password: password.value
	};

	if(isLoginValid(temp_obj)) {
		sendData("./access", temp_obj)
		.then(result => {
			if(result.error) return false;
			select.removeAttribute("disabled");
			return true;
		});
		return false;
	};

	login.textContent = "All fields are required!";
	login.style.display = "block";
};

const handleLoginChange = event => {
	let login = document.querySelector("#alert-login");
	login.style.display = "none";
};

const handleFormChange = event => {
	let alert_form = document.querySelector("#alert-select");
	alert_form.style.display = "none";
};

const holdSubmit = event => {
	event.preventDefault();
	let div = document.querySelector("#wrapper-div");
	let form = event.currentTarget;
	let alert_form = document.querySelector("#alert-select");
	let [textarea, input_0, input_1, input_2] = [...form];
	let temp_obj = {};
	
	temp_obj[textarea.name] = textarea.value.split(" ");
	temp_obj[input_0.name] = input_0.value;
	temp_obj[input_1.name] = input_1.value;
	temp_obj[input_2.name] = input_2.value;

	if(isValid(temp_obj)) {
		if(div.name == "hash") {
			sendData("./followfromhashes", temp_obj)
			.then(result => console.log(result));
		};

		if(div.name == "target") {
			sendData("./followfromusers", temp_obj)
			.then(result => console.log(result));
		};

		if(div.name == "comment") {
			sendData("./commentfromhashes", temp_obj)
			.then(result => console.log(result));
		};

		alert_form.style.display = "none";
		return true;
	};

	alert_form.textContent = "All fields are required!";
	alert_form.style.display = "block";
};
