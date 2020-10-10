const helpModal = () => {
    $("#modal-welcome-build").modal()
}

const displayImageGuide = () => {
    var modal = document.getElementById("modal-help-content");
    let imageGuide = `
        <h2 style="text-align:center;">Image Guide</h2><br>
        <p>Profile pictures: For best results, upload a square image. If using a vertical image, make sure that subject is centered</p>
        <br><p>Event Images: Our event image library is specially curated by the Schefs team! If you don’t find an image that works for your event, shoot us an email ASAP with a proposed image and we’ll figure something out.</p>
        <br>
        <a style="text-align:center;color: #007bff; font-family:'Roboto', sans-serif;font-size:20px;" onclick="resetModal()">&lsaquo; Back to Event Builder Help</a>
    `
    modal.innerHTML = imageGuide;
}
const displayCoHostGuide = () => {
    var modal = document.getElementById("modal-help-content");
    let cohostGuide = `
        <h2 style="text-align:center;">Co-Host Guide</h2><br>
        <p>If you’d like to host an event with somebody else, please provide both of your respective bios, university names, graduation years, and majors in the appropriate boxes.</p>
        <br><p>Instead of filling out both of your first and last names, we ask you to provide Host 1's first name in the First Name box, and Host 2's first name in the Last Name box, separated by an '&' sign.</p>
        <br><p>Please provide one profile picture of the two of you together for your event.</p>
        <br>
        <a style="text-align:center;color: #007bff; font-family:'Roboto', sans-serif;font-size:20px;" onclick="resetModal()">&lsaquo; Back to Event Builder Help</a>
    `
    modal.innerHTML = cohostGuide;
}
const resetModal = () => {
    var modal = document.getElementById("modal-help-content");
    let helpModal = `<h2 style="text-align: center;">Welcome to the Event Builder</h2><br>
    <div style="padding-left: 4rem; padding-right: 4rem;">
        <p style="text-align: center;">Your information is pre-loaded from your account information. You can change the fields if you wish by highlighting and re-typing what you wish.<br><br> After you submit, your event will be reviewed within 24 hours.</p>
        <br><p>Browse Resources:</p>
        <div class="row">
            <div class="col-sm">
                <a style="color: #007bff; font-family:'Roboto', sans-serif;font-size:20px;" onclick="displayImageGuide()">Image Guide</a>
            </div>
            <div class="col-sm">
                <a style="color: #007bff; font-family:'Roboto', sans-serif;font-size:20px;"  onclick="displayCoHostGuide()">Co-host Guide</a>
            </div>
            <div class="col-sm">
                <a target="_blank" href="/archive.html" style="font-family:'Roboto', sans-serif;font-size:20px;">Event Inspiration</a>
            </div>
        </div>
    </div>`
    modal.innerHTML = helpModal;
}