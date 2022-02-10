const urlBase = "http://cop4331-spring22.xyz/LAMPAPI";
const extension = "php";

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

  let url = urlBase + "/Login." + extension;

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
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
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
  } catch (err) {
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

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("welcomeMessage").innerHTML =
      "Welcome, " + firstName + " " + lastName;
  }
}

// Sara Code
function doAddContact() {
  let addFirstName = document.getElementById("addFirstName").value;
  let addLastName = document.getElementById("addLastName").value;
  let addEmail = document.getElementById("addEmail").value;
  let addPhone = document.getElementById("addPhone").value;

  document.getElementById("contactAddResult").innerHTML = "";

  let temp = { UserID: userId, FirstName: addFirstName, LastName: addLastName, Email: addEmail, Phone: addPhone };
  let jsonPayload = JSON.stringify(temp);

  let url = urlBase + "/AddContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactAddResult").innerHTML =
          "Contact has been added";
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    document.getElementById("contactAddResult").innerHTML = err.message;
  }

  doLoadContacts();
}

// Sara work in progress
function doUpdateContact(id) {
  // let id = document.getElementById("contactID").value;
  let updateFirstName = document.getElementById("editFirstName").value;
  let updateLastName = document.getElementById("editLastName").value;
  let updateEmail = document.getElementById("editEmail").value;
  let updatePhone = document.getElementById("editPhone").value;

  document.getElementById("contactUpdateResult").innerHTML = "";

  let temp = { ID: id, userID: userId, firstName: updateFirstName, lastName: updateLastName, email: updateEmail, phone: updatePhone };
  let jsonPayload = JSON.stringify(temp);

  let url = urlBase + "/UpdateContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactUpdateResult").innerHTML =
          "Contact has been updated";
      }
    };

    xhr.send(jsonPayload);
    let cells = document.getElementById(id).getElementsByTagName("td");

    cells[1] = updateFirstName;
    cells[2] = updateLastName;
    cells[3] = updateEmail;
    cells[4] = updatePhone;
  }
  catch (err) {
    document.getElementById("contactUpdateResult").innerHTML = err.message;
  }

  // localStorage.removeItem('contactID');
  // localStorage.clear();
  // resetContactsTable();
  // doLoadContacts();
}

// Edelis work in progress
function doLoadContacts() {
  //readCookie() is on the search.html so the userId should be available when <body> loads

  let searchString = document.getElementById("searchBar").value;

  console.log("UserID: ", userId);
  console.log("Search String: ", searchString);

  let temp = { userID: userId, search: searchString };
  let jsonPayload = JSON.stringify(temp);

  let url = urlBase + "/SearchContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    //send query to API
    xhr.send(jsonPayload);

    // When query finished processing
    xhr.onreadystatechange = function () {
      //if everything is correct
      if (this.readyState == 4 && this.status == 200) {
        // Parse API response to JSON object
        let jsonObject = JSON.parse(xhr.responseText);

        // If "error": "No Records Found" or "id": 0. Try with both
        if (jsonObject.error == "No Records Found") {
          console.log(jsonObject.id);
          console.log(jsonObject.error);

          resetContactsTable();
          return;
        }

        // Store contacts in array
        let contactsArray = jsonObject.results;
        console.log("Found " + contactsArray.length + " contacts for usedID " + userId);

        // resetContactsTable();

        // Loop thru the Array to get elements for each row
        for (var i = 0; i < contactsArray.length; i++) {
          // Grab info
          let contactID = contactsArray[i].id;
          let contactFistName = contactsArray[i].firstName;
          let contactLastName = contactsArray[i].lastName;
          let contactEmail = contactsArray[i].email;
          let contactPhone = contactsArray[i].phone;

          // calling layne's function
          addToContactsTable(contactID, contactFistName, contactLastName, contactEmail, contactPhone);
        }
      }
    };
  }
  catch (err) {
    console.log(err);
  }

}

function resetContactsTable() {
  document.getElementById("table").getElementsByTagName("tbody")[0].innerHTML = "";
}

// Layne Code
// Thank you StackOverflow
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    //return "(" + match[1] + ") " + match[2] + "-" + match[3];
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return null;
}

// Placeholder function for now
// function doReadContacts() {
// 	addToContactsTable("1", 'Thomas', 'Hardy', 'thomashardy@mail.com', '1715552222')
// 	addToContactsTable("2", 'Dominique', 'Perrier', 'dominiqueperrier@mail.com', '(313) 555-5735')
// 	addToContactsTable("3", 'Maria', 'Anders', 'mariaanders@mail.com', '(503) 555-9931')
// 	addToContactsTable("4", 'Fran', 'Wilson', 'franwilson@mail.com', '(204) 619-5731')
// 	addToContactsTable("5", 'Martin', 'Blank', 'martinblank@mail.com', '(480) 631-2097')
// 	addToContactsTable("6", 'jeff', 'benzos', 'jeff@amazon.com', '1234567890')
// }

// Adds a row to the contacts table with a given name, email, phone and row ID
// rowID is intended to match the contact's primary key ID for deletion/updating
function addToContactsTable(rowID, firstName, lastName, email, phone) {
  let tBody = document.getElementById("table").getElementsByTagName("tbody")[0];

  // Insert row at the end of the table
  let newTr = tBody.insertRow(-1);
  newTr.id = rowID;

  // Insert checkbox cell
  let checkCell = newTr.insertCell();
  checkCell.innerHTML =
    '<span class = "custom-checkbox">\
		<input type="checkbox" id="checkbox" name="options[]" value="1">\
		<label for="checkbox"></label>\
		</span>';

  // Name, email, phone as text
  let firstNameCell = newTr.insertCell();
  firstNameCell.innerHTML = firstName;
  let lastNameCell = newTr.insertCell();
  lastNameCell.innerHTML = lastName;
  let emailCell = newTr.insertCell();
  emailCell.innerHTML = email;
  let phoneCell = newTr.insertCell();
  // Convert to parentheses notation
  let fPhone = formatPhoneNumber(phone);
  phoneCell.innerHTML = fPhone;

  // Options (edit, delete buttons) cell
  let optionsCell = newTr.insertCell();
  optionsCell.innerHTML =
    '<a href="#editUserModal" class="edit" data-toggle="modal">\
		<i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>\
		<a href="#deleteUserModal" class="delete" data-toggle="modal">\
		<i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>';

  return newTr;
}


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
