/* ============================================================
   SORELLA CUISINE — SITE SCRIPT v2.0
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Scroll progress bar ──────────────────────────────── */
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const total    = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
        }, { passive: true });
    }

    /* ── Header scroll state ──────────────────────────────── */
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 55);
        }, { passive: true });
    }

    /* ── Mobile nav drawer ────────────────────────────────── */
    const menuBtn    = document.getElementById('mobile-menu-btn');
    const mobileNav  = document.getElementById('mobile-nav');
    const navOverlay = document.getElementById('nav-overlay');
    const navClose   = document.getElementById('nav-close');

    function openNav() {
        if (!mobileNav) return;
        mobileNav.classList.add('active');
        navOverlay && navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
    }
    function closeNav() {
        if (!mobileNav) return;
        mobileNav.classList.remove('active');
        navOverlay && navOverlay.classList.remove('active');
        document.body.style.overflow = '';
        menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
    }

    menuBtn    && menuBtn.addEventListener('click', openNav);
    navClose   && navClose.addEventListener('click', closeNav);
    navOverlay && navOverlay.addEventListener('click', closeNav);
    document.querySelectorAll('[data-nav-link]').forEach(l => l.addEventListener('click', closeNav));

    /* Escape key closes nav */
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

    /* ── Menu filter ──────────────────────────────────────── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems  = document.querySelectorAll('.menu-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            menuItems.forEach(item => {
                const show = filter === 'all' || item.dataset.category === filter;
                item.style.display = show ? '' : 'none';
            });
        });
    });

    /* ── Testimonial carousel ─────────────────────────────── */
    const slides  = document.querySelectorAll('.t-slide');
    const dots    = document.querySelectorAll('.t-dot');
    let current   = 0;
    let autoTimer = null;

    function showSlide(n) {
        slides[current].classList.remove('t-active');
        dots[current].classList.remove('t-dot-active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('t-active');
        dots[current].classList.add('t-dot-active');
    }

    function startAuto() {
        autoTimer = setInterval(() => showSlide(current + 1), 4500);
    }

    if (slides.length > 0) {
        startAuto();
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(autoTimer);
                showSlide(i);
                startAuto();
            });
        });

        /* Swipe support for mobile */
        const carousel = document.getElementById('testimonial-carousel');
        if (carousel) {
            let txStart = 0;
            carousel.addEventListener('touchstart', e => { txStart = e.touches[0].clientX; }, { passive: true });
            carousel.addEventListener('touchend',   e => {
                const diff = txStart - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 45) {
                    clearInterval(autoTimer);
                    showSlide(diff > 0 ? current + 1 : current - 1);
                    startAuto();
                }
            });
        }
    }

    /* ── Stat counter animation ───────────────────────────── */
    const statEls    = document.querySelectorAll('.stat-num[data-target]');
    let statsRan     = false;

    function runCounters() {
        if (statsRan || statEls.length === 0) return;
        statsRan = true;
        statEls.forEach(el => {
            const target   = parseInt(el.dataset.target, 10);
            const duration = 1400;
            const start    = performance.now();
            function step(now) {
                const p    = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - p, 3); /* ease-out-cubic */
                el.textContent = Math.floor(ease * target);
                if (p < 1) requestAnimationFrame(step);
                else       el.textContent = target;
            }
            requestAnimationFrame(step);
        });
    }

    /* ── Intersection observer — reveals + stats trigger ──── */
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    revealEls.forEach(el => observer.observe(el));

    /* Auto-add reveal class to common elements that weren't marked */
    const autoReveal = ['.menu-item', '.exp-card', '.t-slide'];
    autoReveal.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
                observer.observe(el);
            }
        });
    });

    /* Stats trigger */
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const statsObs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) runCounters();
        }, { threshold: 0.4 });
        statsObs.observe(statsBar);
    }

    /* ── Smooth anchor for same-page links ────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href').slice(1);
            if (!id) return;
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                const headerH = header ? header.offsetHeight : 60;
                const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});
