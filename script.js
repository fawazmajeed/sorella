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
});