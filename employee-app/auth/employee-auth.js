// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjXGQ8Xh8vN9K5xJYL7pQmR3sT8uVwXyZ",
    authDomain: "mimipro-0458.firebaseapp.com",
    projectId: "mimipro-0458",
    storageBucket: "mimipro-0458.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import { getCompanyUid } from './company-id-map.js';
import { setSession } from './session.js';

/**
 * Hash password using SHA-256
 * @param {string} password 
 * @returns {Promise<string>}
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Login employee with company ID, employee ID, and password
 * @param {string} companyId 
 * @param {string} employeeId 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message?: string, employee?: object}>}
 */
export async function login(companyId, employeeId, password) {
    try {
        // Get full company UID from short code
        const companyUid = getCompanyUid(companyId);
        if (!companyUid) {
            return {
                success: false,
                message: 'Invalid company ID'
            };
        }
        
        // Hash the password
        const passwordHash = await hashPassword(password);
        
        // Query Firestore for employee
        const employeesRef = collection(db, 'users', companyUid, 'employees');
        const q = query(
            employeesRef,
            where('employeeId', '==', employeeId),
            where('passwordHash', '==', passwordHash)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return {
                success: false,
                message: 'Invalid employee ID or password'
            };
        }
        
        // Get employee data
        const employeeDoc = querySnapshot.docs[0];
        const employeeData = employeeDoc.data();
        
        // Check if employee is active
        if (employeeData.status && employeeData.status !== 'active') {
            return {
                success: false,
                message: 'Your account is not active. Contact admin.'
            };
        }
        
        // Store session
        const sessionData = {
            companyId: companyId,
            companyUid: companyUid,
            employeeId: employeeId,
            employeeDocId: employeeDoc.id,
            employeeName: employeeData.name || 'Employee',
            employeeData: employeeData,
            loginTime: new Date().toISOString()
        };
        
        setSession(sessionData);
        
        return {
            success: true,
            employee: sessionData
        };
        
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'An error occurred during login. Please try again.'
        };
    }
}

/**
 * Logout current employee
 */
export function logout() {
    localStorage.removeItem('employeeSession');
    window.location.href = 'index.html';
}
