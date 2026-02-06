/**
 * Advances page - View advance/salary history
 */

import { getAllRecords } from '../../db/indexeddb.js';
import { formatDateDisplay } from '../../utils/date.js';
import { formatMoney } from '../../utils/money.js';

export class AdvancesPage {
    constructor() {
        this.advances = [];
    }
    
    async loadData() {
        try {
            this.advances = await getAllRecords('advances');
            
            // Sort by date (newest first)
            this.advances.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Error loading advances:', error);
        }
    }
    
    calculateTotals() {
        const total = this.advances.reduce((sum, adv) => sum + (Number(adv.amount) || 0), 0);
        const paid = this.advances
            .filter(adv => adv.status === 'paid')
            .reduce((sum, adv) => sum + (Number(adv.amount) || 0), 0);
        const pending = this.advances
            .filter(adv => adv.status === 'pending')
            .reduce((sum, adv) => sum + (Number(adv.amount) || 0), 0);
        
        return { total, paid, pending };
    }
    
    render() {
        const totals = this.calculateTotals();
        
        return `
            <div class="advances-page">
                <div class="totals-section">
                    <div class="total-card">
                        <div class="total-label">Total Advances</div>
                        <div class="total-value">${formatMoney(totals.total)}</div>
                    </div>
                    <div class="total-card">
                        <div class="total-label">Paid</div>
                        <div class="total-value success-text">${formatMoney(totals.paid)}</div>
                    </div>
                    <div class="total-card">
                        <div class="total-label">Pending</div>
                        <div class="total-value warning-text">${formatMoney(totals.pending)}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Advance History</h2>
                    ${this.advances.length > 0 ? `
                        <div class="advances-list">
                            ${this.advances.map(record => `
                                <div class="advance-item">
                                    <div class="advance-header">
                                        <div class="advance-amount">${formatMoney(record.amount)}</div>
                                        <div class="advance-badge ${record.status === 'paid' ? 'badge-success' : 'badge-warning'}">
                                            ${record.status === 'paid' ? 'Paid' : 'Pending'}
                                        </div>
                                    </div>
                                    <div class="advance-details">
                                        <div class="advance-date">
                                            <span class="detail-label">Date:</span>
                                            <span class="detail-value">${formatDateDisplay(record.date)}</span>
                                        </div>
                                        ${record.reason ? `
                                            <div class="advance-reason">
                                                <span class="detail-label">Reason:</span>
                                                <span class="detail-value">${record.reason}</span>
                                            </div>
                                        ` : ''}
                                        ${record.notes ? `
                                            <div class="advance-notes">
                                                <span class="detail-label">Notes:</span>
                                                <span class="detail-value">${record.notes}</span>
                                            </div>
                                        ` : ''}
                                        ${record.paidDate ? `
                                            <div class="advance-paid-date">
                                                <span class="detail-label">Paid on:</span>
                                                <span class="detail-value">${formatDateDisplay(record.paidDate)}</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="empty-state">
                            <div class="empty-icon">💰</div>
                            <p>No advance records yet</p>
                            <small>Your salary advances will appear here</small>
                        </div>
                    `}
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
        }
    }
    
    cleanup() {
        // Cleanup if needed
    }
}
