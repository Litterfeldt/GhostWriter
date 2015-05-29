setTimeout(function() {
    Waves.displayEffect();
    Mi.motion.pushDown({
        selector: '.push-down'
    });
    Mi.motion.fadeSlideInRight({
        selector: '.animate-fade-slide-in-right > *'
    });
}, 1000);
