const urlBase = 'http://cop4331-spring22.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("login").value;
	let password = document.getElementById("password").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				// console.log("xhr.responseText from code.js" , xhr.responseText)

				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				// Save to Local Storage. Using cookies instead
				// localStorage.setItem("KEY", "VALUE");
				// localStorage.setItem("fName", firstName);
				// localStorage.setItem("lName", lastName);
				// localStorage.setItem("userId", userId);
				
				window.location.href = "search.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	// window.localStorage.clear(); // clear all local storage
	window.location.href = "index.html";
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("welcomeMessage").innerHTML = "Welcome, " + firstName + " " + lastName;
	}
}

function addContact() {
    let newContact = document.getElementById("contactText").value; // need html to match element id
    document.getElementById("contactAddResult").innerHTML = ""; // need html to match element id

    let tmp = { contact: newContact, userId, userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactAddResult").innerHTML = "Contact has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

// Edelis work in progress
function doLoadContacts() {
	//readCookie() is on the search.html so the userId should be available when <body> loads

	let searchString = document.getElementById("searchBar").value;

	console.log("UserID: ", userId);
	console.log("Search String: ", searchString);

	let temp = {userID: userId, search: searchString};
	// let jsonPayload = 


}


/* MOVED TO A register.js FILE */
// function doRegister()


// function addColor() {
//     let newColor = document.getElementById("colorText").value;
//     document.getElementById("colorAddResult").innerHTML = "";

//     let tmp = { color: newColor, userId, userId };
//     let jsonPayload = JSON.stringify(tmp);

//     let url = urlBase + '/AddColor.' + extension;

//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     try {
//         xhr.onreadystatechange = function () {
//             if (this.readyState == 4 && this.status == 200) {
//                 document.getElementById("colorAddResult").innerHTML = "Color has been added";
//             }
//         };
//         xhr.send(jsonPayload);
//     }
//     catch (err) {
//         document.getElementById("colorAddResult").innerHTML = err.message;
//     }

// }

// function searchColor() {
//     let srch = document.getElementById("searchText").value;
//     document.getElementById("colorSearchResult").innerHTML = "";

//     let colorList = "";

//     let tmp = { search: srch, userId: userId };
//     let jsonPayload = JSON.stringify(tmp);

//     let url = urlBase + '/SearchColors.' + extension;

//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     try {
//         xhr.onreadystatechange = function () {
//             if (this.readyState == 4 && this.status == 200) {
//                 document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
//                 let jsonObject = JSON.parse(xhr.responseText);

//                 for (let i = 0; i < jsonObject.results.length; i++) {
//                     colorList += jsonObject.results[i];
//                     if (i < jsonObject.results.length - 1) {
//                         colorList += "<br />\r\n";
//                     }
//                 }

//                 document.getElementsByTagName("p")[0].innerHTML = colorList;
//             }
//         };
//         xhr.send(jsonPayload);
//     }
//     catch (err) {
//         document.getElementById("colorSearchResult").innerHTML = err.message;
//     }

// }

