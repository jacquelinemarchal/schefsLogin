
var pathReference = storage.ref('selectableImages/SustainableUrbanismPostCOVID.jpeg');

pathReference.getDownloadURL().then(function(url) {
    document.getElementById('myimg').src = url;
  }).catch(function(error) {
        console.log(error)
  });