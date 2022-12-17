const puppeteer = require('puppeteer');
var date = require('silly-datetime');
const fs = require('fs');

async function scrape(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  var movies = await page.evaluate(() => {
    const titlesList = document.querySelectorAll('.title>.titleline>a');
    const movieArr = [];

    for (var i = 0; i < titlesList.length; i++) {
      const title = titlesList[i].innerText.trim();
      const content =`${i+1}. ${title}`
      movieArr.push(content);
    }
    return movieArr.join(',\r\n')
  });
  const nowdate = date.format(new Date(), 'YYYY-MM-DD');
  fs.writeFile(
    `../record/${nowdate}.md`,
    movies,
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Great Success');
    },
  );
  browser.close();
}

scrape('https://news.ycombinator.com/news');
