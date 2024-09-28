const urlBase = 'http://cop4331-26.com/LAMPAPI';
const extension = 'php';

const container = document.querySelector('.container');
const loginLink = document.querySelector('#loginLink');
const registerLink = document.querySelector('#registerLink');
const addContactButton = document.querySelector('#addButton');

let nameSearch = document.querySelector("#searchInput");
let searchButton = document.querySelector("#searchButton");

let userId = 0;
const allIds = [];
let firstName = "";
let lastName = "";

if (loginLink || registerLink)
{
loginLink.addEventListener('click', ()=> {
    document.getElementById('regWindow').style.display = 'none';
    document.getElementById('loginWindow').style.display = 'block';
});

registerLink.addEventListener('click', ()=> {
    document.getElementById('regWindow').style.display = 'block';
    document.getElementById('loginWindow').style.display = 'none';
});


let eyeIconLogin = document.querySelector("#showPasswordLogin");
let eyeIconReg = document.querySelector("#showPasswordReg");
let logPassword = document.querySelector("#loginPassword");
let regPassword = document.querySelector("#regPassword");

eyeIconLogin.addEventListener('click', ()=> {
    if (logPassword.type == 'password')
    {
        logPassword.type = 'text';
        eyeIconLogin.src = '/images/eye-open.png';
    }
    else
    {
        logPassword.type = 'password';
        eyeIconLogin.src = '/images/eye-close.png';
    }

});

eyeIconReg.addEventListener('click', ()=> {
    if (regPassword.type == 'password')
    {
        regPassword.type = 'text';
        eyeIconReg.src = '/images/eye-open.png';
    }
    else
    {
        regPassword.type = 'password';
        eyeIconReg.src = '/images/eye-close.png';
    }

});

} // End of Login/Signup Page

function doLogin()
{
    // location.href = "contacts.html";
    userId = 0;
    firstName = "";
    lastName = "";
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login:login,password:password};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
				console.log("UserId is " + userId);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

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
}

function doRegister()
{
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    let login = document.getElementById("regName").value;
	let password = document.getElementById("regPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	if(!validReg(firstName, lastName, login, password))
	{
		document.getElementById("regResult").innerHTML = "Invalid Registration";
		return;
	}

	let tmp = {firstName: firstName,lastName: lastName,login:login,password: password}
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/Register." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
        xhr.onreadystatechange = function () {

            if (this.readyState != 4) {
                return;
            }

            if (this.status == 409) {
                document.getElementById("signupResult").innerHTML = "User already exists";
                return;
            }

            if (this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("regResult").innerHTML = "Registration Successful!";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("regResult").innerHTML = err.message;
    }


}

function validReg(first, last, user, pass)
{
	if ((first == "") || (last == "") ||(user =="") || (pass == ""))
	{
		console.log("invalid registration");
		return false;
	}
	else
	{
		return true;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

if(searchButton) 
{

searchButton.addEventListener('click', ()=>{
	console.log(userId);
});

nameSearch.addEventListener('keydown', ()=> {
	if (event.key === 'Enter')
		searchContacts();
});

addContactButton.addEventListener('click', ()=> {
	openContactsAdd();
});

function openContactsAdd()
{
	document.getElementById('addName').style.display = 'block';
	document.getElementById('contactsWindow').style.display = 'none';
}

function closeContactsAdd()
{
	document.getElementById('addName').style.display = 'none';
	document.getElementById('contactsWindow').style.display = 'block';
}

function addContacts()
{
	let first = document.getElementById('contactsFName').value;
	let last = document.getElementById('contactsLName').value;
	let email = document.getElementById('contactsEmail').value;
	let phone = document.getElementById('contactsPhoneNum').value;
	let name = first + ' ' + last

	if(!phone.includes("-"))
	{
		phone = phone.slice(0,3) + "-" + phone.slice(3,6) + "-" + phone.slice(6,15);
	}

	if(!validContact(first,last,email,phone))
		{
			console.log("Something is wrong with the contact");
			return;
		}

	let contact = {name:name, email:email, phone:phone, userid:userId};



	let jsonPayload = JSON.stringify(contact);

    let url = urlBase + '/AddContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                showContacts();
				clearText();
				closeContactsAdd();
				console.log("added: " + name, email, phone,userId);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
	}

}

function minimise()
{
	closeContactsAdd();
	clearText();
}

function clearText() 
{
	document.getElementById('contactsFName').value = '';
	document.getElementById('contactsLName').value = '';
	document.getElementById('contactsEmail').value = '';
	document.getElementById('contactsPhoneNum').value = '';
	document.getElementById('addResult').innerHTML = '';
}

function showContacts()
{
	let list = {userid:userId, search:""};

	let jsonPayload = JSON.stringify(list);

    let url = urlBase + '/GetContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try 
	{
		xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) 
				{
					let jsonObject = JSON.parse(xhr.responseText);
					if (jsonObject.error) 
					{
						console.log(jsonObject.error);
						return;
                	} 
					let collection = "";
					for (let i = 0; i < Object.keys(jsonObject).length; i++)
					{
						let splitName = jsonObject[i].name.split(" ");
						let fName = splitName[0];
						let lName = splitName[1];
						// console.log(fName + " " + lName + " id = " + jsonObject[i].id);
						allIds[i] = jsonObject[i].id;
						collection += "<tr>"
						collection += "<td id = \"listFirst" + i +  "\"><span>" + fName + "</span></td>"
						collection += "<td id = \"listLast" + i +  "\"><span>" + lName + "</span></td>"
						collection += "<td id = \"listEmail" + i +  "\"><span>" + jsonObject[i].email + "</span></td>"
						collection += "<td id = \"listPhone" + i +  "\"><span>" + jsonObject[i].phone + "</span></td>"
						collection += "<td><button type = \"button\" id=\"deleteButton\" onclick=\"deleteContact(" + i + ")\"><img src=\"/images/x.png\" id=\"whiteX\">" + "</button>";
						collection += "<button type = \"button\" class=\"editing\" onclick=\"editContact(" + i + ")\" id=\"editContact" + i + "\"><img src=\"/images/Write.png\" id=\"editImg\">" + "</button>";
						collection += "</td>";
						collection += "</tr>"
					}
					collection += "</table>"
					// console.log("This is collection: \n" + collection);
					document.getElementById("listContacts").innerHTML = collection;
				}
					};
					xhr.send(jsonPayload);
					}catch (err)
						{
							console.log(err.message);
						}
}

function searchContacts()
{
	let first, last;
	let table = document.getElementById("contactsTable");
	let row = table.getElementsByTagName("tr");
	let input = document.getElementById("searchInput");
	let fixedInput = input.value.toLowerCase().split(" ");

	for (let i = 0; i < row.length; i++)
	{
		first = row[i].getElementsByTagName("td")[0];
		last = row[i].getElementsByTagName("td")[1];

		if (first && last)
		{
			let firstTableText = first.textContent || first.innerText;
			let lastTableText = last.textContent || last.innerText;
			row[i].style.display = "none";

			for (let j = 0; j < fixedInput.length; j++) {
                let element = fixedInput[j];
                if (firstTableText.toLowerCase().indexOf(element) >= 0) 
				{
                    row[i].style.display = "";
                }
                if (lastTableText.toLowerCase().indexOf(element) >= 0) 
				{
                    row[i].style.display = "";
                }
			}
		}
	}
}

function deleteContact(rowNum)
{
	let ID = allIds[rowNum]
	let contact = {id:ID};
	let jsonPayload = JSON.stringify(contact);
	let url = urlBase + "/DeleteContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) 
			{
				showContacts();
				if(rowNum == 0)
				{
					location.reload();
				}

			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}

}

function editContact(rowNum)
{
	let ID = allIds[rowNum];;
	document.getElementById("editContact" + rowNum).innerHTML = "<button type = \"button\" class=\"editing\" onclick=\"saveContact(" + rowNum + ")\" id=\"saveContact" + rowNum + "\"><img src=\"/images/checked.png\" id=\"saveImg\">" + "</button>";
	let firstName = document.getElementById("listFirst" + rowNum);
	let lastName = document.getElementById("listLast" + rowNum);
	let email = document.getElementById("listEmail" + rowNum);
	let phone = document.getElementById("listPhone" + rowNum);

	let oldFirst = firstName.innerText;
	let oldLast = lastName.innerText;
	let oldEmail = email.innerText;
	let oldPhone = phone.innerText;

	firstName.innerHTML = "<input type=\"text\" class=\"editInput\" id=\"newFirst" + rowNum + "\"value=\"" + oldFirst + "\">";
	lastName.innerHTML = "<input type=\"text\" class=\"editInput\" id=\"newLast" + rowNum + "\"value=\"" + oldLast + "\">"; "\">";
	email.innerHTML = "<input type=\"text\" class=\"editInput\" id=\"newEmail" + rowNum + "\"value=\"" + oldEmail + "\">"; "\">";
	phone.innerHTML = "<input type=\"text\" class=\"editInput\" id=\"newPhone" + rowNum + "\"value=\"" + oldPhone + "\">"; "\">";
}

function saveContact(rowNum)
{
	let ID = allIds[rowNum];
	console.log("saving ID: " + ID);
	document.getElementById("saveContact" + rowNum).innerHTML = "<button type = \"button\" class=\"editing\" onclick=\"editContact(" + rowNum + ")\" id=\"editContact" + rowNum + "\"><img src=\"/images/Write.png\" id=\"editImg\">" + "</button>";

	let newFirst = document.getElementById("newFirst" + rowNum).value;
	let newLast = document.getElementById("newLast" + rowNum).value;
	let newEmail = document.getElementById("newEmail" + rowNum).value;
	let newPhone = document.getElementById("newPhone" + rowNum).value;

	let newName = newFirst + ' ' + newLast

	console.log("new name: " + newName);
	console.log("new phone: " + newPhone);
	console.log("new email: " + newEmail);

	let updatedContact = {userid: userId, contactid: ID, name: newName, phone: newPhone,email: newEmail};

	let jsonPayload = JSON.stringify(updatedContact);

	let url = urlBase + '/EditContacts.' + extension;


	let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) 
			{
                showContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
		console.log(err.message);
    }
      

}



function validContact(first, last, email, phone)
{
	let firstE, lastE, emailE, emailV, phoneE, phoneV = false;
	let text = "Please Fill In Your:<br>"

	if(first == "")
	{
		text+= "First Name<br>";
		firstE = true;
	}

	if(last == "")
	{
		text += "Last Name<br>";
		lastE = true;
	}

	if(email == "")
	{
		text+= "Email<br>";
		emailE = true;
	}
	else
	{
		let vEmail = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
		if (vEmail.test(email) == false)
		{
			emailV = true;
		}
	}

	if(phone == "")
	{
		text += "Phone\n";
		phoneE = true;
	}
	else
	{
		let vPhone = new RegExp(/^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/);
		if (vPhone.test(phone) == false)
		{
			phoneV = true;
		}
	}

	if(!(firstE || lastE || emailE || phoneE))
	{
		text = "";
	}

	if((phoneV || emailV))
	{
		text += "Invalid:<br>";
		if(phoneV)
		{
			text += "Phone Number<br>";
		}
		if (emailV)
		{
			text += "Email";
		}
	}

	if((firstE || lastE || emailE || emailV || phoneE || phoneV))
	{
		console.log("should have returned false");
		document.getElementById("addResult").innerHTML = text;
		return false;
	}

	console.log("returned true");
	return true;
}

} // End of Contacts Page

