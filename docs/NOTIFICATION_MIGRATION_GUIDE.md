# Notification System Migration Guide

## Database Migration

Run the following command to apply the database schema changes:

```bash
npx prisma migrate dev --name add_notification_channels_and_preferences
```

This will create:
1. `NotificationChannel` table for tracking multi-channel delivery
2. `NotificationPreference` table for user preferences
3. Updates to `Notification` table (metadata field, channels relation)
4. Updates to `User` table (notificationPreference relation)

## Environment Setup

### 1. Install Redis

**Using Docker (Recommended):**
```bash
docker run -d -p 6379:6379 --name redis redis:alpine
```

**Or install locally:**
- Windows: Download from https://redis.io/download
- Mac: `brew install redis`
- Linux: `sudo apt-get install redis-server`

### 2. Update Environment Variables

Add to your `.env` file:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Configuration (if not already set)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@tecterminal.com

# Optional: SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

## Verification Steps

### 1. Verify Redis Connection
```bash
redis-cli ping
# Should return: PONG
```

### 2. Verify Database Migration
```bash
npx prisma studio
# Check that NotificationChannel and NotificationPreference tables exist
```

### 3. Test Notification System

1. Create a new student registration
2. Check that notifications are created in the database
3. Verify email/SMS are queued (check Redis queue)
4. Check notification preferences are working

## Rollback (if needed)

If you need to rollback:

```bash
npx prisma migrate reset
# WARNING: This will delete all data!
```

Or manually revert the migration:
```bash
npx prisma migrate resolve --rolled-back <migration-name>
```

## Troubleshooting

### Redis Connection Issues
- Ensure Redis is running: `redis-cli ping`
- Check REDIS_HOST and REDIS_PORT in .env
- Verify firewall settings

### Queue Not Processing
- Check Bull queue dashboard (if installed)
- Verify NotificationProcessor is registered in NotificationModule
- Check application logs for errors

### Email/SMS Not Sending
- Verify credentials in .env
- Check notification channel status in database
- Review processor logs for specific errors

## Next Steps

1. Run database migration
2. Start Redis server
3. Restart application
4. Test with a student registration
5. Monitor queue processing
6. Set up monitoring/alerting for failed notifications

