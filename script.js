/* ==========================================================================
   LIN KUAN-YU (林冠佑) - FIERY WARM THEME & CLOCK LOGIC
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
       1. Real-Time Clock & Dynamic Fiery Context
       ========================================================================== */
    function updateClock() {
        const now = new Date();

        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const isPm = hours >= 12;

        const displayHours = hours % 12 || 12;
        const formattedHours = String(displayHours).padStart(2, '0');

        hoursEl.textContent = formattedHours;
        minutesEl.textContent = minutes;
        secondsEl.textContent = seconds;
        ampmEl.textContent = isPm ? 'PM' : 'AM';

        updateGreeting(hours);
        updateDateDisplay(now);
    }

    function updateGreeting(hour) {
        let greeting = '大家好，我是林冠佑！';
        let icon = '🔥';

        if (hour >= 5 && hour < 12) {
            greeting = '早安！我是林冠佑 ☕';
            icon = '🌅';
        } else if (hour >= 12 && hour < 17) {
            greeting = '午安！我是林冠佑 ☀️';
            icon = '🔥';
        } else if (hour >= 17 && hour < 22) {
            greeting = '晚安！我是林冠佑 🌇';
            icon = '🌆';
        } else {
            greeting = '夜貓模式 🦉 我是林冠佑';
            icon = '🌌';
        }

        greetingIconEl.textContent = icon;
        greetingTextEl.textContent = greeting;
    }

    function updateDateDisplay(now) {
        const optionsEn = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        const dateStrEn = now.toLocaleDateString('en-US', optionsEn);

        const optionsZh = { month: 'long', day: 'numeric', weekday: 'short' };
        const dateStrZh = now.toLocaleDateString('zh-TW', optionsZh);

        dateDisplayEl.textContent = `${dateStrEn} • ${dateStrZh}`;

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

    updateClock();
    setInterval(updateClock, 1000);

    /* ==========================================================================
       2. Dynamic Theme Switcher (Ignition, Solar, Inferno)
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

            const rotateX = (-mouseY / (rect.height / 2)) * 5;
            const rotateY = (mouseX / (rect.width / 2)) * 5;

            mainCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
        });

        wrapper.addEventListener('mouseleave', () => {
            mainCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    }
});
