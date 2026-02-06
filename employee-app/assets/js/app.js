/**
 * Main app initialization and setup
 */

import { requireAuth, getSession } from '../../auth/session.js';
import { initRouter } from './router.js';
import { syncData } from '../../sync/sync-download.js';
import { initDB } from '../../db/indexeddb.js';
import { showToast, showLoading, hideLoading } from '../../utils/ui.js';

/**
 * Initialize the app
 */
async function initApp() {
    // Check authentication
    if (!requireAuth()) {
        return;
    }
    
    // Get session data
    const session = getSession();
    
    // Update employee name in drawer
    const employeeNameEl = document.getElementById('employeeName');
    if (employeeNameEl && session.employeeName) {
        employeeNameEl.textContent = session.employeeName;
    }
    
    // Initialize IndexedDB
    await initDB();
    
    // Initialize router
    initRouter();
    
    // Setup drawer
    setupDrawer();
    
    // Setup sync button
    setupSyncButton();
    
    // Perform initial sync
    await performInitialSync();
}

/**
 * Setup drawer open/close functionality
 */
function setupDrawer() {
    const menuBtn = document.getElementById('menuBtn');
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if (!menuBtn || !drawer || !overlay) {
        return;
    }
    
    // Open drawer
    menuBtn.addEventListener('click', () => {
        drawer.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close drawer when clicking overlay
    overlay.addEventListener('click', () => {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close drawer when clicking a menu item
    const drawerItems = drawer.querySelectorAll('.drawer-item');
    drawerItems.forEach(item => {
        item.addEventListener('click', () => {
            drawer.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Setup sync button
 */
function setupSyncButton() {
    const syncBtn = document.getElementById('syncBtn');
    
    if (!syncBtn) {
        return;
    }
    
    syncBtn.addEventListener('click', async () => {
        await performSync(true);
    });
}

/**
 * Perform initial sync on app load
 */
async function performInitialSync() {
    try {
        showLoading('Loading data...');
        
        const result = await syncData();
        
        if (result.success) {
            console.log('Initial sync completed');
        } else {
            console.warn('Initial sync failed:', result.message);
            showToast('Failed to load latest data. Using cached data.', 'warning');
        }
    } catch (error) {
        console.error('Initial sync error:', error);
        showToast('Failed to load data', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Perform manual sync
 * @param {boolean} showFeedback 
 */
async function performSync(showFeedback = false) {
    const syncBtn = document.getElementById('syncBtn');
    
    try {
        if (syncBtn) {
            syncBtn.disabled = true;
            syncBtn.querySelector('.sync-icon').style.animation = 'spin 1s linear infinite';
        }
        
        if (showFeedback) {
            showLoading('Syncing data...');
        }
        
        const result = await syncData();
        
        if (result.success) {
            if (showFeedback) {
                showToast('Data synced successfully', 'success');
            }
            
            // Reload current page to show updated data
            const currentHash = window.location.hash;
            window.location.hash = '';
            setTimeout(() => {
                window.location.hash = currentHash || '#dashboard';
            }, 10);
        } else {
            if (showFeedback) {
                showToast(result.message || 'Sync failed', 'error');
            }
        }
    } catch (error) {
        console.error('Sync error:', error);
        if (showFeedback) {
            showToast('Sync failed', 'error');
        }
    } finally {
        if (syncBtn) {
            syncBtn.disabled = false;
            syncBtn.querySelector('.sync-icon').style.animation = '';
        }
        
        if (showFeedback) {
            hideLoading();
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
