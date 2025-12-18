// Main JS for PopIT Website
console.log('PopIT Scripts Loaded');

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: remove observer if we only want animation once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));


    // Scroller Logic (Enhancement for duplicated content is handled manually in HTML for simplicity, 
    // but we can add check for reduced motion here)
    const scrollers = document.querySelectorAll(".scroller");

    // If a user hasn't opted in for reduced motion, then we add the animation
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation();
    }

    function addAnimation() {
        scrollers.forEach((scroller) => {
            // add data-animated="true" to every `.scroller` on the page
            scroller.setAttribute("data-animated", "true");
        });
    }

    // =========================================
    // VIDEO CAROUSEL SEQUENTIAL LOGIC
    // =========================================
    const videoCarousel = document.getElementById('popitVideoCarousel');
    if (videoCarousel) {
        const carouselInstance = new bootstrap.Carousel(videoCarousel, {
            interval: false, // Disable auto-sliding by time
            wrap: true
        });

        const videos = videoCarousel.querySelectorAll('video');

        // Function to play a specific video
        const playVideo = (video) => {
            video.currentTime = 0;
            video.play().catch(e => console.log("Autoplay blocked:", e));
        };

        // Function to pause all videos
        const pauseAllVideos = () => {
            videos.forEach(v => v.pause());
        };

        // 1. Setup 'ended' event listeners on all videos
        videos.forEach(video => {
            video.addEventListener('ended', () => {
                carouselInstance.next(); // Go to next slide when video finishes
            });
        });

        // 2. Listen for carousel slide events
        videoCarousel.addEventListener('slid.bs.carousel', (e) => {
            pauseAllVideos(); // Stop previous
            const activeSlide = e.relatedTarget;
            const video = activeSlide.querySelector('video');
            if (video) playVideo(video);
        });

        // 3. Start the first video immediately (if visible)
        // Check if IntersectionObserver is already verifying visibility, 
        // to avoid playing if user hasn't scrolled down yet.
        const observerVideo = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeItem = videoCarousel.querySelector('.carousel-item.active');
                    const video = activeItem ? activeItem.querySelector('video') : null;
                    if (video && video.paused) playVideo(video);
                } else {
                    pauseAllVideos();
                }
            });
        }, { threshold: 0.5 });

        observerVideo.observe(videoCarousel);
    }

    // =========================================
    // SCROLL SCALE EFFECT (Somos PopIT)
    // =========================================
    const somosImage = document.querySelector('.imagen_somos');
    if (somosImage) {
        window.addEventListener('scroll', () => {
            const rect = somosImage.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementCenter = rect.top + rect.height / 2;
            const windowCenter = windowHeight / 2;
            const distance = Math.abs(windowCenter - elementCenter);
            const maxDistance = windowHeight;
            let scale = 1.1 - (distance / maxDistance) * 0.25;
            scale = Math.min(Math.max(scale, 0.85), 1.1);
            somosImage.style.transform = `scale(${scale})`;
        });
    }
});
