

db.collection('july20Events').get()
.then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // render page here
        var blob = new Blob(["Hm"],
            { type: "text/plain;charset=utf-8" });
        saveAs(blob, `${eventFileName[0]}.html`);
    });
})
.catch(function(error) {
    console.log("Error getting documents: ", error);
});
console.log(eventFileName)

