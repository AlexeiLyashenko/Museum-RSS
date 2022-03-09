'use strict'

function changeImgOnResize(target, adaptiveUrl, startWindowSize, endWindowSize) {
  let wSize = document.documentElement.clientWidth;
  if (wSize > startWindowSize && wSize <= endWindowSize) {
    target.src = `${adaptiveUrl}`
  }
}

function removeClass(target, className) {
  target.classList.remove(className);
}

// Adaptive Menu

const welcomeBody = document.querySelector('.welcome__body'),
      burger = document.querySelector('.header__burger'),
      headerNavigation = document.querySelector('.adaptive-menu'),
      burgerImages = document.querySelector('.header__images');

burger.addEventListener('click', () => {
  headerNavigation.classList.toggle('visible');
  welcomeBody.classList.toggle('--hidden-item');
  burger.classList.toggle('opened-burger');
  burgerImages.classList.toggle('hidden');  
})


// Scroll to anchors

const welcomeLinks = document.querySelectorAll('.header__navigation > li > a'),
      footerLinks = document.querySelectorAll('.footer__navigation > li > a'),
      anchors = document.querySelectorAll('h2.--anchor');

function scroll(target) {
  target.scrollIntoView( { block: "start", behavior: "smooth" } )
}

welcomeLinks.forEach((link, i) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    scroll(anchors[i])
    headerNavigation.classList.toggle('visible');
    welcomeBody.classList.toggle('--hidden-item');
    burger.classList.toggle('opened-burger');
    burgerImages.classList.toggle('hidden');
  })
})

footerLinks.forEach((link, i) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    scroll(anchors[i])
  })
})

// Burger menu change images on client width 500px

const headerImages = document.querySelectorAll('.header__images>div>img');

const changeImagesOnWindowSize = () => {
  headerImages.forEach((img, i)=> {
    if (document.documentElement.clientWidth <= 420) {
      img.src = `./assets/adaptive-menu-img${(i+1)*4}.png`
    } else if (document.documentElement.clientWidth > 420) {
      img.src = `./assets/adaptive-menu-img${i+1}.png`
    }
  })
}

changeImagesOnWindowSize()

window.addEventListener('resize', changeImagesOnWindowSize)

// Welcome Swiper
const welcomeSwiper = new Swiper('.welcome__swiper-container', {
    direction: 'horizontal',
    loop: true,
    slidesPerView: 1,
    spaceBetween: 13,
    paginationClickable: true,

    pagination: {
      el: '.welcome__swiper-pagination',
      clickable: true,
    },
  
    navigation: {
      nextEl: '.welcome__swiper-button-next',
      prevEl: '.welcome__swiper-button-prev',
    },
});

// Change fraction in Welcome slider

const welcomePrevBtn = document.querySelector('.welcome__swiper-button-next'),
      welcomeNextBtn = document.querySelector('.welcome__swiper-button-prev'),
      currentFr = document.querySelector('.current-fr');

const addFr = (fract, slider) => {
  fract.innerText = `0${slider.realIndex + 1}`;
}

welcomePrevBtn.addEventListener('click', () => {
  addFr(currentFr, welcomeSwiper)
})
welcomeNextBtn.addEventListener('click', () => {
  addFr(currentFr, welcomeSwiper)
})

welcomeSwiper.on('slideChange', () => {
  addFr(currentFr, welcomeSwiper)
})


// Video Swiper

const videoSwiper = new Swiper('.video__swiper-container', {
  direction: 'horizontal',
  loop: true,
  slidesPerView: 3,
  spaceBetween: 42,
  simulateTouch: true,
  grabCursor: true,

  pagination: {
    el: '.video__pagination',
    clickable: true,
  },

  navigation: {
    nextEl: '.video__button-next',
    prevEl: '.video__button-prev',
  },

  breakpoints: {
    769: {
      slidesPerView: 3,
      spaceBetween: 42
    },
    421: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    201: {
      slidesPerView: 2,
      spaceBetween: 20
    },
  }
});

const mainPlayer = document.querySelector('.video__main-player'),
      mainPlayButton = document.querySelector('.video__play-btn-container'),
      playButton = document.querySelector('.video__play'),
      volumeButton = document.querySelector('.video__volume'),
      volumeDuration = document.querySelector('.video__volume-length'),
      videoLength = document.querySelector('.video__length'),
      volumeLength = document.querySelector('.video__volume-length');

// Video main Player

const startPlay = () => {
  mainPlayer.play()
  mainPlayButton.classList.add('hidden-player')
  playButton.classList.add('played')
  // toggleVideoInfo(videoInfo, `Play`)
}

const stopPlay = () => {
  mainPlayer.pause()
  playButton.classList.remove('played')
  mainPlayButton.classList.remove('hidden-player')
  // toggleVideoInfo(videoInfo, `Pause`)
}

const mute = () => {
  volumeButton.classList.add('muted')
}

const unmute = () => {
  volumeButton.classList.remove('muted')
}

// select time & volume range duration
document.addEventListener('DOMContentLoaded', () => {
  mainPlayer.volume = volumeDuration.value / 100;
})


// start/pause playing
mainPlayButton.addEventListener('click', startPlay)

mainPlayer.addEventListener('click', () => {
  mainPlayer.paused ? startPlay() : stopPlay();
})

playButton.addEventListener('click', () => {
  mainPlayer.paused ? startPlay() : stopPlay();
})

// mute volume
let vol = mainPlayer.volume;
volumeDuration.addEventListener('input', () => {
  vol = mainPlayer.volume
})

const muteVol = () => {
  vol = mainPlayer.volume
  mute()
  mainPlayer.volume = 0
  volumeDuration.value = 0
  changeRangeBKG.call(volumeLength)
  toggleVideoInfo(videoInfo, 'Muted')
}

const unmuteVol = () => {
  unmute();
  mainPlayer.volume = vol;
  volumeDuration.value = vol * 100
  changeRangeBKG.call(volumeLength)
  toggleVideoInfo(videoInfo, 'Unmuted')
}

volumeButton.addEventListener('click', () => {
  if (mainPlayer.volume >= 0.01) {
    muteVol()
  } else if (mainPlayer.volume === 0) {
    unmuteVol()
  }
})

// volume range duration
volumeDuration.addEventListener('input', () => {
  let vol = volumeDuration.value / 100
  mainPlayer.volume = vol
  if (vol === 0) {
    mute()
  } else if (!vol == 0) {
    unmute()
  }
})


// time duration

mainPlayer.addEventListener('canplay', () => {
  videoLength.value = Math.floor(mainPlayer.currentTime) / Math.floor(mainPlayer.duration) * 100;
  changeRangeBKG.call(videoLength)
})

mainPlayer.addEventListener('timeupdate', () => {
  videoLength.value =  Math.floor(mainPlayer.currentTime) / Math.floor(mainPlayer.duration) * 100;
  changeRangeBKG.call(videoLength)
})

videoLength.addEventListener('input', () => {
  mainPlayer.currentTime = (mainPlayer.duration * +videoLength.value) / 100
})

// video ended

mainPlayer.addEventListener('ended', () => {
  stopPlay()
})

// Fullscreen

const fullscreenButton = document.querySelector('.video__fullscreen'),
      videoPlayer = document.querySelector('.video__main-video'),
      videoInfo = document.querySelector('.video__info');

fullscreenButton.addEventListener('click', () => {
  !!document.fullscreenElement ? document.exitFullscreen() : videoPlayer.requestFullscreen();
})

// keyboard controls video

document.addEventListener('keydown', (e) => {
  if (e.code == 'Space') {
    e.preventDefault();
    mainPlayer.paused ? startPlay() : stopPlay();
  } else if (e.code == 'KeyM') {
    e.preventDefault();
    mainPlayer.volume >= 0.01 ? muteVol() : unmuteVol();
  } else if (e.code == 'KeyF') {
    e.preventDefault()
    !!document.fullscreenElement ? document.exitFullscreen() : videoPlayer.requestFullscreen();
  }
})

// Video info

let timerId;

function toggleVideoInfo(target, val) {
  //check if the func was called more than once 
  if(typeof timerId === 'number') {
    window.clearTimeout(timerId)
  }
  timerId = setTimeout(removeVideoInfo, 1500)
  target.classList.add('active-info');
  target.innerText = val;

  function removeVideoInfo() {
    target.classList.remove('active-info');
  }
}

function doubleClick(event) {
  if (event.shiftKey && event.code == 'Period') {
    mainPlayer.playbackRate += 0.25;
    toggleVideoInfo(videoInfo, `${mainPlayer.playbackRate}x`)
  } else if (event.shiftKey && event.code == 'Comma') {
    mainPlayer.playbackRate -= 0.25;
    console.log(mainPlayer.playbackRate);
    toggleVideoInfo(videoInfo, `${mainPlayer.playbackRate}x`)
  }
}

document.addEventListener('keyup', doubleClick)

// Video Youtube iframe API
const videoBullets = document.querySelectorAll('.swiper-pagination-bullet'),
      videoArray = ['./assets/video/video0.mp4', './assets/video/video1.mp4', './assets/video/video2.mp4', './assets/video/video3.mp4', './assets/video/video4.mp4'],
      videoPosters = ['./assets/video/poster0.jpg', './assets/video/poster1.jpg', './assets/video/poster2.jpg', './assets/video/poster3.jpg', './assets/video/poster4.jpg', ];

function changeMainVideo(asd) {
  mainPlayer.src = videoArray[asd];
  mainPlayer.poster = videoPosters[asd]
  stopPlay()
}

videoSwiper.on('activeIndexChange', () => changeMainVideo(videoSwiper.realIndex))

// Video Range background-color

function changeRangeBKG() {
  this.style.background = `linear-gradient(to right, #710707 0%, #710707 ${this.value}%, #fff ${this.value}%, white 100%)`
}

document.addEventListener('DOMContentLoaded', () => {
  changeRangeBKG.call(videoLength)
  changeRangeBKG.call(volumeLength)
})

videoLength.addEventListener('input', changeRangeBKG)
volumeLength.addEventListener('input', changeRangeBKG)

// Tickets img adaptive

const ticketsImg = document.querySelector('.tickets__img>img'),
      mapImg = document.querySelector('.contacts__map>img');

      //tickets block
changeImgOnResize(ticketsImg, './assets/img/tickets-img-media.jpg', 200, 420)
changeImgOnResize(ticketsImg ,'./assets/img/tickets-img-1024.jpg', 768, 1024)
changeImgOnResize(ticketsImg ,'./assets/img/tickets-img-768.jpg', 420, 768);


      //map block
changeImgOnResize(mapImg, './assets/img/map-1024.png', 769, 1024)

window.addEventListener('resize', () => {
  changeImgOnResize(ticketsImg ,'./assets/img/tickets-img-media.jpg', 200, 420)
  changeImgOnResize(ticketsImg ,'./assets/img/tickets-img-1024.jpg', 768, 1024)
  changeImgOnResize(ticketsImg ,'./assets/img/tickets-img-768.jpg', 420, 768);
  changeImgOnResize(mapImg, './assets/img/map-1024.png', 769, 1024)
})

// Tickets calculate

function upTicketsCount(target) {
  target.value++
}

function downTicketsCount(target) {
  if(target.value > 0) target.value-- 
}

// calculate tickets price

function calculatePrice() {
  ticketTypes.forEach(radio => {
    if(radio.checked) {
      let totalPrice = (radio.value * basicQuantity.value) + ((radio.value / 2) * seniorQuantity.value)
      priceOut.innerText = totalPrice
      popUpTotalPrice.textContent = totalPrice
      localStorage.setItem('ticketType', radio.id)
      localStorage.setItem('basicQuantity', basicQuantity.value)
      localStorage.setItem('seniorQuantity', seniorQuantity.value)
      ticketTypeRightStatus.textContent = radio.dataset.name;
    }
    calculateTypePrice(popUpBasicTotalPrice, basicAmountRight.textContent, 20)
    calculateTypePrice(popUpSeniorTotalPrice, seniorAmountRight.textContent, 10)
  })
}

function calculateTypePrice(target, count, ticketTypePrice) {
  target.textContent = +count * ticketTypePrice;
}

const radios = document.querySelectorAll('.tickets__type input[type="radio"]'),
      ticketsPrice = document.querySelector('.tickets__total span'),
      upBtn = document.querySelectorAll('.up'),
      downBtn = document.querySelectorAll('.down'),
      basicQuantity = document.querySelector('input[name="basic-quantity"]'),
      seniorQuantity = document.querySelector('input[name="senior-quantity"]'),
      priceOut = document.querySelector('.tickets__total>span'),
      ticketTypes = document.querySelectorAll('.tickets__type input[type="radio"]'),
      popUpTotalPrice = document.querySelector('.booking__right-total-price span'),
      ticketTypeRightStatus = document.querySelector('.booking__right-status-text'),
      ticketTypePopUpSelect = document.querySelector('.booking__select'),
      popUpBasicTotalPrice = document.querySelector('.booking__right-basic-price span'),
      popUpSeniorTotalPrice = document.querySelector('.booking__right-senior-price span'),
      basicAmountRight = document.querySelector('.booking__right-basic-amount'),
      seniorAmountRight = document.querySelector('.booking__right-senior-amount');

// load info from localStorage
radios.forEach(radio => {
  if (radio.id === localStorage.getItem('ticketType')) {
    radio.checked = true;
  } else if (localStorage.getItem('basicQuantity')) {
    basicQuantity.value = +localStorage.getItem('basicQuantity');
  } 
  if (localStorage.getItem('seniorQuantity')) {
    seniorQuantity.value = +localStorage.getItem('seniorQuantity');
  }
})
calculatePrice()


// tickets quantity

const basicAmount = document.querySelector('.booking__basic-amount'),
      seniorAmount = document.querySelector('.booking__senior-amount'),
      basicAmountMinus = document.querySelector('.booking__basic-minus'),
      basicAmountPlus = document.querySelector('.booking__basic-plus'),
      seniorAmountMinus = document.querySelector('.booking__senior-minus'),
      seniorAmountPlus = document.querySelector('.booking__senior-plus');

upBtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.parentElement.classList.contains('tickets__basic-quantity')) {
      upTicketsCount(basicQuantity)
      calculatePrice()
      calculateTypePrice(popUpBasicTotalPrice, basicAmountRight.textContent, 20)
    } else if (e.target.parentElement.classList.contains('tickets__senior-quantity')) {
      upTicketsCount(seniorQuantity)
      calculatePrice()
      calculateTypePrice(popUpSeniorTotalPrice, seniorAmountRight.textContent, 10)
    } else if (e.target.parentElement.classList.contains('basic')) {
      upTicketsCount(basicAmount)
      upTicketsCount(basicQuantity)
      ++basicAmountRight.textContent;
      calculatePrice()
      calculateTypePrice(popUpBasicTotalPrice, basicAmountRight.textContent, 20)
    } else if (e.target.parentElement.classList.contains('senior')) {
      upTicketsCount(seniorAmount)
      upTicketsCount(seniorQuantity)
      ++seniorAmountRight.textContent;
      calculatePrice()
      calculateTypePrice(popUpSeniorTotalPrice, seniorAmountRight.textContent, 10)
    }
  })
})

downBtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.parentElement.classList.contains('tickets__basic-quantity')) {
      downTicketsCount(basicQuantity)
      calculatePrice()
      calculateTypePrice(popUpBasicTotalPrice, basicAmountRight.textContent, 20)
    } else if (e.target.parentElement.classList.contains('tickets__senior-quantity')) {
      downTicketsCount(seniorQuantity)
      calculatePrice()
      calculateTypePrice(popUpSeniorTotalPrice, seniorAmountRight.textContent, 10)
    } else if (e.target.parentElement.classList.contains('basic')) {
      downTicketsCount(basicAmount)
      downTicketsCount(basicQuantity)
      if(basicAmountRight.textContent > 0) {
        --basicAmountRight.textContent;
      }
      calculatePrice()
      calculateTypePrice(popUpBasicTotalPrice, basicAmountRight.textContent, 20)
    } else if (e.target.parentElement.classList.contains('senior')) {
      downTicketsCount(seniorAmount)
      downTicketsCount(seniorQuantity)
      if(seniorAmountRight.textContent > 0) {
        --seniorAmountRight.textContent;
      }
      calculatePrice()
      calculateTypePrice(popUpSeniorTotalPrice, seniorAmountRight.textContent, 10)
    }
  })
})

ticketTypes.forEach(radio => {
  radio.addEventListener('change', calculatePrice)
})

// Ticket type popup select

ticketTypePopUpSelect.addEventListener('change', () => {
  for (let i = 0; i < ticketTypePopUpSelect.children.length; i++) {
    if(ticketTypePopUpSelect.children[i].selected) {
      ticketTypes[i].checked = true;
      calculatePrice()
    }
  }
})

// Buy Tickets

const buyBtn = document.querySelector('.tickets__buy-now'),
      booking = document.querySelector('.booking'),
      overlay = document.querySelector('.overlay'),
      closeBooking = document.querySelector('.booking__close');

buyBtn.addEventListener('click', () => {
  booking.classList.toggle('visible-booking')
  overlay.classList.toggle('visible')

  basicAmount.value = +localStorage.getItem('basicQuantity');
  basicAmountRight.textContent = +localStorage.getItem('basicQuantity');
  seniorAmount.value = +localStorage.getItem('seniorQuantity');
  seniorAmountRight.textContent = +localStorage.getItem('seniorQuantity');
  calculatePrice()

  for (let i = 0; i < ticketTypes.length; i++) {
    if(ticketTypes[i].checked) {
      ticketTypePopUpSelect.children[i].selected = true;
    }
  }
})
overlay.addEventListener('click', () => {
  removeClass(booking, 'visible-booking')
  removeClass(overlay, 'visible')
})

closeBooking.addEventListener('click', () => {
  removeClass(booking, 'visible-booking')
  removeClass(overlay, 'visible')
})


// Booking

