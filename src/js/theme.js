document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('button.theme-toggle');
  const body = document.body;

  function loadTheme() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const theme = localStorage.getItem(`theme-${user.username}`);
      if (theme === 'light') {
        applyLightTheme();
      } else {
        applyDarkTheme();
      }
    }
  }

  function applyLightTheme() {
    body.classList.add('light-theme');
    themeToggle.classList.add('theme-toggle--light');
    themeToggle.setAttribute('aria-label', 'Switch to dark theme');
  }

  function applyDarkTheme() {
    body.classList.remove('light-theme');
    themeToggle.classList.remove('theme-toggle--light');
    themeToggle.setAttribute('aria-label', 'Switch to light theme');
  }

  themeToggle.addEventListener('click', () => {
    const isLightTheme = body.classList.toggle('light-theme');
    themeToggle.classList.toggle('theme-toggle--light');
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const newTheme = isLightTheme ? 'light' : 'dark';
      localStorage.setItem(`theme-${user.username}`, newTheme);
    }

    if (isLightTheme) {
      themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      themeToggle.setAttribute('aria-label', 'Switch to light theme');
    }
  });

  loadTheme();
});