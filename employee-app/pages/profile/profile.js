/**
 * Profile page - Employee information and settings
 */

import { getAllRecords } from '../../db/indexeddb.js';
import { getSession } from '../../auth/session.js';
import { logout } from '../../auth/employee-auth.js';
import { showConfirm } from '../../utils/ui.js';

export class ProfilePage {
    constructor() {
        this.profile = null;
        this.session = null;
    }
    
    async loadData() {
        try {
            this.session = getSession();
            const profiles = await getAllRecords('profile');
            this.profile = profiles.length > 0 ? profiles[0] : null;
            
            // If no profile in IndexedDB, use session data
            if (!this.profile && this.session) {
                this.profile = this.session.employeeData || {};
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }
    
    render() {
        const employeeName = this.profile?.name || this.session?.employeeName || 'Employee';
        const employeeId = this.profile?.employeeId || this.session?.employeeId || 'N/A';
        const phone = this.profile?.phone || 'N/A';
        const email = this.profile?.email || 'N/A';
        const designation = this.profile?.designation || 'N/A';
        const department = this.profile?.department || 'N/A';
        const joinDate = this.profile?.joinDate ? new Date(this.profile.joinDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
        const salary = this.profile?.salary ? `৳${Number(this.profile.salary).toLocaleString('en-IN')}` : 'N/A';
        const status = this.profile?.status || 'active';
        
        return `
            <div class="profile-page">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <span class="avatar-text">${employeeName.charAt(0).toUpperCase()}</span>
                    </div>
                    <h2 class="profile-name">${employeeName}</h2>
                    <p class="profile-id">ID: ${employeeId}</p>
                    <div class="profile-status ${status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${status === 'active' ? '● Active' : '● Inactive'}
                    </div>
                </div>
                
                <div class="section">
                    <h3 class="section-title">Personal Information</h3>
                    <div class="info-list">
                        <div class="info-item">
                            <span class="info-label">📧 Email</span>
                            <span class="info-value">${email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">📱 Phone</span>
                            <span class="info-value">${phone}</span>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h3 class="section-title">Employment Details</h3>
                    <div class="info-list">
                        <div class="info-item">
                            <span class="info-label">💼 Designation</span>
                            <span class="info-value">${designation}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">🏢 Department</span>
                            <span class="info-value">${department}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">📅 Join Date</span>
                            <span class="info-value">${joinDate}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">💰 Monthly Salary</span>
                            <span class="info-value">${salary}</span>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h3 class="section-title">App Information</h3>
                    <div class="info-list">
                        <div class="info-item">
                            <span class="info-label">Version</span>
                            <span class="info-value">1.0.0</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Company</span>
                            <span class="info-value">${this.session?.companyId || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <button class="btn-logout" id="logoutBtn">
                        <span class="btn-icon">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
                
                <div class="profile-footer">
                    <p>For any changes to your profile, please contact your administrator.</p>
                </div>
            </div>
        `;
    }
    
    async attachEventListeners() {
        // Load data
        await this.loadData();
        
        // Re-render with data
        const container = document.getElementById('pageContent');
        if (container) {
            container.innerHTML = this.render();
            this.attachLogoutListener();
        }
    }
    
    attachLogoutListener() {
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                const confirmed = await showConfirm(
                    'Are you sure you want to logout?',
                    'Logout',
                    'Cancel'
                );
                
                if (confirmed) {
                    logout();
                }
            });
        }
    }
    
    cleanup() {
        // Cleanup if needed
    }
}
