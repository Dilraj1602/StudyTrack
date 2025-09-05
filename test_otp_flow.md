# Testing the OTP Implementation

## Prerequisites
1. Ensure MongoDB is running
2. Configure email settings in `.env` file
3. Start both server and client

## Test Steps

### 1. Start the Server
```bash
cd server
npm start
```

### 2. Start the Client
```bash
cd client
npm start
```

### 3. Test the OTP Flow

#### Step 1: Email Input
1. Navigate to `http://localhost:3000/register`
2. Enter a valid email address
3. Click "Send Verification Code"
4. **Expected Result**: Success message and move to Step 2

#### Step 2: OTP Verification
1. Check your email for the 6-digit code
2. Enter the code in the verification field
3. Click "Verify Code"
4. **Expected Result**: Success message and move to Step 3

#### Step 3: Complete Registration
1. Fill in first name, last name, password, confirm password
2. Optionally add age
3. Click "Create Account"
4. **Expected Result**: Success message and redirect to login

### 4. Test Error Scenarios

#### Invalid Email
- Enter invalid email format
- **Expected Result**: Error message about invalid email

#### Duplicate Email
- Try to register with an existing email
- **Expected Result**: Error message about email already existing

#### Invalid OTP
- Enter wrong 6-digit code
- **Expected Result**: Error message about invalid code

#### Expired OTP
- Wait 10+ minutes before entering OTP
- **Expected Result**: Error message about expired code

#### Resend OTP
- Click "Resend Code" button
- **Expected Result**: New OTP sent to email

### 5. Test Navigation

#### Back Button
- Use back button to move between steps
- **Expected Result**: Proper state management and form clearing

#### Form Persistence
- Navigate back and forth between steps
- **Expected Result**: Email and verification status maintained

## API Testing

### Test Endpoints with Postman/Insomnia

#### 1. Send Signup OTP
```http
POST http://localhost:4000/api/v1/auth/send-signup-otp
Content-Type: application/json

{
  "email": "test@example.com"
}
```

#### 2. Verify Signup OTP
```http
POST http://localhost:4000/api/v1/auth/verify-signup-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "otp": "123456",
  "tempUserId": "temp_user_id_from_step_1"
}
```

#### 3. Complete Registration
```http
POST http://localhost:4000/api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "test@example.com",
  "password": "password123",
  "tempUserId": "temp_user_id_from_step_1"
}
```

## Expected Responses

### Success Responses
- **Send OTP**: `{ message: "Verification code sent to your email", email: "...", tempUserId: "..." }`
- **Verify OTP**: `{ message: "Email verified successfully. You can now complete your registration.", email: "...", tempUserId: "..." }`
- **Register**: `{ user: {...}, token: "..." }`

### Error Responses
- **Email exists**: `{ message: "An account with this email already exists" }`
- **Invalid OTP**: `{ message: "Invalid verification code" }`
- **Expired OTP**: `{ message: "Verification code has expired" }`

## Database Verification

### Check MongoDB Collections
1. **Users Collection**: Should contain temporary users during OTP process
2. **Temporary Users**: Should have `signupOtp`, `signupOtpExpires`, `isEmailVerified` fields
3. **Final Users**: Should have all required fields with `isEmailVerified: true`

## Troubleshooting

### Common Issues

#### Email Not Sending
- Check SMTP configuration in `.env`
- Verify email credentials
- Check server logs for email errors

#### OTP Not Working
- Verify MongoDB connection
- Check if temporary user was created
- Verify OTP expiration logic

#### Frontend Errors
- Check browser console for JavaScript errors
- Verify API endpoints are accessible
- Check CORS configuration

### Debug Logs
- Server logs show OTP generation and email sending
- Frontend console shows API call results
- MongoDB shows temporary user creation and updates
