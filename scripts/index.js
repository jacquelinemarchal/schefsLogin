$('.modal').on('shown.bs.modal', function () {
  $('.modal-content').trigger('focus')
})

var switchSignUp = true;
const showSignUp = () => {
  const signupForm = document.getElementById("signup-form");
  if (switchSignUp){
    if (switchLogIn = true){
      switchLogIn=false;
      showLogIn()
    }
    signupForm.setAttribute("style", "display:inline");
    switchSignUp = false;
  }
  else{
    signupForm.setAttribute("style", "display:none");
    switchSignUp = true;
  }
  return false;
}
var switchLogIn = true;
const showLogIn = () => {
  if (switchSignUp = true){
    switchSignUp=false;
    showSignUp()
  }
  const loginForm = document.getElementById("login-form");
  if (switchLogIn){
    loginForm.setAttribute("style", "display:inline");
    switchLogIn = false;
  }
  else{
    loginForm.setAttribute("style", "display:none");
    switchLogIn = true;
  }
  return false;
}

const indexDiv = document.getElementById("indexView");
const pageDiv = document.getElementById("pageView");

for (var i = 1; i < 8; i++){
  const day = i.toString();
  db.collection('aug20events').where('festivalDay', '==', day).get()
      .then(function(querySnapshot) {
        setupEvents(querySnapshot.docs, querySnapshot.size, day)
          querySnapshot.forEach(function(doc) {
            //console.log(doc.id, " => ", doc.data());
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
}
var eventFileName = [];

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
  // DAILY SCHEFS FESTIVAL SETUP: 
  // QUERY FOR db.collection('july20Events').get(~after-x-date~) and append to div festivalDayx
  /* Element will look like <div class="row;" id="row-0;"> ... 3 events ... </div> */
  
  let html = '';
  let count = -1;
  let rowCheck = 0;
  let remainder ='';


  data.forEach(doc => {
    count++;
    rowCheck++;
    const event = doc.data();
    const id = doc.id;
    
    let time = '';
    const month = event.time.toDate().getMonth().toString();
    time += month;
    const thisDay = event.time.toDate().getDate().toString();
    time += "/" + thisDay;
    const year = event.time.toDate().getFullYear().toString();
    time += "/" + year + " ";

    var hour = event.time.toDate().getHours();
    if (hour <= 12){
      time += hour + "am EST";
    }
    else{
      hour-=12;
      time += hour + "pm EST";
    }
    var link = event.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
    eventFileName.push(link);
    
    const li = `
    <div class="col-sm-4" style="margin-bottom: 2rem;>
        <div class="card border-0" style="max-width: 20rem; max-height: 25rem;">
          <a href="" onclick="return displayPage('${id}', '${time}')">
        <img src="${event.thumb}" href="" alt="..." style="inline-size: 100%; border-radius: 10%;"></a>
            <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
            <p style="font-size:16px;">Dinner • Columbia University<br>${time}</p>
        </div>
      </div>` //template string
    html += li; // fill 3-event-buffer

    var thisRow=(Math.floor(count/3)).toString(); 
    
    if (rowCheck%3 === 0){  // when to make a new row and empty buffer
      document.getElementById(`festivalDay${day}${curRow}`).innerHTML = html;
      //html = '';
    }
    else{
      // last line, make sure to print out incomplete rows!
      if (rowCheck%3 === 1 && rowCheck === (num-1)){ // at second-to-last event
        const secondToLast = `
        <div class="col-sm-4" style="margin-bottom: 2rem;>
        <div class="card border-0" style="max-width: 20rem;">
              <a href="" onclick="displayPage('${id}', '${time}')">
            <img src="${event.thumb}" alt="..." href="" style="inline-size: 100%; border-radius: 10%;"></a>
            <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
            <p style="font-size:16px;">Dinner • Columbia University<br>${time}</p> 
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
        <img src="${event.thumb}" alt="..." href="" style="inline-size: 100%; border-radius: 10%;"></a>
            <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">${event.title}</p> 
            <p style="font-size:16px;">Dinner • Columbia University<br>${time}</p> 
        </div>
      </div>`
        remainder += last;
        document.getElementById(`festivalDay${day}${curRow}`).innerHTML = html;
      }     
    }
  });
} 
