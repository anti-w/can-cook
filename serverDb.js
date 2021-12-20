const fs = require('firebase-admin')
const serviceAccount = require('./authService.json')
const puppeteer = require('puppeteer');

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount)
})


const db = fs.firestore().collection('alimentos')

const init = async function () {
  const dbRef = db
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const dataTest = []

  await page.goto('http://www.tbca.net.br/base-dados/composicao_alimentos.php?pagina=1')




  const content = await page.evaluate(() => {
    const itensPage = document.documentElement.querySelectorAll('tbody tr').length
    const data = {}


    const row = []
    const val = []
    const newDict = {}
    cod = document.documentElement.querySelectorAll('tbody tr').item(55).querySelectorAll('td').item(0).innerText
    for (var i = 0; i < 6; i++) {

      row.push(document.documentElement.querySelectorAll('tbody tr').item(55).querySelectorAll('td').item(i).innerText)

      val.push(document.documentElement.querySelectorAll('thead tr th').item(i).innerText)
      newDict[val[i]] = row[i]

    }
    data[cod] = newDict

    return {
      cod,
      data
    }
  })

  dataTest.push(content.data)

  console.log(dataTest.map(data => data.C0003K.Nome))
  db.doc(content.cod).set(content.data)
}

init()
