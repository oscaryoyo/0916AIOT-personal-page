/* ==========================================================================
   LIN KUAN-YU (林冠佑) - FULL-WIDTH PORTFOLIO LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const ampmEl = document.getElementById('ampm');
    const dateDisplayEl = document.getElementById('dateDisplay');
    const dayOfWeekVal = document.getElementById('dayOfWeekVal');
    const dayInYearVal = document.getElementById('dayInYearVal');
    const timezoneVal = document.getElementById('timezoneVal');
    const utcBadge = document.getElementById('utcBadge');

    // Theme Buttons
    const themeButtons = document.querySelectorAll('.theme-btn');

    /* ==========================================================================
       1. Real-Time Clock & Metadata Calculations
       ========================================================================== */
    function updateClock() {
        const now = new Date();

        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const isPm = hours >= 12;

        const displayHours = hours % 12 || 12;
        const formattedHours = String(displayHours).padStart(2, '0');

        if (hoursEl) hoursEl.textContent = formattedHours;
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds;
        if (ampmEl) ampmEl.textContent = isPm ? 'PM' : 'AM';

        updateDateMetadata(now);
    }

    function updateDateMetadata(now) {
        // Date String (Traditional Chinese + English)
        const optionsZh = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        const dateStrZh = now.toLocaleDateString('zh-TW', optionsZh);
        if (dateDisplayEl) dateDisplayEl.textContent = dateStrZh;

        // Day of Week
        const daysZh = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
        if (dayOfWeekVal) dayOfWeekVal.textContent = daysZh[now.getDay()];

        // Day in Year Calculation
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = now - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayInYear = Math.floor(diff / oneDay);
        if (dayInYearVal) dayInYearVal.textContent = `Day ${dayInYear}`;

        // Timezone detection
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Taipei';
            const city = timeZone.split('/')[1] || 'Taipei';
            if (timezoneVal) timezoneVal.textContent = city;

            const offsetMinutes = -now.getTimezoneOffset();
            const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
            const sign = offsetMinutes >= 0 ? '+' : '-';
            if (utcBadge) utcBadge.textContent = `UTC${sign}${offsetHours}`;
        } catch (e) {
            if (timezoneVal) timezoneVal.textContent = 'Taipei';
            if (utcBadge) utcBadge.textContent = 'UTC+8';
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    /* ==========================================================================
       2. Dynamic Theme Switcher
       ========================================================================== */
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.getAttribute('data-theme-val');

            document.documentElement.setAttribute('data-theme', selectedTheme);

            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            try {
                localStorage.setItem('user-theme-fire', selectedTheme);
            } catch (e) { }
        });
    });

    try {
        const savedTheme = localStorage.getItem('user-theme-fire');
        if (savedTheme) {
            const matchingBtn = document.querySelector(`.theme-btn[data-theme-val="${savedTheme}"]`);
            if (matchingBtn) {
                matchingBtn.click();
            }
        }
    } catch (e) { }

    /* ==========================================================================
       3. Active Navigation Link Highlighting on Scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
});
