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

/**
 * Fetch attendance records for an employee
 * @param {string} companyUid 
 * @param {string} employeeId 
 * @returns {Promise<Array>}
 */
export async function fetchAttendance(companyUid, employeeId) {
    try {
        const attendanceRef = collection(db, 'users', companyUid, 'attendance');
        const q = query(attendanceRef, where('employeeId', '==', String(employeeId)));
        
        const querySnapshot = await getDocs(q);
        const records = [];
        
        querySnapshot.forEach((doc) => {
            records.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return records;
    } catch (error) {
        console.error('Error fetching attendance:', error);
        throw error;
    }
}

/**
 * Fetch advance records for an employee
 * @param {string} companyUid 
 * @param {string} employeeId 
 * @returns {Promise<Array>}
 */
export async function fetchAdvances(companyUid, employeeId) {
    try {
        const advancesRef = collection(db, 'users', companyUid, 'advances');
        const q = query(advancesRef, where('employeeId', '==', String(employeeId)));
        
        const querySnapshot = await getDocs(q);
        const records = [];
        
        querySnapshot.forEach((doc) => {
            records.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return records;
    } catch (error) {
        console.error('Error fetching advances:', error);
        throw error;
    }
}

/**
 * Fetch employee profile data
 * @param {string} companyUid 
 * @param {string} employeeId 
 * @returns {Promise<object|null>}
 */
export async function fetchEmployeeProfile(companyUid, employeeId) {
    try {
        const employeesRef = collection(db, 'users', companyUid, 'employees');
        const q = query(employeesRef, where('employeeId', '==', String(employeeId)));
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                employeeId: employeeId,
                ...doc.data()
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching employee profile:', error);
        throw error;
    }
}
