import nodemailer from 'nodemailer';

// Set up the nodemailer transporter with your email service credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service provider
    auth: {
        user: 'surajkumar.nrt@gmail.com',
        // pass: 'suraj@prime11'   
        pass: 'fahp kngo sbxi fhry'
    }
});

/**
 * Sends a registration email with a unique password and registration link.
 *
 * @param {string} userEmail - Recipient's email address
 * @param {string} userPassword - Generated password for the user
 * @return {Promise<string>} - A promise resolving to 'SUCCESS' or 'FAILED'
 */
export default async function sendCompleteRegistrationEmail(userEmail, userPassword) {
    try {
        // Registration link
        const registrationLink = "http://localhost:5173/authentication";

        // Email HTML content
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Complete Your Registration</title>
          <style>
              body { font-family: Arial, sans-serif; }
              .container { margin: 0 auto; padding: 20px; max-width: 600px; }
              h2 { color: #333; }
              p { font-size: 16px; color: #666; }
              .password { font-size: 24px; font-weight: bold; color: #000; }
              .button { display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; }
              .button:hover { background-color: #0056b3; }
          </style>
      </head>
      <body>
          <div class="container">
              <p>Hello,</p>
              <p>Thank you for registering with our service. To complete your registration process, please use the following password to log in:</p>
              <p class="password">${userPassword}</p>
              <p>This password is only valid for a short period of time, so please log in and complete your registration promptly.</p>
              <p>If you did not request this registration, please ignore this email.</p>
              <a href="${registrationLink}" class="button">Complete Registration</a>
              <p>Thank you for using our service.</p>
              <p>Best regards,</p>
              <p>Your Company Name</p>
          </div>
      </body>
      </html>`;

        // Send email
        await transporter.sendMail({
            from: 'surajkumar.nrt@gmail.com',  // Replace with your sender email
            to: userEmail,
            subject: 'Complete Your Registration',
            html: htmlContent
        });

        return 'SUCCESS';
    } catch (error) {
        console.error(error);
        return 'FAILED';
    }
}
