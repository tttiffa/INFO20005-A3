document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('closeBanner');
    const banner = document.getElementById('promoBanner');

    if (closeBtn && banner) {
        closeBtn.addEventListener('click', function() {
            banner.style.display = 'none';
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('searchInput');
    const suggestionsList = document.getElementById('suggestions-list');

    const suggestions = [
        'makeup > face > primer',
        'brand > peripera',
        'product > p&g fragrance softener beads 470ml'
    ];

    function setLastWord(item) {
        const parts = item.split('>');
        const lastPart = parts[parts.length - 1].trim();
        input.value = lastPart;
    }

    input.addEventListener('input', function() {
        const value = this.value.toLowerCase().trim();
        suggestionsList.innerHTML = '';

        if (value) {
            const matchedItems = suggestions.filter(item => item.toLowerCase().includes(value));

            matchedItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                li.addEventListener('click', function() {
                    setLastWord(item);
                    suggestionsList.classList.remove('show');
                    suggestionsList.innerHTML = '';
                });
                suggestionsList.appendChild(li);
            });

            if (matchedItems.length > 0) {
                suggestionsList.classList.add('show');
            } else {
                suggestionsList.classList.remove('show');
            }
        } else {
            suggestionsList.classList.remove('show');
        }
    });
    /* Only show the corresponding results */

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();         
            const value = this.value.toLowerCase().trim();
            const firstMatch = suggestions.find(item => item.toLowerCase().includes(value));
            if (firstMatch) {
                setLastWord(firstMatch);
                suggestionsList.classList.remove('show');
                suggestionsList.innerHTML = '';
            }
        }
    });
      /*prevent directly submission when users pressed 'Enter' key, showing the first match*/

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-bar')) {
            suggestionsList.classList.remove('show');
        }
    });
});
/* Close the 'suggestion list' if users click anywhere else*/