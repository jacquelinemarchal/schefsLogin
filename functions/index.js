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

exports.sendWelcomeEmail = functions.firestore
    .document('users/{userId}')
    .onCreate((snap, context) => {
    
    const user = snap.data();
    const email = user.email;
    const name = user.firstName;

    emailFunctions.sendWelcomeEmail(email, name);
        
    return null;
});

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
    const event_gcal_id = event.gcalId;

    const event_datetime = event.time.toDate();
    const event_date = moment.tz(event_datetime, 'America/New_York').format('dddd, MMMM D, YYYY');
    const event_time = moment.tz(event_datetime, 'America/New_York').format('h:mm A, z');

    gcalFunctions.addAttendeeToGcalEvent(event_id, email);
    emailFunctions.sendReserveEmail(email, name, event_name, event_date, event_time);

    return null;
});

exports.handleCreateEvent = functions.firestore
    .document('weekendevents/{eventId}')
    .onCreate((snap, context) => {

    const event = snap.data();
    const event_id = context.params.eventId;

    const email = event.email;
    const name = event.firstName;
    const event_name = event.title;
    
    emailFunctions.sendEventSubmittedEmail(email, name, event_name);

    return null;
});

exports.handleUpdateEvent = functions.firestore
    .document('weekendevents/{eventId}')
    .onUpdate((change, context) => {

    const after = change.after.data();
    const before = change.before.data();
    const event_id = context.params.eventId;

    const email = after.email;
    const name = after.firstName;
    const event_name = after.title;
    const event_datetime = after.time.toDate();

    if ((!before.zoomLink || !before.zoomId) && after.zoomLink && after.zoomId) {
        const zoom_link = after.zoomLink;
        const zoom_id = after.zoomId;
        const start_time_utc = event_datetime.toISOString();
        event_datetime.setHours(event_datetime.getHours()+1);
        const end_time_utc = event_datetime.toISOString();
        
        gcalFunctions.createGcalEvent(event_name, event_id, zoom_link, zoom_id, start_time_utc, end_time_utc);
    }

    if (!before.approved && after.approved) {
        const event_date = moment.tz(event_datetime, 'America/New_York').format('dddd, MMMM D, YYYY');
        const event_time = moment.tz(event_datetime, 'America/New_York').format('h:mm A, z');

        gcalFunctions.addAttendeeToGcalEvent(event_id, after.email);
        emailFunctions.sendEventApprovedEmail(email, name, event_name, event_date, event_time);
    }

    return null;
});


exports.calendly = functions.https.onRequest((request, response) => {
    var raw = request.body.payload;
    var eventID = raw.tracking.utm_campaign;
    var time = raw.event.start_time;
    var zoomLink = raw.event.location;
    var zoomID = zoomLink.substring(26);
    var zoomPassword = zoomLink.substring(42)
    var pretty = raw.event.start_time_pretty;
    var zoomIDFormat = zoomID.substring(0,3).concat(" ", zoomID.substring(3,7), " ", zoomID.substring(7,11));

    // make week field
    //2020-10-09T12:00:00-04:00
    var month = time.substring(5,7)
    var day = time.substring(8,10)
    
    week = 0;
    weekDay = ""
    if (month === "10"){
        if (day > "15"){
            week = 1;
            if (day === "16"){
                weekDay = "Friday"
            }
            if (day === "17"){
                weekDay = "Saturday"
            }
            if (day === "18"){
                weekDay = "Sunday"
            }
        }
        if (day > "22"){
            week = 2;
            if (day === "23"){
                weekDay = "Friday"
            }
            if (day === "24"){
                weekDay = "Saturday"
            }
            if (day === "25"){
                weekDay = "Sunday"
            }
        }
        if (day > "29"){
            week = 3;
            if (day === "30"){
                weekDay = "Friday"
            }
            if (day === "31"){
                weekDay = "Saturday"
            }
        }
    }
    if (month === "11"){
        if (day === "1"){
            week = 3;
            weekDay = "Sunday"
        }
        if (day > "5"){
            week = 4;
            if (day === "6"){
                weekDay = "Friday"
            }
            if (day === "7"){
                weekDay = "Saturday"
            }
            if (day === "8"){
                weekDay = "Sunday"
            }
        }
        if (day > "12"){
            week = 5;
            if (day === "13"){
                weekDay = "Friday"
            }
            if (day === "14"){
                weekDay = "Saturday"
            }
            if (day === "15"){
                weekDay = "Sunday"
            }
        }
        if (day > "19"){
            week = 6;
            if (day === "20"){
                weekDay = "Friday"
            }
            if (day === "21"){
                weekDay = "Saturday"
            }
            if (day === "22"){
                weekDay = "Sunday"
            }
        }
        if (day > "26"){
            week = 7;
            if (day === "27"){
                weekDay = "Friday"
            }
            if (day === "28"){
                weekDay = "Saturday"
            }
            if (day === "29"){
                weekDay = "Sunday"
            }
        }
    }
    if (month === "12"){
        if (day > "3"){
            week = 8;
            if (day === "4"){
                weekDay = "Friday"
            }
            if (day === "5"){
                weekDay = "Saturday"
            }
            if (day === "6"){
                weekDay = "Sunday"
            }
        }
        if (day > "10"){
            week = 9;
            if (day === "11"){
                weekDay = "Friday"
            }
            if (day === "12"){
                weekDay = "Saturday"
            }
            if (day === "13"){
                weekDay = "Sunday"
            }
        }
        if (day > "17"){
            week = 10;
            if (day === "18"){
                weekDay = "Friday"
            }
            if (day === "19"){
                weekDay = "Saturday"
            }
            if (day === "20"){
                weekDay = "Sunday"
            }
        }
    }

    db.collection("weekendevents").doc(eventID).set({
        start_time: time,
        zoomId: zoomIDFormat,
        zoomLink: zoomLink,
        start_time_pretty: pretty,
        zoomPassword: zoomPassword,
        week: week,
        month: month,
        weekDay: weekDay,
        day: day
    }, { merge: true });
});