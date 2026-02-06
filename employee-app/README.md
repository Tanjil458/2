# MimiPro Employee Portal

A modern, single-page web application for employees to view their attendance, salary advances, and profile information.

## 🌟 Features

- **Secure Authentication**: Three-credential login (Company ID, Employee ID, Password)
- **Dashboard**: Monthly attendance and advance summaries at a glance
- **Attendance Tracking**: Interactive calendar view with detailed check-in/out times
- **Salary Advances**: Complete history of advances with payment status
- **Profile Management**: View personal and employment information
- **Offline Support**: IndexedDB caching for offline data access
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Sync**: Manual and automatic data synchronization

## 📋 Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Internet connection for initial setup and sync
- Valid employee credentials from administrator

## 🚀 Quick Start

### For Employees

1. **Access the App**
   - Open `employee-app/index.html` in your browser
   - Or visit the deployed URL provided by your admin

2. **Login**
   - Enter your Company ID (e.g., "MIMI001")
   - Enter your Employee ID
   - Enter your Password
   - Click "Login"

3. **Explore**
   - Dashboard: See your monthly stats
   - Attendance: View your attendance calendar
   - Advances: Check your salary advances
   - Profile: View your information

### For Administrators

1. **Configure Firebase**
   - See `FIREBASE_CONFIG.md` for detailed instructions
   - Set up Firestore database
   - Configure security rules

2. **Deploy the App**
   - Serve the `employee-app` folder via web server
   - Or deploy to hosting service (Firebase Hosting, Netlify, etc.)

3. **Setup Employees**
   - Create employee records in Firestore
   - Use `password-hash-generator.html` to generate password hashes
   - Provide credentials to employees

## 📂 Project Structure

```
employee-app/
├── index.html                          # Login page
├── home.html                           # Main app shell
├── auth/                               # Authentication module
│   ├── employee-auth.js               # Login logic
│   ├── company-id-map.js              # Company ID mappings
│   └── session.js                     # Session management
├── sync/                               # Data synchronization
│   ├── firestore.js                   # Firestore queries
│   └── sync-download.js               # Sync orchestration
├── db/                                 # Local database
│   └── indexeddb.js                   # IndexedDB wrapper
├── pages/                              # Feature pages
│   ├── dashboard/
│   │   └── dashboard.js               # Dashboard page
│   ├── attendance/
│   │   └── attendance.js              # Attendance calendar
│   ├── advances/
│   │   └── advances.js                # Advances history
│   └── profile/
│       └── profile.js                 # Profile page
├── assets/                             # Static assets
│   ├── css/
│   │   ├── base.css                   # Base styles
│   │   ├── components.css             # Component styles
│   │   ├── layout.css                 # Layout styles
│   │   └── login.css                  # Login page styles
│   └── js/
│       ├── app.js                     # App initialization
│       └── router.js                  # Page routing
├── utils/                              # Utility functions
│   ├── date.js                        # Date formatting
│   ├── money.js                       # Currency formatting
│   └── ui.js                          # UI helpers
├── password-hash-generator.html        # Password hash tool
├── FIREBASE_CONFIG.md                  # Firebase setup guide
├── QUICK_START.md                      # User guide
└── README.md                           # This file
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project
2. Enable Firestore Database
3. Update configuration in:
   - `auth/employee-auth.js`
   - `sync/firestore.js`

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

### Company Mapping

Update `auth/company-id-map.js`:

```javascript
const companyIdMap = {
    'COMPANY001': 'firebase-uid-for-company-001',
    'COMPANY002': 'firebase-uid-for-company-002'
};
```

## 🗄️ Database Structure

### Firestore Collections

```
/users/{companyUid}/employees/{employeeId}
/users/{companyUid}/attendance/{attendanceId}
/users/{companyUid}/advances/{advanceId}
```

### IndexedDB Stores

- `attendance` - Cached attendance records
- `advances` - Cached advance records
- `profile` - Employee profile data
- `meta` - App metadata (sync timestamp)

## 🔐 Security

- **Authentication**: SHA-256 password hashing
- **Authorization**: Read-only access to own data
- **Data Transfer**: HTTPS encryption
- **Local Storage**: Browser-based secure storage
- **Session Management**: Automatic timeout

## 🎨 Design

- **UI Framework**: Custom CSS with Material Design principles
- **Color Scheme**: Blue primary, responsive color palette
- **Typography**: System fonts for optimal performance
- **Icons**: Emoji-based for zero dependencies
- **Layout**: Mobile-first responsive design

## 📱 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

## 🛠️ Development

### Local Development

```bash
# Start a local server (choose one)

# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Navigate to `http://localhost:8000/employee-app/`

### Testing

1. Create test employee in Firestore
2. Add test attendance and advance records
3. Generate password hash using tool
4. Test login and data sync
5. Test offline functionality

## 📖 Documentation

- **User Guide**: See `QUICK_START.md`
- **Firebase Setup**: See `FIREBASE_CONFIG.md`
- **API Documentation**: See inline code comments

## 🐛 Troubleshooting

### Common Issues

**Login Failed**
- Verify credentials
- Check Firebase configuration
- Ensure company ID mapping exists

**No Data Displayed**
- Click sync button
- Check Firestore records
- Verify employeeId type (must be string)

**Sync Errors**
- Check internet connection
- Verify Firestore rules
- Check browser console

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For support, contact your system administrator or IT department.

## 🔄 Version History

### v1.0.0 (February 2026)
- Initial release
- Employee authentication
- Dashboard with statistics
- Attendance calendar view
- Advances tracking
- Profile management
- Offline support with IndexedDB
- Manual and auto sync

## 🙏 Acknowledgments

Built with:
- Firebase Firestore
- IndexedDB API
- Vanilla JavaScript (ES6+)
- CSS3
- HTML5

---

**Made with ❤️ for MimiPro**
