# Email Setup Guide for StudyTracker Password Reset

## Overview
This guide explains how to set up email functionality for the password reset feature in StudyTracker.

## Prerequisites
- A Gmail account (or other email provider)
- App-specific password (for Gmail)

## Step 1: Gmail Setup (Required)

### 1.1 Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### 1.2 Generate App Password
1. Go to Google Account settings
2. Navigate to Security
3. Under "2-Step Verification", click "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "StudyTracker" as the name
6. Copy the generated 16-character password

### 1.3 Gmail SMTP Configuration
The application is configured to use Gmail's SMTP server:
- **Host**: smtp.gmail.com
- **Port**: 587
- **Security**: TLS
- **Authentication**: Required

## Step 2: Environment Configuration

### 2.1 Update .env file
Add these variables to your `server/.env` file:

```env
# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
```

### 2.2 Example .env configuration:
```env
EMAIL_USER=studytracker@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

## Step 3: Alternative Email Providers

### 3.1 Outlook/Hotmail
Update the email configuration in `server/config/email.js`:

```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### 3.2 Yahoo Mail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### 3.3 Custom SMTP Server
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.yourprovider.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Step 4: Testing

### 4.1 Test Email Functionality
1. Start your server
2. Go to `/reset-password`
3. Enter a registered email address
4. Check if the email is received

### 4.2 Troubleshooting
- **Authentication failed**: Check your app password
- **Connection timeout**: Verify your email provider settings
- **Email not received**: Check spam folder

## Step 5: Production Deployment

### 5.1 Environment Variables
For production deployment (e.g., Render.com):
1. Set `EMAIL_USER` environment variable
2. Set `EMAIL_PASSWORD` environment variable
3. Ensure `NODE_ENV=production`

### 5.2 Security Notes
- Never commit email credentials to version control
- Use environment variables for all sensitive data
- Consider using email service providers like SendGrid for production

## Email Template Customization

The email template is located in `server/config/email.js`. You can customize:
- Email subject
- HTML content and styling
- Company branding
- Expiration time messaging

## Support

If you encounter issues:
1. Check the server console for error messages
2. Verify your email credentials
3. Test with a different email provider
4. Check your email provider's security settings 