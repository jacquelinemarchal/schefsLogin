
// listen for auth status changes
auth.onAuthStateChanged(user =>{ // returns null if user logs out
    if (user) { // when user logs in
        console.log(user)



    }
})

const loggedInNav = (user) => {
    const acctInfo = document.getElementById('rightNavItems');

    email = user.email;
    let info = `<a>${email} </a>`;
    info += '<a class="nav-item my-2 my-sm-0" style="color:blue;" id="logout" onclick="logOutUser()" type="submit">Log out</a>'
    acctInfo.innerHTML = info;
}
const loggedOutNav = () => {
    const acctInfo = document.getElementById('rightNavItems');
    acctInfo.innerHTML = '';
}
// signup
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm['signup-email'].value; // look in signupForm and find input with id signup-email
    const password = signupForm['signup-password'].value; 
    
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        const modal = document.querySelector('#signup-content');
        modal.innerHTML = `<h2>Welcome to Schefs!</h2><p>You are now logged in</p>`;
        handleLogIn(auth, email, password);
        })
})
const handleLogIn = (auth, email, password) => {
    auth.signInWithEmailAndPassword(email, password).then(cred =>{
        console.log(auth.currentUser.email)
        console.log(cred.user);
        loginForm.reset();
        loggedInNav(auth.currentUser);
    })

}

// logout
const logOutUser = (user) => {
    auth.signOut().then(() => {
        loggedOutNav()
        console.log("user logged out")
    })
}


// login 
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value; 
    auth.signInWithEmailAndPassword(email, password).then(cred =>{
        console.log(cred.user);
        loginForm.reset();
        $('#modal-login').modal("hide");
    })
    loginForm.reset();
})
