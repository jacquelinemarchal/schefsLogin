const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.calendly = functions.https.onRequest((request, response) => {
    response.send("Endpoint for Calendly Webhooks");
  });