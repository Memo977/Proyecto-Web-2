document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const currentCategory = document.body.dataset.category || 'home';
    const searchInput = document.getElementById('search-input');

    function getCurrentLang() {
        return localStorage.getItem('preferredLanguage') || document.documentElement.lang || 'es';
    }

    let currentLang = getCurrentLang();

    function displayPosts(filteredPosts = null, searchTerm = '') { 
        postsContainer.innerHTML = '';
        const postsToDisplay = filteredPosts || filterPostsByCategory(posts, currentCategory);

        if (Object.keys(postsToDisplay).length === 0) {
            currentLang = getCurrentLang();
            postsContainer.innerHTML = `<p class="no-results">${translations[currentLang].noResults}</p>`;
            return;
        }

        let categoryMismatch = false;

        for (const postId in postsToDisplay) {
            const post = postsToDisplay[postId];
            const postCard = createPostCard(post, postId);
            postsContainer.appendChild(postCard);

            // Solo marcamos como mismatch si estamos en una categoría específica
            // y el post no pertenece a esa categoría
            if (currentCategory !== 'home' && 
                !isSameCategory(post.category[currentLang], currentCategory)) {
                categoryMismatch = true;
            }
        }

        if (searchTerm && categoryMismatch) {
            const mismatchMessage = document.createElement('p');
            mismatchMessage.className = 'category-mismatch';
            currentLang = getCurrentLang();
            mismatchMessage.textContent = translations[currentLang].categoryMismatch;
            postsContainer.insertBefore(mismatchMessage, postsContainer.firstChild);
        }
    }

    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const performSearch = debounce(() => {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === '') {
            displayPosts();
            return;
        }

        const filteredPosts = Object.keys(posts).reduce((acc, postId) => {
            const post = posts[postId];
            if (
                post.title[currentLang].toLowerCase().includes(searchTerm) ||
                post.content[currentLang].toLowerCase().includes(searchTerm) ||
                postId.toLowerCase().includes(searchTerm)
            ) {
                acc[postId] = post;
            }
            return acc;
        }, {});

        displayPosts(filteredPosts, searchTerm);
    }, 300);

    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
    }

    window.displayPosts = displayPosts;

    window.addEventListener('pageshow', (event) => {
        currentLang = getCurrentLang();
        if (event.persisted || window.location.pathname.includes('home.html') || currentCategory !== 'home') {
            displayPosts();
        }
    });

    window.addEventListener('languagechange', () => {
        currentLang = getCurrentLang();
        displayPosts();
    });

    displayPosts();
});

function filterPostsByCategory(posts, category) {
    const currentLang = getCurrentLang();
    
    if (category === 'home') {
        return posts;
    }

    const categoryVariants = getCategoryVariants(category);

    return Object.keys(posts).reduce((acc, postId) => {
        const post = posts[postId];
        if (categoryVariants.includes(post.category[currentLang].toLowerCase())) {
            acc[postId] = post;
        }
        return acc;
    }, {});
}

const categoryMap = {
    'autos de carrera': 'category-carrera',
    'autos deportivos': 'category-deportivos',
    'race cars': 'category-carrera',
    'sports cars': 'category-deportivos',
    'سيارات السباق': 'category-carrera',
    'السيارات الرياضية': 'category-deportivos'
};

function formatCategory(category) {
    return categoryMap[category.toLowerCase()] || 'category-default';
}

function createPostCard(post, postId) {
    const currentLang = getCurrentLang();
    const article = document.createElement('article');
    article.className = 'post-card';

    article.innerHTML = `
        <div class="post-card__image-container">
            <img src="${post.image}" alt="${post.title[currentLang]}" class="post-card__image" />
        </div>
        <div class="post-card__content">
            <h3 class="post-card__title">
                <a href="/src/pages/posts/post.html?id=${postId}">${post.title[currentLang]}</a>
            </h3>
            <a href="/src/pages/categorias/${formatCategory(post.category[currentLang])}.html" class="post-card__category">${post.category[currentLang]}</a>
            <p class="post-card__meta">
                ${translations[currentLang].by} ${post.author} | ${post.date[currentLang]}
            </p>
            <p class="post-card__excerpt">
                ${post.content[currentLang].replace(/<\/?[^>]+(>|$)/g, "").substring(0, 150)}...
            </p>
            <a href="/src/pages/posts/post.html?id=${postId}" class="post-card__read-more">${translations[currentLang].readMore}</a>
        </div>
    `;

    return article;
}

function getCurrentLang() {
    return localStorage.getItem('preferredLanguage') || document.documentElement.lang || 'es';
}

// Función auxiliar para comparar categorías
function isSameCategory(postCategory, currentCategory) {
    const categoryVariants = getCategoryVariants(currentCategory);
    return categoryVariants.includes(postCategory.toLowerCase());
}

// Función para obtener todas las variantes de una categoría
function getCategoryVariants(category) {
    const categoryTranslations = {
        'es': {
            'autos de carrera': ['race cars', 'سيارات السباق'],
            'autos deportivos': ['sports cars', 'السيارات الرياضية']
        },
        'en': {
            'race cars': ['autos de carrera', 'سيارات السباق'],
            'sports cars': ['autos deportivos', 'السيارات الرياضية']
        },
        'ar': {
            'سيارات السباق': ['autos de carrera', 'race cars'],
            'السيارات الرياضية': ['autos deportivos', 'sports cars']
        }
    };

    return [
        category.toLowerCase(),
        ...(categoryTranslations['es'][category.toLowerCase()] || []),
        ...(categoryTranslations['en'][category.toLowerCase()] || []),
        ...(categoryTranslations['ar'][category.toLowerCase()] || [])
    ];
}