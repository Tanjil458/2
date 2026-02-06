/**
 * Hash-based router for single-page navigation
 */

import { DashboardPage } from '../pages/dashboard/dashboard.js';
import { AttendancePage } from '../pages/attendance/attendance.js';
import { AdvancesPage } from '../pages/advances/advances.js';
import { ProfilePage } from '../pages/profile/profile.js';

const routes = {
    'dashboard': DashboardPage,
    'attendance': AttendancePage,
    'advances': AdvancesPage,
    'profile': ProfilePage
};

let currentPage = null;

/**
 * Navigate to a route
 * @param {string} route 
 */
export function navigateTo(route) {
    // Remove leading # if present
    route = route.replace(/^#/, '');
    
    // Default to dashboard
    if (!route || !routes[route]) {
        route = 'dashboard';
    }
    
    // Update URL hash
    window.location.hash = route;
    
    // Load page
    loadPage(route);
}

/**
 * Load page content
 * @param {string} route 
 */
function loadPage(route) {
    const PageClass = routes[route];
    
    if (!PageClass) {
        console.error('Page not found:', route);
        return;
    }
    
    // Clean up previous page
    if (currentPage && typeof currentPage.cleanup === 'function') {
        currentPage.cleanup();
    }
    
    // Create new page instance
    currentPage = new PageClass();
    
    // Get content container
    const contentContainer = document.getElementById('pageContent');
    
    if (!contentContainer) {
        console.error('Content container not found');
        return;
    }
    
    // Clear previous content
    contentContainer.innerHTML = '';
    
    // Render page
    if (typeof currentPage.render === 'function') {
        const content = currentPage.render();
        contentContainer.innerHTML = content;
    }
    
    // Attach event listeners
    if (typeof currentPage.attachEventListeners === 'function') {
        currentPage.attachEventListeners();
    }
    
    // Update page title
    updatePageTitle(route);
    
    // Update navigation active states
    updateNavigationState(route);
}

/**
 * Update page title in app bar
 * @param {string} route 
 */
function updatePageTitle(route) {
    const titles = {
        'dashboard': 'Dashboard',
        'attendance': 'Attendance',
        'advances': 'Advances',
        'profile': 'Profile'
    };
    
    const titleElement = document.getElementById('pageTitle');
    if (titleElement) {
        titleElement.textContent = titles[route] || 'MimiPro';
    }
}

/**
 * Update active state of navigation items
 * @param {string} route 
 */
function updateNavigationState(route) {
    // Update bottom navigation
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    bottomNavItems.forEach(item => {
        const itemRoute = item.getAttribute('href').replace('#', '');
        if (itemRoute === route) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update drawer navigation
    const drawerItems = document.querySelectorAll('.drawer .drawer-item');
    drawerItems.forEach(item => {
        const itemRoute = item.getAttribute('href').replace('#', '');
        if (itemRoute === route) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Initialize router
 */
export function initRouter() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
        const route = window.location.hash.replace('#', '');
        navigateTo(route);
    });
    
    // Load initial route
    const initialRoute = window.location.hash.replace('#', '') || 'dashboard';
    navigateTo(initialRoute);
}

/**
 * Get current route
 * @returns {string}
 */
export function getCurrentRoute() {
    return window.location.hash.replace('#', '') || 'dashboard';
}
