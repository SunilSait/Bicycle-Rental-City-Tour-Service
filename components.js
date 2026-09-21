/* ===== PEDALCITY — BICYCLE RENTAL & CITY TOUR SERVICE — SHARED COMPONENTS ===== */
'use strict';

/* ─── THEME, PALETTE & DIRECTION SYSTEM ─────────────────────── */
const PALETTES = [
    {
        id: 'lime',
        name: 'Neon Volt Lime',
        tagline: 'Speed & Night Cruiser',
        primary: '#84CC16',
        accent: '#10B981'
    },
    {
        id: 'emerald',
        name: 'Emerald Eco-Green',
        tagline: 'Fresh Eco-Mobility',
        primary: '#10B981',
        accent: '#34D399'
    },
    {
        id: 'amber',
        name: 'Sunset Amber',
        tagline: 'Warm Urban Cycling',
        primary: '#F59E0B',
        accent: '#FB923C'
    },
    {
        id: 'cyan',
        name: 'Electric Cyan',
        tagline: 'Smart Coastal Transit',
        primary: '#06B6D4',
        accent: '#38BDF8'
    },
    {
        id: 'indigo',
        name: 'Royal Indigo',
        tagline: 'High-Tech Metro',
        primary: '#6366F1',
        accent: '#8B5CF6'
    },
    {
        id: 'coral',
        name: 'Sunset Coral',
        tagline: 'Sport & Adventure',
        primary: '#FF5722',
        accent: '#F43F5E'
    }
];

(function initThemeDir() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('pc_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) html.classList.add('dark');
    if (localStorage.getItem('pc_dir') === 'rtl') html.setAttribute('dir', 'rtl');

    // Initialize palette: default to Neon Volt Lime
    const savedPalette = localStorage.getItem('pc_palette') || 'lime';
    html.setAttribute('data-palette', savedPalette);
})();

function getActivePalette() {
    return document.documentElement.getAttribute('data-palette') || 'lime';
}

function setPalette(paletteId) {
    const pal = PALETTES.find(p => p.id === paletteId) || PALETTES[0];
    document.documentElement.setAttribute('data-palette', pal.id);
    localStorage.setItem('pc_palette', pal.id);

    // Update active cards in Theme Studio modal
    document.querySelectorAll('.palette-card').forEach(card => {
        const isMatch = card.getAttribute('data-palette-id') === pal.id;
        card.classList.toggle('active', isMatch);
    });

    // Update status text
    document.querySelectorAll('.theme-studio-status-name').forEach(el => {
        el.textContent = pal.name;
    });

    // Show toast
    showThemeToast(pal.name, pal.primary);
}

function showThemeToast(paletteName, primaryColor) {
    let toast = document.getElementById('theme-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'theme-toast';
        toast.className = 'theme-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="theme-toast-swatch" style="background:${primaryColor};box-shadow:0 0 10px ${primaryColor};"></span> Theme switched to <strong>${paletteName}</strong>`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function openThemeStudio() {
    const backdrop = document.getElementById('theme-studio-backdrop');
    if (backdrop) backdrop.classList.add('open');
    updateThemeStudioActiveStates();
}

function closeThemeStudio() {
    const backdrop = document.getElementById('theme-studio-backdrop');
    if (backdrop) backdrop.classList.remove('open');
}

function toggleThemeMode(mode) {
    const html = document.documentElement;
    if (mode === 'dark') {
        html.classList.add('dark');
        localStorage.setItem('pc_theme', 'dark');
    } else {
        html.classList.remove('dark');
        localStorage.setItem('pc_theme', 'light');
    }
    document.querySelectorAll('.theme-icon').forEach(updateThemeIcon);
    updateThemeStudioActiveStates();
}

function updateThemeStudioActiveStates() {
    const isDark = document.documentElement.classList.contains('dark');
    const darkBtn = document.getElementById('theme-mode-dark');
    const lightBtn = document.getElementById('theme-mode-light');
    if (darkBtn && lightBtn) {
        darkBtn.classList.toggle('active', isDark);
        lightBtn.classList.toggle('active', !isDark);
    }

    const currentPalette = getActivePalette();
    document.querySelectorAll('.palette-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-palette-id') === currentPalette);
    });

    const palObj = PALETTES.find(p => p.id === currentPalette) || PALETTES[0];
    document.querySelectorAll('.theme-studio-status-name').forEach(el => {
        el.textContent = palObj.name;
    });
}

function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('pc_theme', html.classList.contains('dark') ? 'dark' : 'light');
    document.querySelectorAll('.theme-icon').forEach(updateThemeIcon);
    updateThemeStudioActiveStates();
}

function updateThemeIcon(el) {
    if (!el) return;
    const isDark = document.documentElement.classList.contains('dark');
    el.className = isDark ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
}

function toggleDir() {
    const html = document.documentElement;
    const isRTL = html.getAttribute('dir') === 'rtl';
    html.setAttribute('dir', isRTL ? 'ltr' : 'rtl');
    localStorage.setItem('pc_dir', isRTL ? 'ltr' : 'rtl');
    document.querySelectorAll('.dir-label').forEach(el => {
        el.textContent = isRTL ? 'LTR' : 'RTL';
    });
}

/* ─── SVG LOGO (Dynamic Palette Adaptable) ──────────────────── */
function getLogoSVG(size = 38) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="${size}" height="${size}" class="nav-logo-img" style="width:${size}px;height:${size}px;object-fit:contain;display:block;flex-shrink:0;">
      <!-- Outer wheel rim -->
      <circle cx="80" cy="80" r="68" stroke="var(--primary)" stroke-width="5" fill="none"/>
      <!-- Inner wheel rim -->
      <circle cx="80" cy="80" r="58" stroke="var(--primary)" stroke-width="2" fill="none" opacity="0.35"/>
      <!-- Hub -->
      <circle cx="80" cy="80" r="12" fill="var(--primary)"/>
      <circle cx="80" cy="80" r="6" fill="#FFFFFF"/>
      <!-- Spokes -->
      <line x1="80" y1="22" x2="80" y2="68" stroke="var(--primary)" stroke-width="1.5"/>
      <line x1="80" y1="92" x2="80" y2="138" stroke="var(--primary)" stroke-width="1.5"/>
      <line x1="22" y1="80" x2="68" y2="80" stroke="var(--primary)" stroke-width="1.5"/>
      <line x1="92" y1="80" x2="138" y2="80" stroke="var(--primary)" stroke-width="1.5"/>
      <line x1="39" y1="39" x2="68" y2="68" stroke="var(--primary)" stroke-width="1.5"/>
      <line x1="92" y1="92" x2="121" y2="121" stroke="var(--primary)" stroke-width="1.5"/>
      <line x1="121" y1="39" x2="92" y2="68" stroke="var(--primary)" stroke-width="1.5"/>
      <line x1="68" y1="92" x2="39" y2="121" stroke="var(--primary)" stroke-width="1.5"/>
      <!-- City skyline silhouette -->
      <g transform="translate(44, 28)">
        <rect x="0" y="18" width="8" height="14" fill="var(--secondary)" rx="1"/>
        <rect x="10" y="10" width="10" height="22" fill="var(--secondary)" rx="1"/>
        <rect x="22" y="4" width="8" height="28" fill="var(--primary)" rx="1"/>
        <rect x="32" y="14" width="10" height="18" fill="var(--secondary)" rx="1"/>
        <rect x="44" y="8" width="8" height="24" fill="var(--secondary)" rx="1"/>
        <rect x="54" y="16" width="10" height="16" fill="var(--secondary)" rx="1"/>
        <line x1="26" y1="0" x2="26" y2="4" stroke="var(--primary)" stroke-width="1.5"/>
        <circle cx="26" cy="0" r="1.5" fill="var(--primary)"/>
      </g>
    </svg>`;
}

/* ─── NAVBAR ─────────────────────────────────────────── */
function injectNav() {
    const el = document.getElementById('main-nav');
    if (!el) return;
    const page = location.pathname.split('/').pop() || 'index.html';
    const links = [
        { href: 'index.html',     label: 'Home' },
        { href: 'home2.html',     label: 'Home 2' },
        { href: 'fleet.html',     label: 'Fleet' },
        { href: 'tours.html',     label: 'Tours' },
        { href: 'locations.html', label: 'Locations' },
        { href: 'rules.html',     label: 'Rules' },
        { href: 'contact.html',   label: 'Contact' },
    ];

    const isDark = document.documentElement.classList.contains('dark');
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

    const navLinksHTML = links.map(l => {
        const isActive = page === l.href || (page === '' && l.href === 'index.html');
        return `<a href="${l.href}" class="nav-link ${isActive ? 'active' : ''}">${l.label}</a>`;
    }).join('');

    const mobileLinksHTML = links.map(l => {
        const isActive = page === l.href || (page === '' && l.href === 'index.html');
        return `<a href="${l.href}" class="mobile-nav-link ${isActive ? 'active' : ''}">${l.label}</a>`;
    }).join('');

    el.innerHTML = `
    <nav class="navbar" id="navbar">
        <div class="nav-inner">
            <!-- Logo -->
            <a href="index.html" class="nav-logo" aria-label="PedalCity Home">
                ${getLogoSVG(38)}
                <div class="nav-logo-text">
                    <span class="brand-top">PedalCity</span>
                    <span class="brand-bottom">Bicycle Rental & City Tours</span>
                </div>
            </a>

            <!-- Desktop Nav Links -->
            <div class="nav-links">
                ${navLinksHTML}
            </div>

            <!-- Right Actions -->
            <div class="nav-actions">
                <!-- RTL Toggle -->
                <button onclick="toggleDir()" class="nav-icon-btn" title="Toggle Direction" aria-label="Toggle RTL">
                    <span class="dir-label" style="font-size:0.625rem;font-weight:700;">${isRTL ? 'RTL' : 'LTR'}</span>
                </button>
                <!-- Theme Toggle -->
                <button onclick="toggleTheme()" class="nav-icon-btn" title="Toggle Theme" aria-label="Toggle dark mode">
                    <i class="${isDark ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon'}"></i>
                </button>
                <!-- Sign In & Dashboard CTA Buttons -->
                <a href="login.html" class="btn btn-outline btn-sm nav-btn-signin">Sign In</a>
                <a href="dashboard.html" class="btn btn-primary btn-sm nav-btn-dashboard">Dashboard</a>
                <!-- Mobile Hamburger (WireWise Reference) -->
                <button class="hamburger" id="hamburger-btn" aria-label="Open menu" aria-expanded="false" onclick="toggleMobileDrawer()">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Mobile Navigation Drawer Overlay (WireWise Reference Architecture) -->
    <div class="mobile-drawer-overlay" id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div class="mobile-drawer-header">
            <a href="index.html" class="nav-logo" aria-label="PedalCity Home" onclick="closeMobileDrawer()">
                ${getLogoSVG(36)}
                <div class="nav-logo-text">
                    <span class="brand-top">PedalCity</span>
                    <span class="brand-bottom">Bicycle Rental & City Tours</span>
                </div>
            </a>
            <button class="mobile-drawer-close" id="mobile-drawer-close" onclick="closeMobileDrawer()" aria-label="Close menu">
                <i class="fas fa-xmark"></i>
            </button>
        </div>

        <div class="mobile-drawer-body">
            ${mobileLinksHTML}
        </div>

        <div class="mobile-drawer-footer">
            <a href="dashboard.html" class="btn btn-primary btn-full" onclick="closeMobileDrawer()"><i class="fas fa-th-large"></i> Dashboard</a>
            <a href="login.html" class="btn btn-outline btn-full" onclick="closeMobileDrawer()"><i class="fas fa-user"></i> Sign In</a>
            <div class="mobile-drawer-controls">
                <button onclick="toggleDir()" class="nav-icon-btn" title="Toggle Direction" aria-label="Toggle RTL">
                    <span class="dir-label" style="font-size:0.625rem;font-weight:700;">${isRTL ? 'RTL' : 'LTR'}</span>
                </button>
                <button onclick="toggleTheme()" class="nav-icon-btn" title="Toggle Theme" aria-label="Toggle dark mode">
                    <i class="${isDark ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon'}"></i>
                </button>
            </div>
        </div>
    </div>
    <div class="navbar-spacer"></div>`;
}

function openMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const hamburger = document.getElementById('hamburger-btn');
    if (!drawer) return;
    drawer.classList.add('open');
    if (hamburger) {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const hamburger = document.getElementById('hamburger-btn');
    if (!drawer) return;
    drawer.classList.remove('open');
    if (hamburger) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
}

function toggleMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer && drawer.classList.contains('open')) {
        closeMobileDrawer();
    } else {
        openMobileDrawer();
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const drawer = document.getElementById('mobile-drawer');
        if (drawer && drawer.classList.contains('open')) {
            closeMobileDrawer();
        }
        if (typeof closeDashboardSidebar === 'function') {
            closeDashboardSidebar();
        }
    }
});

/* ─── FOOTER ─────────────────────────────────────────── */
function injectFooter() {
    const el = document.getElementById('main-footer');
    if (!el) return;
    el.innerHTML = `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <!-- Column 1: Brand -->
                <div class="footer-brand">
                    <a href="index.html" class="nav-logo" style="margin-bottom:0.5rem;" aria-label="PedalCity Home">
                        ${getLogoSVG(38)}
                        <div class="nav-logo-text">
                            <span class="brand-top" style="color:#fff;">PedalCity</span>
                            <span class="brand-bottom">Bicycle Rental & City Tours</span>
                        </div>
                    </a>
                    <p>Your premier destination for bicycle rentals and guided city tours. Explore urban landscapes on two wheels with eco-friendly, affordable rides.</p>
                    <div class="footer-socials">
                        <a href="#" class="footer-social-link" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="footer-social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="footer-social-link" aria-label="Twitter"><i class="fab fa-x-twitter"></i></a>
                        <a href="#" class="footer-social-link" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    </div>
                </div>

                <!-- Column 2: Quick Links -->
                <div>
                    <h4 class="footer-col-title">Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="home2.html">Home 2 — Premium</a></li>
                        <li><a href="fleet.html">Our Fleet</a></li>
                        <li><a href="tours.html">Guided Tours</a></li>
                        <li><a href="locations.html">Pickup Locations</a></li>
                        <li><a href="rules.html">Rules & Deposit</a></li>
                    </ul>
                </div>

                <!-- Column 3: Resources -->
                <div>
                    <h4 class="footer-col-title">Resources</h4>
                    <ul class="footer-links">
                        <li><a href="contact.html">Contact Us</a></li>
                        <li><a href="coming-soon.html">Blog & Guides</a></li>
                        <li><a href="coming-soon.html">Careers</a></li>
                        <li><a href="login.html">Login</a></li>
                        <li><a href="signup.html">Sign Up</a></li>
                        <li><a href="404.html">404 Page</a></li>
                        <li><a href="coming-soon.html">Coming Soon</a></li>
                    </ul>
                </div>

                <!-- Column 4: Newsletter -->
                <div>
                    <div class="footer-newsletter">
                        <h4>Ride Updates</h4>
                        <p>Get cycling tips, new tour alerts & exclusive discounts delivered to your inbox.</p>
                        <form onsubmit="event.preventDefault(); alert('Subscribed successfully!'); this.reset();" class="footer-newsletter-form">
                            <input type="email" placeholder="your@email.com" class="footer-newsletter-input" required>
                            <button type="submit" class="footer-newsletter-btn">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} PedalCity. All rights reserved.</p>
                <div class="footer-bottom-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Cookies</a>
                </div>
            </div>
        </div>
    </footer>`;
}

/* ─── AUTH PAGE HELPERS ─────────────────────────────────── */
function initAuthPage() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('pc_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) html.classList.add('dark');
    if (localStorage.getItem('pc_dir') === 'rtl') html.setAttribute('dir', 'rtl');

    const savedPalette = localStorage.getItem('pc_palette') || 'lime';
    html.setAttribute('data-palette', savedPalette);

    document.querySelectorAll('.theme-icon').forEach(updateThemeIcon);
    document.querySelectorAll('.dir-label').forEach(el => {
        el.textContent = html.getAttribute('dir') === 'rtl' ? 'RTL' : 'LTR';
    });

    injectThemeStudio();
}

function togglePasswordVisibility(inputId, iconEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        iconEl.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        iconEl.className = 'fas fa-eye';
    }
}

/* ─── FAQ TOGGLE ─────────────────────────────────────────── */
function toggleFAQ(el) {
    const item = el.closest('.faq-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item.active').forEach(faq => faq.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
}

/* ─── TAB SYSTEM / FILTER ─────────────────────────────────── */
function switchFilter(filterValue, groupSelector) {
    // Update tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-filter') === filterValue);
    });

    // Filter cards
    const cards = document.querySelectorAll(groupSelector || '.filterable-card');
    cards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });

    // Update dynamic centering for last child when odd number of visible cards
    document.querySelectorAll('.grid-3, .grid-4').forEach(grid => {
        const visibleCards = Array.from(grid.children).filter(c => c.style.display !== 'none');
        grid.querySelectorAll('.centered-last-card').forEach(c => c.classList.remove('centered-last-card'));
        if (visibleCards.length % 2 === 1 && visibleCards.length > 1) {
            visibleCards[visibleCards.length - 1].classList.add('centered-last-card');
        }
    });
}

/* ─── SCROLL ANIMATIONS ─────────────────────────────────── */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

/* ─── COUNTER ANIMATION ─────────────────────────────────── */
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const suffix = el.getAttribute('data-suffix') || '';
                const prefix = el.getAttribute('data-prefix') || '';
                let current = 0;
                const step = Math.ceil(target / 60);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = prefix + current.toLocaleString() + suffix;
                }, 25);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
}

/* ─── NAVBAR SCROLL ────────────────────────────────── */
window.addEventListener('scroll', function() {
    const nav = document.getElementById('navbar');
    if (nav) {
        if (window.scrollY > 15) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
}, { passive: true });

/* ─── SCROLL TO TOP ─────────────────────────────────────── */
function injectScrollToTop() {
    if (document.body.classList.contains('auth-page') || document.body.classList.contains('fullscreen-page') || document.body.classList.contains('dashboard-body')) return;
    if (document.getElementById('scroll-to-top')) return;
    const btn = document.createElement('button');
    btn.id = 'scroll-to-top';
    btn.className = 'scroll-to-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.setAttribute('title', 'Scroll to top');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.onclick = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(btn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 280) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });
}

/* ─── THEME STUDIO INJECTION ─────────────────────────────── */
function injectThemeStudio() {
    if (document.getElementById('theme-studio-backdrop')) return;

    const currentPalette = getActivePalette();
    const currentPalObj = PALETTES.find(p => p.id === currentPalette) || PALETTES[0];
    const isDark = document.documentElement.classList.contains('dark');

    // Theme Studio Backdrop & Modal
    const existingLauncher = document.getElementById('floating-theme-launcher');
    if (existingLauncher) existingLauncher.remove();

    // 2. Theme Studio Backdrop & Modal
    const modalWrapper = document.createElement('div');
    modalWrapper.id = 'theme-studio-backdrop';
    modalWrapper.className = 'theme-studio-backdrop';
    modalWrapper.onclick = function(e) {
        if (e.target === modalWrapper) closeThemeStudio();
    };

    const palettesHTML = PALETTES.map(p => `
        <button type="button" 
                class="palette-card ${p.id === currentPalette ? 'active' : ''}" 
                data-palette-id="${p.id}" 
                onclick="setPalette('${p.id}')"
                style="--palette-primary:${p.primary};">
            <div class="palette-swatch-circles">
                <div class="palette-swatch-primary" style="background:${p.primary};"></div>
                <div class="palette-swatch-accent" style="background:${p.accent};"></div>
            </div>
            <div class="palette-info">
                <div class="palette-name">${p.name}</div>
                <div class="palette-tagline">${p.tagline}</div>
            </div>
            <div class="palette-active-check">
                <i class="fas fa-check"></i>
            </div>
        </button>
    `).join('');

    modalWrapper.innerHTML = `
        <div class="theme-studio-modal" role="dialog" aria-labelledby="theme-studio-title" aria-modal="true">
            <!-- Header -->
            <div class="theme-studio-header">
                <div>
                    <h3 class="theme-studio-title" id="theme-studio-title">
                        <i class="fas fa-palette"></i> Theme Studio
                    </h3>
                    <p class="theme-studio-subtitle">Customize PedalCity's visual palette & display mode</p>
                </div>
                <button type="button" onclick="closeThemeStudio()" class="theme-studio-close-btn" aria-label="Close Theme Studio">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Display Mode Bar -->
            <div class="theme-studio-mode-bar">
                <div class="theme-mode-label">
                    <i class="fas fa-circle-half-stroke" style="color:var(--primary);"></i>
                    <span>Display Mode</span>
                </div>
                <div class="theme-mode-switch-group">
                    <button type="button" class="theme-mode-option-btn ${!isDark ? 'active' : ''}" id="theme-mode-light" onclick="toggleThemeMode('light')">
                        <i class="fas fa-sun"></i> Light
                    </button>
                    <button type="button" class="theme-mode-option-btn ${isDark ? 'active' : ''}" id="theme-mode-dark" onclick="toggleThemeMode('dark')">
                        <i class="fas fa-moon"></i> Dark
                    </button>
                </div>
            </div>

            <!-- Palettes Selection Grid -->
            <div class="theme-palettes-grid">
                ${palettesHTML}
            </div>

            <!-- Footer -->
            <div class="theme-studio-footer">
                <div class="theme-studio-status">
                    <span class="theme-studio-status-dot"></span>
                    <span>Active: <strong class="theme-studio-status-name">${currentPalObj.name}</strong></span>
                </div>
                <button type="button" onclick="closeThemeStudio()" class="btn btn-primary btn-sm">Done</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalWrapper);
}

/* ─── HERO AUTO-SLIDER (5s Rotation) ─────────────────────── */
let heroSliderInterval = null;
let currentSlide = 0;

function initHeroSlider() {
    const slider = document.getElementById('hero-slider') || document.querySelector('.hero-slider-container');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (slides.length < 2) return;

    startHeroAutoSlide();

    if (slider) {
        slider.addEventListener('mouseenter', stopHeroAutoSlide);
        slider.addEventListener('mouseleave', startHeroAutoSlide);
    }
}

function startHeroAutoSlide() {
    stopHeroAutoSlide();
    heroSliderInterval = setInterval(() => {
        nextHeroSlide();
    }, 5000);
}

function stopHeroAutoSlide() {
    if (heroSliderInterval) {
        clearInterval(heroSliderInterval);
        heroSliderInterval = null;
    }
}

function goToHeroSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (!slides.length) return;

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((s, i) => {
        if (i === currentSlide) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });

    dots.forEach((d, i) => {
        if (i === currentSlide) {
            d.classList.add('active');
        } else {
            d.classList.remove('active');
        }
    });

    startHeroAutoSlide();
}

function prevHeroSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    goToHeroSlide(currentSlide - 1);
}

function nextHeroSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    goToHeroSlide(currentSlide + 1);
}

// Aliases for compatibility
function goToSlide(index) { goToHeroSlide(index); }
function prevSlide() { prevHeroSlide(); }
function nextSlide() { nextHeroSlide(); }

/* ─── TOUR SCHEDULE CALENDAR INTERACTION ───────────────── */
const calMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const calDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let currentCalMonth = 9; // October (0-indexed)
let currentCalYear = 2026;

function selectTourDate(day) {
    const days = document.querySelectorAll('.calendar-day');
    days.forEach(d => {
        if (d.textContent.trim() === String(day) && !d.classList.contains('empty')) {
            d.classList.add('selected');
        } else {
            d.classList.remove('selected');
        }
    });

    const heading = document.getElementById('selected-date-heading');
    if (heading) {
        const d = new Date(currentCalYear, currentCalMonth, day);
        const dayName = calDayNames[d.getDay()];
        const monthName = calMonthNames[currentCalMonth];
        heading.textContent = `${dayName}, ${monthName} ${day}, ${currentCalYear}`;
    }
}

function prevCalendarMonth() {
    currentCalMonth--;
    if (currentCalMonth < 0) {
        currentCalMonth = 11;
        currentCalYear--;
    }
    updateCalendarHeader();
}

function nextCalendarMonth() {
    currentCalMonth++;
    if (currentCalMonth > 11) {
        currentCalMonth = 0;
        currentCalYear++;
    }
    updateCalendarHeader();
}

function updateCalendarHeader() {
    const header = document.getElementById('calendar-month-year');
    if (header) {
        header.textContent = `${calMonthNames[currentCalMonth]} ${currentCalYear}`;
    }
    selectTourDate(1);
}

/* ─── CUSTOMER REVIEWS CAROUSEL (1 CARD PER SLIDE, 3 SLIDES) ─── */
let currentReviewIndex = 0;

function updateReviewsCarousel() {
    const track = document.getElementById('reviewsTrack');
    const cards = document.querySelectorAll('.review-carousel-card');
    const dots = document.querySelectorAll('.review-dot');
    if (!track || !cards.length) return;

    const maxIndex = cards.length - 1;

    if (currentReviewIndex > maxIndex) {
        currentReviewIndex = 0;
    }
    if (currentReviewIndex < 0) {
        currentReviewIndex = maxIndex;
    }

    const card = cards[0];
    const cardWidth = card.offsetWidth;
    const computedGap = parseFloat(window.getComputedStyle(track).gap) || 32;
    const slideAmount = (cardWidth + computedGap) * currentReviewIndex;

    const isRTL = document.documentElement.getAttribute('dir') === 'rtl' || document.body.getAttribute('dir') === 'rtl';
    track.style.transform = `translateX(${isRTL ? slideAmount : -slideAmount}px)`;

    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentReviewIndex);
    });
}

function nextCustomerReview() {
    const cards = document.querySelectorAll('.review-carousel-card');
    if (!cards.length) return;
    if (currentReviewIndex >= cards.length - 1) {
        currentReviewIndex = 0;
    } else {
        currentReviewIndex++;
    }
    updateReviewsCarousel();
}

function prevCustomerReview() {
    const cards = document.querySelectorAll('.review-carousel-card');
    if (!cards.length) return;
    if (currentReviewIndex <= 0) {
        currentReviewIndex = cards.length - 1;
    } else {
        currentReviewIndex--;
    }
    updateReviewsCarousel();
}

function goToCustomerReview(index) {
    currentReviewIndex = index;
    updateReviewsCarousel();
}

window.addEventListener('resize', () => {
    if (document.getElementById('reviewsTrack')) {
        updateReviewsCarousel();
    }
});

/* ─── HERO 3D MOUSE PARALLAX TILT ───────────────────────── */
function initHeroParallax() {
    const heroVisuals = document.querySelectorAll('.hero-split-visual');
    if (!heroVisuals.length) return;

    heroVisuals.forEach(visual => {
        const stack = visual.querySelector('.hero-image-stack');
        if (!stack) return;

        visual.addEventListener('mousemove', (e) => {
            const rect = visual.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const tiltX = -(y / rect.height) * 10;
            const tiltY = (x / rect.width) * 10;

            stack.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
        });

        visual.addEventListener('mouseleave', () => {
            stack.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            stack.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        visual.addEventListener('mouseenter', () => {
            stack.style.transition = 'transform 0.1s ease-out';
        });
    });
}

/* ─── DASHBOARD SIDEBAR TOGGLE ─────────────────────────── */
function toggleDashboardSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const backdrop = document.querySelector('.dashboard-backdrop');
    if (!sidebar) return;

    const isOpen = sidebar.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen && window.innerWidth <= 1024 ? 'hidden' : '';
}

function closeDashboardSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const backdrop = document.querySelector('.dashboard-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
}

/* ─── INIT ON DOM READY ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
    injectNav();
    injectFooter();
    injectScrollToTop();
    injectThemeStudio();
    initScrollAnimations();
    animateCounters();
    initHeroSlider();
    initHeroParallax();
    if (document.getElementById('reviewsTrack')) {
        updateReviewsCarousel();
    }
});


