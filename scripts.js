document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Tab switching functionality - fixed version
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabName = button.dataset.tab;
            document.querySelector(`.tab-pane[data-tab="${tabName}"]`).classList.add('active');
        });
    });

    // Update JavaScript for theme-aware colors
    const colorMap = {
        dark: {
            'yellow': {
                color: '#B59E00'
            },
            'green': {
                color: '#2EA043'
            },
            'red': {
                color: '#CF222E'
            },
            'cyan': {
                color: '#0991B2'
            },
            'blue': {
                color: '#2F81F7'
            },
            'mono': {
                color: '#FFFFFF'
            }
        },
        light: {
            'yellow': {
                color: '#826F00'
            },
            'green': {
                color: '#2EA043'
            },
            'red': {
                color: '#CF222E'
            },
            'cyan': {
                color: '#0991B2'
            },
            'blue': {
                color: '#2F81F7'
            },
            'mono': {
                color: '#000000'
            }
        }
    };

    document.querySelectorAll('.accent-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            const colorScheme = colorMap[theme][btn.dataset.color];
            document.documentElement.style.setProperty('--accent', colorScheme.color);

            // Remove active class from all buttons and add to the clicked one
            document.querySelectorAll('.accent-btn').forEach(button => {
                button.classList.remove('active');
            });
            btn.classList.add('active'); // Add active class to the clicked button
        });
    });

    const checkOverflow = () => {
        document.body.style.overflow = 
            document.documentElement.scrollHeight > window.innerHeight 
            ? 'auto' 
            : 'hidden';
    };

    // Check on load and resize
    window.addEventListener('load', checkOverflow);
    window.addEventListener('resize', checkOverflow);

    // Update theme toggle to handle chromatic colors
    const themeToggle = document.querySelector('.theme-toggle');

    // Function to get system theme preference
    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Function to set theme
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = themeToggle.querySelector('.material-symbols-rounded');
        icon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
    };

    // Initialize theme based on system preference
    window.addEventListener('load', () => {
        // Check if user has previously set a theme preference
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            // Use saved theme if it exists
            setTheme(savedTheme);
        } else {
            // Use system theme if no saved preference
            setTheme(getSystemTheme());
        }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if user hasn't set a manual preference
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Update theme toggle to save preference
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Save user preference
        localStorage.setItem('theme', newTheme);
        
        setTheme(newTheme);
        
        // Handle accent colors
        const currentColor = document.documentElement.style.getPropertyValue('--accent');
        const colorName = Object.keys(colorMap.dark).find(key => 
            colorMap.dark[key].color === currentColor || colorMap.light[key].color === currentColor
        );
        if (colorName) {
            const colorScheme = colorMap[newTheme][colorName];
            document.documentElement.style.setProperty('--accent', colorScheme.color);
        }
    });

    // Message cycling functionality
    const messageContainer = document.querySelector('.message-container');
    const messages = document.querySelectorAll('.message');
    let currentIndex = 0;

    messageContainer.addEventListener('click', () => {
        // Hide current message
        messages[currentIndex].classList.remove('active');
        
        // Move to next message (cycle back to start if at end)
        currentIndex = (currentIndex + 1) % messages.length;
        
        // Show new message
        messages[currentIndex].classList.add('active');
    });
}); 