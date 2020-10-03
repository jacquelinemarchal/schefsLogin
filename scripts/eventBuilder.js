isProf = false;
isThumb = false;
profilePicture = new Blob();
isConfirmed = -1;

$(window).scroll(function() {
    if ($(window).scrollTop() > 10) {
        $('#navBar').addClass('floatingNav');
    } else {
        $('#navBar').removeClass('floatingNav');
    }
});
if (window.innerWidth > 915){
    $("#modal-welcome-build").modal()
}
$('.popover-dismiss').popover({
    trigger: 'focus' //,
    // html : true,
    //content: ""
})
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
var isBooked = false;
isCalendlyEvent = (e) => {
    return e.data.event &&
           e.data.event.indexOf('calendly') === 0;
}; 

window.addEventListener(
    'message',
    function(e) {
        if (isCalendlyEvent(e)) {
            if (e.data.event === "calendly.date_and_time_selected"){
                    isBooked = true;
                    e.preventDefault()
            //        document.getElementById("calendly-link").innerHTML = "<p>You have booked a time</p>";
                    return true;
            }
        }
    }
);

Calendly.initPopupWidget({
    url: 'https://calendly.com/schefs/schefs-event?primary_color=4d5055',
   /* prefill: {
        name: "John Doe",
        email: "john@doe2.com"
    },*/
    utm: {
        utmSource: "Facebook"
    }      
});

const submitResult = (r) => {
    if (r===0){
        isConfirmed = 0;
        logResults();
    }
}

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

    // if any fields are left empty
    for (let i = 0; i < inputs.length; i++) {
        var emptyInput = 0;
        if (inputs[i].length === 0){
            emptyInput++
            document.getElementById("modal-error-content").innerHTML = `<p style="margin-bottom: 0;">Please complete all fields</p>`
            $("#modal-error").modal()
            break;
        }
    }

    if (emptyInput === 0 && isBooked && isProf){
        if (isConfirmed != 0){
            $("#modal-confirm-submit").modal()
        }
        if (isConfirmed === 0){
            $('#modal-confirm-submit').modal('hide');
            createDocument(inputs)
        }

    }
    if (!isBooked){            
        document.getElementById("modal-error-content").innerHTML = `<p style="margin-bottom: 0;">Please schedule a date</p>`
        $("#modal-error").modal()
    }
    if (!isProf){
        document.getElementById("modal-error-content").innerHTML = `<p style="margin-bottom: 0;">Please add a profile picture by clicking on the plus sign to the left of your name.</p>`
        $("#modal-error").modal()    
    }
    if (!isThumb){
        document.getElementById("modal-error-content").innerHTML = `<p style="margin-bottom: 0;">Please select an event picture by clicking on the plus sign under your event title.</p>`
        $("#modal-error").modal()
    }
}
createDocument = (inputs) => {
    var date = new Date();
    var eventImage = document.getElementById("event-img")
    var storeURL = storage.ref(`${eventImage.dataset.link}`);
    var uid = auth.currentUser.uid;
    sendProfToDb(uid, inputs[0])
    db.collection('testevents').doc()
    .set({
        title: `${inputs[0]}`,
        desc: `${inputs[1]}`,
        university: `${inputs[2]}`,
        gradYear: `${inputs[3]}`,
        major: `${inputs[4]}`,
        bio: `${inputs[5]}`,
        firstName: `${inputs[6]}`,
        isLive: false,
        user: uid,
        lastName: `${inputs[7]}`,
        req: `${inputs[8]}`,
        mealType: "Meal Type",
        time: date,
        thumb: `${storeURL}`
    })
    .then(() => {
        $("#modal-success").modal()
        $('#modal-success').on('hidden.bs.modal', function () {
            window.location.replace("/")
        });
       // deleteSelectableImage(eventImage.src)
    })
    .catch(err => {
        console.log('Error adding event: ', err);
    });
}

const sendProfToDb = (uid, eventTitle) => {
    var pictureName = uid.concat("+", eventTitle)
    var storageRef = storage.ref();
    var indivImageRef = storageRef.child(`${pictureName}`);
    var imageRef = storageRef.child(`hostPictures/${pictureName}`);
    imageRef.put(profilePicture).then(function(snapshot) {
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

const uploadImage = () => {
    $("#modal-image-select").modal()
    photoLibrary()
} 

const uploadHostImage = (input) => {
    var freader = new FileReader();
    freader.readAsDataURL(input.files[0]);
    freader.onloadend = event => {
        document.getElementById(input.name).src = event.target.result;
        document.getElementById("prof-img-upload").setAttribute("data-name", `${input.files[0].name}`);
        isProf = true;
    }
    profilePicture = input.files[0];
}
