/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
});

// Define the Cloud Function
exports.sendNotificationEmail = functions.database.ref('/clubs/{clubId}/subscribers/{subscriptionId}')
  .onCreate((snapshot, context) => {
    const email = snapshot.val();
    const clubId = context.params.clubId;
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'New Event Notification',
      text: `Hello! There is a new event added to the club with ID: ${clubId}.`
    };

    // Send the email
    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
