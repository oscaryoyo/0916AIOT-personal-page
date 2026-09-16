/* ==========================================================================
   LIN KUAN-YU (林冠佑) - PERSONAL PAGE LOGIC
   Features: Real-time High Precision Clock, Dynamic Greeting, Theme Switcher,
             3D Card Parallax Tilt Effect
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const ampmEl = document.getElementById('ampm');
    const greetingIconEl = document.getElementById('greetingIcon');
    const greetingTextEl = document.getElementById('greetingText');
    const dateDisplayEl = document.getElementById('dateDisplay');
    const timezoneDisplayEl = document.getElementById('timezoneDisplay');
    const mainCard = document.getElementById('mainCard');

    // Theme Buttons
    const themeButtons = document.querySelectorAll('.theme-btn');

    /* ==========================================================================
       1. Real-Time Clock & Dynamic Context
       ========================================================================== */
    function updateClock() {
        const now = new Date();

        // Hours, Minutes, Seconds
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const isPm = hours >= 12;

        // Convert to 12-hour format for clock display
        const displayHours = hours % 12 || 12;
        const formattedHours = String(displayHours).padStart(2, '0');

        // Update DOM Clock
        hoursEl.textContent = formattedHours;
        minutesEl.textContent = minutes;
        secondsEl.textContent = seconds;
        ampmEl.textContent = isPm ? 'PM' : 'AM';

        // Update Dynamic Greeting (based on 24h format)
        updateGreeting(hours);

        // Update Date Display
        updateDateDisplay(now);
    }

    function updateGreeting(hour) {
        let greeting = 'Hello';
        let icon = '✨';

        if (hour >= 5 && hour < 12) {
            greeting = 'Good Morning';
            icon = '☕';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good Afternoon';
            icon = '☀️';
        } else if (hour >= 17 && hour < 22) {
            greeting = 'Good Evening';
            icon = '🌇';
        } else {
            greeting = 'Night Owl Mode';
            icon = '🦉';
        }

        greetingIconEl.textContent = icon;
        greetingTextEl.textContent = `${greeting}, 林冠佑`;
    }

    function updateDateDisplay(now) {
        // English Date Format
        const optionsEn = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        const dateStrEn = now.toLocaleDateString('en-US', optionsEn);

        // Traditional Chinese Date Format
        const optionsZh = { month: 'long', day: 'numeric', weekday: 'short' };
        const dateStrZh = now.toLocaleDateString('zh-TW', optionsZh);

        dateDisplayEl.textContent = `${dateStrEn} • ${dateStrZh}`;

        // Timezone detection
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Taipei';
            const offsetMinutes = -now.getTimezoneOffset();
            const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
            const sign = offsetMinutes >= 0 ? '+' : '-';
            const utcString = `UTC${sign}${offsetHours}`;

            timezoneDisplayEl.textContent = `${timeZone} • ${utcString}`;
        } catch (e) {
            timezoneDisplayEl.textContent = 'Asia/Taipei • UTC+8';
        }
    }

    // Initial call & tick every second
    updateClock();
    setInterval(updateClock, 1000);

    /* ==========================================================================
       2. Dynamic Theme Switcher
       ========================================================================== */
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.getAttribute('data-theme-val');
            
            // Set root attribute
            document.documentElement.setAttribute('data-theme', selectedTheme);
            
            // Toggle active state
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Save preference to localStorage if available
            try {
                localStorage.setItem('user-theme', selectedTheme);
            } catch (e) {
                // Ignore storage errors
            }
        });
    });

    // Restore saved theme on startup
    try {
        const savedTheme = localStorage.getItem('user-theme');
        if (savedTheme) {
            const matchingBtn = document.querySelector(`.theme-btn[data-theme-val="${savedTheme}"]`);
            if (matchingBtn) {
                matchingBtn.click();
            }
        }
    } catch (e) {
        // Ignore storage errors
    }

    /* ==========================================================================
       3. Interactive 3D Card Parallax Tilt Effect
       ========================================================================== */
    if (window.matchMedia('(pointer: fine)').matches) {
        const wrapper = document.querySelector('.page-wrapper');

        wrapper.addEventListener('mousemove', (e) => {
            const rect = mainCard.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            // Calculate tilt angle (-6 deg to +6 deg)
            const rotateX = (-mouseY / (rect.height / 2)) * 6;
            const rotateY = (mouseX / (rect.width / 2)) * 6;

            mainCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;
        });

        wrapper.addEventListener('mouseleave', () => {
            mainCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    }
});
