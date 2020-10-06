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

const displayEvents = () => {
    document.getElementById("notAdmin").setAttribute("style", "display:none;")

    db.collection('weekendevents').get()
    .then(snap => {
        let allEvents = [];
        snap.forEach(doc => allEvents.push({
            ...doc.data(),
            id: doc.id
        }));

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
                        </div>`
                        document.getElementById("modal-event-content").innerHTML = last;
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

       // displaySamples(allEvents)
    })
    .catch(err => console.log('Error getting events: ', err));

    const displaySamples = ((allEvents) => {
        allEvents.forEach(event => {
            var reference = storage.refFromURL(event.thumb)
            reference.getDownloadURL()
            .then((url) => {
                const last = `
                <div class="col-sm-4" style="margin-bottom: 2rem;>
                <div class="card border-0" style="max-width: 20rem;">
                <img src="${url}" alt="..." href="" style="inline-size: 100%; border-radius: 10%;">
                <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
                <p style="font-size:16px;">${event.mealType} • ${event.university}<br>TIME</p></a>
                </div>
                </div>`
                document.getElementById("events-section").innerHTML = last;
            })
            .catch(function(error) {
                console.log(error)
            });
        });
    });
}