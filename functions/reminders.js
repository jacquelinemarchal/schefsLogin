const functions = require('firebase-functions');
const { CloudTasksClient } = require('@google-cloud/tasks');

const project = 'schefs-291406';
const queue = 'schefs-reminders';
const location = 'us-central1';
const url = 'https://us-central1-schefs.cloudfunctions.net/reminders';

const client = new CloudTasksClient();
const parent = client.queuePath(project, location, queue);

exports.schedule30MinuteReminderTask = async (email, name, event_name, event_time_js, event_zoom_link) => {
    const payload = {
        email,
        name,
        event_name,
        event_zoom_link,
        type: '30m'
    };

    const reminder_time = new Date(event_time_js.getTime());
    reminder_time.setMinutes(event_time_js.getMinutes() - 30);
    
    const task = {
        httpRequest: {
            httpMethod: 'POST',
            url,
            body: Buffer.from(JSON.stringify(payload)).toString('base64'),
            headers: { 'Content-Type': 'application/json' }
        },
        scheduleTime: { seconds: reminder_time.getTime() / 1000 }
    };

    const [ response ] = await client.createTask({parent, task});
    console.log(response);

    return null;
};

exports.schedule24HourReminderTask = async (email, name, event_name, event_time_js, event_zoom_link) => {
    const payload = {
        email,
        name,
        event_name,
        event_zoom_link,
        type: '24h'
    };

    const reminder_time = new Date(event_time_js.getTime());
    reminder_time.setDate(event_time_js.getDate() - 1);

    const task = {
        httpRequest: {
            httpMethod: 'POST',
            url,
            body: Buffer.from(JSON.stringify(payload)).toString('base64'),
            headers: { 'Content-Type': 'application/json' }
        },
        scheduleTime: { seconds: reminder_time.getTime() / 1000 }
    };

    const [ response ] = await client.createTask({parent, task});
    console.log(response);

    return null;
};
