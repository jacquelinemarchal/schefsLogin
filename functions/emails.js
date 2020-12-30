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
        subject: 'Confirmation of registration for a SOCIAL : Schefs conversation',
        dsn: {
            id: 'Reserve SOCIAL - ' + email,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: 'schefs.us@gmail.com'
        },
        html: `
            <p>
                Hi ${name},
            </p>
            <p>
                Thanks for signing up for a Schefs event for SOCIAL, our
                upcoming festival.
                <br><br>
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

exports.sendEventSubmittedEmail = async (email, name, event_name, event_time, event_date, event_description, event_requirements) => {
    const mailOptions = {
        to: email,
        subject: 'Event Submission Confirmation – Schefs SOCIAL : Festival',
        dsn: {
            id: 'Submit SOCIAL - ' + email,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: 'schefs.us@gmail.com'
        },
        html: `
            <p>
                Hi ${name},
            </p>
            <p>
                Thank you for signing up to host a Schefs conversation for SOCIAL, 
                our upcoming festival (January 4th - 10th, 2021)! Your event,
                <b>${event_name}</b>, has been submitted. A copy of your submission
                is below.
            </p>
            <p>
                Here are next steps to be aware of:
                <ol>
                    <li>
                        All festival events will be published to our website around
                        the 26th/27th.
                    </li>
                    <li>
                        By December 28th, you will receive the following:
                        <ol type="a">
                            <li>
                                An email confirming that your event has been approved,
                                plus a link to your event page on our website, where
                                any college student can reserve a free ticket to attend.
                                A Google Calendar event with a corresponding Zoom will 
                                all be automatically created for your event.
                            </li>
                            <li>
                                A custom graphic for your event, that you can use to
                                spread the word on your social channels and send to
                                whomever you like.
                            </li>
                            <li>
                                Some cool promo material for the festival that might
                                excite you :)
                            </li>
                        </ol>
                    </li>
                </ol>
                Sound good? If you have any questions, don’t hesitate to reach out.
            </p>
            <p>
                Cheers x1000,<br>
                The Schefs Team<br>
                <a href="www.schefs.us">www.schefs.us</a>
            </p>
            <br>
            <p>
                <u>Your event submission:</u><br><br>
                <b>
                    ${event_name}<br>
                    ${event_time}, ${event_date}<br>
                    ${event_description}<br>
                    ${event_requirements}
                </b>
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
        subject: 'Your Schefs event is live! Get ready for the festival!',
        dsn: {
            id: 'Approval SOCIAL - ' + email,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: 'schefs.us@gmail.com'
        },
        html: `
            <p>
                Hi ${name},
            </p>
            <p>
                Wohoooo! Your event, <b>${event_name}</b>, is officially part of
                SOCIAL, the upcoming Schefs festival. Very exciting!
            </p>
            <p>
                Your event, along with many others, is NOW LIVE on our website
                (link below). Share your link and invite whoever you want. Anyone
                with a Schefs account will be able to sign up to attend. The
                guests will probably be a mix of people from different schools
                across the world – that’s the beautiful unpredictability of these
                Schefs conversations!
            </p>
            <p>
                You should have also received a Google Calendar invitation that
                includes the Zoom link for the event. All guests will receive that
                link immediately once they reserve a ticket.
            </p>
            <p>
                <u>Event Information:</u><br><br>
                <b>
                    ${event_name}<br>
                    ${event_time}, ${event_date}<br>
                    Link: ${event_url}<br>
                    Zoom: <a href=${event_zoom_link}>${event_zoom_link}</a><br>
                </b>
            </p>
            <p><mark>
                You will receive a personalized flyer for your event + additional
                graphics that you can use to help spread the word about the festival
                shortly.
            </mark></p>
            <p>
                Otherwise, just make sure to hop on your Zoom at the appropriate time,
                and feel proud that you’re catalyzing meaningful discussion amongst
                people our age. Have a stellar time!
                <br><br>
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
};

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
                Here’s the Zoom link (also in the GCal for the event):<br>
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
};

exports.sendPostEventEmail = async (email, name, event_name) => {
    const mailOptions = {
        to: email,
        subject: 'Schefs Merch, Host Your Own Event… + More!',
        dsn: {
            id: 'Post Event Email - ' + email,
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: 'schefs.us@gmail.com'
        },
        html: `
            <p>
                Hi ${name},
            </p>
            <p>
                Thanks so much for participating in <b>${event_name}</b>. We
                hope it went well!
            </p>
            <ol>
                <li>
                    We made some dope sweatshirts for the festival... check ‘em out
                    <a href="https://shop.schefs.us">here</a> &amp; snag your order
                    before they run out!
                </li>
                <li>
                    <mark>Inspired to host an event of your own?</mark> They usually
                    happen every Friday, Saturday, and Sunday. Pick a topic that
                    interests you, and <a href="https://schefs.us">sign up</a> to
                    lead a conversation later this month!
                </li>
                <li>
                    Are you really psyched by the mission behind Schefs? Do you want
                    to become a Schefs ambassador and be part of a dedicated network
                    of students committed to tapping into their communities to
                    catalyze conversations? Come to our next Ambassador Info Session
                    on 01/17; learn more
                    <a href="https://schefs.us/ambassador-info.html">here</a>.
                </li>
                <li>
                    Since we’re still (very much) growing as a platform, any thoughts,
                    advice, reviews, or musings on the event or Schefs at large would
                    be very much appreciated. If you’re up for it, fill out this
                    <a href="https://schefs.typeform.com/to/sKrS5Y2X">2 minute form</a>
                    and share what you’re thinking!
                </li>
            </ol>
            <p>
                Peace &amp; love,<br>
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

