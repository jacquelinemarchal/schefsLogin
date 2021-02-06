$('.modal').on('shown.bs.modal', function () {
    $('.modal-content').trigger('focus')
})

const renderHomeEvents = async () => {
    document.getElementById("indexView").classList.add("d-none")
    document.getElementById("builder-spinner").classList.remove("d-none")
    db.collection('weekendevents').get()
        .then(async snap => {
            let allEvents = [];
            let archiveEvents = [];
            snap.forEach((doc) => {
                var data = doc.data();
                /* Weekly Change */ 
                if ((data.week > 4 && data.week < 8) && (data.month === "01" || data.month === "02") && (data.status === "approved")){ 
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
                /* Weekly Change */ 
                if ((data.week === 1 || data.week === 2 || data.week === 3 || data.week === 4 || data.week === 5  || data.week === 7 || data.week === 8 || data.week === 9) && (data.status === "approved") && (data.month > "02" || data.month == "01")){
                    var archiveReference = storage.refFromURL(data.thumb)
                    archiveEvents.push(new Promise(async res => {
                        var url = await archiveReference.getDownloadURL();
                        res({
                            ...data,
                            id: doc.id,
                            thumbURL: url
                        });
                    }))
                }
            });
            allEvents = await Promise.all(allEvents);
            archiveEvents = await Promise.all(archiveEvents)
            // sort by time
            allEvents.sort((e1, e2) => e1.start_time - e2.start_time);
            archiveEvents.sort((e1, e2) => e1.start_time - e2.start_time);
          //  console.log(allEvents)
            setupEvents(allEvents, allEvents.length, true);
            setupEvents(archiveEvents, archiveEvents.length, false);
        })
        .catch(err => console.log('Error getting events: ', err));
}

const setupEvents = (data, num, isLive) => {
    eventDiv = "";
    if (isLive){
        eventDiv = "#main-events-div"
    }
    if (!isLive){
        eventDiv = "#archive-events-div"
    }
    // where num is total number of elements
    var numRows=(Math.floor(num/3))+1; 
    for (var i = 0; i < numRows; i++){
        var row = document.createElement("div");
        row.setAttribute("class", "row");
        var curRow = "row-"+i.toString();
        row.setAttribute("id", `event-row-${curRow}`);
        document.querySelector(`${eventDiv}`).appendChild(row);
    }

    let html = '';
    let count = -1;
    let rowCheck = 0;
    let remainder ='';
   // console.log(data)

    data.forEach(event => {
        count++;
        rowCheck++;
        const id = event.id;
        var opacity = ""
        /* Weekly Change */ 
        if ((event.week == 1 || event.week == 2 || event.week == 3 || event.week == 4 || event.week == 5 || event.week == 6 || event.week === 7 || event.week === 8 || event.week === 9) && (event.month > "02" || event.month == "01")) {
            opacity = 'opacity: 0.45;'
        }
        
        /*
        const event_datetime = event.start_time.toDate();
        const event_page_time = moment.tz(event_datetime, 'America/New_York').format('dddd MMMM D YYYY h:mm A z');
        const time = moment.tz(event_datetime, 'America/New_York').format('MM/DD/YY h:mm A z');
*/
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
