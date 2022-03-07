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
      priceOut.innerText = (radio.value * basicQuantity.value) + ((radio.value / 2) * seniorQuantity.value)
      localStorage.setItem('ticketType', radio.id)
      localStorage.setItem('basicQuantity', basicQuantity.value)
      localStorage.setItem('seniorQuantity', seniorQuantity.value)
    }
  })
}

const radios = document.querySelectorAll('.tickets__type input[type="radio"]'),
      ticketsPrice = document.querySelector('.tickets__total span'),
      upBtn = document.querySelectorAll('.up'),
      downBtn = document.querySelectorAll('.down'),
      basicQuantity = document.querySelector('input[name="basic-quantity"]'),
      seniorQuantity = document.querySelector('input[name="senior-quantity"]'),
      priceOut = document.querySelector('.tickets__total>span'),
      ticketTypes = document.querySelectorAll('.tickets__type input[type="radio"]');


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
upBtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (e.target.parentElement.classList.contains('tickets__basic-quantity')) {
      upTicketsCount(basicQuantity)
      calculatePrice()
    } else if (e.target.parentElement.classList.contains('tickets__senior-quantity')) {
      upTicketsCount(seniorQuantity)
      calculatePrice()
    }
  })
})

downBtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (e.target.parentElement.classList.contains('tickets__basic-quantity')) {
      downTicketsCount(basicQuantity)
      calculatePrice()
    } else if (e.target.parentElement.classList.contains('tickets__senior-quantity')) {
      downTicketsCount(seniorQuantity)
      calculatePrice()
    }
  })
})

ticketTypes.forEach(radio => {
  radio.addEventListener('change', calculatePrice)
}) 

// Buy Tickets

const buyBtn = document.querySelector('.tickets__buy-now'),
      booking = document.querySelector('.booking'),
      overlay = document.querySelector('.overlay'),
      closeBooking = document.querySelector('.booking__close');

buyBtn.addEventListener('click', () => {
  booking.classList.toggle('visible-booking')
  overlay.classList.toggle('visible')
})
overlay.addEventListener('click', () => {
  removeClass(booking, 'visible-booking')
  removeClass(overlay, 'visible')
})

closeBooking.addEventListener('click', () => {
  removeClass(booking, 'visible-booking')
  removeClass(overlay, 'visible')
})

window.addEventListener('DOMContentLoaded', () => {
  console.log(
    `Ваша оценка - 103 балла 
    Отзыв по пунктам ТЗ:
    Не выполненные/не засчитанные пункты:
    1) если внутри слайда проигрывается видео с YouTube, клик по стрелке перелистывания слайдов или клик по буллету останавливает проигрывание видео 
    
    2) ползунок можно перетягивать мышкой по горизонтали 
    
    3) ползунок никогда не выходит за границы картины 
    
    4) при перемещении ползунка справа налево плавно появляется нижняя картина 
    
    5) при перемещении ползунка слева направо плавно появляется верхняя картина 
    
    6) при обновлении страницы ползунок возвращается в исходное положение 
    
    7) когда при клике по кнопке Buy now открывается форма, она уже содержит данные, указанные на странице сайта - количество билетов, их тип, общая цена за них 
    
    8) когда пользователь выбирает дату в форме слева, она отображается в билете справа 
    
    9) нельзя выбрать дату в прошлом 
    
    10) когда пользователь выбирает время в форме слева, оно отображается в билете справа 
    
    11) время можно выбирать с 9:00 до 18:00 с интервалом в 30 минут 
    
    12) можно изменить тип билета в поле Ticket type слева при этом меняется тип билета, цена билета и общая стоимость билетов справа 
    
    13) можно изменить количество билетов каждого типа в поле слева при этом меняется количество билетов и общая стоимость билетов справа 
    
    14) валидация имени пользователя. Имя пользователя должно содержать от 3 до 15 символов, в качестве символов могут быть использованы буквы английского или русского алфавита в нижнем или верхнем регистре и пробелы 
    
    15) валидация e-mail должна пропукать только адреса вида username@example.com, где: username - имя пользователя, должно содержать от 3 до 15 символов (буквы, цифры, знак подчёркивания, дефис), не должно содержать пробелов; @ - символ собачки; example - домен первого уровня состоит минимум из 4 латинских букв; com - домен верхнего уровня, отделяется от домена первого уровня точкой и состоит минимум из 2 латинских букв 
    
    16) валидация номера телефона: номер содержит только цифры; без разделения или с разделением на две или три цифры; разделение цифр может быть через дефис или пробел; с ограничением по количеству цифр не больше 10 цифр 
    
    17) при попытке ввода в форму невалидного значения выводится предупреждение, например, "номер телефона может содержать только цифры" 
    
    18) на карте отображаются маркеры, расположение и внешний вид маркеров соответствует макету 
    
    19) Любой собственный дополнительный функционал, улучшающий качество проекта. Например, ночная тема, плавная смена изображений в блоке Tickets, всплывающее окно с информацией про картины и их авторов, кнопка прокрутки страницы вверх, возможность проголосовать за понравившиеся картины с сохранением данных в local storage, всё зависит от вашей фантазии и чувства вкуса. Для удобства проверки выполненный вами дополнительный функционал включите в самооценку, которую выведите в консоль браузера 
    
    Частично выполненные пункты:
    1) если видео с YouTube проигрывается, клик по кнопке Pause останавливает его проигрывание. Также проигрывание видео останавливается, если кликнуть по другому слайду или кнопке Play в центре другого слайда. В указанной ситуации другое видео должно запуститься, а текущее остановиться. Невозможно проигрывание нескольких YouTube видео одновременно 
    
    Выполненные пункты:
    1) есть возможность перелистывания слайдов влево и вправо кликами по стрелкам 
    
    2) есть возможность перелистывания слайдов влево и вправо свайпами (движениями) мышки 
    
    3) есть возможность перелистывания слайдов кликами по буллетам (квадратики внизу слайдера) 
    
    4) слайды перелистываются плавно с анимацией смещения вправо или влево 
    
    5) перелистывание слайдов бесконечное (зацикленное) 
    
    6) при перелистывании слайдов буллет активного слайда подсвечивается (выделяется стилем) 
    
    7) при перелистывании слайдов кликами или свайпами меняется номер активного слайда 
    
    8) даже при частых кликах или свайпах нет ситуации, когда слайд после перелистывания находится не по центру, нет ситуации, когда видны одновременно два слайда 
    
    9) при клике по самому слайду или кнопке Play в центре слайда, внутри слайда проигрывается видео с YouTube. Никакие изменения с основным видео при этом не происходят 
    
    10) есть возможность перелистывания слайдов с видео влево и вправо кликами по стрелкам. Слайды перелистываются по одному, при этом также меняется основное видео 
    
    11) есть возможность перелистывания слайдов кликами по буллетам (кружочки внизу слайдера), при этом также меняется основное видео 
    
    12) слайды перелистываются плавно с анимацией смещения вправо или влево (для смены основного видео анимация смещения не требуется и не проверяется) 
    
    13) перелистывание слайдов бесконечное (зацикленное) 
    
    14) при перелистывании слайдов буллет активного слайда подсвечивается (выделяется стилем) 
    
    15) если основное видео проигрывалось при перелистывании слайдера, проигрывание видео останавливается, прогресс бар сдвигается к началу, иконки "Play" на панели управления и по центру видео меняются на первоначальные 
    
    16) даже при частых кликах по стрелкам нет ситуации, когда слайд после перелистывания находится не по центру, нет ситуации, когда видны одновременно два слайда 
    
    17) при клике по кнопке "Play" слева внизу на панели видео начинается проигрывание видео, иконка кнопки при этом меняется на "Pause", большая кнопка "Play" по центру видео исчезает. Повторный клик на кнопку останавливает проигрывание видео, иконка меняется на первоначальную, большая кнопка "Play" по центру видео снова отображается 
    
    18) при клике по большой кнопке "Play" по центру видео, или при клике по самому видео, начинается проигрывание видео, иконка кнопки "Play" слева внизу на панели видео меняется на "Pause", большая кнопка "Play" по центру видео исчезает. Клик на видео, которое проигрывается, останавливает проигрывание видео, иконка кнопки "Play" слева внизу на панели видео меняется на первоначальную, большая кнопка "Play" по центру видео снова отображается 
    
    19) прогресс-бар отображает прогресс проигрывания видео 
    
    20) перетягивание ползунка прогресс-бара позволяет изменить время с которого проигрывается видео 
    
    21) если прогресс-бар перетянуть до конца, видео останавливается, соответственно, меняется внешний вид кнопок "Play" 
    
    22) при клике на иконку динамика происходит toggle звука и самой иконки (звук включается или выключается, соответственно изменяется иконка) 
    
    23) при перемещении ползунка громкости звука изменяется громкость видео 
    
    24) если ползунок громкости звука перетянуть до 0, звук выключается, иконка динамика становится зачеркнутой 
    
    25) если при выключенном динамике перетянуть ползунок громкости звука от 0, звук включается, иконка громкости перестаёт быть зачёркнутой 
    
    26) при нажатии на кнопку fullscreen видео переходит в полноэкранный режим, при этом видео и панель управления разворачиваются во весь экран. При нажатии на кнопку fullscreen повторно видео выходит из полноэкранного режима. Нажатие на клавишу для выхода из полноэкранного режима Esc не проверяем и не оцениваем 
    
    27) панель управления в полноэкранном режиме визуально выглядит так же, как на макете - кнопки равномерно распределены по всей ширине страницы, относительные размеры между кнопками и ползунками, а также относительные размеры самих кнопок остались прежними 
    
    28) клавиша Пробел — пауза, при повторном нажатии - play 
    
    29) Клавиша M (англ) — отключение/включение звука 
    
    30) Клавиша F — включение/выключение полноэкранного режима 
    
    31) Клавиши SHIFT+, (англ) — ускорение воспроизведения ролика 
    
    32) Клавиши SHIFT+. (англ) — замедление воспроизведения ролика 
    
    33) при прокрутке страницы вниз появление картин секции Galery сопровождается анимацией: изображения плавно поднимаются снизу вверх, увеличиваясь и создавая эффект выплывания. В качестве образца анимации используйте анимацию на сайте Лувра https://www.louvre.fr/ 
    
    34) если прокрутить страницу вверх и затем снова прокручивать вниз, анимация появления картин повторяется 
    
    35) при обновлении страницы, если она к тому моменту была прокручена до секции Galery, анимация картин повторяется 
    
    36) при изменении количества билетов Basic и Senior пересчитывается общая цена за них 
    
    37) у каждого типа билетов своя цена (20 €, 25 €, 40 € для Basic и половина этой стоимости для Senior). При изменении типа билета пересчитывается общая цена за них 
    
    38) при обновлении страницы сохраняется выбранное ранее количество билетов Basic и Senior, выбранный тип билета, общая цена за них 
    
    39) в секции Contacts добавлена интерактивная карта 
    
    40) стиль карты соответствует макету 
    
    `
  );
})