const container = document.querySelector('.container');
const loginLink = document.querySelector('#loginLink');
const registerLink = document.querySelector('#registerLink');

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
    location.href = "contacts.html";
}

function doLogout()
{
    location.href = "index.html";
}