
// listen for auth status changes
auth.onAuthStateChanged(user =>{ // returns null if user logs out
    if (user) { // when user logs in
        console.log(user)
        const mainModal = document.getElementById("enableLogInButtons")
        mainModal.setAttribute("style", "display:none");
        const emptyModal = document.getElementById("disableLogInButtons")
        emptyModal.setAttribute("style", "display:inline");
    }
})

// after user creates account and logs out, refresh modal
// NAV BAR UPDATES
const loggedInNav = (user) => {
    const acctInfo = document.getElementById('rightNavItems');
    email = user.email;
    let info = `<a>${email} </a>`;
    info += '<a class="nav-item my-2 my-sm-0" style="color:blue;" id="logout"  data-toggle="modal" data-target="#modal-logged-out" onclick="logOutUser()" type="submit">Log out</a>'
    acctInfo.innerHTML = info;
}
const loggedOutNav = () => {
    const acctInfo = document.getElementById('rightNavItems');
    acctInfo.innerHTML = '';
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
        $('#modal-signup').modal("hide");
        loggedInNav(auth.currentUser)
        loginForm.reset();
    })
})

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm['signup-email'].value; // look in signupForm and find input with id signup-email
    const password = signupForm['signup-password'].value; 
    
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        handleLogIn(auth, email, password);
        $('#modal-signup').modal("hide");
        $('#modal-welcome').modal("show");
    })
})
const handleLogIn = (auth, email, password) => {
    auth.signInWithEmailAndPassword(email, password).then(cred =>{
        console.log(auth.currentUser.email)
        console.log(cred.user);
        signupForm.reset();
        loggedInNav(auth.currentUser);
    })
}

// logout
const logOutUser = (user) => {
    auth.signOut().then(() => {
        loggedOutNav()
        let mainModal = getElementById("enableLogInButtons")
        mainModal.setAttribute("style", "display:inline");
        let emptyModal = getElementById("disableLogInButtons")
        mainModal.setAttribute("style", "display:none");
        console.log("user logged out")
    })
}
