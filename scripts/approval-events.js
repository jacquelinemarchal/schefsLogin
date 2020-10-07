auth.onAuthStateChanged(user => {
    if (user){
        var uid = user.uid;
        db.collection("users").doc(uid).get()
        .then((userSnap) => {
            if (userSnap.data().isAdmin) {
                displayEvents()
            }
        })
    }
})

const approveEvent = (event) => {
    console.log(event)
};
const displayEvents = () => {
    document.getElementById("notAdmin").setAttribute("style", "display:none;")

    db.collection('weekendevents').get()
    .then(snap => {
        let allEvents = [];
        snap.forEach((doc) => {
            console.log(doc.data().status)
            if (doc.data().status != "approved" && doc.data().status != "denied"){
                allEvents.push({
                    ...doc.data(),
                    id: doc.id
                })
            }
        });

        // sort by time
        allEvents.sort((e1, e2) => e1.submit_time - e2.submit_time);
        console.log(allEvents.length)

        for (let i = 0; i<allEvents.length; i++){
            var row = document.createElement("div");
            row.setAttribute("class", "row");
            row.setAttribute("style", "text-align:center;");
            row.innerHTML = `${allEvents[i].title}`;

            $(row).on('click', function () {
                var fileName = (allEvents[i].user).concat("+", allEvents[i].title)
                var path = storage.ref('hostPictures')
                var proPicRef = path.child(fileName)
                proPicRef.getDownloadURL()
                .then((url) =>{
                    hostPicURL = url;
                    var reference = storage.refFromURL(allEvents[i].thumb)
                    reference.getDownloadURL()
                    .then((url) => {
                        const last = `
                        <div class="col-sm-4" style="margin-bottom: 2rem;>
                        <div class="card border-0" style="max-width: 20rem;">
                        <img src="${url}" alt="..." href="" style="inline-size: 100%; border-radius: 10%;">
                        <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${allEvents[i].title}</p> 
                        <p style="font-size:16px;">${allEvents[i].university}<br>${allEvents[i].start_time_pretty}</p></a>
                        </div>
                        <h3>Event Info</h3>
                        <b>Description</b>${allEvents[i].desc}<br>
                        <br><b>Bio</b>${allEvents[i].bio}<br>
                        <br><b>Requirements</b>${allEvents[i].req}<br><br>
                        <h3>Host Info</h3>
                        <div style="width:125px;height:125px;border-radius:50%;overflow: hidden;"> 
                        <img src="${hostPicURL}" style="height:auto; width: 100%;"alt="...">
                        </div>
                        <br><b>Host Name</b>${allEvents[i].firstName} ${allEvents[i].lastName}<br>
                        <br><b>University</b>${allEvents[i].university}<br>
                        <br><b>Major</b>${allEvents[i].major}<br>
                        <br><b>Grad Year</b>${allEvents[i].gradYear}<br>
                        <br><b>Zoom</b>${allEvents[i].zoomLink}<br>
                        </div><br>
                        <div id="buttons" style="margin-left:auto;margin-right:auto;text-align: center;">
                            <a id="showButtons" type="submit" class="btn btn-outline-dark reserve" style="margin-bottom:1rem;">Show Buttons</a><br>
                        </div>
                        <div class="d-none" style="margin-left:auto;margin-right:auto;text-align: center;" id="buttonsDiv">
                            <a id="approveButton" type="submit" class="btn btn-outline-dark reserve" style="margin-bottom:1rem;">Approve</a><br>
                            <a id="denyButton" data-dismiss="modal" type="button" class="btn btn-outline-dark reserve" style="margin-bottom:1rem;">Deny</a>
                        </div>`
                        document.getElementById("modal-event-content").innerHTML = last;
                        var show = document.getElementById("buttons")
                        $(show).on('click', function () {
                            document.getElementById("buttonsDiv").classList.remove("d-none")
                        });

                        var approve = document.getElementById("approveButton")
                        $(approve).on('click', function () {
                            db.collection("weekendevents").doc(allEvents[i].id)
                            .set({
                                status: "approved",
                                isLive: true
                            }, { merge: true })
                            .then(function() {
                                document.getElementById("modal-status-content").innerHTML = `<b>${allEvents[i].title}</b> was approved.`;
                                $("#modal-event").modal("hide")
                                $("#event-status").modal()
                            })
                            .catch(function(error) {
                                console.log(error)
                            });
                        });
                        var deny = document.getElementById("denyButton")
                        $(deny).on('click', function () {
                            db.collection("weekendevents").doc(allEvents[i].id)
                            .set({
                                status: "denied",
                                isLive: false
                            }, { merge: true })
                            .then(function() {
                                document.getElementById("modal-status-content").innerHTML = `<b>${allEvents[i].title}</b> was denied.`;
                                $("#modal-event").modal("hide")
                                $("#event-status").modal()
                            })
                            .catch(function(error) {
                                console.log(error)
                            });
                        });
                    })
                    .catch(function(error) {
                        console.log(error)
                    });
                })
               
                $("#modal-event").modal()
            });

            var curRow = "row-"+i.toString();
            row.setAttribute("id", `${curRow}`);
            document.getElementById("events").appendChild(row);
        }
    })
    .catch(err => console.log('Error getting events: ', err));
}
