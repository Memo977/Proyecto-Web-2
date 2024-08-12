document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userDisplay = document.getElementById('userDisplay');
    const logoutButton = document.getElementById('logoutButton');

    if (!user) {
        window.location.href = '/src/pages/login.html';
    } else {
        userDisplay.textContent = `${user.username}`;
        loadTheme(); // Cargamos el tema del usuario
    }

    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('user');
        window.location.href = '/src/pages/login.html';
    });
});

function loadTheme() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const theme = localStorage.getItem(`theme-${user.username}`);
        const root = document.documentElement;
        const themeToggle = document.querySelector('.theme-toggle');
        if (theme === 'light') {
            root.classList.add('light-theme');
            themeToggle.classList.add('theme-toggle--light');
        } else {
            root.classList.remove('light-theme');
            themeToggle.classList.remove('theme-toggle--light');
        }
    }
}