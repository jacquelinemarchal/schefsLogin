// set initial state
let state = {
    indexDivStyle: '',  // empty style = being displayed
    pageDivHtml: ''     // empty page  = event page not rendered
};

// initialize history state
window.history.replaceState(state, null, '');

// update display
const render = () => {
    window.scrollTo(0, 0);
    indexDiv.setAttribute('style', state.indexDivStyle);
    pageDiv.innerHTML = state.pageDivHtml;
}

// handle set state from history
window.onpopstate = event => {
    if (event.state) {
        state = event.state;
        render();
    }
}

// handle click home button
const displayHome = () => {
    state.indexDivStyle = '';
    state.pageDivHtml = '';

    window.history.pushState(state, null, '');

    render();
}

// handle click some event
const displayPage = (eventId, time) => {
    const eventRef = db.collection('aug20events').doc(eventId);
    const ticketsRef = eventRef.collection('tickets');

    ticketsRef.get()
        .then(snap => {
            const attendeeData = snap;
            const size = snap.size;
            eventRef.get()
                .then(snap => {
                    const eventData = snap.data(); 
                    state.pageDivHtml = generateEventPage(eventData, eventId, time, size);
                    state.indexDivStyle = 'display: none';

                    window.history.pushState(state, null, '');

                    render();

                    if (auth.currentUser) {
                        const uid = auth.currentUser.uid;
                        db.collection('users').doc(uid).get().then(userSnap => {
                            if (userSnap.data().isAdmin) {
                                let allAttendees = [];
                                attendeeData.forEach(attendee => allAttendees.push({
                                    ...attendee.data()
                                }));
                                showEventAttendees(allAttendees);
                            }
                        })
                        .catch(err => console.log('Error getting tickets: ', err));
                    }
                })
                .catch(err => console.log('Error getting event document: ', err));
        })
        .catch(err => console.log('Error getting tickets: ', err));
}

// generate HTML for event page

const generateEventPage = (eventData, eventId, time, size) => { 
    let capacity = 7;
    let soldOutStyle = 'display: none;';
    let reserveStyle = 'display: none;';
    let loginStyle = 'display: none;';
    let adminStyle = 'display: none;';
    let pastEventStyle = '';
    let remainingTickets = 7;

    // escape apostrophes & quotes
    const escapedTitle = eventData.title.replace(/'/g, '\\x27').replace(/"/g, '\\x22');
    const name = eventData.firstName + " " + eventData.lastName;

    return `
        <div class="container">
            <div class="container-wrapper">
                <div class="row">
                    <div class="col-md-7">
                        <h1 id="title">${eventData.title}</h1>
                        <p>${eventData.mealType} • ${time}</p>
                           <img src="${eventData.thumb}" alt="..." id="thumb">
                        <p>${eventData.desc}</p>
                        <br>
                        <h2 id="webPrepare">What to prepare:</h2>
                        <b><p id="mobilePrepare">What to prepare:</p></b>
                        <p>${eventData.req}</p>
                        <div id="mobileHost">
                            <p>Hosted by: ${name}</p><br>
                                <img src="${eventData.prof}" alt="..." id="hostMobilePic">
                            <br><p class="hostSchool">${eventData.university} • ${eventData.gradYear}<br>${eventData.major}</p>
                            <br><div class="hostBio"> <p>${eventData.bio}</p></div><br>
                        </div>
                        <br><br>
                    </div>
    
                    <div class="col-sm-4 offset-sm-7" style="padding-left: 0;" id="hostInfo">
                        <div id="soldOut-item" style="${soldOutStyle}">
                            <a class="btn btn-dark reserve" style="color: white ;background-color: #3e4042">SOLD OUT</a>
                        </div>
                        <div id="soldOut-item" style="${pastEventStyle}">
                            <a class="btn btn-dark reserve" style="color: white ;background-color: #3e4042">PAST EVENT</a>
                        </div>
                        <div id="reserve-item" style="${reserveStyle}">
                            <a class="btn btn-outline-dark reserve" onclick="triggerReserve('${escapedTitle}', '${eventId}')" data-toggle="modal" data-target="#modal-reserve" role="button">RESERVE ZOOM LINK</a>
                        </div>
                        <div id="login-item" style="${loginStyle}">
                            <a class="btn btn-outline-dark reserve" data-toggle="modal" data-target="#modal-signup">RESERVE FOR ZOOM</a>
                        </div>
                        <div id="admin-item" style="${adminStyle}">
                        <a class="btn btn-outline-dark reserve" id="adminButton" data-toggle="modal" data-target="#modal-admin">ADMIN</a>
                        </div>
                        <p class="ticket-count">0 / 7 spots available</p>
                        <p>Hosted by: </p>
                        <div class="row" style="margin-top: 10px;">
                            <div class="col-sm-3">
                                <img src="${eventData.prof}" alt="..." id="hostPic">
                            </div>
                            <div class="col-sm-1 offset-sm-1">
                                <h2>${name}</h2>
                            </div>
                        </div>
                        <br><p class="hostSchool">${eventData.university} • ${eventData.gradYear}<br>${eventData.major}</p>
                        <br><div class="hostBio"> ${eventData.bio}</div>
                    </div>
                </div>         
            </div>
            <div class="footer">
                <div class="row" id="fixed-footer">
                    <p id="mobileReserve" class="ticket-count">0 / 7spots available</p>
                    <div id="soldOut-item-mobile" style="${soldOutStyle}">
                        <a class="btn btn-dark reserve" style="color: white;background-color: #3e4042">SOLD OUT</a>
                    </div>
                    <div id="soldOut-item" style="${pastEventStyle}">
                        <a class="btn btn-dark reserve" style="color: white ;background-color: #3e4042">PAST EVENT</a>
                    </div>
                    <div id="reserve-item-mobile" style="${reserveStyle}">
                        <a class="btn btn-outline-dark reserve" onclick="triggerReserve('${escapedTitle}', '${eventId}')" data-toggle="modal" data-target="#modal-reserve" role="button" id="mobileHost">RESERVE</a>
                    </div>
                    <div id="login-item-mobile" style="${loginStyle}">
                        <a class="btn btn-outline-dark reserve" data-toggle="modal" data-target="#modal-signup" id="mobileHost">RESERVE</a>
                    </div>
                </div>
            </div>
        </div>
    `
}
let totalTix = 48;
const triggerReserve = (title, eventId) => {
    const modalContent = document.getElementById('reserve-modal-content');
    if (auth.currentUser){
        const email = auth.currentUser.email;
        const uid = auth.currentUser.uid;

        db.collection("users").doc(uid).get()
        .then(snap => {
            const user = snap.data();
            const phone = user.phoneNumber
            const name = `${user.firstName} ${user.lastName}`;
            db.collection('aug20events').doc(eventId).collection('tickets').doc(uid)
            .set({
                email: email,
                name: name,
                phoneNumber: phone
             })
            .then(() => {
                totalTix ++;
                console.log('Success');
                console.log(totalTix)

                modalContent.innerHTML = `
                    <h2>Success!</h2><p>You have reserved a spot at ${title}. Check ${email} for ticket information.</p>
                `;
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

// listen for auth changes to update reserve/login button
auth.onAuthStateChanged(user => {
    const soldOutItem = document.getElementById("soldOut-item");
    const adminItem = document.getElementById("admin-item");
    if (soldOutItem && soldOutItem.getAttribute('style') !== 'display: none') {
        if (user) {
            document.getElementById("reserve-item").setAttribute('style', 'display: inline;');
            document.getElementById("reserve-item-mobile").setAttribute('style', 'display: inline;');
            document.getElementById("login-item").setAttribute('style', 'display: none;');
            document.getElementById("login-item-mobile").setAttribute('style', 'display: none;');
        } else {
            document.getElementById("login-item").setAttribute('style', 'display: inline;');
            document.getElementById("login-item-mobile").setAttribute('style', 'display: inline;');
            document.getElementById("reserve-item").setAttribute('style', 'display: none;');
            document.getElementById("reserve-item-mobile").setAttribute('style', 'display: none;');
        }
    }
});

const showEventAttendees = (array) =>{
    document.getElementById("admin-item").setAttribute('style', 'display: inline;');
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

const showSiteData = () => {
    const modalAdminSite = document.getElementById('site-admin-content');
    modalAdminSite.innerHTML = `<p>Total Festival Tickets Reserved: ${totalTix}</p>`
}