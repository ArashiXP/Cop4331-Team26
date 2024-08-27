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