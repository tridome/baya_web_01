document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('#header nav');
    if (!nav) {
        console.error('Navigation element not found: #header nav');
        return;
    }

    // Define breakpoints matching CSS
    const mobileBreakpoint = window.matchMedia('(max-width: 736px)'); // Toggle vs. hover
    const layoutBreakpoint = window.matchMedia('(max-width: 480px)'); // Vertical vs. horizontal
    let isMobile = mobileBreakpoint.matches;
    let isVertical = layoutBreakpoint.matches;

    // Update state on resize
    const updateState = () => {
        const wasMobile = isMobile;
        const wasVertical = isVertical;
        isMobile = mobileBreakpoint.matches;
        isVertical = layoutBreakpoint.matches;

        console.log('isMobile:', isMobile, 'isVertical:', isVertical, 'Window width:', window.innerWidth);

        // Clear dropdowns on layout or mode transition
        if (wasMobile !== isMobile || wasVertical !== isVertical) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
                console.log('Cleared dropdown display for:', menu);
            });
        }
    };

    mobileBreakpoint.addEventListener('change', updateState);
    layoutBreakpoint.addEventListener('change', updateState);
    updateState(); // Initial check

    // Event delegation for dropdown toggle
    nav.addEventListener('click', (e) => {
        console.log('Click event on:', e.target);
        const link = e.target.closest('.dropdown > a');
        if (!link) {
            console.warn('No dropdown link found for click event');
            return;
        }
        if (!isMobile) {
            console.log('Skipping toggle - Not in mobile mode, window width:', window.innerWidth);
            return; // Skip if not mobile
        }

        e.preventDefault();
        const dropdown = link.parentElement;
        const menu = dropdown.querySelector('.dropdown-menu');
        if (!menu) {
            console.warn('Dropdown menu not found for:', dropdown);
            return;
        }

        console.log('Toggling dropdown menu, current display:', menu.style.display);
        // Toggle dropdown using inline styles
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        console.log('New display state:', menu.style.display);

        // Close other open dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
            if (otherMenu !== menu && otherMenu.style.display === 'block') {
                otherMenu.style.display = 'none';
                console.log('Closed other dropdown:', otherMenu);
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!isMobile) return; // Skip if not mobile
        const dropdown = e.target.closest('.dropdown');
        if (!dropdown) {
            console.log('Clicked outside dropdown, closing all, window width:', window.innerWidth);
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });
});

