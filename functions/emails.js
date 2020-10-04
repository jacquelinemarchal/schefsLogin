const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

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

exports.sendWelcomeEmail = async (email, name) => {
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
};

exports.sendReserveEmail = async (email, name,  event_name, event_date, event_time) => {
    const mailOptions = {
        to: email,
        subject: 'Your Schefs Reservation',
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
                ${event_date}<br>
                ${event_time}<br><br>
                </b>
                You will receive details for the scheduled Zoom the night before
                the event.
            </p>
            <p>
                Let's make this an insane week of powerful themed conversations and
                start the fall with our minds running, hungry excited ravenous for
                knowledge.
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
};

exports.sendEventSubmittedEmail = async (email, name, event_name) => {
    const mailOptions = {
        to: email,
        subject: '[Schefs] Your event has been submitted',
        dsn: {
            id: 'Submit - ' + email,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: 'schefs.us@gmail.com'
        },
        html: `
            <p>
                Hi ${name},
            </p>
            <p>
                Thanks for submitting an event idea! We've received your submission and
                will get back to you on its approval as soon as possible.
            </p>
            <p>
                Your event: <b>${event_name}</b>
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
};

exports.sendEventApprovedEmail = async (email, name, event_name, event_date, event_time) => {
    const mailOptions = {
        to: email,
        subject: '[Schefs] Your event has been approved',
        dsn: {
            id: 'Approval - ' + email,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: 'schefs.us@gmail.com'
        },
        html: `
            <p>
                Hi ${name},
            </p>
            <p>
                Congratulations! Your event has been approved!
            </p>
            <p>
                Event Details:<br><br>
                <b>
                    ${event_name}<br>
                    ${event_date}<br>
                    ${event_time}<br>
                </b>
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

    return null
};
