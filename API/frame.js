const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/darkmode', async (req, res) => {
  const url = req.query.url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle0' });

  const hasDarkMode = await page.evaluate(() => {
    return document.querySelector('.dark-mode') !== null;
  });

  if (!hasDarkMode) {
    // CSS for dark mode website
    await page.addStyleTag({
      content: `
        body {
          background-color: #222;
          color: #ddd;
        }

        a {
          color: #fff;
        }
      `
    });
  }

  // get html/css for response
  const html = await page.content();
  res.send(html);

  await browser.close();
});

app.listen(3000, () => {
  console.log('Dark mode API listening on port 3000');
});
