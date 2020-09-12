$(window).scroll(function() {
    if ($(window).scrollTop() > 10) {
        $('#navBar').addClass('floatingNav');
    } else {
        $('#navBar').removeClass('floatingNav');
    }
});

$("#modal-welcome-build").modal()

auth.onAuthStateChanged(user => {
    if (user){
        var uid = user.uid;
        db.collection("users").doc(uid).get()
        .then((querySnapshot) => {
            // pre-fill entries
            let userInfo = querySnapshot.data();
            document.getElementById("uniInput").value =`${userInfo.university}`; 
            document.getElementById("gradInput").value =`${userInfo.gradYear}`; 
            document.getElementById("fnInput").value =`${userInfo.firstName}`; 
            document.getElementById("lnInput").value =`${userInfo.lastName}`; 
            document.getElementById("majorInput").value =`${userInfo.major}`; 
        })
    }
})

isCalendlyEvent = (e) => {
    return e.data.event &&
           e.data.event.indexOf('calendly') === 0;
}; 

window.addEventListener(
    'message',
    function(e) {
        if (isCalendlyEvent(e)) {
            if (e.data.event === "calendly.date_and_time_selected"){
                console.log("switching")
                //switchBookStatus();
            }
        }
    }
);

logResults = () => {
    var x = document.getElementById("titleInput").value;
    var y = document.getElementById("descInput").value;
    var z = document.getElementById("uniInput").value;
    var a = document.getElementById("gradInput").value;
    var b = document.getElementById("majorInput").value;
    var c = document.getElementById("bioInput").value;
    var aa = document.getElementById("fnInput").value;
    var bb = document.getElementById("lnInput").value;
    var cc = document.getElementById("reqInput").value;
    var inputs = [x, y, z, a, b, c, aa, bb, cc]

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].length === 0){
            document.getElementById("modal-error-content").innerHTML = `<p style="margin-bottom: 0;">Please complete all fields</p>`
            $("#modal-error").modal()
            //alert("Please complete all fields")
            break;
        }
    }
   // if (!isBooked){
      //  alert("Please schedule a date ")
    //}
    createDocument(inputs);
}

createDocument = (inputs) => {
    db.collection('aug20events').doc()
    .set({
        title: `${inputs[0]}`,
        desc: `${inputs[1]}`,
        university: `${inputs[2]}`,
        gradYear: `${inputs[3]}`,
        major: `${inputs[4]}`,
        bio: `${inputs[5]}`,
        firstName: `${inputs[6]}`,
        isLive: false,
        lastName: `${inputs[7]}`,
        festivalDay: "1",
        req: `${inputs[8]}`,
        mealType: "Meal Type",
        time: "timestamp",
        prof: "prof",
        thumb: "thumb"
     })
    .then(() => {
        console.log('Success');
    })
    .catch(err => {
        console.log('Error adding event: ', err);
    });
}

function countChars(obj){
    var maxLength = 30;
    var strLength = obj.value.length;
    if(strLength > maxLength){
        document.getElementById("charNum").innerHTML = '<span style="color: red;">'+strLength+' / '+maxLength+' characters</span>';
    }
    else{
        document.getElementById("charNum").innerHTML = strLength+' / '+maxLength+' characters';
    }
}