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

/*hero section: shop now button*/
const banners = document.querySelectorAll('.banner-img');
const shopBtn = document.querySelector('.shop-now-btn');
let currentIndex = 0;

function showBanner(index) {
    banners.forEach((banner, i) => {
        banner.classList.toggle('active', i === index);
    });

    const activeBanner = banners[index];
    const showButton = activeBanner.getAttribute('data-button-visible') === 'true';
    shopBtn.style.display = showButton ? 'inline-block' : 'none';
}

function nextBanner() {
    currentIndex = (currentIndex + 1) % banners.length;
    showBanner(currentIndex);
}

function prevBanner() {
    currentIndex = (currentIndex - 1 + banners.length) % banners.length;
    showBanner(currentIndex);
}

document.querySelector('.left-arrow').addEventListener('click', prevBanner);
document.querySelector('.right-arrow').addEventListener('click', nextBanner);
showBanner(currentIndex);



/* pop-up navigation on desktop homepage */
  const makeupTrigger = document.querySelector('.makeup-trigger');
    const makeupDropdown = document.getElementById('makeupDropdown');
    const faceBtn = document.querySelector('.face-btn');
    const faceSub = document.getElementById('faceSub');

/* Open or close the pop-up navigation bar for destop version*/
    makeupTrigger.addEventListener('click', function (e) {
      e.preventDefault();
      makeupDropdown.style.display =
        makeupDropdown.style.display === 'flex' ? 'none' : 'flex';
      /* hide the third column everytime when open*/
      faceSub.classList.remove('show');
    });

    /*Click face to show the third column*/
    faceBtn.addEventListener('click', function (e) {
      e.preventDefault();
      faceSub.classList.toggle('show');
    });

    /* Click other place to close the whole pop-up*/
    document.addEventListener('click', function (e) {
      if (
        !makeupTrigger.contains(e.target) &&
        !makeupDropdown.contains(e.target)
      ) {
        makeupDropdown.style.display = 'none';
        faceSub.classList.remove('show');
      }

});



    