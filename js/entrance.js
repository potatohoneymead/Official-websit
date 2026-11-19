// 土豆與蜜酒 - 入口頁互動控制器 (index.html)

const entranceScreen = document.getElementById('entrance-screen');
const entranceBgWrapper = document.getElementById('entrance-bg-wrapper');
const bgVideo = document.getElementById('bg-video');
const scrollOpenVideo = document.getElementById('scroll-open-video');
const logoTitleImg = document.getElementById('logo-title-img');
const scrollCloseVideo = document.getElementById('scroll-close-video');
const enterBtnWrapper = document.getElementById('enter-btn-wrapper');

let isTransitioning = false;
let isParallaxActive = false;

// 1. 卷軸展開影片播放結束 -> 顯示標準字圖片、啟用 Enter 按鈕、啟動視差
function handleScrollOpenEnd() {
  if (isParallaxActive) return;
  scrollOpenVideo.classList.add('hidden');
  logoTitleImg.classList.remove('hidden');
  enterBtnWrapper.classList.add('active');
  isParallaxActive = true;
}

scrollOpenVideo.addEventListener('ended', handleScrollOpenEnd);

scrollOpenVideo.addEventListener('timeupdate', () => {
  if (scrollOpenVideo.duration && scrollOpenVideo.currentTime >= scrollOpenVideo.duration - 0.1) {
    handleScrollOpenEnd();
  }
});

scrollOpenVideo.addEventListener('error', () => {
  console.warn('卷軸影片未載入，自動進入待機狀態。');
  handleScrollOpenEnd();
});

// 2. 點擊 Enter -> logo 回正 -> 播 scroll-close -> 正式跳轉至獨立的吧檯網頁 (bar.html)
function triggerEnterTavern() {
  if (isTransitioning) return;
  isTransitioning = true;
  isParallaxActive = false;
  entranceBgWrapper.style.transform = 'translate3d(0px, 0px, 0) rotateY(0deg)';

  enterBtnWrapper.classList.remove('active');
  logoTitleImg.classList.add('reset-position');

  setTimeout(() => {
    logoTitleImg.classList.add('hidden');
    logoTitleImg.classList.remove('reset-position');
    playScrollClose();
  }, 150);
}

function playScrollClose() {
  if (scrollCloseVideo && scrollCloseVideo.querySelector('source').getAttribute('src')) {
    scrollCloseVideo.classList.remove('hidden');
    scrollCloseVideo.currentTime = 0;

    let closeEnded = false;
    const onFinished = () => {
      if (closeEnded) return;
      closeEnded = true;
      scrollCloseVideo.classList.add('hidden');
      // 播完後跳轉到獨立的酒館吧檯頁面
      window.location.href = 'bar.html';
    };

    scrollCloseVideo.onended = onFinished;
    scrollCloseVideo.ontimeupdate = () => {
      if (scrollCloseVideo.duration && scrollCloseVideo.currentTime >= scrollCloseVideo.duration - 0.1) {
        onFinished();
      }
    };

    const p = scrollCloseVideo.play();
    if (p !== undefined) {
      p.catch(err => {
        console.warn('卷軸收起播放異常，直接跳轉：', err);
        window.location.href = 'bar.html';
      });
    }
  } else {
    window.location.href = 'bar.html';
  }
}

enterBtnWrapper.addEventListener('click', triggerEnterTavern);

// 3. 滑鼠微跟隨視差效果 (Parallax)
window.addEventListener('mousemove', (e) => {
  if (!isParallaxActive) return;

  const { innerWidth, innerHeight } = window;
  const offsetX = (e.clientX / innerWidth - 0.5) * 2;
  const offsetY = (e.clientY / innerHeight - 0.5) * 2;

  const moveX = -offsetX * 15;
  const moveY = -offsetY * 12;
  const rotateY = offsetX * 1.5;

  entranceBgWrapper.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateY(${rotateY}deg)`;
});
