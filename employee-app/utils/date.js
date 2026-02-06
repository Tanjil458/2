/**
 * Date utility functions
 */

/**
 * Format date to YYYY-MM-DD
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDateISO(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Format date to DD/MM/YYYY
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDateDisplay(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

/**
 * Convert DD/MM/YYYY to YYYY-MM-DD
 * @param {string} displayDate 
 * @returns {string}
 */
export function displayToISO(displayDate) {
    const [day, month, year] = displayDate.split('/');
    return `${year}-${month}-${day}`;
}

/**
 * Get month name from date
 * @param {Date|string} date 
 * @returns {string}
 */
export function getMonthName(date) {
    const d = new Date(date);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[d.getMonth()];
}

/**
 * Get short month name
 * @param {Date|string} date 
 * @returns {string}
 */
export function getShortMonthName(date) {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()];
}

/**
 * Get days in month
 * @param {number} year 
 * @param {number} month (0-11)
 * @returns {number}
 */
export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Get first day of month (0 = Sunday, 6 = Saturday)
 * @param {number} year 
 * @param {number} month (0-11)
 * @returns {number}
 */
export function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

/**
 * Get current year and month
 * @returns {{year: number, month: number}}
 */
export function getCurrentYearMonth() {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth()
    };
}

/**
 * Format time to HH:MM AM/PM
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatTime(date) {
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

/**
 * Format datetime to readable string
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDateTime(date) {
    return `${formatDateDisplay(date)} ${formatTime(date)}`;
}

/**
 * Check if date is today
 * @param {Date|string} date 
 * @returns {boolean}
 */
export function isToday(date) {
    const d = new Date(date);
    const today = new Date();
    return formatDateISO(d) === formatDateISO(today);
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {Date|string} date 
 * @returns {string}
 */
export function getRelativeTime(date) {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return formatDateDisplay(date);
}
