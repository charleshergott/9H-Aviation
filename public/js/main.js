// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.innerHTML = mainNav.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.style.padding = '0';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.padding = '';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Aircraft Slider
const sliderContainer = document.getElementById('sliderContainer');
const sliderNav = document.getElementById('sliderNav');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');

let currentSlide = 0;
const slideWidth = slides[0].clientWidth;

// Set up slider navigation dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        goToSlide(index);
    });
});

// Create and add navigation buttons
const prevBtn = document.createElement('button');
const nextBtn = document.createElement('button');

prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';

prevBtn.className = 'slider-btn slider-btn-prev';
nextBtn.className = 'slider-btn slider-btn-next';

// Add buttons to the slider
sliderContainer.parentNode.insertBefore(prevBtn, sliderContainer);
sliderContainer.parentNode.insertBefore(nextBtn, sliderContainer.nextSibling);

// Set up slider navigation dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        goToSlide(index);
    });
});

// Set up button click events
prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
});

nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
});

function goToSlide(slideIndex) {
    if (slideIndex < 0) slideIndex = slides.length - 1;
    if (slideIndex >= slides.length) slideIndex = 0;

    sliderContainer.style.transform = `translateX(-${slideIndex * 100}%)`;

    // Update active dot
    dots.forEach(dot => dot.classList.remove('active'));
    dots[slideIndex].classList.add('active');

    currentSlide = slideIndex;
}

// Form submission
const inquiryForm = document.getElementById('inquiryForm');

inquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = inquiryForm.querySelector('input[type="text"]').value;
    const email = inquiryForm.querySelector('input[type="email"]').value;

    // Simple validation
    if (name && email) {
        // In a real implementation, you would send this data to a server
        alert(`Thank you ${name}! Your inquiry has been submitted. We'll contact you at ${email} shortly.`);
        inquiryForm.reset();
    } else {
        alert('Please fill in all required fields.');
    }
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