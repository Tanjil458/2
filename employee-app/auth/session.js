/**
 * Set employee session in localStorage
 * @param {object} sessionData 
 */
export function setSession(sessionData) {
    localStorage.setItem('employeeSession', JSON.stringify(sessionData));
}

/**
 * Get current employee session
 * @returns {object|null}
 */
export function getSession() {
    const sessionStr = localStorage.getItem('employeeSession');
    if (!sessionStr) return null;
    
    try {
        return JSON.parse(sessionStr);
    } catch (error) {
        console.error('Error parsing session:', error);
        return null;
    }
}

/**
 * Clear current session
 */
export function clearSession() {
    localStorage.removeItem('employeeSession');
}

/**
 * Check if user is authenticated and redirect if not
 * Call this function on protected pages
 */
export function requireAuth() {
    const session = getSession();
    
    if (!session || !session.employeeId) {
        // Not logged in, redirect to login page
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

/**
 * Check if session is valid (not expired)
 * @param {number} maxAgeHours - Maximum session age in hours (default: 24)
 * @returns {boolean}
 */
export function isSessionValid(maxAgeHours = 24) {
    const session = getSession();
    
    if (!session || !session.loginTime) {
        return false;
    }
    
    const loginTime = new Date(session.loginTime);
    const now = new Date();
    const ageHours = (now - loginTime) / (1000 * 60 * 60);
    
    return ageHours < maxAgeHours;
}
