if (auth.currentUser){ 
    console.log("Hellooo")
    db.collection("users").doc(auth.currentUser.uid).get()
    .then((snap) => {
        let userDB = snap.data();
        let fullName = `${userDB.firstName} ${userDB.lastName}`
        console.log(fullName, user.uid)
    })
}

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


