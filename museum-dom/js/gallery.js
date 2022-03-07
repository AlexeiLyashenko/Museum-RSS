'use strict'

function debounce(fun, ms) {
    let cooldown = false;
    return function () {
        if (cooldown) return

        fun.apply(this, arguments)

        cooldown = true

        setTimeout(() => cooldown = false, ms)
    }
}

const galleryImages = document.querySelectorAll('.gallery__picture img');

function showImg(entry) {
    entry.forEach(image => {
        if(image.isIntersecting) {
            image.target.classList.add('active-image')
        } else {
            image.target.classList.remove('active-image')
        }
    })
}

let options = {
    threshold: [0.3, 0.7],
}

let observer = new IntersectionObserver(debounce(showImg, 20), options)

for (const item of galleryImages) {
    observer.observe(item)
}