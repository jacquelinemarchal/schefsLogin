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
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');

admin.initializeApp();

const email = functions.config().user.email;
const password = functions.config().user.password;

const transportOptions = {
    name: 'schefs.us',
    pool: true,
    rateDelta: 86400000,    // 24 hours in ms, this prop will be deprecated
    rateLimit: 300,         // 300 emails per day (Gmail limit is 500), this prop will be deprecated
    service: 'gmail',
    auth: {
        user: email,
        pass: password
    }
};

const defaults = {
    from: 'Schefs US <schefs.us@gmail.com>',
    replyTo: 'schefs.us@gmail.com'
};

const transporter = nodemailer.createTransport(transportOptions, defaults);

const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        to: email,
        subject: 'Welcome to Schefs!',
        dsn: {
            id: 'Welcome - ' + email,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: 'schefs.us@gmail.com'
        },
        html: `
            <p>
                Hi ${name},
            </p>
            <p>
                Thanks for making a Schefs account! We’re psyched to have you join this 
                community of college students who want to share with and learn from one
                another, partaking in this joyous journey of knowledge exchange, and 
                harnessing the collective intelligence of our generation.
            </p>
            <p>
                To many conversations,<br>
                The Schefs Team<br>
                <a href="www.schefs.us">www.schefs.us</a>
            </p>
        `
    };

    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        console.log(info);
    });

    return null;
}

const sendReserveEmail = async (user_id, event_ref) => {
    const user_ref = admin.firestore().collection('users').doc(user_id);
    const user_snap = await user_ref.get();
    const user = user_snap.data();
    const email = user.email;
    const name = user.firstName;

    const event_snap = await event_ref.get();
    const event = event_snap.data();
    const event_name = event.title;
    const event_datetime = event.time.toDate();
    
    const event_date = moment.tz(event_datetime, 'America/New_York').format('dddd, MMMM D, YYYY');
    const event_time = moment.tz(event_datetime, 'America/New_York').format('h:mm A, z');

    const mailOptions = {
        to: email,
        subject: 'Schefs Town Hall Registration: Today at 5pm EST',
        dsn: {
            id: 'Reserve - ' + email,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: 'schefs.us@gmail.com'
        },
        html: `
            <p>
                Hi ${name},
            </p>
            <p>
                Thanks for signing up for a Schefs event:<br><br>
                <b>
                ${event_name}<br>
                Sunday, September 27th<br>
                5:00 PM EDT<br><br>
                </b>
                You will receive details for the scheduled Zoom the night before 
                the event.
            </p>
            <p>
                Yours truly,<br>
                The Schefs Team<br>
                <a href="www.schefs.us">www.schefs.us</a>
            </p>
        `
    };
    
    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        console.log(info);
    });

    return null;
}

exports.sendWelcomeEmail = functions.firestore
    .document('users/{userId}')
    .onCreate((snap, context) => {
    
    const user = snap.data();
    const email = user.email;
    const name = user.firstName;

    return sendWelcomeEmail(email, name);
});

exports.sendReserveEmail = functions.firestore
    .document('aug20events/{eventId}/tickets/{ticketId}')
    .onCreate((snap, context) => {

    const user_id = context.params.ticketId;
    const ticket_ref = snap.ref;
    const event_ref = ticket_ref.parent.parent;

    return sendReserveEmail(user_id, event_ref);
});

exports.calendly = functions.https.onRequest((request, response) => {
    response.send("Endpoint for Calendly Webhooks");
    var body = request.body.text	
    response.send(`${body}`)
  });
  //:850934