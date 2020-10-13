isLoggedIn = false;
name = ""
auth.onAuthStateChanged(user => {
    if (user){
        var uid = user.uid;
        isLoggedIn = true;
        db.collection("users").doc(uid).get()
        .then((userSnap) => {
            var data = userSnap.data()
            name = data.firstName.concat(" ", data.lastName)
        })
    }
})

db.collection("openmind").get()
    .then(snap => {
        let allTopics = [];
        snap.forEach((doc) => {
            var data = doc.data();
            //  if (data.status === "approved"){
            allTopics.push({
                ...data
            })
            //   }
        });
        allTopics.sort((e1, e2) => e1.submit_time - e2.submit_time);
        var topicList = document.getElementById("open-mind-ideas");

        for (let i = 0; i < allTopics.length; i++){
            var topic = document.createElement("li")
            topic.innerHTML = allTopics[i].topic;
            topic.setAttribute("style", "list-style-type: none;")
            topicList.appendChild(topic)      
        }
    })
    .catch((err) => {
        console.log(err)
    })

$("#add-topic").on('click', function () {
    var newTopic = document.getElementById("open-mind-form").value;
    if (isLoggedIn) {
        db.collection("openmind").doc()
        .set({
            topic: newTopic,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            name: name
        })
        .catch(function(error) {
            console.log(error)
        });
    }
    if (!isLoggedIn){
        ("#modal-signup").modal()
    } 
});