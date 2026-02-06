/**
 * Attendance page - Monthly calendar view
 */

import { getAllRecords } from '../../db/indexeddb.js';
import { 
    getCurrentYearMonth, 
    getDaysInMonth, 
    getFirstDayOfMonth,
    formatDateISO,
    getMonthName
} from '../../utils/date.js';

export class AttendancePage {
    constructor() {
        this.currentYear = null;
        this.currentMonth = null;
        this.attendance = [];
        this.attendanceMap = new Map();
    }
    
    async loadData() {
        try {
            this.attendance = await getAllRecords('attendance');
            
            // Create a map for quick lookup: date -> attendance record
            this.attendanceMap.clear();
            this.attendance.forEach(record => {
                if (record.date) {
                    const dateKey = formatDateISO(record.date);
                    this.attendanceMap.set(dateKey, record);
                }
            });
        } catch (error) {
            console.error('Error loading attendance:', error);
        }
    }
    
    initializeDate() {
        const { year, month } = getCurrentYearMonth();
        this.currentYear = year;
        this.currentMonth = month;
    }
    
    isPresent(day) {
        const dateKey = formatDateISO(new Date(this.currentYear, this.currentMonth, day));
        return this.attendanceMap.has(dateKey);
    }
    
    getAttendanceForDay(day) {
        const dateKey = formatDateISO(new Date(this.currentYear, this.currentMonth, day));
        return this.attendanceMap.get(dateKey);
    }
    
    renderCalendar() {
        const daysInMonth = getDaysInMonth(this.currentYear, this.currentMonth);
        const firstDay = getFirstDayOfMonth(this.currentYear, this.currentMonth);
        const monthName = getMonthName(new Date(this.currentYear, this.currentMonth));
        
        // Count present days
        let presentDays = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            if (this.isPresent(day)) {
                presentDays++;
            }
        }
        
        // Create calendar grid
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let calendarHTML = `
            <div class="calendar-header">
                <button class="nav-btn" id="prevMonth">‹</button>
                <div class="month-year">
                    <div class="month-name">${monthName} ${this.currentYear}</div>
                    <div class="month-summary">${presentDays} days present</div>
                </div>
                <button class="nav-btn" id="nextMonth">›</button>
            </div>
            
            <div class="calendar-grid">
                ${days.map(day => `<div class="calendar-day-header">${day}</div>`).join('')}
        `;
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-cell empty"></div>';
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isPresent = this.isPresent(day);
            const today = new Date();
            const isToday = this.currentYear === today.getFullYear() && 
                           this.currentMonth === today.getMonth() && 
                           day === today.getDate();
            
            let cellClass = 'calendar-cell';
            if (isPresent) cellClass += ' present';
            if (isToday) cellClass += ' today';
            
            calendarHTML += `
                <div class="${cellClass}">
                    <div class="day-number">${day}</div>
                    ${isPresent ? '<div class="day-indicator">✓</div>' : ''}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        
        return calendarHTML;
    }
    
    renderAttendanceList() {
        // Get attendance for current month
        const monthAttendance = this.attendance.filter(record => {
            if (!record.date) return false;
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === this.currentYear && 
                   recordDate.getMonth() === this.currentMonth;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (monthAttendance.length === 0) {
            return `
                <div class="empty-state">
                    <p>No attendance records for this month</p>
                </div>
            `;
        }
        
        return `
            <div class="attendance-list">
                ${monthAttendance.map(record => {
                    const date = new Date(record.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dateStr = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                    
                    return `
                        <div class="attendance-item">
                            <div class="attendance-date">
                                <div class="day-name">${dayName}</div>
                                <div class="date-str">${dateStr}</div>
                            </div>
                            <div class="attendance-times">
                                ${record.checkIn ? `
                                    <div class="time-entry">
                                        <span class="time-label">In:</span>
                                        <span class="time-value">${new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                ` : ''}
                                ${record.checkOut ? `
                                    <div class="time-entry">
                                        <span class="time-label">Out:</span>
                                        <span class="time-value">${new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    render() {
        if (!this.currentYear || !this.currentMonth === null) {
            this.initializeDate();
        }
        
        return `
            <div class="attendance-page">
                <div class="calendar-container">
                    ${this.renderCalendar()}
                </div>
                
                <div class="section">
                    <h2 class="section-title">Attendance Details</h2>
                    ${this.renderAttendanceList()}
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
            this.attachNavigationListeners();
        }
    }
    
    attachNavigationListeners() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentMonth--;
                if (this.currentMonth < 0) {
                    this.currentMonth = 11;
                    this.currentYear--;
                }
                this.updateView();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentMonth++;
                if (this.currentMonth > 11) {
                    this.currentMonth = 0;
                    this.currentYear++;
                }
                this.updateView();
            });
        }
    }
    
    updateView() {
        const container = document.getElementById('pageContent');
        if (container) {
            container.innerHTML = this.render();
            this.attachNavigationListeners();
        }
    }
    
    cleanup() {
        // Cleanup if needed
    }
}
