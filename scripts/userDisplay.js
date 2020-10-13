var acctInfo = document.getElementById('nav-items-right');
// listen for auth status changes
auth.onAuthStateChanged(user => { // returns null if user logs out
    if (user) { // when user logs in
        db.collection("users").doc(user.uid).get()
        .then((snap) => {
            if (snap.exists){
                let userDB = snap.data();
                let fullName = `${userDB.firstName} ${userDB.lastName}`
                loggedInNav(fullName, user.uid)
            }
        })
    }
    else{
        acctInfo.innerHTML = 
        `<a class="nav-item nav-link" style="color: black;" href="open-mind-archive.html">Open Mind Archive</a>
         <a style="color:black;"class="nav-item nav-link p-2" data-toggle="modal" data-target="#modal-build-prompt">Host</a>
         <a class="nav-item nav-link" style="color: black;" href="about.html">About</a>
         <a style="color:black;"class="nav-item nav-link" data-toggle="modal" data-target="#modal-signup">Sign In</a>`;
    }
});
// NAV BAR UPDATES
const loggedInNav = (name, uid) => {
    var oma = `<a class="nav-item nav-link" style="color: black;padding: 0;margin-right:1rem;" href="open-mind-archive.html">Open Mind Archive</a>`
    var eventBuilder = `<a class="nav-item nav-link" style="color: black;padding: 0;margin-right:1rem;" href="eventBuilder.html">Host</a>`
    var about = `<a class="nav-item nav-link" style="color: black; padding: 0; margin-right:1rem;" href="about.html">About</a>`
    var account = `<a data-toggle="modal" style="margin-right:1rem;" onclick="displayUserInfo('${uid}')" data-target="#modal-account">
    <img src="assets/person.png" style="max-width: 1.7rem; padding-bottom: 2px;">${name}</a>`
    /*
    if (window.location.href.indexOf("eventBuilder") > -1) {
        const info = about.concat(account)
        acctInfo.innerHTML = info;
    }
    if (window.location.href.indexOf("approval-events") > -1) {
        const info = account;
        acctInfo.innerHTML = info;    
    }
    if (window.location.href.indexOf("about") > -1) {
        const info = eventBuilder.concat(account);
        acctInfo.innerHTML = info;    
    }
    if ((window.location.href.indexOf("eventBuilder") < -1) || (window.location.href.indexOf("approval-events") < -1) || (window.location.href.indexOf("about") < -1)){
        const info = eventBuilder.concat(about, account);
        acctInfo.innerHTML = info;
    }
    else{*/
    const info = oma.concat(eventBuilder, about, account);
    acctInfo.innerHTML = info;
  //  }
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
                <a class="btn btn-outline-dark reserve" id="myEventsBtn" style="margin-bottom:1rem;" role="button">    My Events    </a>
                <a class="btn btn-outline-dark reserve" onclick="logOut()" role="button">    Log out    </a>`
                $(myEventsBtn).on('click', () => {
                    $('#modal-account').modal("hide");
                    var eventDiv = document.getElementById("modal-hosted-events-content")
                    var areEventsEmpty = eventDiv.innerHTML === "";
                    if(areEventsEmpty){
                        displayUserHostedEvents(uid, eventDiv);
                    }
                    if (!areEventsEmpty){
                        eventDiv.innerHTML = '';
                        displayUserHostedEvents(uid, eventDiv);
                    }
                });
        })
}
const logOut = (user) => {
    auth.signOut().then(() => {
        $('#modal-account').modal("hide");
        $('.modal-backdrop').remove();
        window.location.replace("/")
    })
    .catch(function(error) {
        console.log("Error signing user out: ", error);
    });
}

const displayUserHostedEvents = (uid, eventDiv) => {
    $('#modal-hosted-events').modal("show");
    db.collection("users").doc(uid).collection("hostedEvents").get()
    .then(snap => {
        if (snap.empty){
            eventDiv.innerHTML = `<p style="text-align: center; margin-bottom:0;">You are not hosting any events. Head over to our Event Builder to make one!</p>`
        }
        if (!snap.empty){
            snap.forEach(doc => {
                var eventList = document.createElement("ul")
                var event = document.createElement("li")
                event.setAttribute("style", "list-style-type: none;")
                status = "";
                if (event.isLive){
                    status = "approved"
                }
                if (!event.isLive){
                    status = "pending approval"
                }
                event.innerHTML=`${doc.data().title} • this event is ${status}`
                eventList.appendChild(event)
                eventDiv.appendChild(eventList)
            })
        }
    })
}
$('#modal-hosted-events').on('hidden.bs.modal', function (e) {
    $('.modal-backdrop').remove();
})
const displayUserEvents = (uid) => {
    $('#modal-personal-events').modal("show");
    var unconfirmed = document.getElementById("unconfirmed-events-section")
    var confirmed = document.getElementById("personal-events-section")
    db.collection("users").doc(uid).collection("events").get()
    .then(snap => {
        snap.forEach(doc => {
            var eventData = doc.data();
            
            if (eventData.attended){
                var titleBtn = document.createElement("a")
                titleBtn.setAttribute("id", `${eventData.eventTitle}`)
                titleBtn.setAttribute("class", "btn btn-outline-dark reserve")
                titleBtn.setAttribute("role", "button")
                titleBtn.innerHTML = `${eventData.eventTitle}`
                confirmed.appendChild(titleBtn)
                $(titleBtn).on('click', function () {
                    findGuests(doc.id);
                });
            }
            if (!eventData.attended){
                appendTo = unconfirmed;
            }
        })
    })
    .catch(err => {
        console.log('Error finding events: ', err);
    });
}
const findGuests = (doc) => {
    db.collection("aug20events").doc(doc).collection("tickets").get()
    .then(snap => {
        snap.forEach(doc => {
          //  var guestList = document.createElement("p")
           // guestList.innerHTML = `${doc.data().email}<br>`
            console.log(doc.data())
        })
    })
} 