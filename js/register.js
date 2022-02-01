const urlBase = 'http://cop4331-spring22.xyz/LAMPAPI';
const extension = 'php';

// Default fields
let userId = 0;
let firstName = "";
let lastName = "";
let username = "";
let password = "";
// let confirmPassword = "";
// let hash = "";

function displayError(str) {
	document.getElementById("registerResult").innerHTML = str;
}

function doRegister() {

	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	username = document.getElementById("username").value;
	password = document.getElementById("newPassword").value;
	confirmPassword = document.getElementById("confirmNewPassword").value;
	// hash = md5(password)

	/* CONFIRM VALIDATION. REGEX ??????? */ 
	if (!firstName) {
		displayError("Missing first name");
	 	return;
	}

	if (!lastName) {
		displayError("Missing last name");
	 	return;
	}
	
	if (!username) {
		displayError("Missing username");
		return;
	}
	
	if (password.length < 7) {
		displayError("Password must be at least 7 characters long");
		return;
	}
	
	if (password != confirmPassword) {
		displayError("Passwords do not match");
		return;
	}

	// Create payload
	let tmp = { 
		firstName: firstName, 
		lastName: lastName, 
		login: username, 
		// password = hash,
		password: password 
	};

	console.log(tmp); //for testing in browser dev tool

	// Convert to JSON string
	let jsonPayload = JSON.stringify(tmp);

	// Creating a XHR object
	let xhr = new XMLHttpRequest();
	let url = urlBase + '/Register.' + extension;

	// Open a connection
	xhr.open("POST", url, true);

	// Set the request header-> type of content being sent
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		// Create a state change callback
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);
				console.log(jsonObject.error);

				if (jsonObject.error == "Username already taken") {
					document.getElementById("registerResult").innerHTML = "Sorry, Username already taken";
				} else {
					// saveCookie();
					window.location.href = "index.html";
				}
			}
		};

		xhr.send(jsonPayload);

	} catch (err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}

}
