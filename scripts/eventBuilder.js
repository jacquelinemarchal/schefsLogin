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
            let userInfo = querySnapshot.data();
            document.getElementById("uniInput").value =`${userInfo.university}`; 
            console.log('Hi')
            document.getElementById("gradInput").value =`${userInfo.gradYear}`; 
            document.getElementById("fnInput").value =`${userInfo.firstName}`; 
            document.getElementById("lnInput").value =`${userInfo.lastName}`; 
            document.getElementById("majorInput").value =`${userInfo.major}`; 
        })
    }
})

saveChange = () => {
    var x = document.getElementById("myInput").value;
    console.log(x)
}

logResults = () => {
    var x = document.getElementById("titleInput").value;
    var y = document.getElementById("descInput").value;
    var z = document.getElementById("uniInput").value;
    var a = document.getElementById("gradInput").value;
    var b = document.getElementById("majorInput").value;
    var c = document.getElementById("bioInput").value;
    var bb = document.getElementById("fnInput").value;
    var cc = document.getElementById("lnInput").value;
    console.log(x, y, z, a, b, c, bb, cc)
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


