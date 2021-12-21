const puppeteer = require('puppeteer');
const express = require('express');

const server = express();
let x = 0

server.get("/", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const dataAll = []

    await page.goto('http://www.tbca.net.br/base-dados/int_composicao_alimentos.php?cod_produto=C0001C');

    const pageCt = await page.evaluate(() => {

      const data = []
      const val = []
      const itensPage = document.documentElement.querySelectorAll('tbody tr').length
      for (var x = 0; x < itensPage; x++) {
        console.log(x)
        const row = []
        const dict = {}
        for (var i = 0; i < 3; i++) {
          row.push(document.documentElement.querySelectorAll('tbody tr').item(x).querySelectorAll('td').item(i).innerText)
          val.push(document.documentElement.querySelectorAll('thead tr th').item(i).innerText)
          dict[val[i]] = row[i]
        }
        data.push(dict)

      }

      return data
    })


    dataAll.push(pageCt)


  await browser.close()

  res.send({
    dataAll
  })

});
const port = 3000;

server.listen(port, () => {
  console.log(`Servidor rodando, acesse em: https://localhost:${port}`)
});

