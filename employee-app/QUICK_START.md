# Quick Start Guide - MimiPro Employee App

## Introduction
MimiPro Employee App is a single-page web application that allows employees to view their attendance records, salary advances, and profile information.

## Features
- ✅ Secure login with Company ID, Employee ID, and Password
- 📊 Dashboard with monthly attendance and advance summaries
- 📅 Monthly calendar view of attendance
- 💰 Salary advance history with status tracking
- 👤 Employee profile information
- 🔄 Offline-capable with IndexedDB caching
- 📱 Responsive design for mobile and desktop

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Active internet connection for first sync
- Valid employee credentials from admin

### Installation

#### Option 1: Direct File Access
1. Download all files to a folder
2. Open `index.html` in a web browser
3. Login with your credentials

#### Option 2: Web Server (Recommended)
1. Serve the `employee-app` folder using any web server
2. Examples:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js (http-server)
   npx http-server -p 8000
   
   # PHP
   php -S localhost:8000
   ```
3. Navigate to `http://localhost:8000`

### First Login

1. **Get Credentials**
   - Company ID (e.g., "MIMI001")
   - Employee ID (your unique ID)
   - Password (provided by admin)

2. **Login**
   - Open the app
   - Enter your Company ID
   - Enter your Employee ID
   - Enter your Password
   - Click "Login"

3. **Initial Sync**
   - App will download your data from Firestore
   - Data is cached locally for offline access
   - You'll be redirected to the Dashboard

### Using the App

#### Dashboard
- View current month attendance summary
- See total advances (paid and pending)
- Quick access to recent records
- Last sync timestamp

#### Attendance
- Monthly calendar view
- Green dots indicate present days
- Navigate between months
- View detailed check-in/out times

#### Advances
- View all salary advances
- See payment status (Paid/Pending)
- Track total amounts
- View reasons and notes

#### Profile
- View your personal information
- See employment details
- App version and company info
- Logout option

### Syncing Data

**Automatic Sync**
- Happens on login
- Downloads latest data

**Manual Sync**
- Click the sync button (↻) in top right
- Refreshes all data from server
- Updates current page

### Offline Usage
- App works offline after first sync
- All data is cached in IndexedDB
- Sync when online to get latest updates
- Login requires internet connection

## Configuration

### For IT Administrators

1. **Firebase Setup**
   - Follow `FIREBASE_CONFIG.md` for detailed steps
   - Configure Firestore database
   - Set security rules

2. **Company Mapping**
   - Edit `auth/company-id-map.js`
   - Add company ID to Firebase UID mappings

3. **Employee Setup**
   - Create employee records in Firestore
   - Generate password hash using `password-hash-generator.html`
   - Ensure employeeId is stored as string type

## Troubleshooting

### Cannot Login
**Solution:**
- Verify credentials are correct
- Check internet connection
- Ensure Firebase is configured
- Contact admin if issue persists

### No Data Showing
**Solution:**
- Click sync button to refresh
- Check if admin has added your records
- Verify employeeId matches in Firestore
- Clear browser cache and re-login

### Sync Fails
**Solution:**
- Check internet connection
- Verify Firestore is accessible
- Check browser console for errors
- Try logging out and back in

### App Not Loading
**Solution:**
- Use modern browser (latest Chrome/Firefox)
- Enable JavaScript
- Clear browser cache
- Check if files are served correctly

## Security

### Best Practices
- Never share your login credentials
- Logout when using shared computers
- Keep your password secure
- Report any suspicious activity to admin

### Data Privacy
- All data is encrypted in transit (HTTPS)
- Local data is stored securely in browser
- No data is sent to third parties
- Only you can view your information

## Support

### Getting Help
1. Check this guide first
2. Review `FIREBASE_CONFIG.md` for technical details
3. Contact your system administrator
4. Check browser console for error messages

### Reporting Issues
When reporting problems, provide:
- Browser name and version
- Error message (if any)
- Steps to reproduce
- Screenshot (if applicable)

## Updates

### Checking Version
- Go to Profile page
- Version shown under "App Information"
- Current version: 1.0.0

### Updating the App
- Admin will notify you of updates
- Simply refresh the browser
- Clear cache if needed
- Re-login to ensure proper sync

## Tips & Tricks

### Faster Navigation
- Use bottom navigation for quick page switching
- Swipe to open side drawer (mobile)
- Use back button to return to dashboard

### Data Management
- Sync regularly to see latest updates
- Check "Last synced" timestamp on dashboard
- Sync before viewing important data

### Mobile Usage
- Add to home screen for app-like experience
- Works offline after initial sync
- Optimized for touch interactions

## FAQ

**Q: Can I change my password?**
A: No, contact your admin to change password.

**Q: Can I edit my attendance?**
A: No, this is a view-only app. Contact admin for changes.

**Q: How often should I sync?**
A: Sync at least once daily or whenever you need latest data.

**Q: Is my data safe?**
A: Yes, all data is encrypted and securely stored.

**Q: Can I use this on multiple devices?**
A: Yes, login on any device with your credentials.

**Q: What if I forget my password?**
A: Contact your admin to reset your password.

## Developer Notes

### Tech Stack
- Vanilla JavaScript (ES6 modules)
- Firebase Firestore
- IndexedDB
- CSS3
- HTML5

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### File Structure
```
employee-app/
├── index.html              # Login page
├── home.html              # Main app shell
├── auth/                  # Authentication
├── sync/                  # Data sync
├── db/                    # IndexedDB
├── pages/                 # Feature pages
├── assets/                # CSS and JS
├── utils/                 # Helper functions
└── docs/                  # Documentation
```

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**License:** Proprietary
