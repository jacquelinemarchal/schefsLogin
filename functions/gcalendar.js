const { google } = require('googleapis');
const functions = require('firebase-functions');
const base32hex = require('rfc4648').base32hex;
const credentials = require('./credentials.json');

const TIMEZONE = 'America/New_York';
const CALENDAR_ID = 'g7pn5r5mh7kga75tgc5m186qs0@group.calendar.google.com';

const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar('v3');

const auth = new OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
);

auth.setCredentials({refresh_token: credentials.refresh_token});

exports.createGcalEvent = async (event_name, event_id, zoom_link, zoom_id, start_time_utc, end_time_utc) => {
    const encoded_id = base32hex.stringify(event_id, {pad: false}).toLowerCase();
    const gcal_event = {
        summary: event_name,
        location: zoom_link,
        description: `<html>Schefs US is inviting you to a scheduled Zoom meeting.<br><br>Join Zoom Meeting<br><a href=${zoom_link}>${zoom_link}</a><br><br>Meeting ID: ${zoom_id}</html> `,
        start: {
            dateTime: start_time_utc,
            timeZone: TIMEZONE
        },
        end: {
            dateTime: end_time_utc,
            timeZone: TIMEZONE,
        },
        attendees: [],
        reminders: {
            useDefault: false,
            overrides: [
                {method: 'email', minutes: 24 * 60},
                {method: 'email', minutes: 30},
            ],
        },
        id: encoded_id
    };

    await calendar.events.insert({
        auth: auth,
        calendarId: CALENDAR_ID,
        resource: gcal_event
    }, (err, event) => {
        if (err) console.log(err);
    });

    return null;
};

exports.addAttendeeToGcalEvent = async (event_id, attendee_email) => {
    const encoded_id = base32hex.stringify(event_id, {pad: false}).toLowerCase();
    const gcal_event = await calendar.events.get({
        auth: auth,
        calendarId: CALENDAR_ID,
        eventId: encoded_id 
    });

    let attendees = gcal_event.data.attendees;
    if (!attendees) attendees = [];

    attendees.push({email: attendee_email});

    const gcal_event_patch = {attendees: attendees};
    await calendar.events.patch({
        auth: auth,
        calendarId: CALENDAR_ID,
        eventId: encoded_id,
        resource: gcal_event_patch,
        sendNotifications: true
    }, (err, event) => {
        if (err) console.log(err);
    });

    return null;
};

exports.deleteGcalEvent = async (event_id) => {
    const encoded_id = base32hex.stringify(event_id, {pad: false}).toLowerCase();
    await calendar.events.delete({
        auth: auth,
        calendarId: CALENDAR_ID,
        eventId: encoded_id
    }, (err, event) => {
        if (err) console.log(err);
    });

    return null;
}
