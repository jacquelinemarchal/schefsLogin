
// listen for auth status changes
auth.onAuthStateChanged(user =>{ // returns null if user logs out
    if (user) { // when user logs in
        loggedInNav(auth.currentUser)
        document.getElementById("nav-items").innerHTML= `<a class="nav-item nav-link" style="color: black;" href="about.html">About</a>`
    }
})

// after user creates account and logs out, refresh modal
// NAV BAR UPDATES
const loggedInNav = (user) => {
    const acctInfo = document.getElementById('rightNavItems');
    var fullName = user.displayName;
    var name = fullName.split(" ", 1);    
    let uid = user.uid;

    let info = `<a data-toggle="modal" onclick="displayUserInfo('${uid}')" data-target="#modal-account"><img src="assets/person.png" style="max-width: 1.7rem; padding-bottom: 1px;">${name}    </a>`;
    //onclick="logOutUser('${uid}')"
    //info += '<a class="nav-item my-2 my-sm-0" style="color:blue;" id="logout" data-toggle="modal" data-target="#modal-logged-out" onclick="logOutUser()"> log out</a>'
    acctInfo.innerHTML = info;
}
const loggedOutNav = () => {
    const acctInfo = document.getElementById('rightNavItems');
    acctInfo.innerHTML = '';
}
const displayUserInfo = (uid) => {
    db.collection("users").doc(uid).get()
        .then(function(querySnapshot){
            let userInfo = querySnapshot.data();
            var modalContent = document.getElementById('modal-account-content');
            modalContent.innerHTML = `<p style="color: #888;">Logged in as:</p><br><h2>${userInfo.firstName}<br>${userInfo.lastName}</h2><br>
                <p>${userInfo.university}</p>
                <p>Class of ${userInfo.gradYear}</p>
                <p>${userInfo.major}</p>
                <p>${userInfo.email}</p><br>
                <a class="btn btn-outline-dark reserve" onclick="logOutUser()" role="button">    Log out    </a>`         
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
        $('#modal-signup').modal("hide");
        loginForm.reset();
    }).catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
        console.log("Error logging in user: ", error);
    });
    })

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm['signup-email'].value; // look in signupForm and find input with id signup-email
    const password = signupForm['signup-password'].value; 
    
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        handleNewLogIn(auth, email, password);
        $('#modal-signup').modal("hide");
        $('#modal-welcome').modal("show");
    })
    .catch(function(error){
        var errorMessage = error.message;
        alert(errorMessage);
        console.log("Error logging in user: ", error);
    }) 
})

const storeProfile = (email, fName, lName, gradYear, major, university, user) => {
    let docTitle = user.uid;
    var defaultStatus = false;
    db.collection("users").doc(docTitle).set({
        email: email,
        firstName: fName,
        lastName: lName,
        gradYear: gradYear,
        major: major,
        university: university,
        isAdmin: defaultStatus
    })
    .catch((error) => {
        console.log("Error storing user info: ", error);
    });
}

const handleNewLogIn = (auth, email, password) => {
    auth.signInWithEmailAndPassword(email, password).then(cred =>{
        var user = auth.currentUser;
        loggedInNav(auth.currentUser);
        const fName = signupForm['firstName'].value;
        const lName = signupForm['lastName'].value;
        const gradYear = signupForm['gradYear'].value;
        const major = signupForm['major'].value;
        const university = signupForm['school'].value;
        name = (fName + " " + lName)
        
        user.updateProfile({
            displayName: name,
        })
        storeProfile(email, fName, lName, gradYear, major, university, user);

        })
        .catch(function(error){
            var errorMessage = error.message;
            alert(errorMessage);
            console.log("Error logging in user: ", error);
        }) 

        .catch(function(error) {
           console.log("Error updating auth username: ", error);
        });
}

// logout
const logOutUser = (user) => {
    auth.signOut().then(() => {
        loggedOutNav()
        $('#modal-account').modal("hide");
        console.log("user logged out")
        document.getElementById("nav-items").innerHTML= `<a class="nav-item nav-link" style="color: black;" href="about.html">About</a><a class="nav-item nav-link" data-toggle="modal" data-target="#modal-signup">Sign In</a>        `
    })
    .catch(function(error) {
        console.log("Error signing user out: ", error);
    });
}
