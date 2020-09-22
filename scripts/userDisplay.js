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
   // <a class="nav-item nav-link" style="color: black;padding: 0;margin-right:1rem;" href="eventBuilder.html">Event Builder</a> 
    const info = `<a class="nav-item nav-link" style="color: black; padding: 0; margin-right:1rem;" href="about.html">About</a>
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
                <a class="btn btn-outline-dark reserve" onclick="logOut()" role="button">    Log out    </a>`         
        })
}
const logOut = (user) => {
    auth.signOut().then(() => {
        $('#modal-account').modal("hide");
        window.location.replace("/")
    })
    .catch(function(error) {
        console.log("Error signing user out: ", error);
    });
}