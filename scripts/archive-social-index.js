$('.modal').on('shown.bs.modal', function () {
    $('.modal-content').trigger('focus')
})

var indexHtml = `
    <div class="container" id="heading">
        <div class="container-wrapper" style="margin-top: 2rem;">
            <div class="row" id="mobileSocial">
                <a href="/festival-landing-page.html"><img style="margin-bottom:1rem; margin-top:1rem; height:5rem; width:auto" src="../assets/social.png"><img></a>
                <p style="margin: 0">The second Schefs festival.</p>
                <p style="margin: 0">A week of discussions.</p>
                <p style="margin: 0">By & for college students worldwide.</p>
                <br>
                <p style="margin: 0">January 04 - 10, 2021 </p>
            </div>
            <div class="row" id="webSocial" style="margin-top:2.5rem;">
                <div class="col">
                    <div style="text-align: left;">
                        <a href="/festival-landing-page.html"><img style="margin-bottom:1.5rem; margin-top:1rem; height:5rem; width:auto" src="../assets/social.png"><img></a>
                        <p style="margin: 0">The second Schefs festival.</p>
                        <p style="margin: 0">A week of discussions.</p>
                        <p style="margin: 0">By & for college students worldwide.</p>
                    </div>

                </div>
                <div class="md:col-7 col-3">
                    <div style="text-align: right;">
                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <a style="color: black; text-decoration: none; dislpay:flex;" href="#socialDistancing">
                                    <p style="margin: 0">: Distancing</p>
                                </a>
                                    <p class="" style="margin:0;">Jan 04</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <a style="color: black; text-decoration: none; dislpay:flex;" href="#socialJustice">
                                    <p style="margin: 0">: Networks</p>
                                </a>
                                    <p style="margin:0;">Jan 05</p>
                            </div>
                        </div>

                        <div class="row">
                                <div class="container d-flex justify-content-between">
                                    <a style="color: black; text-decoration: none; dislpay:flex;" href="#socialJustice">
                                        <p style="margin: 0">: Justice</p>
                                    </a>
                                        <p style="margin:0;">Jan 06</p>
                                </div>
                        </div>

                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <a style="color: black; text-decoration: none; dislpay:flex;" href="#socialCircles">
                                    <p style="margin: 0">: Circles</p>
                                </a>
                                <p style="margin:0;">Jan 07</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <a style="color: black; text-decoration: none; dislpay:flex;" href="#socialIsms">
                                    <p style="margin: 0">: -isms</p>
                                </a>
                                <p style="margin:0;">Jan 08</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <a style="color: black; text-decoration: none; dislpay:flex;" href="#socialConstructs">
                                    <p style="margin: 0">: Constructs</p>
                                </a>
                                <p style="margin:0;">Jan 09</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="container d-flex justify-content-between">
                                <a style="color: black; text-decoration: none; dislpay:flex;" href="#socialResponsibility">
                                    <p style="margin: 0">: Responsibility</p>
                                </a>
                                <p style="margin:0;">Jan 10</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="container-wrapper" style="padding-top: 2rem;">
            <!-- EVENT LIST -->
            <a name="socialDistancing" style="padding: 6rem"></a>
            <p style="margin-bottom: 0;">Monday, January 4th </p>
            <h2 style="margin-bottom: 2rem;">SOCIAL: Distancing</h2>
            <div id="festivalDay1"></div>

            <a name="socialNetworks" style="padding: 6rem"></a>
            <p style="margin-bottom: 0;">Tuesday, January 5th </p>
            <h2 style="margin-bottom: 2rem;">SOCIAL: Networks</h2>
            <div id="festivalDay2"></div>

            <a name="socialJustice" style="padding: 6rem"></a>
            <p style="margin-bottom: 0;">Wednesday, January 6th </p>
            <h2 style="margin-bottom: 2rem;">SOCIAL: Justice</h2>
            <div id="festivalDay3"></div>

            <a name="socialCircles" style="padding: 6rem"></a>
            <p style="margin-bottom: 0;">Thursday, January 7th </p>
            <h2 style="margin-bottom: 2rem;">SOCIAL: Circles</h2>
            <div id="festivalDay4"></div>

            <a name="socialIsms" style="padding: 6rem"></a>
            <p style="margin-bottom: 0;">Friday, January 8th </p>
            <h2 style="margin-bottom: 2rem;">SOCIAL: -isms</h2>
            <div id="festivalDay5"></div>

            <a name="socialConstructs" style="padding: 6rem"></a>
            <p style="margin-bottom: 0;">Saturday, January 9th</p>
            <h2 style="margin-bottom: 2rem;">SOCIAL: Constructs</h2>
            <div id="festivalDay6"></div>

            <a name="socialResponsibility" style="padding: 6rem"></a>
            <p style="margin-bottom: 0;">Sunday, January 10th</p>
            <h2 style="margin-bottom: 2rem;">SOCIAL: Responsibility</h2>
            <div id="festivalDay7"></div>
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
                <a class="btn btn-outline-dark reserve" href="https://shop.schefs.us/">SHOP</a>
                </div>
            </div>
        </div>
    </div>
`;

const indexDiv = document.getElementById("indexView");
const pageDiv = document.getElementById("pageView");

const renderHomeEvents = () => {
    document.getElementById("indexView").classList.add("d-none")
    document.getElementById("builder-spinner").classList.remove("d-none")
    db.collection('weekendevents').get()
        .then(async snap => {
            let allEvents = [];
            let archiveEvents = [];
            snap.forEach((doc) => {
                var data = doc.data();
                /* Weekly Change */ 
                if ((data.type === "socialFestival") && (data.status === "approved")){ // BEFORE LAUNCH: Make data.status===approved //  && (doc.id !== "e1cDuJ9kSiuVq3rEsXQx") && (doc.id !== "V43rdqalukcDWZ0yetKW") && (doc.id !== "nT5GCXvOImyW7wrxMxdF")
                    var reference = storage.refFromURL(data.thumb)
                    allEvents.push(new Promise(async res => {
                        reference.getDownloadURL().then(url => {
                            res({
                                ...data,
                                id: doc.id,
                                thumbURL: url
                            });
                        });
                    }))
                }
                /* Weekly Change */ 
                if ((data.week === 1 || data.week === 2 || data.week === 3 || data.week === 4 || data.week === 5 ||data.week === 6 ||data.week === 7 || data.week === 8 || data.week === 9) && (data.status === "approved") && (data.type !== "socialFestival")){
                    var archiveReference = storage.refFromURL(data.thumb)
                    archiveEvents.push(new Promise(async res => {
                        archiveReference.getDownloadURL().then(url => {
                            res({
                                ...data,
                                id: doc.id,
                                thumbURL: url
                            });
                        });
                    }))
                }
            });
            Promise.all(allEvents).then(allEvents => {
                Promise.all(archiveEvents).then(archiveEvents => {
                    // sort by time
                    allEvents.sort((e1, e2) => e1.start_time - e2.start_time);
                    archiveEvents.sort((e1, e2) => e1.start_time - e2.start_time);
                    //console.log(allEvents)
                    for (let i = 1; i <= 7; i++) {
                        const dayEvents = allEvents.filter(event => event.festivalDay === i);
                        setupEvents(dayEvents, dayEvents.length, true, i);
                    }
                    
                    /*const dayEvents = allEvents.filter(event => event.festivalDay === 1);
                    setupEvents(dayEvents, dayEvents.length, true, 3);*/

                   // setupEvents(allEvents, allEvents.length, true);
                    setupEvents(archiveEvents, archiveEvents.length, false, null);

                    indexHtml = indexDiv.innerHTML;
                    state.indexDivHtml = indexHtml;
                    state.eventsRendered = true;
                    window.history.replaceState(state, null, '');
                });
            });
        })
        .catch(err => console.log('Error getting events: ', err));
}

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
}

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

const setupEvents = (data, num, isFest, day) => {
    if (!isFest){
        eventDiv = "#archive-events-div"
        var numRows=(Math.floor(num/3))+1; // how many rows you need
        for (var i = 0; i < numRows; i++){
            var row = document.createElement("div");
            row.setAttribute("class", "row");
            var curRow = i.toString();
            row.setAttribute("id", `event-row-${curRow}`);
            document.querySelector(`${eventDiv}`).appendChild(row);
        }
        let html = '';
    let count = -1;
    let rowCheck = 0;
    let remainder ='';

    data.forEach(event => {
        count++;
        rowCheck++;
        const id = event.id;
        var opacity = 'opacity: 0.45;'
        
        const pretty_time = event.start_time_pretty.substring(10, event.start_time_pretty.length-6)
        var hour = event.start_time_pretty.substring(0, 8)
        if (hour.substring(0, 1) === "0"){
            hour = hour.substring(1)
        }
        const time = pretty_time.concat(" @ ", hour, "EST")

        const li = `
            <div class="col-sm-4" style="margin-bottom: 2rem;>
            <div class="card border-0" style="max-width: 20rem; max-height: 25rem;">
            <a onclick="displayPage('${id}')">
            <img src="${event.thumbURL}" href="" alt="..." style="${opacity} inline-size: 100%; border-radius: 10%;">
            <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
            <p style="font-size:16px;">Hosted by ${event.firstName} • ${event.university}<br>${time}</p></a>
            </div>
            </div>` //template string
        html += li; // fill 3-event-buffer
        var thisRow=(Math.floor(count/3)).toString(); 

        if (rowCheck%3 === 0){  // when to make a new row and empty buffer
            document.getElementById(`event-row-${curRow}`).innerHTML = html;
        }
        else{
            // last line, make sure to print out incomplete rows!
            if (rowCheck%3 === 1 && rowCheck === (num-1)){ // at second-to-last event
                const secondToLast = `
                    <div class="col-sm-4" style="margin-bottom: 2rem;>
                    <div class="card border-0" style="max-width: 20rem;">
                    <a href="" onclick="displayPage('${id}')">
                    <img src="${event.thumbURL}" alt="..." href="" style="${opacity} inline-size: 100%; border-radius: 10%;">
                    <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
                    <p style="font-size:16px;">Hosted by ${event.firstName} • ${event.university}<br>${time}</p></a>
                    </div>
                    </div>`
                remainder += secondToLast; // fill 3-event-buffer
                return;
            }

            if (rowCheck === num){ // at last event
                const last = `
                    <div class="col-sm-4" style="margin-bottom: 2rem;>
                    <div class="card border-0" style="max-width: 20rem;">
                    <a href="" onclick="displayPage('${id}', '${time}')">
                    <img src="${event.thumbURL}" alt="..." href="" style="${opacity} inline-size: 100%; border-radius: 10%;">
                    <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
                    <p style="font-size:16px;">Hosted by ${event.firstName} • ${event.university}<br>${time}</p></a>
                    </div>
                    </div>`
                remainder += last;
                document.getElementById(`event-row-${curRow}`).innerHTML = html;
            }
        }
        document.getElementById("indexView").classList.remove("d-none")
        document.getElementById("builder-spinner").classList.add("d-none")
    });
    }
    if (isFest){
        //console.log(data)
        // where num is total number of elements
        var numRows=(Math.floor(num/3))+1; 
        for (var i = 1; i < numRows+1; i++){
            var festRow = document.createElement("div");
            festRow.setAttribute("class", "row");
            var curRow = "row-"+i.toString();
            festRow.setAttribute("id", `festivalDay${day}${curRow}`);
            document.querySelector(`#festivalDay${day}`).appendChild(festRow);
        }
        let html = '';
        let count = -1;
        let rowCheck = 0;
        let remainder ='';

        data.forEach(event => {
            count++;
            rowCheck++;
            const id = event.id;
            var opacity = '' //'opacity: 0.45;'
            //console.log(event.title)
            const pretty_time = event.start_time_pretty.substring(10, event.start_time_pretty.length-6)
            
            var hour = event.start_time_pretty.substring(0, 8)
            if (hour.substring(0, 1) === "0"){
                hour = hour.substring(1)
            }
            const time = pretty_time.concat(" @ ", hour, "EST")

            const li = `
                <div class="col-sm-4" style="margin-bottom: 2rem;>
                <div class="card border-0" style="max-width: 20rem; max-height: 25rem;">
                <a onclick="displayPage('${id}')">
                <img src="${event.thumbURL}" href="" alt="..." style="${opacity} inline-size: 100%; border-radius: 10%;">
                <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
                <p style="font-size:16px;">Hosted by ${event.firstName} • ${event.university}<br>${time}</p></a>
                </div>
                </div>` //template string
            html += li; // fill 3-event-buffer

            if (rowCheck%3 === 0){  // when to make a new row and empty buffer
                document.getElementById(`festivalDay${day}${curRow}`).innerHTML = html;
            }
            else{
                // last line, make sure to print out incomplete rows!
                if (rowCheck%3 === 1 && rowCheck === (num-1)){ // at second-to-last event
                    const secondToLast = `
                        <div class="col-sm-4" style="margin-bottom: 2rem;>
                        <div class="card border-0" style="max-width: 20rem;">
                        <a href="" onclick="displayPage('${id}')">
                        <img src="${event.thumbURL}" alt="..." href="" style="${opacity} inline-size: 100%; border-radius: 10%;">
                        <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
                        <p style="font-size:16px;">Hosted by ${event.firstName} • ${event.university}<br>${time}</p></a>
                        </div>
                        </div>`
                    remainder += secondToLast; // fill 3-event-buffer
                    return;
                }

                if (rowCheck === num){ // at last event
                    const last = `
                        <div class="col-sm-4" style="margin-bottom: 2rem;>
                        <div class="card border-0" style="max-width: 20rem;">
                        <a href="" onclick="displayPage('${id}', '${time}')">
                        <img src="${event.thumbURL}" alt="..." href="" style="${opacity} inline-size: 100%; border-radius: 10%;">
                        <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
                        <p style="font-size:16px;">Hosted by ${event.firstName} • ${event.university}<br>${time}</p></a>
                        </div>
                        </div>`
                    remainder += last;
                    document.getElementById(`festivalDay${day}${curRow}`).innerHTML = html;
                }
            }
            document.getElementById("indexView").classList.remove("d-none")
            document.getElementById("builder-spinner").classList.add("d-none")
        });
    }

}
