/**
 * Money formatting utilities
 */

/**
 * Format amount with currency symbol (Bangladeshi Taka)
 * @param {number} amount 
 * @returns {string}
 */
export function formatMoney(amount) {
    if (amount === null || amount === undefined) {
        return '৳0';
    }
    
    const num = Number(amount);
    if (isNaN(num)) {
        return '৳0';
    }
    
    // Format with commas for thousands
    const formatted = num.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
    
    return `৳${formatted}`;
}

/**
 * Format amount without currency symbol
 * @param {number} amount 
 * @returns {string}
 */
export function formatAmount(amount) {
    const num = Number(amount);
    if (isNaN(num)) {
        return '0';
    }
    
    return num.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

/**
 * Parse formatted money string to number
 * @param {string} moneyStr 
 * @returns {number}
 */
export function parseMoney(moneyStr) {
    if (!moneyStr) return 0;
    
    // Remove currency symbol and commas
    const cleaned = String(moneyStr).replace(/[৳,]/g, '').trim();
    const num = parseFloat(cleaned);
    
    return isNaN(num) ? 0 : num;
}
