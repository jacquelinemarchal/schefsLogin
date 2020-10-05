isProf = false;
isThumb = false;
isConfirmed = false;
profilePicture = new Blob();
userFName = "";
userEmail = "";
userLName = "";

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
            userFName = userInfo.firstName;
            userLName = userInfo.lastName;
            userEmail = userInfo.email;
            document.getElementById("uniInput").value =`${userInfo.university}`; 
            document.getElementById("gradInput").value =`${userInfo.gradYear}`; 
            document.getElementById("fnInput").value =`${userFName}`; 
            document.getElementById("lnInput").value =`${userLName}`; 
            document.getElementById("majorInput").value =`${userInfo.major}`; 

        })
    }
})
const initCalendly = (eventID) => {
    Calendly.initInlineWidget({
        url: 'https://calendly.com/schefs/schefs-event?primary_color=4d5055',
        parentElement: document.getElementById('calendly'),
        prefill: {
            firstName: `${userFName}`,
            lastName: `${userLName}`,
            email: `${userEmail}`,
        },
        utm: {
            utmCampaign: `${eventID}`,
        }     
    });

}

var isBooked = false;
isCalendlyEvent = (e) => {
    return e.data.event &&
           e.data.event.indexOf('calendly') === 0;
}; 

window.addEventListener(
    'message',
    function(e) {
        if (isCalendlyEvent(e)) {
            if (e.data.event === "calendly.event_scheduled"){
                    e.preventDefault()
                 //   $("#modal-success").modal()
                  //  $('#modal-success').on('hidden.bs.modal', function () {
                   // window.location.replace("/")
             //   });
                    return true;
            }
        }
    }
);

const submitResult = (r) => {
    if (r===0){
        isConfirmed = true;
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
    if (emptyInput === 0 && isProf && isThumb){
        if (!isConfirmed){
            $("#modal-confirm-submit").modal()
        }
        if (isConfirmed){
            $('#modal-confirm-submit').modal('hide');
            createDocument(inputs)
        }
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
    db.collection('testevents')
    .add({
        title: `${inputs[0]}`,
        desc: `${inputs[1]}`,
        university: `${inputs[2]}`,
        gradYear: `${inputs[3]}`,
        major: `${inputs[4]}`,
        bio: `${inputs[5]}`,
        firstName: `${inputs[6]}`,
        isLive: false,
        user: uid,
        email: userEmail,
        lastName: `${inputs[7]}`,
        req: `${inputs[8]}`,
        submit_time: date,
        thumb: `${storeURL}`
    })
    .then((docRef) => {
        db.collection('users').doc(`${uid}`).collection('hostedEvents').doc(`${docRef.id}`)
        .set({
            title: `${inputs[0]}`
        })
        .then(() => {
            initCalendly(docRef.id)
            document.getElementById("builder-content").setAttribute("style", "display:none;")
            document.getElementById("mobile-builder").setAttribute("style", "display:none;")
            document.getElementById("calendly").classList.remove("d-none")
           // deleteSelectableImage(eventImage.src)
        })
        .catch(err => {
            console.log('Error adding event: ', err);
        });
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
