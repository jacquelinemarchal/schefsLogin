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

    const event_datetime = event.start_time.toDate();
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
    const event_datetime = after.start_time.toDate();

    if ((!before.zoomLink || !before.zoomId) && after.zoomLink && after.zoomId) {
        const zoom_link = after.zoomLink;
        const zoom_id = after.zoomId;
        const start_time_utc = event_datetime.toISOString();
        event_datetime.setHours(event_datetime.getHours()+1);
        const end_time_utc = event_datetime.toISOString();
        
        gcalFunctions.createGcalEvent(event_name, event_id, zoom_link, zoom_id, start_time_utc, end_time_utc);
    }

    if ((!before.status || before.status === 'denied') && after.status === 'approved') {
        const event_date = moment.tz(event_datetime, 'America/New_York').format('dddd, MMMM D, YYYY');
        const event_time = moment.tz(event_datetime, 'America/New_York').format('h:mm A, z');

        gcalFunctions.addAttendeeToGcalEvent(event_id, after.email);
        emailFunctions.sendEventApprovedEmail(email, name, event_name, event_date, event_time);
    } else if ((!before.status || before.status === 'approved') && after.status === 'denied') {
        const event_date = moment.tz(event_datetime, 'America/New_York').format('dddd, MMMM D, YYYY');
        const event_time = moment.tz(event_datetime, 'America/New_York').format('h:mm A, z');

        gcalFunctions.deleteGcalEvent(event_id);
        // emailFunctions.sendEventDeniedEmail(email, name, event_name, event_date, event_time);
    }

    return null;
});

