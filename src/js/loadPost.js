document.addEventListener('DOMContentLoaded', () => {
    loadPost();
});

function loadPost() {
    const postId = new URLSearchParams(window.location.search).get('id');
    const post = posts[postId];
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (post) {
        document.getElementById('hero-image').src = post.heroImage;
        currentLang = getCurrentLang();
        document.getElementById('hero-image').alt = post.title[currentLang];
        document.getElementById('hero-title').textContent = post.title[currentLang];
        
        document.getElementById('post-author').textContent = `${translations[currentLang].by} ${post.author}`;
        document.getElementById('post-date').textContent = post.date[currentLang];
        
        document.getElementById('post-content').innerHTML = post.content[currentLang];
        
        document.title = `${post.title[currentLang]} - AutoBlog`;
        
        if (user) {
            const savedRating = localStorage.getItem(`rating-${user.username}-${postId}`);
            if (savedRating) {
                updateStars(savedRating);
            }
        }
    } else {
        document.getElementById('post-content').innerHTML = `<p>${translations[currentLang].postNotFound}</p>`;
    }

    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            if (user) {
                const rating = star.dataset.value;
                localStorage.setItem(`rating-${user.username}-${postId}`, rating);
                updateStars(rating);
            } else {
                alert(translations[currentLang].loginToRate);
            }
        });
    });
}

function updateStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.textContent = star.dataset.value <= rating ? '★' : '☆';
    });
}

// Función para actualizar el contenido del post cuando se cambia el idioma
function updatePostContent() {
    loadPost();
}