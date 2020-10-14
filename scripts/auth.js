// login 
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value; 
    auth.signInWithEmailAndPassword(email, password).then(cred =>{
        loginForm.reset();
        $('#modal-signup').modal("hide");
        $('.modal-backdrop').remove();
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
    document.getElementById("submit-sign-up").innerHTML = `<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>`
    const email = signupForm['signup-email'].value; // look in signupForm and find input with id signup-email
    const password = signupForm['signup-password'].value; 
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
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
                })
            loggedInNav(name, user.uid);
            storeProfile(user.uid, email, fName, lName, gradYear, major, university, phone, password);
        })
        .catch(function(error){
            console.log("Error logging in user: ", error);
            alert(`${error}. Contact schefs.us@gmail if you think this is a mistake.`)
        })
});

const storeProfile = (userId, email, fName, lName, gradYear, major, university, phone, password) => {
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            var time = new Date();
            db.collection("users").doc(userId).set({
                email: email,
                firstName: fName,
                lastName: lName,
                gradYear: gradYear,
                major: major,
                university: university,
                isAdmin: false,
                phoneNumber: phone,
                timestamp: time
            })
            .then(() => {
                $("#modal-signup").modal("hide");
                if (location.pathname === "/eventBuilder.html"){
                    location.reload();
                }
                $("#modal-welcome").modal("show");
                $('.modal-backdrop').remove();
            })
            .catch((error) => {
                console.log("Error storing user info: ", error);
            });
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