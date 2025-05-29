document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('closeBanner');
    const banner = document.getElementById('promoBanner');

    if (closeBtn && banner) {
        closeBtn.addEventListener('click', function() {
            banner.style.display = 'none';
        });
    }
});
