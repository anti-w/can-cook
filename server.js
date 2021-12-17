const puppeteer = require('puppeteer');
const express = require('express');

const server = express();

server.get("/", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.tbca.net.br/base-dados/composicao_alimentos.php');
  // await page.screenshot({ path: 'example1.png' });

  const pageContent = await page.evaluate(() => {

    const data = []
    const val = []

    for (var x = 0; x < 10; x++) {

      const row = []
      const dict = {}
      for (var i = 0; i < 6; i++) {
        row.push(document.documentElement.querySelectorAll('tbody tr').item(x).querySelectorAll('td').item(i).innerText)
        val.push(document.documentElement.querySelectorAll('thead tr th').item(i).innerText)
        dict[val[i]] = row[i]
      }
      data.push(dict)

    }


    return data
  });


  await browser.close();

  res.send({
    pageContent
  })
});
const port = 3000;

server.listen(port, () => {
  console.log(`Servidor rodando, acesse em: https://localhost:${port}`)
});

