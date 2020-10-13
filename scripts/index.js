$('.modal').on('shown.bs.modal', function () {
    $('.modal-content').trigger('focus')
})

const renderHomeEvents = async () => {
    db.collection('weekendevents').get()
        .then(async snap => {
            let allEvents = [];
            snap.forEach( (doc) => {
                var data = doc.data();
                if ((data.week === 1 || data.week === 2 || data.week === 3) && (data.status === "approved" || data.status === "")){
                    var reference = storage.refFromURL(data.thumb)
                    allEvents.push(new Promise(async res => {
                        var url = await reference.getDownloadURL();
                        res({
                            ...data,
                            id: doc.id,
                            thumbURL: url
                        });
                    }))
                }
            });
            allEvents = await Promise.all(allEvents);
            // sort by time
            allEvents.sort((e1, e2) => e1.start_time - e2.start_time);
          //  console.log(allEvents)
            setupEvents(allEvents, allEvents.length);
        })
        .catch(err => console.log('Error getting events: ', err));
}

const setupEvents = (data, num) => {
    // where num is total number of elements
    var numRows=(Math.floor(num/3))+1; 
    for (var i = 0; i < numRows; i++){
        var row = document.createElement("div");
        row.setAttribute("class", "row");
        var curRow = "row-"+i.toString();
        row.setAttribute("id", `event-row-${curRow}`);
        document.querySelector(`#main-events-div`).appendChild(row);
    }

    let html = '';
    let count = -1;
    let rowCheck = 0;
    let remainder ='';
   // console.log(data)

    data.forEach(event => {
      //  console.log(event)
        count++;
        rowCheck++;
        const id = event.id;

        const event_datetime = event.start_time.toDate();
        const event_page_time = moment.tz(event_datetime, 'America/New_York').format('dddd MMMM D YYYY h:mm A z');
        const time = moment.tz(event_datetime, 'America/New_York').format('MM/DD/YY h:mm A z');

        const li = `
            <div class="col-sm-4" style="margin-bottom: 2rem;>
            <div class="card border-0" style="max-width: 20rem; max-height: 25rem;">
            <a onclick="displayPage('${id}')">
            <img src="${event.thumbURL}" href="" alt="..." style="inline-size: 100%; border-radius: 10%;">
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
                    <img src="${event.thumbURL}" alt="..." href="" style="inline-size: 100%; border-radius: 10%;">
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
                    <img src="${event.thumbURL}" alt="..." href="" style="inline-size: 100%; border-radius: 10%;">
                    <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
                    <p style="font-size:16px;">Hosted by ${event.firstName} • ${event.university}<br>${time}</p></a>
                    </div>
                    </div>`
                remainder += last;
                document.getElementById(`event-row-${curRow}`).innerHTML = html;
            }     
        }
    });
}