# Dynamic Razorpay Key Management System

## Overview
This system allows admin users to update Razorpay API keys dynamically through the admin panel without needing to modify code or restart the server.

## How It Works

### 1. Database Storage
- Razorpay keys are stored in the `GatewaySettings` collection in MongoDB
- The model includes fields for `RazorPayKey` and `RazorPaySecretKey`

### 2. Dynamic Key Retrieval
- A `getRazorpayKeys()` function is implemented in both `transaction.js` and `Gateway.js`
- This function fetches keys from the database
- Falls back to environment variables if database keys are not available
- Provides final fallback to default test keys

### 3. Admin Panel Integration
- Admin can update keys through the Gateway Settings page (`/admin-bkp/src/app/components/adminManagement/Gateway.js`)
- Changes are immediately reflected in all Razorpay operations

## Files Modified

### Backend Files
1. **`backend-api/Routes/transaction.js`**
   - Added `getRazorpayKeys()` function
   - Updated all Razorpay instances to use dynamic keys
   - Modified routes: `/razorpaycheck/response`, `/razorpaydesposit/response`, `/user/razorpay_order`, payout routes

2. **`backend-api/Routes/Gateway.js`**
   - Added `getRazorpayKeys()` function
   - Updated `/razorpay/order` endpoint to use dynamic keys
   - Removed hardcoded Razorpay instance

3. **`backend-api/Routes/User.js`**
   - Updated `/website/setting` endpoint to return dynamic keys from database

### Frontend Files
1. **`admin-bkp/src/app/components/adminManagement/Gateway.js`**
   - Already had functionality to update Razorpay keys
   - No changes needed

## API Endpoints

### Get Gateway Settings
```
GET /gatewaysettings/data
```
Returns current gateway settings including Razorpay keys

### Update Gateway Settings
```
POST /gatewaysettings
```
Updates gateway settings including Razorpay keys

### Get Website Settings (for frontend)
```
GET /website/setting
```
Returns website settings including dynamic Razorpay keys

## Security Features

1. **Fallback System**: If database keys are not available, system falls back to environment variables
2. **Error Handling**: Graceful error handling if database is unavailable
3. **Admin Only**: Only admin users can update keys through the admin panel

## Usage Instructions

1. **For Admin Users**:
   - Go to Admin Panel → Gateway Settings
   - Update Razorpay Key and Secret Key
   - Save changes
   - Keys are immediately active

2. **For Developers**:
   - Keys can still be set via environment variables as fallback
   - Database keys take precedence over environment variables

## Benefits

1. **No Code Changes**: Admin can update keys without developer intervention
2. **No Server Restart**: Changes take effect immediately
3. **Environment Flexibility**: Can use different keys for different environments
4. **Backward Compatibility**: Still supports environment variable configuration

## Testing

To test the system:
1. Update keys through admin panel
2. Make a test payment
3. Verify that new keys are being used
4. Check logs to confirm dynamic key retrieval 