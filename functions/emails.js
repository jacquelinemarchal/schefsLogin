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

exports.sendReserveEmail = async (email, name,  event_name, event_date, event_time, event_url) => {
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
                ${event_time}<br>
                ${event_url}<br><br>
                </b>
                You should have received a Google Calendar invitation that includes
                the Zoom link for the event.
            </p>
            <p>
                Have a beautiful time!
            </p>
            <p>
                Here's to many conversations,<br>
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
        subject: 'Schefs Event Submission Confirmation',
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
                Thank you for signing up to host a Schefs conversation!<br><br>
                Your event, <b>${event_name}</b>, has been submitted. We will 
                review your event and get back to you with a response within 24 
                hours before publishing it on our site.<br><br>

                If you have any questions, please reach out to schefs.us@gmail.com.
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

exports.sendEventApprovedEmail = async (email, name, event_name, event_date, event_time, event_url, event_zoom_link) => {
    const mailOptions = {
        to: email,
        subject: 'Your Schefs Event Is Approved!',
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
                Wohoooo! Your event, ${event_name}, has been approved and 
                is NOW LIVE on our website. Share your link and invite whoever
                you want. Anyone with a Schefs account will be able to sign up
                to attend!
            </p>
            <p>
                Event Information:<br><br>
                <b>
                    ${event_name}<br>
                    ${event_date}<br>
                    ${event_time}<br>
                    ${event_url}<br>
                    Zoom: <a href=${event_zoom_link}>${event_zoom_link}</a><br>
                </b>
            </p>
            <p>
                If you’d like us to make a personalized flyer for your event to
                help promote it, reply to this email... we’ve got some cool
                designs up our sleeve :)<br><br>

                And if you have any questions about anything at all, don’t hesitate
                to reach out!
            </p>
            <p>
                Here’s to many conversations,<br>
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

exports.sendEventDeniedEmail = async (email, name, event_name, event_description, event_requirements, event_hostbio) => {
    const mailOptions = {
        to: email,
        subject: `Schefs Event Update: ${event_name}`,
        dsn: {
            id: 'Denial - ' + email,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: 'schefs.us@gmail.com'
        },
        html: `
            <p>
                Hi ${name},
            </p>
            <p>
                Thank you for submitting a Schefs event!<br><br>

                Your event, <b>${event_name}</b>, has been reviewed but unfortunately wasn’t
                approved. However, we encourage you to resubmit with edits.
            </p>
            <p>
                Here are some tips for submitting a successful event proposal:
                <ul>
                    <li>
                        Schefs believes that everybody should have a stake in each conversation. 
                        Make sure that your event isn’t structured as a lecture, but that your event
                        encourages active participation from those who are experts, from those who
                        are enthusiasts, and from those who are totally new to your event’s topic.
                    </li>
                    <li>
                        The most successful Schefs events tackle a very specific topic as a catalyst
                        for conversation. Make sure that your event topic isn’t too broad.
                    </li>
                    <li>
                        Make sure that your event’s description gives potential guests an idea of 
                        what will be discussed at your event, and that it’s at least 5 sentences
                        long.
                    </li>
                    <li>
                        Most Schefs participants are unable to prepare extensively for each event.
                        We encourage you to share resources for guests to browse before each event,
                        but don’t ask guests to read a whole book!
                    </li>
                </ul>
            </p>
            <p>
                A copy of the information you submitted is below. Feel free to edit and resubmit if
                you’d like!<br><br>

                If you have any questions, don’t hesitate to reach out!
            </p>
            <p>
                Cheers,<br>
                The Schefs Team<br>
                <a href="www.schefs.us">www.schefs.us</a>
            </p>
            <hr>
            <p>
                Title: <b>${event_name}</b><br>
                Description: <b>${event_description}</b><br>
                Requirements: <b>${event_requirements}</b><br>
                Bio: <b>${event_hostbio}</b>
            </b></p>
        `
    };

    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        console.log(info);
    });

    return null;
};

exports.send24HourReminderEmail = async (email, name, event_name) => {
    const mailOptions = {
        to: email,
        subject: `Schefs Event Reminder: ${event_name}`,
        dsn: {
            id: '24 Hour Reminder - ' + email,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: 'schefs.us@gmail.com'
        },
        html: `
            <p>
                Hi ${name},
            </p>
            <p>
                Just a reminder that your Schefs event, <b>${event_name}</b>, is tomorrow.
            </p>
            <p>
                Make sure you join the Zoom on time so the conversation can get started 
                with all participants present as soon as possible, and turn on your video!
                Be brave, share your thoughts, and have a blast.
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

exports.send30MinuteReminderEmail = async (email, name, event_name, event_zoom_link) => {
    const mailOptions = {
        to: email,
        subject: `Schefs Event Reminder: ${event_name}`,
        dsn: {
            id: '30 Min Reminder - ' + email,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: 'schefs.us@gmail.com'
        },
        html: `
            <p>
                Hi ${name},
            </p>
            <p>
                Your Schefs event, <b>${event_name}</b>, is in 30 minutes!
            </p>
            <p>
                Here's the Zoom link (also in the GCal for the event):<br>
                ${event_zoom_link}<br>
            </p>
            <p>
                Enjoy,<br>
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
