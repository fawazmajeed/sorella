document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        // Simple toggle visual
        if (mobileNav.classList.contains('active')) {
            menuBtn.innerHTML = '✕';
        } else {
            menuBtn.innerHTML = '☰';
        }
    });

    // --- Portfolio Filtering Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Strip the active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // 2. Add the active class to the clicked button
            btn.classList.add('active');

            // 3. Get the target category
            const filterValue = btn.getAttribute('data-filter');

            // 4. Loop through grid items and toggle visibility
            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    // Optional: Add a tiny animation reset here later if needed
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- Scroll Reveal Animation ---
    // Target all major cards and sections to fade in dynamically
    const sectionsToAnimate = document.querySelectorAll('.card, .menu-item, .course-card, .story-content');
    
    // Add the starting class
    sectionsToAnimate.forEach(sec => sec.classList.add('fade-in-section'));

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    sectionsToAnimate.forEach(sec => {
        observer.observe(sec);
    });

});