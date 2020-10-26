auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById("reserve-item").setAttribute("style", "display: inline-block")
        document.getElementById("login-item").setAttribute("style", "display: none;")
        const uid = auth.currentUser.uid;
        db.collection('users').doc(uid).get().then(userSnap => {
            if (userSnap.data().isAdmin) {
                let allAttendees = [];
               // console.log("attendee data");
           //     attendeeData.forEach(attendee => allAttendees.push({
            //        ...attendee.data()
             //  }));
             //   showEventAttendees(allAttendees);
            }
        })
        .catch(err => console.log('Error getting tickets: ', err));
    }
    else{
        document.getElementById("reserve-item").setAttribute("style", "display:none;")
        document.getElementById("login-item").setAttribute("style", "display: inline-block;")
    
    }
})
var storageRef = storage.ref();
var listRef = storageRef.child('ambassador');
var path = listRef.child("ambassador.jpg");
path.getDownloadURL()
    .then((url) => {
        var image = document.getElementById("thumb");
        image.src = url;
    })
    .catch(function(error) {
        console.log(error)
    });
const showEventAttendees = (array) =>{
   // document.getElementById("admin-item").setAttribute('style', 'display: inline;');
    const modalAdminEvent = document.getElementById('event-admin-content');
    let guestList = `<br><table>`;
    let justEmails = `<p> Just emails: </p>`
    let count = 0;
    array.forEach(attendee => {
        count ++;
        guestList += `<tr><th>${attendee.name}</th><th>${attendee.email}</th><th>${attendee.phoneNumber}</th>`
        justEmails += `<p>${attendee.email}</p>`
    })
    guestList += `</table <br> <b><p> ${count} guests</b></p>`;
    guestList += justEmails;
    modalAdminEvent.innerHTML = guestList;
}

const townHallReserve = () => {
    const modalContent = document.getElementById('reserve-modal-content');
    if (auth.currentUser){
        const email = auth.currentUser.email;
        const uid = auth.currentUser.uid;
        const eventDocId = "bknqr8A5OwRKIrebe5Hu";
        const eventTitle = "Ambassador Town Hall"
        var date = new Date();
        var timestamp = date.getTime();

        db.collection("users").doc(uid).get()
        .then(snap => {
            const user = snap.data();
            const phone = user.phoneNumber;
            const name = `${user.firstName} ${user.lastName}`;
            // add ticket 
            db.collection('weekendevents').doc(eventDocId).collection('tickets').doc(uid)
            .set({
                email: email,
                name: name,
                phoneNumber: phone,
                time: timestamp
             })
            .then(() => {
                addToUsersEvents(uid, eventDocId, eventTitle, email, user.firstName, user.lastName) //eventTime
            })
            .catch(err => {
                console.log('Error adding ticket: ', err);
                modalContent.innerHTML = `
                    <p>It appears you already have a ticket for this event. If you think this is an error, please contact schefs.us@gmail.com</p>
                `;
            });
        })

    } else {
        console.log('Error: User not logged in anymore');
        modalContent.innerHTML = `
            <p>You are no longer logged in! Please log in and try again.</p>
        `;
    }
}
const addToUsersEvents = (uid, docId, title, email, fname, lname) => { //time
    console.log("adding to user event collection")
    db.collection("users").doc(uid).collection("events").doc(docId)
    .set({
        eventTitle: title,
        email: email,
        firstName: fname,
        lastName: lname,
        attended: false
      //  eventTime: time
    })
}
