isProf = false;
isThumb = false;
isConfirmed = false;
profilePicture = new Blob();
proPicPath = "";
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

auth.onAuthStateChanged(user => {
    if (user){
        var uid = user.uid;
        db.collection("users").doc(uid).get()
        .then((querySnapshot) => {
            document.getElementById("mobile-builder").classList.remove("d-none")
            document.getElementById("builder-content").classList.remove("d-none")
            document.getElementById("logged-out").classList.add("d-none")
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
        $("#modal-welcome-build").modal()
    }
    else{
        document.getElementById("mobile-builder").classList.add("d-none")
        document.getElementById("builder-content").classList.add("d-none")
        document.getElementById("logged-out").classList.remove("d-none")
    }
})
const initCalendly = (eventID) => {
    Calendly.initInlineWidget({
        url: 'https://calendly.com/schefs/schefs-weekend-events?primary_color=4d5055',
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
                    document.getElementById("complete").classList.remove("d-none")
                    document.getElementById("calendly").classList.add("d-none")
                    return true;
            }
        }
    }
);

const submitResult = (r) => {
    if (r===0){
        isConfirmed = true;
        document.getElementById("builder-spinner").classList.remove("d-none")
        document.getElementById("builder-content").classList.add("d-none")
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
    var inputs = [x, y, z, a, b, c, aa, bb]

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

    var req = document.getElementById("reqInput").value;
    inputs.push(req)

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
createDocument = async (inputs) => {
    var date = new Date();
    var eventImage = document.getElementById("event-img")
    var storeURL = storage.ref(`${eventImage.dataset.link}`);
    var uid = auth.currentUser.uid;
    await sendProfToDb(uid, inputs[0])
    db.collection('weekendevents')
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
        status: "",
        thumb: `${storeURL}`,
        prof: `${proPicPath}`
    })
    .then((docRef) => {
        db.collection('users').doc(uid).collection('hostedEvents').doc(docRef.id)
        .set({
            title: `${inputs[0]}`
        })
        .then(() => {
            initCalendly(docRef.id)
            document.getElementById("builder-content").setAttribute("style", "display:none;")
            document.getElementById("mobile-builder").setAttribute("style", "display:none;")
            document.getElementById("calendly").classList.remove("d-none")
            document.getElementById("builder-spinner").classList.add("d-none")
            deleteSelectableImage(eventImage.src)
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
    return imageRef.put(profilePicture)
}

function countChars(obj){
    var maxLength = 65;
    var strLength = obj.value.length;
    if(strLength > maxLength){
        document.getElementById("charNum").innerHTML = '<span style="color: red;">'+strLength+' / '+maxLength+' characters</span>';
    }
    else{
        document.getElementById("charNum").innerHTML = strLength+' / '+maxLength+' characters';
    }
}

function countCharsMinimum(obj){
    var minLength = 70;
    var strLength = obj.value.trim().split(/\s+/).length;;
    if(strLength < minLength){
        document.getElementById("charDescNum").innerHTML = '<span style="color: red;">'+strLength+' / '+minLength+' words minimum</span>';
    }
    else{
        document.getElementById("charDescNum").innerHTML = strLength+' / '+minLength+' words minimum';
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