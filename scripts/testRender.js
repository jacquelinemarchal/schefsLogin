
db.collection('weekendevents').get()
.then(snap => {
    let allEvents = [];
    // get all events from db
    snap.forEach(doc => allEvents.push({
        ...doc.data(),
        id: doc.id
    }));

    // sort by time
    allEvents.sort((e1, e2) => e1.time - e2.time);
    displaySamples(allEvents)
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