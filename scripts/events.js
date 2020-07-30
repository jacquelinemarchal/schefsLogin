function displayPage(x) {
    var indexhtml = view.innerHTML;
    console.log(x)
    view.innerHTML = `<div class="container">
        <div class="container-wrapper">
            <div class="row">
                <div class="col-md-7">
                    <h1 id="title">Sample Event</h1>
                    <a class="btn btn-outline-dark reserve" href="#" role="button" id="mobileHost">RESERVE</a>
                    <p>Breakfast • Sample Time</p>

                    <img src="assets/simping.png" alt="..." id="thumb">
                    <p> I want to host a conversation about sustainability and draw attention to environmental sustainability and climate action, as well as social sustainability that entails issues like poverty, food security, and healthcare. Sustainability is a fairly broad topic so there's a lot of room for the conversation to develop (which I find can make for a very interesting discussion). I would also love to be able to share some eco-friendly tips and swaps that I have, talk about my experience with vegetarianism, fast-fashion, and advice for college students on getting involved in sustainability, especially on college campuses. There's also a lot to talk about in relation to current events by talking about the importance of diversity and inclusivity in sustainability (depending on how deep or surface level the conversation decides to go and what the other students are interested in talking about).</p>
                    <br>
                    <h2>What to prepare:</h1>
                    <p> Try to craft in your imagination what your character will be like. What’s their job onboard? What are their intentions (glory, adventure, treasure)? Look up the D&D alignment chart - where do you land?</p>
                    <div id="mobileHost">
                        <h2>Hosted by: Robert Lotreck</h2>
                            <img src="assets/prof.png" alt="...">
                        <br><p class="hostSchool">Columbia University • 2022 <br> Sociology</p>
                        <br><div class="hostBio"> <p>Robert Lotreck grew up in woodsy Tolland, Connecticut. Starting out as a Math/Computer Science major, it took him 3 semesters to realize his academic passion was Sociology. Primarily involved in sports his whole life, drumming only became a serious interest during senior year of high school.</p></div>
                    </div>
                    <br><br>
                </div>

                <div class="col-sm-4 offset-sm-7" style="padding-left: 0;" id="hostInfo">
                
                    <a class="btn btn-outline-dark reserve" href="#" role="button">RESERVE</a>
                    
                    <br> <br>
                    <small>Hosted by:</small>
                    <div class="row" style="margin-top: 10px;">
                        <div class="col-sm-3">
                            <img src="assets/prof.png" alt="..." id="hostPic">

                        </div>
                        <div class="col-sm-1">
                            <h2>Robert Lotreck</h2>
                        </div>
                    </div>
                    <br><p class="hostSchool">Columbia University • 2022 <br> Sociology</p>
                    <br><div class="hostBio"> Robert Lotreck grew up in woodsy Tolland, Connecticut. Starting out as a Math/Computer Science major, it took him 3 semesters to realize his academic passion was Sociology. Primarily involved in sports his whole life, drumming only became a serious interest during senior year of high school.</div>
                    </div>
            </div> 
        </div>
    </div>`;
    return false;
}

function backHome() {
    view.innerHTML = indexhtml;
    return false;
}
/*
var count = 0;
db.collection('july20Events').get()
.then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        const event = doc.data();

        let time = '';
        const month = event.time.toDate().getMonth().toString();
        time += month;
        const thisDay = event.time.toDate().getDate().toString();
        time += "/" + thisDay;
        const year = event.time.toDate().getFullYear().toString();
        time += "/" + year + " ";
    
        var hour = event.time.toDate().getHours();
        if (hour <= 12){
          time += hour + "am EST";
        }
        else{
          hour-=12;
          time += hour + "pm EST";
        }

        const innerBody = `<div class="container">
            <div class="container-wrapper">
                <nav class="navbar navbar-expand-lg" style="font-family: 'Roboto', sans-serif; padding-left: 0;">
                    <a href="#" class="navbar-brand">
                        <img src="assets/logo.png" style="height: 30px;">
                    </a>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav" style="font-size: 14px;">
                            <a class="nav-item nav-link logged-in modal-trigger" data-toggle="modal" data-target="#modal-account">Account</a>
                            <a class="nav-item nav-link logged-in modal-trigger" data-toggle="modal" data-target="#modal-create">Event Creator</a>
                            <a class="nav-item nav-link" id="logout">Logout</a>
                            <a class="nav-item nav-link logged-out modal-trigger" data-toggle="modal" data-target="#modal-login">Login</a>
                            <a class="nav-item nav-link logged-out" data-toggle="modal" data-target="#modal-signup">Sign Up</a>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
        <br>

        <!-- Header -->
        <div class="container">
            <div class="container-wrapper">
                <div class="row">
                    <div class="col-md-7">
                        <h1 id="title">${event.title}</h1>
                        <a class="btn btn-outline-dark reserve" href="#" role="button" id="mobileHost">RESERVE</a>
                        <p>Breakfast • ${time}</p>

                        <img src="assets/simping.png" alt="..." id="thumb">
                        <p> I want to host a conversation about sustainability and draw attention to environmental sustainability and climate action, as well as social sustainability that entails issues like poverty, food security, and healthcare. Sustainability is a fairly broad topic so there's a lot of room for the conversation to develop (which I find can make for a very interesting discussion). I would also love to be able to share some eco-friendly tips and swaps that I have, talk about my experience with vegetarianism, fast-fashion, and advice for college students on getting involved in sustainability, especially on college campuses. There's also a lot to talk about in relation to current events by talking about the importance of diversity and inclusivity in sustainability (depending on how deep or surface level the conversation decides to go and what the other students are interested in talking about).</p>
                        <br>
                        <h2>What to prepare:</h1>
                        <p> Try to craft in your imagination what your character will be like. What’s their job onboard? What are their intentions (glory, adventure, treasure)? Look up the D&D alignment chart - where do you land?</p>
                        <div id="mobileHost">
                            <h2>Hosted by: Robert Lotreck</h2>
                                <img src="assets/prof.png" alt="...">
                            <br><p class="hostSchool">Columbia University • 2022 <br> Sociology</p>
                            <br><div class="hostBio"> <p>Robert Lotreck grew up in woodsy Tolland, Connecticut. Starting out as a Math/Computer Science major, it took him 3 semesters to realize his academic passion was Sociology. Primarily involved in sports his whole life, drumming only became a serious interest during senior year of high school.</p></div>
                        </div>
                        <br><br>
                    </div>

                    <div class="col-sm-4 offset-sm-7" style="padding-left: 0;" id="hostInfo">
                    
                        <a class="btn btn-outline-dark reserve" href="#" role="button">RESERVE</a>
                        
                        <br> <br>
                        <small>Hosted by:</small>
                        <div class="row" style="margin-top: 10px;">
                            <div class="col-sm-3">
                                <img src="assets/prof.png" alt="..." id="hostPic">

                            </div>
                            <div class="col-sm-1">
                                <h2>Robert Lotreck</h2>
                            </div>
                        </div>
                        <br><p class="hostSchool">Columbia University • 2022 <br> Sociology</p>
                        <br><div class="hostBio"> Robert Lotreck grew up in woodsy Tolland, Connecticut. Starting out as a Math/Computer Science major, it took him 3 semesters to realize his academic passion was Sociology. Primarily involved in sports his whole life, drumming only became a serious interest during senior year of high school.</div>
                        </div>
                </div> 
            </div>
        </div>`
        docu.body.innerHTML = innerBody;

        console.log(docu)
        count++;
    });
})
.catch(function(error) {
    console.log("Error getting documents: ", error);
});

*/