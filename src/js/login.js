document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Usuarios predefinidos
    const validUsers = [
        {
            username: 'Guillermo',
            password: '12345678'
        },
        {
            username: 'Admin',
            password: 'password'
        }
    ];

    // Funcionalidad para mostrar/ocultar contraseña
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '🔓' : '🔒';
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = passwordInput.value;
        const currentLang = getCurrentLang();

        if (password.length < 8) {
            loginError.textContent = translations[currentLang].loginErrorShortPassword;
            return;
        }

        // Verificar si el usuario y la contraseña coinciden con algún usuario válido
        const user = validUsers.find(u => u.username === username && u.password === password);
        if (user) {
            // Login exitoso
            localStorage.setItem('user', JSON.stringify({ username: username }));
            loadTheme(); // Cargamos el tema del usuario
            window.location.href = '/src/pages/home.html';
        } else {
            loginError.textContent = translations[currentLang].loginErrorInvalidCredentials;
        }
    });

    // Actualizar el contenido cuando cambie el idioma
    window.addEventListener('languageChanged', updateLoginPageContent);
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