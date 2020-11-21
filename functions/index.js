/**
 * Set email/password as environment variables with Firebase CLI:
 * ```
 * firebase functions:config:set email="myusername@gmail.com" password="mypassword"
 * ```
 *
 * If using a Gmail account, you must enable 'Less secure apps' to access your
 * account: https://myaccount.google.com/lesssecureapps
 *
 * Gmail may ask for a CAPTCHA. Disable it here:
 * https://accounts.google.com/b/0/displayunlockcaptcha
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment-timezone');

admin.initializeApp();
const db = admin.firestore()
const emailFunctions = require('./emails');
const gcalFunctions = require('./gcalendar');
const reminderFunctions = require('./reminders');

// send email on user registration
exports.sendWelcomeEmail = functions.firestore
    .document('users/{userId}')
    .onCreate((snap, context) => {
    
    const user = snap.data();
    const email = user.email;
    const name = user.firstName;

    emailFunctions.sendWelcomeEmail(email, name);
        
    return null;
});

// invite to GCal event + send email on reserving event ticket + schedule reminders Tasks
exports.handleReserveEvent = functions.firestore
    .document('weekendevents/{eventId}/tickets/{ticketId}')
    .onCreate(async (snap, context) => {

    const user_id = context.params.ticketId;
    const event_id = context.params.eventId;

    const ticket_ref = snap.ref;
    const event_ref = ticket_ref.parent.parent;
    const user_ref = admin.firestore().collection('users').doc(user_id);

    const user_snap = await user_ref.get();
    const user = user_snap.data();
    const email = user.email;
    const name = user.firstName;

    const event_snap = await event_ref.get();
    const event = event_snap.data();
    const event_name = event.title;

    const event_datetime = event.start_time.toDate();
    const event_date = moment.tz(event_datetime, 'America/New_York').format('dddd, MMMM D, YYYY');
    const event_time = moment.tz(event_datetime, 'America/New_York').format('h:mm A, z');
    
    const event_url = 'https://schefs.us/index.html?event=' + event_id;
    const event_zoom_link = event.zoomLink;

    gcalFunctions.addAttendeeToGcalEvent(event_id, email);
    emailFunctions.sendReserveEmail(email, name, event_name, event_date, event_time, event_url);
    reminderFunctions.schedule30MinuteReminderTask(email, name, event_name, event_datetime, event_zoom_link);
    reminderFunctions.schedule24HourReminderTask(email, name, event_name, event_datetime, event_zoom_link);

    return null;
});

// various functions on event update for hosts
exports.handleUpdateEvent = functions.firestore
    .document('weekendevents/{eventId}')
    .onUpdate((change, context) => {

    const after = change.after.data();
    const before = change.before.data();
    const event_id = context.params.eventId;

    const email = after.email;
    const name = after.firstName;
    const event_name = after.title;
    const event_datetime = after.start_time.toDate();

    // on Zoom meeting creation (after receiving Calendly info), create GCal event and send submit confirmation email
    if ((!before.zoomLink || !before.zoomId) && after.zoomLink && after.zoomId) {
        // Zoom + time info
        const zoom_link = after.zoomLink;
        const zoom_id = after.zoomId;
        const start_time_utc = event_datetime.toISOString();
        event_datetime.setHours(event_datetime.getHours()+1);
        const end_time_utc = event_datetime.toISOString();
       
        // host info for email 
        const email = after.email;
        const name = after.firstName;
        const event_name = after.title;
        
        gcalFunctions.createGcalEvent(event_name, event_id, zoom_link, zoom_id, start_time_utc, end_time_utc);
        emailFunctions.sendEventSubmittedEmail(email, name, event_name);
    }

    // on event approval
    if ((!before.status || before.status !== 'approved') && after.status === 'approved') {
        const event_date = moment.tz(event_datetime, 'America/New_York').format('dddd, MMMM D, YYYY');
        const event_time = moment.tz(event_datetime, 'America/New_York').format('h:mm A, z');
        const event_url = 'https://schefs.us/index.html?event=' + event_id;
        const event_zoom_link = after.zoomLink;

        gcalFunctions.addAttendeeToGcalEvent(event_id, after.email);
        emailFunctions.sendEventApprovedEmail(email, name, event_name, event_date, event_time, event_url, event_zoom_link);
        reminderFunctions.schedule30MinuteReminderTask(email, name, event_name, event_datetime, event_zoom_link);
        reminderFunctions.schedule24HourReminderTask(email, name, event_name, event_datetime, event_zoom_link);
    
    // on event denial
    } else if ((!before.status || before.status !== 'denied') && after.status === 'denied') {
        const event_description = after.desc;
        const event_requirements = after.req;
        const event_hostbio = after.bio;

        gcalFunctions.deleteGcalEvent(event_id);
        emailFunctions.sendEventDeniedEmail(email, name, event_name, event_description, event_requirements, event_hostbio);
    }

    return null;
});

// add Zoom info to Firebase using Calendly webhooks
exports.calendly = functions.https.onRequest((request, response) => {
    const raw = request.body.payload;
    const eventID = raw.tracking.utm_campaign;
    const time = raw.event.start_time;
    const zoomLink = raw.event.location;
    const zoomID = zoomLink.substring(26);
    const pretty = raw.event.start_time_pretty;
    const zoomIDFormat = zoomID.substring(0,3).concat(" ", zoomID.substring(3,7), " ", zoomID.substring(7,11));

    // make week field
    const month = time.substring(5,7)
    const day = time.substring(8,10)
    
    let week = 0;
    let weekDay = "";
    if (month === "10") {
        if (day > "15") {
            week = 1;
            if (day === "16") weekDay = "Friday";
            if (day === "17") weekDay = "Saturday";
            if (day === "18") weekDay = "Sunday";
        }

        if (day > "22") {
            week = 2;
            if (day === "23") weekDay = "Friday";
            if (day === "24") weekDay = "Saturday";
            if (day === "25") weekDay = "Sunday";
        }

        if (day > "29") {
            week = 3;
            if (day === "30") weekDay = "Friday";
            if (day === "31") weekDay = "Saturday";
        }
    } else if (month === "11") {
        if (day === "01") {
            week = 3;
            weekDay = "Sunday"
        }

        if (day > "5") {
            week = 4;
            if (day === "6") weekDay = "Friday";
            if (day === "7") weekDay = "Saturday";
            if (day === "8") weekDay = "Sunday";
        }

        if (day > "12") {
            week = 5;
            if (day === "13") weekDay = "Friday";
            if (day === "14") weekDay = "Saturday";
            if (day === "15") weekDay = "Sunday";
        }

        if (day > "19") {
            week = 6;
            if (day === "20") weekDay = "Friday";
            if (day === "21") weekDay = "Saturday";
            if (day === "22") weekDay = "Sunday";
        }

        if (day > "26") {
            week = 7;
            if (day === "27") weekDay = "Friday";
            if (day === "28") weekDay = "Saturday";
            if (day === "29") weekDay = "Sunday";
        }
    } else if (month === "12") {
        if (day > "3") {
            week = 8;
            if (day === "4") weekDay = "Friday";
            if (day === "5") weekDay = "Saturday";
            if (day === "6") weekDay = "Sunday";
        }

        if (day > "10") {
            week = 9;
            if (day === "11") weekDay = "Friday";
            if (day === "12") weekDay = "Saturday";
            if (day === "13") weekDay = "Sunday";
        }

        if (day > "17") {
            week = 10;
            if (day === "18") weekDay = "Friday";
            if (day === "19") weekDay = "Saturday";
            if (day === "20") weekDay = "Sunday";
        }
    }

    db.collection("weekendevents").doc(eventID)
        .set({
            start_time: moment.parseZone(time),
            zoomId: zoomIDFormat,
            zoomLink: zoomLink,
            start_time_pretty: pretty,
            week: week,
            month: month,
            weekDay: weekDay,
            day: day
        }, { merge: true })
        .then(() => response.status(204).send())
        .catch((err) => {
            response.status(500).send(err);
            console.log(err)
        });
});

exports.reminders = functions.https.onRequest(async (request, response) => {
    const email = request.body.email;
    const name = request.body.name;
    const event_name = request.body.event_name;
    const event_zoom_link = request.body.event_zoom_link;
    const type = request.body.type;

    if (type === '30m') {
        await emailFunctions.send30MinuteReminderEmail(email, name, event_name, event_zoom_link);
        response.send(200);
    } else if (type === '24h') {
        await emailFunctions.send24HourReminderEmail(email, name, event_name);
        response.send(200);
    } else
        response.status(400).send();
});
