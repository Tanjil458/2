# Firebase Configuration Guide

## Overview
The MimiPro Employee App uses Firebase Firestore for backend data storage and authentication.

## Configuration Steps

### 1. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing `mimipro-0458`
3. Enable Firestore Database
4. Set Firestore rules (see below)

### 2. Update Firebase Config
Update the Firebase configuration in these files:
- `auth/employee-auth.js`
- `sync/firestore.js`

Replace the placeholder config with your actual Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Firestore Database Structure

The app expects the following Firestore structure:

```
/users
  /{companyUid}
    /employees
      /{employeeDocId}
        - employeeId: "string" (MUST be string type)
        - name: "string"
        - passwordHash: "string" (SHA-256 hash)
        - phone: "string"
        - email: "string"
        - designation: "string"
        - department: "string"
        - salary: number
        - status: "active" | "inactive"
        - joinDate: timestamp
    
    /attendance
      /{attendanceId}
        - employeeId: "string" (MUST be string type)
        - date: "YYYY-MM-DD"
        - checkIn: timestamp
        - checkOut: timestamp
    
    /advances
      /{advanceId}
        - employeeId: "string" (MUST be string type)
        - amount: number
        - date: "YYYY-MM-DD"
        - status: "paid" | "pending"
        - reason: "string"
        - notes: "string"
        - paidDate: "YYYY-MM-DD" (optional)
```

### 4. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow employees to read their own data
    match /users/{companyId}/employees/{employeeId} {
      allow read: if request.auth != null;
    }
    
    match /users/{companyId}/attendance/{attendanceId} {
      allow read: if request.auth != null;
    }
    
    match /users/{companyId}/advances/{advanceId} {
      allow read: if request.auth != null;
    }
    
    // Deny all writes from the employee app
    match /{document=**} {
      allow write: if false;
    }
  }
}
```

**Note:** The employee app is read-only. All write operations should be done through the admin app.

### 5. Company ID Mapping

Update `auth/company-id-map.js` with your company mappings:

```javascript
const companyIdMap = {
    'COMPANY001': 'firebase-uid-for-company-001',
    'COMPANY002': 'firebase-uid-for-company-002'
};
```

### 6. Important Notes

- **Employee ID Type**: MUST be stored as string in Firestore, not number
- **Password Hash**: Use SHA-256 hash (use `password-hash-generator.html`)
- **Date Format**: Use "YYYY-MM-DD" for date fields
- **Timestamps**: Use Firestore Timestamp for datetime fields

### 7. Testing

1. Create a test employee in Firestore
2. Add attendance and advance records
3. Test login with employee credentials
4. Verify data sync

## Troubleshooting

### Login Issues
- Verify Firebase config is correct
- Check company ID mapping
- Ensure password hash matches
- Verify employee status is "active"

### Data Not Syncing
- Check Firestore rules
- Verify employeeId is string type
- Check browser console for errors
- Ensure internet connection

### Common Errors

**"Invalid company ID"**
- Company ID not in mapping
- Update `auth/company-id-map.js`

**"Invalid credentials"**
- Password hash mismatch
- Use password-hash-generator.html to create hash

**"No data found"**
- employeeId type mismatch (string vs number)
- Verify Firestore query filters
