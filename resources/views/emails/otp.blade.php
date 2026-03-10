<!DOCTYPE html>
<html>
<head>
    <title>OTP Verification</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">

    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #4A90E2; text-align: center;">{{ $purpose }}</h2>
        
        <p>Hello <strong>{{ $user->name }}</strong>,</p>
        
        <p>You requested a One-Time Password (OTP) for <strong>{{ $purpose }}</strong>.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2d3748; background: #f7fafc; padding: 10px 20px; border-radius: 4px; border: 1px dashed #cbd5e0;">
                {{ $otp }}
            </span>
        </div>

        <p>This OTP is valid for {{ config('auth.otp_expiry', 60) }} minutes.</p>
        
        <p>If you did not request this, please ignore this email.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #718096; text-align: center;">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </p>
    </div>

</body>
</html>
