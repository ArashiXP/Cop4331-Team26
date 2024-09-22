const urlBase = 'http://165.227.203.121/LAMPAPI';
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
	printText();
});

nameSearch.addEventListener('keydown', ()=> {
	if (event.key === 'Enter')
		searchContacts();
});

addContactButton.addEventListener('click', ()=> {
	document.getElementById('addName').style.display = 'block';
	document.getElementById('contactsWindow').style.display = 'none';
});

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
                // reload contacts table and switch view to show
                showContacts();
				document.getElementById('addName').style.display = 'none';
				document.getElementById('contactsWindow').style.display = 'block';
				clearText();
				console.log("added: " + name, email, phone,userId);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
	}

}

function clearText() 
{
	document.getElementById('contactsFName').value = '';
	document.getElementById('contactsLName').value = '';
	document.getElementById('contactsEmail').value = '';
	document.getElementById('contactsPhoneNum').value = '';
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
						// console.log("This is split: " + fName + " " + lName);
						// allIds[i] = ObjejsonObject.length[i].ID
						collection += "<tr>"
						collection += "<td id = \"listFirst" + i +  "\"><span>" + fName + "</span></td>"
						collection += "<td id = \"listLast" + i +  "\"><span>" + lName + "</span></td>"
						collection += "<td id = \"listEmail" + i +  "\"><span>" + jsonObject[i].email + "</span></td>"
						collection += "<td id = \"listPhone" + i +  "\"><span>" + jsonObject[i].phone + "</span></td>"
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

