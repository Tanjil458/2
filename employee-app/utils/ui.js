/**
 * UI utility functions for toast, loading, dialogs, etc.
 */

/**
 * Show toast notification
 * @param {string} message 
 * @param {string} type - 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in ms (default: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.warn('Toast container not found');
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, duration);
}

/**
 * Show loading overlay
 * @param {string} message - Optional loading message
 */
export function showLoading(message = '') {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        console.warn('Loading overlay not found');
        return;
    }
    
    overlay.style.display = 'flex';
    
    if (message) {
        const existingMsg = overlay.querySelector('.loading-message');
        if (existingMsg) {
            existingMsg.textContent = message;
        } else {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'loading-message';
            msgDiv.textContent = message;
            overlay.appendChild(msgDiv);
        }
    }
}

/**
 * Hide loading overlay
 */
export function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/**
 * Show confirmation dialog
 * @param {string} message 
 * @param {string} confirmText 
 * @param {string} cancelText 
 * @returns {Promise<boolean>}
 */
export function showConfirm(message, confirmText = 'Confirm', cancelText = 'Cancel') {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'dialog-message';
        messageDiv.textContent = message;
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'dialog-buttons';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'dialog-btn dialog-btn-cancel';
        cancelBtn.textContent = cancelText;
        cancelBtn.onclick = () => {
            document.body.removeChild(overlay);
            resolve(false);
        };
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'dialog-btn dialog-btn-confirm';
        confirmBtn.textContent = confirmText;
        confirmBtn.onclick = () => {
            document.body.removeChild(overlay);
            resolve(true);
        };
        
        buttonsDiv.appendChild(cancelBtn);
        buttonsDiv.appendChild(confirmBtn);
        
        dialog.appendChild(messageDiv);
        dialog.appendChild(buttonsDiv);
        overlay.appendChild(dialog);
        
        document.body.appendChild(overlay);
    });
}

/**
 * Show alert dialog
 * @param {string} message 
 * @param {string} buttonText 
 * @returns {Promise<void>}
 */
export function showAlert(message, buttonText = 'OK') {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'dialog-message';
        messageDiv.textContent = message;
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'dialog-buttons';
        
        const okBtn = document.createElement('button');
        okBtn.className = 'dialog-btn dialog-btn-confirm';
        okBtn.textContent = buttonText;
        okBtn.onclick = () => {
            document.body.removeChild(overlay);
            resolve();
        };
        
        buttonsDiv.appendChild(okBtn);
        
        dialog.appendChild(messageDiv);
        dialog.appendChild(buttonsDiv);
        overlay.appendChild(dialog);
        
        document.body.appendChild(overlay);
    });
}

/**
 * Debounce function
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
