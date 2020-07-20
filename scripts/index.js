// style modals
$('.modal').on('shown.bs.modal', function () {
  $('.modal-content').trigger('focus')
})

const eventList = document.querySelector('.events');

const setupEvents = (data, num) => {
  // where num is total number of elements
  var numRows=(Math.floor(num/3))+1; 
  for (var i = 0; i < numRows; i++){

    var row = document.createElement("div");
    row.setAttribute("class", "row");

    var curRow = "row-"+i.toString();
    row.setAttribute("id", `${curRow}`);
    document.querySelector('.events').appendChild(row);
  }
  // DAILY SCHEFS FESTIVAL SETUP: 
  // QUERY FOR db.collection('july20Events').get(~after-x-date~) and append to div festivalDayx
  /* Element will look like <div class="row;" id="row-0;"> ... 3 events ... </div> */

  let html = '';
  let count = -1;
  let rowCheck = 0;
  let remainder ='';

  data.forEach(doc => {
    //var doc = document.implementation.createHTMLDocument(`${event.title}`);
    count++;
    rowCheck++;
    const event = doc.data();

    let time = '';
    const month = event.time.toDate().getMonth().toString();
    time += month;
    const day = event.time.toDate().getDate().toString();
    time += "/" + day;
    const year = event.time.toDate().getFullYear().toString();
    time += "/" + year + " ";

    const hour = event.time.toDate().getHours();
    if (hour < 12){
      time += hour + "am EDT";
    }
    else{
      hour - 12;
      time += hour + "pm EDT";
    }
    const li = `
    <div class="col-sm-4" style="margin-bottom: 2rem;>
      <div class="card border-0" style="max-width: 20rem;">
          <a href="template.html">
          <img src="${event.thumbnail}"; alt="..." style="inline-size: 100%; border-radius: 10%;"></a>
          <p style="line-height: 0.9; font-size:20px; margin-top: 1.2rem; margin-bottom: 0.8rem; font-family: 'Roboto', sans-serif;">${event.title}</p> 
          <p style="font-size:14px; font-family:'Roboto', sans-serif; font-weight:300;">Dinner • Columbia University<br>${time}</p>       
        </div>
    </div>` //template string
    html += li; // fill 3-event-buffer

    var thisRow=(Math.floor(count/3)).toString(); 
    
    if (rowCheck%3 === 0){  // when to make a new row and empty buffer
      console.log("why don't you work")
      document.getElementById(`row-${thisRow}`).innerHTML = html;
      html = '';
    }
    else{
      // last line, make sure to print out incomplete rows!
      if (rowCheck%3 === 1 && rowCheck === (num-1)){ // at second-to-last event
        console.log("hey")
        const secondToLast = `
        <div class="col-sm-4" style="margin-bottom: 2rem;>
        <div class="card border-0" style="max-width: 20rem;">
            <img src="${event.thumbnail}" alt="..." style="inline-size: 100%; border-radius: 10%;">
            <p style="line-height: 0.9; font-size:20px; margin-top: 1.2rem; margin-bottom: 0.8rem; font-family: 'Roboto', sans-serif;">${event.title}</p> 
            <p style="font-size:14px; font-family:'Roboto', sans-serif; font-weight:300;">Dinner • Columbia University<br>${time}</p> 
        </div>
        </div>`
        remainder += secondToLast; // fill 3-event-buffer

        return;
      } 

      if (rowCheck === num){ // at last event
        console.log("hi")

        const last = `
        <div class="col-sm-4" style="margin-bottom: 2rem;>
        <div class="card border-0" style="max-width: 20rem;">
            <img src="${event.thumbnail}" alt="..." style="inline-size: 100%; border-radius: 10%;">
            <p style="line-height: 0.9; font-size:20px; margin-top: 1.2rem; margin-bottom: 0.8rem; font-family: 'Roboto', sans-serif;">${event.title}</p> 
            <p style="font-size:14px; font-family:'Roboto', sans-serif; font-weight:300;">Dinner • Columbia University<br>${time}</p> 
        </div>
      </div>`
        remainder += last;
        document.getElementById(`row-${thisRow}`).innerHTML = remainder;
        //html = '';
      }
    }  
  });
} 
