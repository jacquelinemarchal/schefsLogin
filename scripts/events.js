function displayPage(x, t) {
    // var indexhtml = view.innerHTML;
    console.log(x)
     db.collection('aug20events').doc(`${x}`).get()
         .then(function(doc) {
             loadEventPage(doc, t);
         })
         .catch(function(error) {
             console.log("Error getting documents: ", error);
         });
     return false;
 }
 
 const loadEventPage = (dbRef, time) => {
    window.scrollTo(0,0);
    var curEvent = dbRef.data()
    indexDiv.setAttribute("style", "display:none");
    name = (curEvent.firstName + " " + curEvent.lastName)
    pageDiv.innerHTML = `<div class="container">
         <div class="container-wrapper">
             <div class="row">
                 <div class="col-md-7">
                     <h1 id="title">${curEvent.title}</h1>
                     <a class="btn btn-outline-dark reserve" href="#" role="button" id="mobileHost">RESERVE</a>
                     <p>${curEvent.mealType} • ${time}</p>
                        <img src="../assets/simping.png" alt="..." id="thumb">
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
     </div>`;
    console.log(dbRef.data())
    console.log(time)
 }


 function backHome() {
     view.innerHTML = indexhtml;
     return false;
 }