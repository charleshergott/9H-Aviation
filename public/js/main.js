// ===== MAIN JS FILE - INCLUDES ALL FUNCTIONALITY =====

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('show');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('show');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Aircraft Slider
const sliderContainer = document.getElementById('sliderContainer');
const sliderDots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;

function showSlide(index) {
    if (!sliderContainer) return;

    const slides = sliderContainer.querySelectorAll('.slide');
    const totalSlides = slides.length;

    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;

    currentSlide = index;
    sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    sliderDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Initialize slider if it exists
if (sliderContainer && sliderDots.length > 0) {
    // Auto slide every 5 seconds
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    // Dot click events
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
}

// ===== BOOKING SYSTEM =====

// Modal Elements
const bookingModal = document.getElementById('bookingModal');
const successModal = document.getElementById('successModal');
const closeModalButtons = document.querySelectorAll('.close-modal, .btn-close-success');

// Form Elements
const bookingForm = document.getElementById('bookingForm');
const aircraftOptions = document.querySelectorAll('.aircraft-option');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const leaseTypeSelect = document.getElementById('leaseType');

// Calendar Elements
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthEl = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

// State
let currentStep = 1;
let selectedAircraft = null;
let startDate = null;
let endDate = null;
let calendarDate = new Date();

// Aircraft Data
const aircraftData = {
    'DHC6-400-MSN925': {
        name: 'Twin Otter MSN 925',
        bookedDates: [
            '2024-03-15', '2024-03-16', '2024-03-17',
            '2024-04-20', '2024-04-21', '2024-04-22',
            '2024-05-10', '2024-05-11'
        ],
        minLease: 3,
        maxLease: 365
    },
    'DHC6-400-MSN938': {
        name: 'Twin Otter MSN 938',
        bookedDates: [
            '2024-03-10', '2024-03-11',
            '2024-04-05', '2024-04-06', '2024-04-07',
            '2024-06-01', '2024-06-02', '2024-06-03'
        ],
        minLease: 3,
        maxLease: 365
    }
};

// ===== INITIALIZE BOOKING SYSTEM =====

function initBookingSystem() {
    console.log('Initializing booking system...');

    // Add booking buttons to page
    addBookingTriggers();

    // Set up event listeners if modals exist
    if (bookingModal) {
        setupModalEvents();
        setupFormEvents();
        setupCalendar();
        updateSummary();

        console.log('Booking modal found and initialized');
    } else {
        console.warn('Booking modal not found - make sure HTML is included');
    }

    if (successModal) {
        console.log('Success modal found');
    }
}

// ===== ADD BOOKING TRIGGERS =====

function addBookingTriggers() {
    console.log('Adding booking triggers...');

    // Add to hero section
    const heroBtns = document.querySelector('.hero-btns');
    if (heroBtns) {
        const bookingBtn = document.createElement('a');
        bookingBtn.href = '#';
        bookingBtn.className = 'btn btn-booking booking-trigger';
        bookingBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Check Availability & Book';
        heroBtns.appendChild(bookingBtn);
        console.log('Added button to hero section');
    }

    // Add to services section
    const servicesSection = document.querySelector('.services-section');
    if (servicesSection) {
        const bookingCta = document.createElement('div');
        bookingCta.className = 'booking-cta';
        bookingCta.innerHTML = `
            <div class="section-title" style="margin-top: 4rem;">
                <h3>Ready to Book?</h3>
                <p>Check aircraft availability and submit a booking request</p>
                <a href="#" class="btn btn-booking booking-trigger">
                    <i class="fas fa-plane"></i> Start Booking Process
                </a>
            </div>
        `;
        servicesSection.appendChild(bookingCta);
        console.log('Added CTA to services section');
    }

    // Add click events to all booking triggers
    document.addEventListener('click', function (e) {
        if (e.target.closest('.booking-trigger')) {
            e.preventDefault();
            console.log('Booking trigger clicked, opening modal...');
            openBookingModal();
        }
    });
}

// ===== MODAL FUNCTIONS =====

function openBookingModal() {
    if (!bookingModal) {
        console.error('Booking modal not found!');
        alert('Please refresh the page to load the booking system.');
        return;
    }

    console.log('Opening booking modal');
    bookingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    resetForm();
    updateProgress();
    renderCalendar();
}

function closeBookingModal() {
    if (bookingModal) {
        bookingModal.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
}

function openSuccessModal() {
    if (successModal) {
        successModal.style.display = 'block';
    }
}

function closeSuccessModal() {
    if (successModal) {
        successModal.style.display = 'none';
    }
    closeBookingModal();
}

function setupModalEvents() {
    // Close buttons
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (bookingModal.style.display === 'block') {
                closeBookingModal();
            }
            if (successModal.style.display === 'block') {
                closeSuccessModal();
            }
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeBookingModal();
        }
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBookingModal();
            closeSuccessModal();
        }
    });
}

// ===== FORM FUNCTIONS =====

const FIRST_AVAILABLE_DATE = '2026-06-01'; // June 1, 2026
const lastAvailableDate = '2027-12-31'; // Optional: set an end date too

function setupFormEvents() {
    // Aircraft selection
    aircraftOptions.forEach(option => {
        option.addEventListener('click', () => {
            aircraftOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedAircraft = option.dataset.aircraft;
            updateSummary();
        });
    });

    // Date inputs
    const today = new Date().toISOString().split('T')[0];
    const firstAvailable = FIRST_AVAILABLE_DATE;

    if (startDateInput) {
        // Set minimum to first available date
        startDateInput.min = firstAvailable;
        startDateInput.value = firstAvailable; // Default to first available date
        startDate = firstAvailable;

        startDateInput.addEventListener('change', (e) => {
            startDate = e.target.value;
            if (startDate) {
                if (endDateInput) {
                    endDateInput.min = startDate;
                    // Also ensure end date is not before first available
                    if (endDateInput.value && endDateInput.value < startDate) {
                        endDateInput.value = startDate;
                        endDate = startDate;
                    }
                }
                renderCalendar();
                updateSummary();
            }
        });
    }

    if (endDateInput) {
        endDateInput.min = firstAvailable;
        endDateInput.value = firstAvailable; // Default to same as start

        endDateInput.addEventListener('change', (e) => {
            endDate = e.target.value;
            if (endDate) {
                renderCalendar();
                updateSummary();
            }
        });
    }

    if (leaseTypeSelect) {
        leaseTypeSelect.addEventListener('change', updateSummary);
    }

    // Step navigation
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.dataset.next.replace('step', ''));
            goToStep(nextStep);
        });
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.dataset.prev.replace('step', ''));
            goToStep(prevStep);
        });
    });

    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmit);
    }
}

function goToStep(stepNumber) {
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });
    const stepElement = document.getElementById(`step${stepNumber}`);
    if (stepElement) {
        stepElement.classList.add('active');
    }
    currentStep = stepNumber;
    updateProgress();
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressSteps = document.querySelectorAll('.progress-step');

    if (progressFill) {
        const progressPercent = (currentStep / 3) * 100;
        progressFill.style.width = `${progressPercent}%`;
    }

    progressSteps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// ===== CALENDAR FUNCTIONS =====

function setupCalendar() {
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            calendarDate.setMonth(calendarDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            calendarDate.setMonth(calendarDate.getMonth() + 1);
            renderCalendar();
        });
    }
}

function renderCalendar() {
    if (!calendarGrid || !currentMonthEl) return;

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstAvailableDate = new Date(FIRST_AVAILABLE_DATE);

    // Update month header
    currentMonthEl.textContent = calendarDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    // Clear calendar
    calendarGrid.innerHTML = '';

    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day-header';
        dayEl.textContent = day;
        calendarGrid.appendChild(dayEl);
    });

    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();

    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDay; i++) {
        const dayEl = createCalendarDay(prevMonthLastDay - startingDay + i + 1, true, 'prev');
        calendarGrid.appendChild(dayEl);
    }

    // Current month days
    const today = new Date().toISOString().split('T')[0];
    for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateObj = new Date(year, month, day);

        // Check if date is before June 1, 2026
        const isBeforeAvailable = dateObj < firstAvailableDate;

        let isBooked = false;
        if (!isBeforeAvailable && selectedAircraft && aircraftData[selectedAircraft]) {
            isBooked = aircraftData[selectedAircraft].bookedDates.includes(dateStr);
        }

        const isToday = dateStr === today;
        const isSelected = isDateSelected(dateStr);
        const isInRange = isDateInRange(dateStr);

        const dayEl = createCalendarDay(day, isBeforeAvailable, 'current', {
            dateStr,
            dateObj,
            isBooked,
            isToday,
            isSelected,
            isInRange,
            isBeforeAvailable
        });

        calendarGrid.appendChild(dayEl);
    }

    // Next month days
    const totalCells = 42;
    const remainingCells = totalCells - (startingDay + totalDays);
    for (let i = 1; i <= remainingCells; i++) {
        const dayEl = createCalendarDay(i, false, 'next');
        calendarGrid.appendChild(dayEl);
    }
}

function createCalendarDay(day, isDisabled, monthType = 'current', options = {}) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.textContent = day;

    const { isBeforeAvailable } = options;

    if (isDisabled || isBeforeAvailable) {
        dayEl.classList.add('disabled');
        if (isBeforeAvailable) {
            dayEl.title = 'Available from June 1, 2026';
        }
        return dayEl;
    }

    const { dateStr, dateObj, isBooked, isToday, isSelected, isInRange } = options;

    if (isBooked) {
        dayEl.classList.add('booked');
        dayEl.title = 'Aircraft is booked on this date';
    } else if (!isDisabled) {
        dayEl.addEventListener('click', () => handleDateClick(dateStr));
    }

    if (isToday) {
        dayEl.classList.add('today');
        dayEl.title = 'Today';
    }

    if (isSelected) {
        dayEl.classList.add('selected');
        if (dateStr === startDate) {
            dayEl.classList.add('selected-start');
            dayEl.title = 'Start date selected';
        } else if (dateStr === endDate) {
            dayEl.classList.add('selected-end');
            dayEl.title = 'End date selected';
        }
    } else if (isInRange) {
        dayEl.classList.add('in-range');
        dayEl.title = 'Within selected date range';
    }

    if (dateObj) {
        dayEl.dataset.date = dateStr;
    }

    return dayEl;
}

function isDateSelected(dateStr) {
    return dateStr === startDate || dateStr === endDate;
}

function isDateInRange(dateStr) {
    if (!startDate || !endDate) return false;

    const date = new Date(dateStr);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return date > start && date < end;
}

function handleDateClick(dateStr) {
    const clickedDate = new Date(dateStr);
    const firstAvailableDate = new Date(FIRST_AVAILABLE_DATE);

    // Don't allow selection before June 1, 2026
    if (clickedDate < firstAvailableDate) {
        alert(`Aircraft available for booking from June 1, 2026 only. Please select dates after ${formatDate(FIRST_AVAILABLE_DATE)}.`);
        return;
    }

    // Rest of existing code...
    if (!startDate || (startDate && endDate)) {
        startDate = dateStr;
        endDate = null;
        if (startDateInput) startDateInput.value = dateStr;
        if (endDateInput) endDateInput.value = '';
    } else if (startDate && !endDate) {
        const clickedDate = new Date(dateStr);
        const startDateObj = new Date(startDate);

        if (clickedDate <= startDateObj) {
            endDate = startDate;
            startDate = dateStr;
        } else {
            endDate = dateStr;
        }

        if (endDateInput) endDateInput.value = endDate;

        // Validate minimum lease duration
        const daysDiff = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
        if (selectedAircraft && daysDiff < aircraftData[selectedAircraft].minLease) {
            alert(`Minimum lease period for this aircraft is ${aircraftData[selectedAircraft].minLease} days.`);
            startDate = null;
            endDate = null;
            if (startDateInput) startDateInput.value = '';
            if (endDateInput) endDateInput.value = '';
        }
    }

    renderCalendar();
    updateSummary();
}

// ===== FORM SUBMISSION =====

async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Generate unique request ID
    const requestId = '9H-' + Date.now().toString().slice(-8);

    // Prepare form data
    const formData = {
        requestId: requestId,
        aircraft: selectedAircraft,
        aircraftName: aircraftData[selectedAircraft]?.name || selectedAircraft,
        startDate: startDate,
        endDate: endDate,
        leaseType: leaseTypeSelect ? leaseTypeSelect.value : 'dry',
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        company: document.getElementById('company')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        missionType: document.getElementById('missionType')?.value || '',
        additionalInfo: document.getElementById('additionalInfo')?.value || '',
        submittedAt: new Date().toISOString()
    };

    // Update success modal
    if (successId) successId.textContent = requestId;
    if (successAircraft) successAircraft.textContent = aircraftData[selectedAircraft]?.name || selectedAircraft;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (successDates) {
        successDates.textContent = `${formatDate(startDate)} - ${formatDate(endDate)} (${duration} days)`;
    }

    try {
        // Send to FormSubmit.co
        const response = await fetch('https://formsubmit.co/ajax/bd89e916b9761587b962e084078e8051', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                _subject: `New Aircraft Booking Request: ${requestId}`,
                _template: 'table',
                _autoresponse: `Thank you for your booking request (ID: ${requestId}). We have received your request for ${aircraftData[selectedAircraft]?.name} from ${formatDate(startDate)} to ${formatDate(endDate)}. Our team will review availability and contact you within 24 hours.`
            })
        });

        const result = await response.json();

        if (result.success) {
            closeBookingModal();
            openSuccessModal();
            setTimeout(resetForm, 1000);
        } else {
            throw new Error('Submission failed');
        }

    } catch (error) {
        console.error('Error submitting form:', error);

        // Fallback: Show success modal anyway
        closeBookingModal();
        openSuccessModal();
    }
}

function validateForm() {
    if (!selectedAircraft) {
        alert('Please select an aircraft');
        goToStep(1);
        return false;
    }

    if (!startDate || !endDate) {
        alert('Please select start and end dates');
        goToStep(2);
        return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
        alert('Start date cannot be in the past');
        return false;
    }

    if (end <= start) {
        alert('End date must be after start date');
        return false;
    }

    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (selectedAircraft && aircraftData[selectedAircraft]) {
        const aircraft = aircraftData[selectedAircraft];

        if (duration < aircraft.minLease) {
            alert(`Minimum lease period for ${aircraft.name} is ${aircraft.minLease} days`);
            return false;
        }

        if (duration > aircraft.maxLease) {
            alert(`Maximum lease period for ${aircraft.name} is ${aircraft.maxLease} days`);
            return false;
        }

        // Check for booked dates in range
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            if (aircraft.bookedDates.includes(dateStr)) {
                alert(`Aircraft is not available on ${formatDate(dateStr)}`);
                return false;
            }
        }
    }

    // Add check for availability start date
    const firstAvailable = new Date(FIRST_AVAILABLE_DATE);
    const selectedStart = new Date(startDate);

    if (selectedStart < firstAvailable) {
        alert(`Aircraft available for booking from June 1, 2026 only. Please select dates after ${formatDate(FIRST_AVAILABLE_DATE)}.`);
        goToStep(2);
        return false;
    }

    // Check required fields
    const firstName = document.getElementById('firstName')?.value.trim();
    const lastName = document.getElementById('lastName')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();

    if (!firstName || !lastName || !email || !phone) {
        alert('Please fill in all required contact details');
        goToStep(3);
        return false;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    if (!document.getElementById('terms')?.checked) {
        alert('Please accept the terms and conditions');
        return false;
    }

    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== SUMMARY FUNCTIONS =====

function updateSummary() {
    // Aircraft
    const summaryAircraft = document.getElementById('summaryAircraft');
    if (summaryAircraft) {
        if (selectedAircraft && aircraftData[selectedAircraft]) {
            summaryAircraft.textContent = aircraftData[selectedAircraft].name;
        } else {
            summaryAircraft.textContent = 'Not selected';
        }
    }

    // Dates
    const summaryDates = document.getElementById('summaryDates');
    const summaryDuration = document.getElementById('summaryDuration');
    if (summaryDates && summaryDuration) {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

            summaryDates.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
            summaryDuration.textContent = `${duration} days`;
        } else {
            summaryDates.textContent = 'Not selected';
            summaryDuration.textContent = '0 days';
        }
    }

    // Lease Type
    const summaryLease = document.getElementById('summaryLease');
    if (summaryLease) {
        if (leaseTypeSelect && leaseTypeSelect.value) {
            const leaseTypes = {
                'dry': 'Dry Lease',
                'wet': 'Wet Lease',
                'acmi': 'ACMI'
            };
            summaryLease.textContent = leaseTypes[leaseTypeSelect.value] || leaseTypeSelect.value;
        } else {
            summaryLease.textContent = 'Not selected';
        }
    }

    // Request ID
    const summaryId = document.getElementById('summaryId');
    if (summaryId) {
        const previewId = selectedAircraft ?
            `${selectedAircraft.slice(0, 8)}-${Date.now().toString().slice(-4)}` :
            '--';
        summaryId.textContent = previewId;
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function resetForm() {
    currentStep = 1;
    selectedAircraft = null;
    startDate = null;
    endDate = null;

    goToStep(1);

    // Reset aircraft selection
    aircraftOptions.forEach(opt => opt.classList.remove('selected'));

    // Reset form inputs
    if (startDateInput) {
        const today = new Date().toISOString().split('T')[0];
        startDateInput.value = today;
        startDate = today;
    }
    if (endDateInput) endDateInput.value = '';
    if (leaseTypeSelect) leaseTypeSelect.value = 'dry';
    if (bookingForm) bookingForm.reset();

    updateSummary();
}

// ===== INITIALIZE EVERYTHING =====

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing all systems...');

    // Initialize booking system
    initBookingSystem();

    // Initialize slider if it exists
    if (sliderContainer && sliderDots.length > 0) {
        showSlide(0);
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    console.log('All systems initialized successfully');
});

// Make functions available globally (optional)
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;