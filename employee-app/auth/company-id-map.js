/**
 * Maps company short codes to full Firebase UIDs
 * Add your company mappings here
 */
const companyIdMap = {
    'MIMI001': 'company-uid-mimipro-001',
    'MIMI002': 'company-uid-mimipro-002',
    // Add more company mappings as needed
};

/**
 * Get full company UID from short code
 * @param {string} shortCode 
 * @returns {string|null}
 */
export function getCompanyUid(shortCode) {
    return companyIdMap[shortCode.toUpperCase()] || null;
}

/**
 * Add a new company mapping
 * @param {string} shortCode 
 * @param {string} uid 
 */
export function addCompanyMapping(shortCode, uid) {
    companyIdMap[shortCode.toUpperCase()] = uid;
}
