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
    // set state to initial
    state.indexDivStyle = '';
    state.pageDivHtml = '';

    // push state to history
    window.history.pushState(state, null, 'index.html');
    
    // render
    render();
}

// handle click some event
const displayPage = (x, t) => {
     db.collection('aug20events').doc(`${x}`).get()
         .then(function(doc) {
             // set proper state
             state.pageDivHtml = generateEventPage(doc, t);
             state.indexDivStyle = 'display: none';

             // push state to history
             window.history.pushState(state, null, 'index.html');

             //render
             render();
         })
         .catch(function(error) {
             console.log("Error getting documents: ", error);
         });
 }

// generate HTML for event page
 const generateEventPage = (dbRef, time) => {
    var curEvent = dbRef.data()
    const eventId = dbRef.id;

    db.collection('aug20events').doc(eventId).collection("tickets").get()
        .then((querySnapshot) => {
            size = querySnapshot.size;
            remainingTickets = 7 - size;
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    
    name = (curEvent.firstName + " " + curEvent.lastName)

    return `
        <div class="container">
            <div class="container-wrapper">
                <div class="row">
                    <div class="col-md-7">
                        <h1 id="title">${curEvent.title}</h1>
                        <a class="btn btn-outline-dark reserve" onclick="triggerReserve('${curEvent.title}', '${eventId}')" data-toggle="modal" data-target="#modal-reserve" role="button" id="mobileHost">RESERVE</a>
                        <p id="mobileHost" class="ticket-count">${remainingTickets} / 7 spots available</p>
                        <p>${curEvent.mealType} • ${time}</p>
                           <img src="${curEvent.thumb}" alt="..." id="thumb">
                        <p>${curEvent.desc}</p>
                        <br>
                        <h2>What to prepare:</h1>
                        <p>${curEvent.req}</p>
                        <div id="mobileHost">
                            <h2>Hosted by: ${name}</h2>
                                <img src="${curEvent.prof}" alt="...">
                            <br><p class="hostSchool">${curEvent.university} • ${curEvent.gradYear}<br>${curEvent.major}</p>
                            <br><div class="hostBio"> <p>${curEvent.bio}</p></div>
                        </div>
                        <br><br>
                    </div>
    
                    <div class="col-sm-4 offset-sm-7" style="padding-left: 0;" id="hostInfo">
                        <a class="btn btn-outline-dark reserve" onclick="triggerReserve('${curEvent.title}', '${eventId}')" data-toggle="modal" data-target="#modal-reserve" role="button">RESERVE</a><br> <br>
                        <p class="ticket-count">${remainingTickets} / 7 spots available</p>
                        <p>Hosted by: </p>
                        <div class="row" style="margin-top: 10px;">
                            <div class="col-sm-3" style="padding-right: 4rem">
                                <img src="${curEvent.prof}" alt="..." id="hostPic">
                            </div>
                            <div class="col-sm-1">
                                <h2>${name}</h2>
                            </div>
                        </div>
                        <br><p class="hostSchool">${curEvent.university} • ${curEvent.gradYear}<br>${curEvent.major}</p>
                        <br><div class="hostBio"> ${curEvent.bio}</div>
                    </div>
                </div> 
            </div>
        </div>
    `
 }

const triggerReserve = (title, eventId) => {
    var modalContent = document.getElementById('reserve-modal-content');
    if (auth.currentUser){
        let email = auth.currentUser.email;
        handleReserve(eventId);
        const content = `<h2>Success!</h2><p>You have reserved a spot at ${title}. Check ${email} for ticket information</p>`
        modalContent.innerHTML = content;
    }
    else{
        modalContent.innerHTML = `<h2>You must have a Schefs account to reserve a ticket</h2><p>Create one on the top left of the screen under 'Sign In'</p>`
        $('#modal-reserve').modal("show");
    }
 }

const handleReserve = (id) => {
    var user = auth.currentUser;
    var uid = user.uid;
    var eventRef = db.collection("aug20events").doc(id)
    console.log(eventRef)
    eventRef.collection("tickets").doc(uid).set({
        email: user.email,
        name: user.displayName
    })
    .then(() =>{
        console.log("Success")
    })
    .catch(function(error) {
          console.log("Error getting documents: ", error);
    });
 }