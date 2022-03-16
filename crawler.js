const puppeteer = require("puppeteer");

async function crawler(client) {
  async function createFood(food) {
    const result = await client
      .db("testdbOne")
      .collection("testColl")
      .insertOne(food);
    console.log(`ID food: ${result.insertedId}`);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.exposeFunction("createFood", createFood);
  await page.goto(
    `http://www.tbca.net.br/base-dados/composicao_alimentos.php?pagina=1`
  );

  const content = await page.evaluate(() => {
    const cod = [];
    const name = [];
    const group = [];
    const itensPerPage = document.documentElement.querySelectorAll("tbody tr");

    itensPerPage.forEach((node) => {
      cod.push(node.childNodes.item(0).innerText);
      name.push(node.childNodes.item(1).innerText);
      group.push(node.childNodes.item(4).innerText);
    });
    return {
      cod,
      name,
      group,
    };
  });

  for (let i = 0; i < content.cod.length; i++) {
    let cod = content.cod[i];
    let name = content.name[i];
    let group = content.group[i];

    await page.goto(
      `http://www.tbca.net.br/base-dados/int_composicao_alimentos.php?cod_produto=${cod}`
    );
  }
}

module.exports = crawler;
