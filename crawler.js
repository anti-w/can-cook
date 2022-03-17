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

  await page.goto(
    `http://www.tbca.net.br/base-dados/composicao_alimentos.php?pagina=1`
  );

  const content = await page.evaluate(() => {
    let cod = [];
    let name = [];
    let group = [];
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

  page.exposeFunction("createFood", createFood);

  for (let i = 0; i < content.cod.length; i++) {
    let cod = content.cod[i];
    let name = content.name[i];
    let group = content.group[i];

    await page.goto(
      `http://www.tbca.net.br/base-dados/int_composicao_alimentos.php?cod_produto=${cod}`
    );
    const nutrientsPage = await page.evaluate(() => {
      let components = [];
      let values = [];
      const itensPerPage =
        document.documentElement.querySelectorAll("tbody tr");

      itensPerPage.forEach((node) => {
        let component = node.childNodes.item(0).innerText.replaceAll(" ", "");

        let unity = node.childNodes.item(1).innerText;
        let valuePer100g = node.childNodes.item(2).innerText.replace(",", ".");
        valuePer100g = parseFloat(valuePer100g);

        components.push(
          component + unity //componente + unidade (açúcarg)
        );
        values.push(valuePer100g);
      });

      return { components, values };
    });

    let components = nutrientsPage.components;
    let values = nutrientsPage.values;

    const food = {
      nome: name,
      codigo: cod,
      grupoAlimentar: group,
      nutrientes: {},
    };
    for (let x = 0; x < components.length; x++) {
      food.nutrientes[components[x]] = values[x];
    }
    createFood(food);
  }
}

module.exports = crawler;
