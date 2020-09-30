$('.modal').on('shown.bs.modal', function () {
    $('.modal-content').trigger('focus')
})
window.addEventListener("resize", checkWidth = () => {
    if (window.innerWidth < 1042){
        document.getElementById("breakpoint-banner").innerHTML = "<br>";
    }
    if (window.innerWidth > 1042){
        document.getElementById("breakpoint-banner").innerHTML = "";
    }
});



$(window).scroll(function() {
    if ($(window).scrollTop() > 10) {
        $('#banner').addClass('floatingNav');
    } else {
        $('#banner').removeClass('floatingNav');
    }
});

const renderHomeEvents = () => {
    db.collection('aug20events').get()
        .then(snap => {
            let allEvents = [];
            // get all events from db
            snap.forEach(doc => allEvents.push({
                ...doc.data(),
                id: doc.id
            }));

            // sort by time
            allEvents.sort((e1, e2) => e1.time - e2.time);

            // filter by festivalDay
            for (let i = 1; i <= 7; i++) {
                const day = String(i);
                const dayEvents = allEvents.filter(event => event.festivalDay === day);
                setupEvents(dayEvents, dayEvents.length, day);
            }
        })
        .catch(err => console.log('Error getting events: ', err));
}

const setupEvents = (data, num, day) => {
    // where num is total number of elements
    var numRows=(Math.floor(num/3))+1; 
    for (var i = 0; i < numRows; i++){
        var row = document.createElement("div");
        row.setAttribute("class", "row");

        var curRow = "row-"+i.toString();
        row.setAttribute("id", `festivalDay${day}${curRow}`);
        document.querySelector(`.festivalDay${day}`).appendChild(row);
    }

    let html = '';
    let count = -1;
    let rowCheck = 0;
    let remainder ='';

    data.forEach(event => {
        count++;
        rowCheck++;
        const id = event.id;

        const event_datetime = event.time.toDate();
        const event_page_time = moment.tz(event_datetime, 'America/New_York').format('dddd MMMM D YYYY h:mm A z');
        const time = moment.tz(event_datetime, 'America/New_York').format('MM/DD/YY h:mm A z');
        let opacity = ''

        const li = `
            <div class="col-sm-4" style="margin-bottom: 2rem;>
            <div class="card border-0" style="max-width: 20rem; max-height: 25rem;">
            <a onclick="displayPage('${id}')">
            <img src="${event.thumb}" href="" alt="..." style="inline-size: 100%; border-radius: 10%; ${opacity}">
            <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
            <p style="font-size:16px;">${event.mealType} • ${event.university}<br>${time}</p></a>
            </div>
            </div>` //template string
        html += li; // fill 3-event-buffer
        var thisRow=(Math.floor(count/3)).toString(); 

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
                    <img src="${event.thumb}" alt="..." href="" style="inline-size: 100%; border-radius: 10%; ${opacity}">
                    <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
                    <p style="font-size:16px;">${event.mealType} • ${event.university}<br>${time}</p></a>
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
                    <img src="${event.thumb}" alt="..." href="" style="inline-size: 100%; border-radius: 10%; ${opacity}">
                    <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
                    <p style="font-size:16px;">${event.mealType} • ${event.university}<br>${time}</p></a>
                    </div>
                    </div>`
                remainder += last;
                document.getElementById(`festivalDay${day}${curRow}`).innerHTML = html;
            }     
        }
    });
} 

// mailing-list addition
const mailingForm = document.querySelector('#mailing-form');
mailingForm.addEventListener('submit', (e) => {
    e.preventDefault()
    var date = new Date();
    var timestamp = date.getTime();
    const name = mailingForm['name-mailing-signup'].value;
    const email = mailingForm['email-mailing-signup'].value;
    db.collection('mailinglist').doc()
    .set({
        firstName: `${name}`,
        email: `${email}`,
        time: timestamp
    })
    .then(() => {
        $("#modal-thank-you").modal()
    })
    .catch(err => {
        console.log('Error adding user to mailing list: ', err);
    });
});
