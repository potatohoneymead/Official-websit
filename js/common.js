// 土豆與蜜酒 - 全站共用腳本 (導覽列 LOGO 圖片處理等)
const navLogoImg = document.getElementById('nav-logo-img');
const navLogoText = document.querySelector('.nav-logo-text');

if (navLogoImg) {
  navLogoImg.addEventListener('load', () => {
    if (navLogoImg.naturalWidth > 120 && navLogoText) {
      navLogoText.style.display = 'none';
    }
  });
  navLogoImg.addEventListener('error', () => {
    navLogoImg.style.display = 'none';
    if (navLogoText) navLogoText.style.display = 'inline';
  });
}
