const acctInfo = document.getElementById('nav-items-right');
// listen for auth status changes
auth.onAuthStateChanged(user => { // returns null if user logs out
    if (user) { // when user logs in
        db.collection("users").doc(user.uid).get()
        .then((snap) => {
            let userDB = snap.data();
            let fullName = `${userDB.firstName} ${userDB.lastName}`
            loggedInNav(fullName, user.uid)
        })
    }
    else{
        acctInfo.innerHTML = 
        `<a class="nav-item nav-link p-2" data-toggle="modal" data-target="#modal-build-prompt">Event Builder</a><a class="nav-item nav-link" style="color: black;" href="about.html">About</a>
        <a class="nav-item nav-link" data-toggle="modal" data-target="#modal-signup">Sign In</a>`;
    }
})

// after user creates account and logs out, refresh modal
// NAV BAR UPDATES
const loggedInNav = (name, uid) => {
    const info = `<a class="nav-item nav-link" style="color: black;padding: 0;margin-right:1rem;" href="eventBuilder.html">Event Builder</a> <a class="nav-item nav-link" style="color: black; padding: 0; margin-right:1rem;" href="about.html">About</a>
                    <a data-toggle="modal" style="margin-right:1rem;" onclick="displayUserInfo('${uid}')" data-target="#modal-account">
                    <img src="assets/person.png" style="max-width: 1.7rem; padding-bottom: 2px;">${name}</a>`;
    acctInfo.innerHTML = info;
}

const displayUserInfo = (uid) => {
    db.collection("users").doc(uid).get()
        .then(function(querySnapshot){
            let userInfo = querySnapshot.data();
            var modalContent = document.getElementById('modal-account-content');
            modalContent.innerHTML = `<p style="color: #888;">Logged in as:</p><br><h2><b>${userInfo.firstName}<br>${userInfo.lastName}</b></h2><br>
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
        loginForm.reset();
        $('#modal-signup').modal("hide");
        loginForm.reset();
    }).catch((error) => {
        alert(`${error}. Contact schefs.us@gmail if you think this is a mistake.`)
        console.log("Error logging in user: ", error);
    });
});

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
        console.log("Error logging in user: ", error);
        alert(`${error}. Contact schefs.us@gmail if you think this is a mistake.`)
    }); 
});

const storeProfile = (userId, email, fName, lName, gradYear, major, university, phone) => {
    db.collection("users").doc(userId).set({
        email: email,
        firstName: fName,
        lastName: lName,
        gradYear: gradYear,
        major: major,
        university: university,
        isAdmin: false,
        phoneNumber: phone
    })
    .catch((error) => {
        console.log("Error storing user info: ", error);
    });
}

const handleNewLogIn = (auth, email, password) => {
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        const fName = signupForm['firstName'].value;
        const lName = signupForm['lastName'].value;
        const gradYear = signupForm['gradYear'].value;
        const major = signupForm['major'].value;
        const university = signupForm['school'].value;
        const phone = signupForm['phone'].value;

        const user = auth.currentUser;
        const name = fName + " " + lName;

        user.updateProfile({displayName: name})
            .catch(function(error) {
                console.log("Error updating auth username: ", error);
            });

        loggedInNav(name, user.uid);
        storeProfile(user.uid, email, fName, lName, gradYear, major, university, phone);
    })
    .catch(function(error){
        alert(`${error}. Contact schefs.us@gmail if you think this is a mistake.`)
        console.log("Error logging in user: ", error);
    });
}

// logout
const logOutUser = (user) => {
    auth.signOut().then(() => {
        $('#modal-account').modal("hide");
    })
    .catch(function(error) {
        console.log("Error signing user out: ", error);
    });
}
