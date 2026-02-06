import { fetchAttendance, fetchAdvances, fetchEmployeeProfile } from './firestore.js';
import { clearStore, putRecords, putRecord } from '../db/indexeddb.js';
import { getSession } from '../auth/session.js';

/**
 * Perform full data sync from Firestore to IndexedDB
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function syncData() {
    try {
        const session = getSession();
        
        if (!session || !session.companyUid || !session.employeeId) {
            throw new Error('No valid session found');
        }
        
        const { companyUid, employeeId } = session;
        
        // Clear existing local data
        await clearStore('attendance');
        await clearStore('advances');
        
        // Fetch fresh data from Firestore
        const [attendance, advances, profile] = await Promise.all([
            fetchAttendance(companyUid, employeeId),
            fetchAdvances(companyUid, employeeId),
            fetchEmployeeProfile(companyUid, employeeId)
        ]);
        
        // Store in IndexedDB
        if (attendance.length > 0) {
            await putRecords('attendance', attendance);
        }
        
        if (advances.length > 0) {
            await putRecords('advances', advances);
        }
        
        if (profile) {
            await putRecord('profile', profile);
        }
        
        // Store sync timestamp
        await putRecord('meta', {
            key: 'lastSync',
            timestamp: new Date().toISOString()
        });
        
        return {
            success: true,
            stats: {
                attendance: attendance.length,
                advances: advances.length
            }
        };
        
    } catch (error) {
        console.error('Sync error:', error);
        return {
            success: false,
            message: error.message || 'Sync failed'
        };
    }
}

/**
 * Get last sync timestamp
 * @returns {Promise<string|null>}
 */
export async function getLastSyncTime() {
    try {
        const { getRecord } = await import('../db/indexeddb.js');
        const meta = await getRecord('meta', 'lastSync');
        return meta ? meta.timestamp : null;
    } catch (error) {
        console.error('Error getting last sync time:', error);
        return null;
    }
}
