// get data
db.collection('july20Events').get().then(snapshot => {
    setupEvents(snapshot.docs, snapshot.size);
})
// listen for auth status changes
auth.onAuthStateChanged(user =>{ // returns null if user logs out
    if (user) { // when user logs in
        
    }
})

// signup
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm['signup-email'].value; // look in signupForm and find input with id signup-email
    const password = signupForm['signup-password'].value; 
    
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        document.getElementById('signup-header').innerHTML = "<h2>Welcome to Schefs</h2>";
        document.getElementById('signup-form').innerHTML = "Your account has been made, you may now login";
    })
})


// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault()
    auth.signOut().then(() => {
    })
})  

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
