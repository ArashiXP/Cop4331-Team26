const urlBase = 'http://165.227.203.121/LAMPAPI';
const extension = 'php';

const container = document.querySelector('.container');
const loginLink = document.querySelector('#loginLink');
const registerLink = document.querySelector('#registerLink');

let userId = 0;
let firstName = "";
let lastName = "";
let email = "";
let phoneNumber = "";

registerLink.addEventListener('click', ()=> {
    document.getElementById('regWindow').style.display = 'block';
    document.getElementById('loginWindow').style.display = 'none';
});

loginLink.addEventListener('click', ()=> {
    document.getElementById('regWindow').style.display = 'none';
    document.getElementById('loginWindow').style.display = 'block';
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
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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