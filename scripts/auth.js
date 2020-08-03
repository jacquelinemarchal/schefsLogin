
// listen for auth status changes
auth.onAuthStateChanged(user =>{ // returns null if user logs out
    if (user) { // when user logs in
        console.log(user)
        loggedInNav(auth.currentUser)
        document.getElementById("nav-items").innerHTML= `<a class="nav-item nav-link" style="color: black;" href="about.html">About</a>`
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
        storeUserInfo(auth.currentUser);
        $('#modal-signup').modal("hide");
        $('#modal-welcome').modal("show");
    })


    

})
const handleLogIn = (auth, email, password) => {
    auth.signInWithEmailAndPassword(email, password).then(cred =>{
        console.log(auth.currentUser.email)
        console.log(cred.user);
        loggedInNav(auth.currentUser);
    })
}
const storeUserInfo = (user) => {
    console.log(user)
    /*
    db.collection("users").doc(uid).set({
        email: user.email
        console.log(user)
    })*/
}

// logout
const logOutUser = (user) => {
    auth.signOut().then(() => {
        loggedOutNav()
        console.log("user logged out")
        document.getElementById("nav-items").innerHTML= `<a class="nav-item nav-link" style="color: black;" href="about.html">About</a><a class="nav-item nav-link" data-toggle="modal" data-target="#modal-signup">Sign In</a>        `

    })
}
