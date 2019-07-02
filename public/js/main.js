const textModel = {
	target: {
		textarea: "Write the target(s) profile(s) to colect users. If more than one target, split them with spaces: target1 target2 target3 targetN.",
		input_0: "N. Max users to follow per Target",
		input_1: "N. Max user followers",
		input_2: "N. Min user followers"
	},

	hash: {
		textarea: "Write the tags to colect users. If more than one tag, split them with spaces: tag1 tag2 tag3 tagN.",
		input_0: "N. Max users to follow per Tag",
		input_1: "N. Max user followers",
		input_2: "N. Min user followers"
	},

	comment: {
		textarea: "Write the tags to comment in. If more than one tag, split them with spaces: tag1 tag2 tag3 tagN.",
		input_0: "N. of photos to comment per tag",
		input_1: "N. min photo likes",
		input_2: "Write the comment"
	}
};

const fieldModel = texts => {
	let div = document.createElement("div");
	let target_field = document.createElement("textarea");
	let max_users_to_follow = document.createElement("input");
	let max_users_followers = document.createElement("input");
	let min_users_to_follow = document.createElement("input");
	let min_users_followers = document.createElement("input");
	let button_execute = document.createElement("button");
	let div_max_follow = document.createElement("div");
	let div_max_followers = document.createElement("div");
	let div_min_followers = document.createElement("div");

	div.id = "wrapper-div";
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
	target_field.name = "target-field";
	target_field.style.width = "100%";
	target_field.style.resize = "none";

	max_users_to_follow.setAttribute("placeholder", `${texts.input_0}`);
	max_users_to_follow.classList.add("form-control");
	max_users_to_follow.name  = "input-max";

	max_users_followers.setAttribute("placeholder", `${texts.input_1}`);
	max_users_followers.classList.add("form-control");
	max_users_followers.name = "input-max-followers";

	min_users_followers.setAttribute("placeholder", `${texts.input_2}`);
	min_users_followers.classList.add("form-control");
	min_users_followers.name = "input-min-followers";

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
	if(obj["target-field"].length < 1) return false; 
	if(isNaN(obj["input-max"])) return false;
	if(isNaN(obj["input-max-followers"])) return false;
	if(isNaN(obj["input-min-followers"])) return false;

	return true;
};

const holdSubmit = event => {
	event.preventDefault();
	let form = event.currentTarget;
	let [textarea, input_0, input_1, input_2] = [...form];
	let new_form = new FormData();
	let temp_obj = {};
	
	temp_obj[textarea.name] = textarea.value.split(" ");
	temp_obj[input_0.name] = parseInt(input_0.value);
	temp_obj[input_1.name] = parseInt(input_1.value);
	temp_obj[input_2.name] = parseInt(input_2.value);

	if(isValid(temp_obj)) {
		new_form.set(textarea.name, textarea.value);
		new_form.set(input_0.name, input_0.value);
		new_form.set(input_1.name, input_1.value);
		new_form.set(input_2.name, input_2.value);

		return new_form;
	};

	return false;
};
