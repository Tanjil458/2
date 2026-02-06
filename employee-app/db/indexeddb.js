/**
 * IndexedDB wrapper for employee app local storage
 */

const DB_NAME = 'MimiProEmployeeDB';
const DB_VERSION = 1;

let db = null;

/**
 * Initialize IndexedDB
 * @returns {Promise<IDBDatabase>}
 */
export async function initDB() {
    if (db) return db;
    
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            reject(new Error('Failed to open IndexedDB'));
        };
        
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            // Create object stores
            if (!database.objectStoreNames.contains('attendance')) {
                const attendanceStore = database.createObjectStore('attendance', { keyPath: 'id' });
                attendanceStore.createIndex('date', 'date', { unique: false });
                attendanceStore.createIndex('employeeId', 'employeeId', { unique: false });
            }
            
            if (!database.objectStoreNames.contains('advances')) {
                const advancesStore = database.createObjectStore('advances', { keyPath: 'id' });
                advancesStore.createIndex('date', 'date', { unique: false });
                advancesStore.createIndex('employeeId', 'employeeId', { unique: false });
                advancesStore.createIndex('status', 'status', { unique: false });
            }
            
            if (!database.objectStoreNames.contains('profile')) {
                database.createObjectStore('profile', { keyPath: 'employeeId' });
            }
            
            if (!database.objectStoreNames.contains('meta')) {
                database.createObjectStore('meta', { keyPath: 'key' });
            }
        };
    });
}

/**
 * Get all records from a store
 * @param {string} storeName 
 * @returns {Promise<Array>}
 */
export async function getAllRecords(storeName) {
    await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get a single record by key
 * @param {string} storeName 
 * @param {any} key 
 * @returns {Promise<any>}
 */
export async function getRecord(storeName, key) {
    await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add or update a record
 * @param {string} storeName 
 * @param {any} data 
 * @returns {Promise<any>}
 */
export async function putRecord(storeName, data) {
    await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add multiple records
 * @param {string} storeName 
 * @param {Array} dataArray 
 * @returns {Promise<void>}
 */
export async function putRecords(storeName, dataArray) {
    await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        dataArray.forEach(data => store.put(data));
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

/**
 * Clear all records from a store
 * @param {string} storeName 
 * @returns {Promise<void>}
 */
export async function clearStore(storeName) {
    await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Delete a specific record
 * @param {string} storeName 
 * @param {any} key 
 * @returns {Promise<void>}
 */
export async function deleteRecord(storeName, key) {
    await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get records by index
 * @param {string} storeName 
 * @param {string} indexName 
 * @param {any} value 
 * @returns {Promise<Array>}
 */
export async function getByIndex(storeName, indexName, value) {
    await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}
