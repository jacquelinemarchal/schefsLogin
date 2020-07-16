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
  /* Element will look like <div class="row;" id="row-0;"> ... 3 events ... </div> */

  let html = '';
  let count = -1;
  let rowCheck = 0;

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
      <div class="col-sm-4" style="margin-bottom: 2rem;">
        <div class="card border-0" style="max-width: 20rem;">
            <img src="${event.thumbnail}" alt="..." style="inline-size: 100%; border-radius: 10%;">
            <p style="font-size:20px; margin-top: 1rem;">${event.title}
                <br><small style="font-size:13px; line-height: 125%; ">Dinner • Columbia University<br>${time}</small>
            </p>  
        </div>
      </div>` //template string
    html += li; // fill 3-event-buffer

    var thisRow=(Math.floor(count/3)).toString(); 
    
    if (rowCheck%3 === 0){  // when to make a new row and empty buffer
      document.getElementById(`row-${thisRow}`).innerHTML = html;
      html = '';
    }

    /*
    // last line, make sure to print out incomplete rows!
    if (rowCheck == num){
      console.log(`hey ${event.title}`)
      remainder = 3-num%3; // how many empty events you need to keep the grid structure
      //for (var j = 0; j < remainder; i++){
        //console.log("hey")
        const empty = `
        <div class="col-lg">
          <div class="card border-0" style="max-width: 18rem;">
            <div class="card border-0">
            </div>
          </div>
        </div>` //template string
        html += empty; // fill 3-event-buffer
     // } 
      document.getElementById(`row-${thisRow}`).innerHTML = html;
      //html = '';
    }


    */

  });
} 
