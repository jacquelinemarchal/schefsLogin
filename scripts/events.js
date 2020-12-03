const indexDiv = document.getElementById("indexView");
const pageDiv = document.getElementById("pageView");
isLoggedIn = false;
username = ""

auth.onAuthStateChanged(user => {
    if (user){
        uid = user.uid;
        isLoggedIn = true;
        db.collection("users").doc(uid).get()
        .then((userSnap) => {
            var data = userSnap.data()
            username = data.firstName.concat(" ", data.lastName)
        })
    }
})


var indexHtml = `
    <div class="container" id="heading">
        <div class="container-wrapper" style="margin-top: 3rem;">
            <div class="row" id="mobileSocial">
                <img style="margin-bottom:2rem; height:5rem; width:auto" src="../assets/social.png"><img>
                <p style="margin: 0">a weeklong Schefs festival.</p>
                <p style="margin: 0">7 days, 7 themes.</p>
                <p style="margin: 0">Student-led conversations. </p>
                <br>
                <p style="margin: 0">January 04 - 10, 2021 </p>
            </div>
            <div class="row" id="webSocial">
                <div class="col">
                    <div style="text-align: left;">
                        <h3 style="color: #001AFF; font-weight: 400;">UPCOMING IN JANUARY 2021</h3>
                        <img style="margin-bottom:2rem; height:5rem; width:auto" src="../assets/social.png"><img>
                        <p style="margin: 0">a weeklong Schefs festival.</p>
                        <p style="margin: 0">7 days, 7 themes.</p>
                        <p style="margin: 0">Student-led conversations. </p>
                    </div>
                    <a style="margin-top: 2rem" class="btn btn-outline-dark reserve" href="/festival-landing-page.html">LEAD A CONVERSATION FOR THE FESTIVAL</a>

                </div>
                <div class="md:col-7 col-3">
                    <div style="text-align: right;">
                        <h3 style="margin-bottom:4rem; font-weight: 400; color: #001AFF;">7 DAYS, 7 THEMES</h3>
                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <p  style="margin: 0">: Distancing</p>
                                <p class="" style="margin:0;">Jan 04</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <p style="margin: 0">: Networks</p>
                                <p style="margin:0;">Jan 05</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <p style="margin: 0">: Justice</p>
                                <p style="margin:0;">Jan 06</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <p style="margin: 0">: Circles</p>
                                <p style="margin:0;">Jan 07</p>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <p style="margin: 0">: -isms</p>
                                <p style="margin:0;">Jan 08</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <p style="margin: 0">: Constructs</p>
                                <p style="margin:0;">Jan 09</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <p style="margin: 0">: Responsibility</p>
                                <p style="margin:0;">Jan 10</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="container-wrapper" style="padding-top: 4rem;">
            <!-- EVENT LIST -->
            <div class="events" id="main-events-div"></div>
            <h2 style="margin-bottom: 2rem;">Past Events</h2>
            <div class="events" id="archive-events-div"></div>
            <div class="d-flex justify-content-center" style="padding-top: 2rem;">
                <a class="btn btn-outline-dark reserve" href="/archive-festival-events.html" style="font-size: 24px;" target="_blank">August 2020 Festival</a>
            </div>
        </div>
    </div>
    <div class="mobileSocial">
        <div class="footer">
            <div class="row" id="fixed-footer">
                <a class="btn btn-outline-dark reserve" href="/festival-landing-page.html">HOST YOUR OWN EVENT</a>
                </div>
            </div>
        </div>
    </div>
`;

// handle click some event
const displayPage = eventId => {
    const eventRef = db.collection('weekendevents').doc(eventId);
    const ticketsRef = eventRef.collection('tickets');

    if (eventId === "bknqr8A5OwRKIrebe5Hu"){
        window.location = '/ambassador.html';
        return;
    }

    if (eventId === "gPPBtXgL38N5yUdrPmZp"){
        window.location = '/ambassador1.html';
        return;
    }


    ticketsRef.get()
        .then(snap => {
            const attendeeData = snap;
            const size = snap.size;
            eventRef.get()
                .then(async snap => {
                    const eventData = snap.data();
                    const event_datetime = eventData.start_time.toDate();
                    const event_page_time = moment.tz(event_datetime, 'America/New_York').format('dddd MMMM D YYYY h:mm A z');
                    const time = moment.tz(event_datetime, 'America/New_York').format('MM/DD/YY h:mm A z');
                    
                    state.pageDivHtml = await generateEventPage(eventData, eventId, time, size);
                    state.indexDivHtml = '';
                    window.history.pushState(state, null, '');

                    render();

                    if (auth.currentUser) {
                        const uid = auth.currentUser.uid;
                        db.collection('users').doc(uid).get().then(userSnap => {
                            var snapData = userSnap.data()
                            if (snapData.isAdmin) {
                                let allAttendees = [];
                                attendeeData.forEach(attendee => allAttendees.push({
                                    ...attendee.data()
                                }));
                                showEventAttendees(allAttendees);
                            }
                        })
                        .catch(err => console.log('Error getting tickets: ', err));
                    }
                    displayComments(eventId)
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

const getURL = (ref) => {
    return ref.getDownloadURL();
}

const getProfURL = (proref) => {
    return proref.getDownloadURL()
}

// generate HTML for event page
const generateEventPage = async (eventData, eventId, time, size) => { 

    var reference = storage.refFromURL(eventData.thumb)
    var thumbUrl = await getURL(reference);

    var fileName = (eventData.user).concat("+", eventData.title)
    var path = storage.ref('hostPictures')
    var proPicRef = path.child(fileName)
    var profUrl = await getProfURL(proPicRef);
    
    let capacity = 7;
    let soldOutStyle = '';
    let reserveStyle = '';
    let loginStyle = '';
    let pastEventStyle = 'display: none;';
    let adminStyle = 'display: none;';
    let remainingTickets = 7;

    // format time
    const pretty_time = eventData.start_time_pretty.substring(10, eventData.start_time_pretty.length-6)
    var hour = eventData.start_time_pretty.substring(0, 8)
    if (hour.substring(0, 1) === "0"){
        hour = hour.substring(1)
    }
    const formatTime = pretty_time.concat(" @ ", hour, "EST")

    // escape apostrophes & quotes
    const escapedTitle = eventData.title.replace(/'/g, '\\x27').replace(/"/g, '\\x22');
    const name = eventData.firstName + " " + eventData.lastName;

    // set requirements text if none
    if ((eventData.req === "") || (!eventData.req)|| (/^\s*$/.test(eventData.req)) || 0 === eventData.req.length){
        eventData.req = 'There are no requirements for this event.';
    }    

    // Sam Smith's event should be able to book 15 people
    if (eventId === "GdyQq9KCK5WAJTWRZfgV"){ 
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
        // tickets remaining display
        if (size > 9) {
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
        /* Weekly Change */ 
        if (eventData.week === 1 || eventData.week === 2 || eventData.week === 3 || eventData.week === 4 || eventData.week === 5 || eventData.week === 6){
            loginStyle = 'display: none;';
            reserveStyle = 'display: none;';
            soldOutStyle = 'display:none';
            pastEventStyle = 'display:inline';
        }
    }
    return `
        <div class="container">
            <div class="container-wrapper">
                <div class="row" style="margin-bottom:2rem;">
                    <div class="col-md-7">
                        <h1 id="title">${eventData.title}</h1>
                        <p>${formatTime}</p>
                           <img src="${thumbUrl}" alt="..." id="thumb">
                        <p>${eventData.desc}</p>
                        <br>
                        <h2 id="webPrepare">What to prepare:</h2>
                        <b><p id="mobilePrepare">What to prepare:</p></b>
                        <p>${eventData.req}</p>
                        <div id="mobileHost">
                            <p>Hosted by: ${name}</p><br>
                            <div style="width:125px;height:125px;border-radius:50%;overflow: hidden;"> 
                                <img src="${profUrl}"  style="height:auto; width: 100%;"alt="..." id="hostPic">
                            </div>                            <br><p class="hostSchool">${eventData.university} • ${eventData.gradYear}<br>${eventData.major}</p>
                            <br><div class="hostBio"> <p>${eventData.bio}</p></div><br>
                        </div>
                        <br>
                        <hr />
                        <h2 style="margin-top:2rem;margin-bottom:2rem;" id="webThoughts">Thoughts:</h2>
                        <div class="row" style="margin-bottom: 2rem;">
                            <div class="col-sm-8">
                                <form id="add-comment-form">
                                    <textarea id="add-comment-input" placeholder="Add your thought here..." rows="1" style="border-bottom-style:solid; border-bottom-width:2.5px; width:100%; margin-left:0; margin-right: 10px; font-size:20px;" required></textarea>
                                </form>
                            </div>
                            <div id="add-thought-div" class="col-sm-2">
                                <a id="add-thought" style="margin-left:1rem;margin-bottom:2rem;" onclick="addComment('${eventId}', '${username}')" type="button" class="btn btn-outline-dark reserve">POST</a>
                            </div>
                            <div id="comments-section"></div>
                        </div>
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
                        <p class="ticket-count">${remainingTickets} / ${capacity} spots available</p>
                        <p>Hosted by: </p>
                        <div class="row" style="margin-top: 10px;">
                            <div class="col-sm-3">
                                <div style="width:125px;height:125px;border-radius:50%;overflow: hidden;"> 
                                    <img src="${profUrl}"  style="height:auto; width: 100%;"alt="..." id="hostPic">
                                </div>
                            </div>
                            <div class="col-sm-1 offset-sm-1">
                                <h2 id="hostInfoName">${name}</h2>
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
                    <div id="soldOut-item-mobile" style="${pastEventStyle}">
                        <a class="btn btn-dark reserve" style="color: white;background-color: #3e4042">PAST EVENT</a>
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
const addComment = (id, name) => {
    if (isLoggedIn) {
        document.getElementById("add-thought-div").innerHTML = `<div class="spinner-border" role="status"><span class="sr-only">Loading</span></div>`
        var newComment = document.getElementById("add-comment-input").value;
        db.collection("weekendevents").doc(id).collection("comments").doc()
        .set({
            content: newComment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            name: name,
            uid: uid
        })
        .then(() => {
            location.reload();
        })
        .catch(function(error) {
            console.log(error)
        });
    }
    if (!isLoggedIn){
        $("#modal-signup").modal("show")
    }
}

const displayComments = (id) => {
        var commentSection = document.getElementById("comments-section")
        db.collection("weekendevents").doc(id).collection("comments").get()
        .then((snap) => {
            snap.forEach((doc) => {
                var data = doc.data();
                console.log(data)

                var pName = document.createElement("p")
                var pComment = document.createElement("p")
                pName.setAttribute("style", "padding-left: 1rem; margin-bottom: .5rem;font-size: 24px;")
                pComment.setAttribute("style", "padding-left: 1rem; margin-bottom: 2rem;")

                pName.innerHTML = `${data.name}`;
                pComment.innerHTML = `${data.content}`;

                commentSection.appendChild(pName)
                commentSection.appendChild(pComment)
            })
        })
        .catch((err) => {console.log(err)})
}

const triggerReserve = (title, eventId) => {
    const modalContent = document.getElementById('reserve-modal-content');
    if (auth.currentUser){
        const email = auth.currentUser.email;
        const uid = auth.currentUser.uid;

        db.collection("users").doc(uid).get().then(snap => {
            const user = snap.data();
            const phone = user.phoneNumber
            const name = `${user.firstName} ${user.lastName}`;
            db.collection('weekendevents').doc(eventId).collection('tickets').doc(uid)
                .set({
                    email: email,
                    name: name,
                    phoneNumber: phone
                 })
                .then(() => {
                    db.collection("users").doc(uid).collection("events").doc(eventId)
                    .set({
                        attended: false,
                        email: email,
                        eventTitle: title
                    }, { merge: true })
                    .then(()=>{
                        console.log('Success');
                        modalContent.innerHTML = `
                            <h2>Success!</h2><p>You have reserved a spot at ${title}. Check ${email} for ticket information.</p>
                        `;
                    })
                    .catch(err => {console.log(err)})
                })
                .catch(err => {
                    console.log('Error adding ticket: ', err);
                    modalContent.innerHTML = `
                        <p>It appears you already have a ticket for this event. If you think this is an error, please contact schefs.us@gmail.com</p>
                    `;
                });
            db.collection('totaltickets').doc()
                .set({
                    name: name,
                    user: uid,
                    eventId: eventId
                })
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

        if (state.indexDivHtml)
            window.history.replaceState(state, null, '/index.html');
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
}
