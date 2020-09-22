const photoLibrary = () => {
    var storageRef = storage.ref();
    var listRef = storageRef.child('selectableImages');
    var lastRow = false;
    listRef.listAll().then((res) => {
        var imgNum = res.items.length;
        var extras = imgNum % 4;
        var rows = imgNum / 4;
        if (extras > 0){
            rows++;
        }
        for (let i = 0; i < (Math.floor(rows)); i++){
            var row = document.createElement("div");
            row.setAttribute("class", "row");
            var curRow = "row-"+i.toString();
            row.setAttribute("id", `${curRow}`);
            document.getElementById("modal-image-select-content").appendChild(row);
        }
        var count = 0;
        var thisRow = 0;
        res.items.forEach((itemRef) => {
            var image = document.createElement("IMG");
            image.setAttribute("id", `img${count}`);
            $(image).on('click', function () {
                $('#modal-image-select').modal('toggle');
                fromRefToImg(itemRef, document.getElementById("event-img"));
            });

            document.getElementById(`row-${thisRow}`).appendChild(image);
            
            addUrl(itemRef, count, lastRow)
            count++;
            if (count % 4 === 0){
                thisRow++;
                //console.log(thisRow, Math.floor(rows)-1)
                if (thisRow === Math.floor(rows)-1){
                    lastRow = true;
                }
            }
        });
    })
}
const fromRefToImg = (ref, dest) => {
    var path = storage.ref(`${ref.fullPath}`);
    path.getDownloadURL()
        .then((url) => {
            dest.src = url;
        })
        .catch(function(error) {
            console.log(error)
        });
}
const addUrl = (reference, count, lastRow) => {
    var path = storage.ref(`${reference.fullPath}`);
    path.getDownloadURL()
        .then((url) => {
            var image = document.getElementById(`img${count}`);
            if (lastRow){
                image.setAttribute("class", "responsiveLastRow")
            }
            else{
                image.setAttribute("class", "responsiveImg")
            }
            image.setAttribute("style", "padding:1rem;")
            image.src = url;
        })
        .catch(function(error) {
            console.log(error)
        });
}


