/**
 * Dashboard page - Shows summary of attendance and advances
 */

import { getAllRecords, getRecord } from '../../db/indexeddb.js';
import { formatDateDisplay, getMonthName, getCurrentYearMonth } from '../../utils/date.js';
import { formatMoney } from '../../utils/money.js';
import { getLastSyncTime } from '../../sync/sync-download.js';
import { getRelativeTime } from '../../utils/date.js';

export class DashboardPage {
    constructor() {
        this.data = {
            attendance: [],
            advances: [],
            profile: null,
            lastSync: null
        };
    }
    
    async loadData() {
        try {
            const [attendance, advances, profile, lastSyncMeta] = await Promise.all([
                getAllRecords('attendance'),
                getAllRecords('advances'),
                getAllRecords('profile').then(profiles => profiles[0] || null),
                getRecord('meta', 'lastSync')
            ]);
            
            this.data.attendance = attendance;
            this.data.advances = advances;
            this.data.profile = profile;
            this.data.lastSync = lastSyncMeta ? lastSyncMeta.timestamp : null;
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    
    calculateStats() {
        const { year, month } = getCurrentYearMonth();
        
        // Filter current month attendance
        const currentMonthAttendance = this.data.attendance.filter(record => {
            if (!record.date) return false;
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === year && recordDate.getMonth() === month;
        });
        
        const daysPresent = currentMonthAttendance.length;
        
        // Calculate advances
        const totalAdvances = this.data.advances.reduce((sum, adv) => sum + (Number(adv.amount) || 0), 0);
        const paidAdvances = this.data.advances
            .filter(adv => adv.status === 'paid')
            .reduce((sum, adv) => sum + (Number(adv.amount) || 0), 0);
        const pendingAdvances = this.data.advances
            .filter(adv => adv.status === 'pending')
            .reduce((sum, adv) => sum + (Number(adv.amount) || 0), 0);
        
        return {
            daysPresent,
            totalAdvances,
            paidAdvances,
            pendingAdvances
        };
    }
    
    render() {
        const stats = this.calculateStats();
        const { year, month } = getCurrentYearMonth();
        const monthName = getMonthName(new Date(year, month));
        
        // Get last 5 attendance records
        const recentAttendance = [...this.data.attendance]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        // Get last 5 advances
        const recentAdvances = [...this.data.advances]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        const lastSyncText = this.data.lastSync 
            ? getRelativeTime(this.data.lastSync)
            : 'Never';
        
        return `
            <div class="dashboard-page">
                <div class="sync-info">
                    <small>Last synced: ${lastSyncText}</small>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📅</div>
                        <div class="stat-value">${stats.daysPresent}</div>
                        <div class="stat-label">Days Present (${monthName})</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value">${formatMoney(stats.totalAdvances)}</div>
                        <div class="stat-label">Total Advances</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-value">${formatMoney(stats.paidAdvances)}</div>
                        <div class="stat-label">Paid Advances</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">⏳</div>
                        <div class="stat-value">${formatMoney(stats.pendingAdvances)}</div>
                        <div class="stat-label">Pending Advances</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Recent Attendance</h2>
                    ${recentAttendance.length > 0 ? `
                        <div class="list">
                            ${recentAttendance.map(record => `
                                <div class="list-item">
                                    <div class="list-item-icon">📅</div>
                                    <div class="list-item-content">
                                        <div class="list-item-title">${formatDateDisplay(record.date)}</div>
                                        <div class="list-item-subtitle">
                                            ${record.checkIn ? 'In: ' + new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                                            ${record.checkOut ? ' • Out: ' + new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </div>
                                    </div>
                                    <div class="list-item-badge success">Present</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="empty-state">
                            <p>No attendance records yet</p>
                        </div>
                    `}
                </div>
                
                <div class="section">
                    <h2 class="section-title">Recent Advances</h2>
                    ${recentAdvances.length > 0 ? `
                        <div class="list">
                            ${recentAdvances.map(record => `
                                <div class="list-item">
                                    <div class="list-item-icon">💰</div>
                                    <div class="list-item-content">
                                        <div class="list-item-title">${formatMoney(record.amount)}</div>
                                        <div class="list-item-subtitle">${formatDateDisplay(record.date)}</div>
                                    </div>
                                    <div class="list-item-badge ${record.status === 'paid' ? 'success' : 'warning'}">
                                        ${record.status === 'paid' ? 'Paid' : 'Pending'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="empty-state">
                            <p>No advance records yet</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }
    
    async attachEventListeners() {
        // Load data when page is attached
        await this.loadData();
        
        // Re-render with data
        const container = document.getElementById('pageContent');
        if (container) {
            container.innerHTML = this.render();
        }
    }
    
    cleanup() {
        // Cleanup if needed
    }
}
