# OTP-Based Email Verification Implementation

## Overview
This implementation adds a secure OTP (One-Time Password) verification system for user signup in StudyTrack. Users must verify their email address before they can create an account.

## How It Works

### 1. Email Verification Flow
1. **Step 1**: User enters their email address
2. **Step 2**: System sends a 6-digit OTP to the email
3. **Step 3**: User enters the OTP for verification
4. **Step 4**: After successful verification, user completes registration

### 2. Security Features
- **OTP Expiration**: Codes expire after 10 minutes
- **Rate Limiting**: Prevents abuse with express-rate-limit
- **Email Uniqueness**: Prevents duplicate accounts during signup
- **Temporary Users**: Creates temporary user records during verification

## Backend Changes

### New User Model Fields
```javascript
signupOtp: { type: String },           // Stores the OTP
signupOtpExpires: { type: Date },      // OTP expiration time
isEmailVerified: { type: Boolean, default: false }  // Verification status
```

### New API Endpoints
- `POST /api/v1/auth/send-signup-otp` - Send OTP to email
- `POST /api/v1/auth/verify-signup-otp` - Verify OTP
- Modified `POST /api/v1/auth/register` - Now requires verified email

### New Controller Functions
- `sendSignupOtp()` - Generates and sends OTP
- `verifySignupOtp()` - Verifies OTP and marks email as verified
- Modified `register()` - Works with verified temporary users

## Frontend Changes

### Multi-Step Registration Form
1. **Email Input Step**: User enters email and requests OTP
2. **OTP Verification Step**: User enters 6-digit code
3. **Registration Step**: User completes account details

### New API Functions
- `sendSignupOtp(data)` - Request OTP
- `verifySignupOtp(data)` - Verify OTP
- Modified `register(data)` - Create account with verified email

### Enhanced UI Features
- Step-by-step progress indication
- Error and success message handling
- Resend OTP functionality
- Back navigation between steps
- Loading states for all operations

## Email Templates

### Signup Verification Email
- Professional HTML template
- Clear OTP display
- Expiration warning
- StudyTrack branding

## Error Handling

### Common Error Scenarios
- **Email Already Exists**: Prevents duplicate accounts
- **Invalid OTP**: Handles wrong codes gracefully
- **Expired OTP**: Allows resending new codes
- **Email Send Failures**: Graceful fallback handling

## Rate Limiting

### Protection Against Abuse
- 5 requests per minute per IP
- Applies to all OTP-related endpoints
- Prevents OTP spam attacks

## Database Considerations

### Temporary User Records
- Created during OTP request
- Cleaned up if email fails
- Converted to full users after verification
- Prevents orphaned records

## Testing the Implementation

### Manual Testing Steps
1. Navigate to `/register`
2. Enter email address
3. Check email for OTP
4. Enter OTP in verification step
5. Complete registration form
6. Verify successful account creation

### Environment Requirements
- Valid SMTP configuration in `.env`
- MongoDB connection
- JWT secret configured
- Frontend API URL configured

## Security Benefits

1. **Email Ownership Verification**: Ensures users control the email
2. **Prevents Fake Accounts**: Reduces bot registrations
3. **Account Recovery**: Verified emails for password reset
4. **Audit Trail**: Clear verification history

## Future Enhancements

1. **SMS OTP**: Add phone number verification
2. **2FA Integration**: Use OTP for login security
3. **OTP History**: Track verification attempts
4. **Advanced Rate Limiting**: Per-email rate limiting
