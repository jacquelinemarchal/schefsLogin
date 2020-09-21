const indexDiv = document.getElementById("indexView");
const pageDiv = document.getElementById("pageView");

var indexHtml = `
    <div class="container">
        <div class="container-wrapper" style="padding-top: 4rem;">
            <div class="row" style="font-family: 'Roboto', sans-serif;" id="desktopHome">
                <div class="col-sm-7" style="justify-content: right;" >
                    <h1>Schefs Festival: <br> Micro think tanks for peer-to-peer knowledge exchange between college students, over <s>a meal</s> Zoom.</h1>
                </div>
                <div class="col-sm-5" style="font-size: 30px;">
                    1. Click on an event <br>
                    2. Reserve your ticket <br>
                    3. Learn from and talk with college students from around the world
                </div>
            </div>
            <div id="mobileHome">
                <p>Multiplicities:<br>A week of themed learning experiences from students across the country.</p>
            </div>
            <br><br>
            <!-- EVENT LIST -->
            <div class="events">
                <p style="margin-bottom: 0;">Monday, August 17th </p>
                <h2 style="margin-bottom: 2rem;">Eroticisms</h2>
                <div class ="festivalDay1"></div>

                <p style="margin-bottom: 0;">Tuesday, August 18th </p>
                <h2 style="margin-bottom: 2rem;">Digital Citizens</h2>
                <div class ="festivalDay2"></div>

                <p style="margin-bottom: 0;">Wednesday, August 19th </p>
                <h2 style="margin-bottom: 2rem;">Spaces & Places</h2>
                <div class ="festivalDay3"></div>

                <p style="margin-bottom: 0;">Thursday, August 20th </p>
                <h2 style="margin-bottom: 2rem;">Pandemic Society</h2>
                <div class ="festivalDay4"></div>

                <p style="margin-bottom: 0;">Friday, August 21st </p>
                <h2 style="margin-bottom: 2rem;">Art: The Performative Self</h2>
                <div class ="festivalDay5"></div>

                <p style="margin-bottom: 0;">Saturday, August 22nd</p>
                <h2 style="margin-bottom: 2rem;">Autonomies</h2>
                <div class ="festivalDay6"></div>

                <p style="margin-bottom: 0;">Sunday, August 23rd</p>
                <h2 style="margin-bottom: 2rem;">The Anthropocene</h2>
                <div class ="festivalDay7"></div>
            </div>
        </div>
    </div>
`;

// handle click some event
const displayPage = eventId => {
    const eventRef = db.collection('aug20events').doc(eventId);
    const ticketsRef = eventRef.collection('tickets');

    ticketsRef.get()
        .then(snap => {
            const attendeeData = snap;
            const size = snap.size;
            eventRef.get()
                .then(snap => {
                    const eventData = snap.data();
                    const event_datetime = eventData.time.toDate();
                    const event_page_time = moment.tz(event_datetime, 'America/New_York').format('dddd MMMM D YYYY h:mm A z');
                    const time = moment.tz(event_datetime, 'America/New_York').format('MM/DD/YY h:mm A z');
                    
                    state.pageDivHtml = generateEventPage(eventData, eventId, time, size);
                    state.indexDivHtml = '';

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
                .catch(err => {
                    console.log('Error getting event document: ', err)
                    return false;
                });
        })
        .catch(err => {
            console.log('Error getting tickets: ', err);
            return false;
        });

    window.history.replaceState(state, '', '/index.html?event=' + eventId); 
    return true;
}

// generate HTML for event page
const generateEventPage = (eventData, eventId, time, size) => { 
    let capacity = 7;
    let soldOutStyle = '';
    let reserveStyle = '';
    let loginStyle = '';
    let adminStyle = 'display: none;';
    let remainingTickets = 7;

    // escape apostrophes & quotes
    const escapedTitle = eventData.title.replace(/'/g, '\\x27').replace(/"/g, '\\x22');
    const name = eventData.firstName + " " + eventData.lastName;

    // one anthropocene event should be able to book 15 people
    if (eventId === "SRWp7iAWdWOtiVzNMCWY"){ 
        capacity = 15;
        remainingTickets = 15;
        
        if (size > 15){
            remainingTickets = 0;
            reserveStyle = 'display: none;';
            loginStyle = 'display: none;';
        }
        else {
            remainingTickets = 15 - size;
            soldOutStyle = 'display: none;';
            if (auth.currentUser)
                loginStyle = 'display: none;';
            else
                reserveStyle = 'display: none;';
        }
    }
    else{
        if (size > 14) {
            remainingTickets = 0;
            reserveStyle = 'display: none;';
            loginStyle = 'display: none;';
        } else {
            if (size >= 6)
                remainingTickets = 2;
            else
                remainingTickets = 7 - size;
    
            soldOutStyle = 'display: none;';
            if (auth.currentUser)
                loginStyle = 'display: none;';
            else
                reserveStyle = 'display: none;';
        }
    }

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
                        <div id="reserve-item" style="${reserveStyle}">
                            <a class="btn btn-outline-dark reserve" onclick="triggerReserve('${escapedTitle}', '${eventId}')" data-toggle="modal" data-target="#modal-reserve" role="button">RESERVE ZOOM LINK</a>
                        </div>
                        <div id="login-item" style="${loginStyle}">
                            <a class="btn btn-outline-dark reserve" data-toggle="modal" data-target="#modal-signup">RESERVE FOR ZOOM</a>
                        </div>
                        <div id="admin-item" style="${adminStyle}">
                        <a class="btn btn-outline-dark reserve" id="adminButton" data-toggle="modal" data-target="#modal-admin">ADMIN</a>
                        </div>
                        <p class="ticket-count">${remainingTickets} / ${capacity} spots available</p>
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
                    <p id="mobileReserve" class="ticket-count">${remainingTickets} / ${capacity} spots available</p>
                    <div id="soldOut-item-mobile" style="${soldOutStyle}">
                        <a class="btn btn-dark reserve" style="color: white;background-color: #3e4042">SOLD OUT</a>
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

// update display
const render = () => {
    window.scrollTo(0, 0);
    indexDiv.innerHTML = state.indexDivHtml;
    pageDiv.innerHTML = state.pageDivHtml;
}

// handle set state from history
window.onpopstate = event => {
    if (event.state) {
        state = event.state;
        render();
    }
}

// set initial state
let state = {
    eventsRendered: false,
    indexDivHtml: '',   // empty page = home page not rendered
    pageDivHtml: ''     // empty page = event page not rendered
};

// check fake URL before rendering
if (window.location.search.startsWith('?event=')) {
    const eventId = window.location.search.slice('?event='.length);
    if (!displayPage(eventId))
        state.indexDivHtml = indexHtml;
} else {
    state.indexDivHtml = indexHtml;
    render();
    renderHomeEvents();
    setTimeout(() => {
        indexHtml = indexDiv.innerHTML;
        state.indexDivHtml = indexHtml;
        state.eventsRendered = true;
    }, 2000);
}

//initialize history state
window.history.replaceState(state, null, '');

// handle click home button
const displayHome = () => {
    state.indexDivHtml = indexHtml; 
    state.pageDivHtml = '';

    window.history.pushState(state, null, '/index.html');

    render();
    if (!state.eventsRendered) {
        renderHomeEvents();
        setTimeout(() => {
            indexHtml = indexDiv.innerHTML;
            state.indexDivHtml = indexHtml;
            state.eventsRendered = true;
        }, 2000);
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
