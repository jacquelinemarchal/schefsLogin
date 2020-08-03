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
    name = (curEvent.firstName + " " + curEvent.lastName)

    return `
        <div class="container">
            <div class="container-wrapper">
                <div class="row">
                    <div class="col-md-7">
                        <h1 id="title">${curEvent.title}</h1>
                        <a class="btn btn-outline-dark reserve" href="#" role="button" id="mobileHost">RESERVE</a>
                        <p>${curEvent.mealType} • ${time}</p>
                           <img src="assets/simping.png" alt="..." id="thumb">
                        <p>${curEvent.desc}</p>
                        <br>
                        <h2>What to prepare:</h1>
                        <p>${curEvent.req}</p>
                        <div id="mobileHost">
                            <h2>Hosted by:${name}</h2>
                                <img src="assets/prof.png" alt="...">
                            <br><p class="hostSchool">${curEvent.university} • ${curEvent.gradYear}<br>${curEvent.major}</p>
                            <br><div class="hostBio"> <p>${curEvent.bio}</p></div>
                        </div>
                        <br><br>
                    </div>
    
                    <div class="col-sm-4 offset-sm-7" style="padding-left: 0;" id="hostInfo">
                        <a class="btn btn-outline-dark reserve" href="#" role="button">RESERVE</a><br> <br>
                        <small>Hosted by:</small>
                        <div class="row" style="margin-top: 10px;">
                            <div class="col-sm-3">
                                <img src="assets/prof.png" alt="..." id="hostPic">
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
