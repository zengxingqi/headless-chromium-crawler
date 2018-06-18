const puppeteer = require('puppeteer');
const { mn } = require('./config');
const srcToImg = require('./utils/srcToImg');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://image.baidu.com/');
  console.info('go to https://image.baidu.com/');

  await page.setViewport({
    width: 1920,
    height: 1080
  });
  console.log('reset viewport');

  await page.focus('#kw');
  await page.keyboard.sendCharacter('狗');
  await page.click('.s_search');
  console.info('go to search list');

  page.on('load', async () => {
    console.info('page loading done, start fetch ...');
    const ImageSrc = await page.evaluate(()=>{
      const images = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(images, img => img.src)
    });
    console.log(ImageSrc)
    ImageSrc.forEach(async element => {
      await page.waitFor(200);
      await srcToImg(element, mn);
    });
    await browser.close();
  })
})();