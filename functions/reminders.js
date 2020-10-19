const functions = require('firebase-functions');
const { CloudTasksClient } = require('@google-cloud/tasks');

const project = 'schefs-291406';
const queue = 'schefs-reminders';
const location = 'us-central1';
const url = 'https://us-central1-schefs.cloudfunctions.net/reminders';

const client = new CloudTasksClient();
const parent = client.queuePath(project, location, queue);

const schedule30MinuteReminderTask = async (email, name, event_name, event_date, event_time, event_time_js) => {
    const payload = {
        email,
        name,
        event_name,
        event_date,
        event_time,
        type: '30m'
    };

    const reminder_time = new Date(event_time_js.getTime());
    reminder_time.setMinutes(event_time_js.getMinutes() - 30);
    
    const task = {
        httpRequest: {
            httpMethod: 'POST',
            url,
            body: Buffer.from(JSON.stringify(payload)).toString('base64'),
            headers: { 'Content-Type': 'application/octet-stream' }
        },
        scheduleTime: { seconds: reminder_time.getTime() / 1000 }
    };

    const [ response ] = await client.createTask({parent, task});
    console.log(response);

    return null;
};

const schedule24HourReminderTask = async (email, name, event_name, event_date, event_time, event_time_js) => {
    const payload = {
        email,
        name,
        event_name,
        event_date,
        event_time,
        type: '24h'
    };
    console.log(JSON.stringify(payload));

    const reminder_time = new Date(event_time_js.getTime());
    reminder_time.setDate(event_time_js.getDate() - 1);

    const task = {
        httpRequest: {
            httpMethod: 'POST',
            url,
            body: Buffer.from(JSON.stringify(payload)).toString('base64'),
            headers: { 'Conent-Type': 'application/octet-stream' }
        },
        scheduleTime: { seconds: reminder_time.getTime() / 1000 }
    };

    const [ response ] = await client.createTask({parent, task});
    console.log(response);

    return null;
};

let date = new Date();
date.setDate(date.getDate()+1);
date.setSeconds(date.getSeconds()+10);
console.log(date);
schedule30MinuteReminderTask('cyw2124@columbia.edu', 'Chris', 'Test Event', 'October 20', '4:00 PM EST', date);
schedule24HourReminderTask('cyw2124@columbia.edu', 'Chris', 'Test Event', 'October 20', '4:00 PM EST', date);
