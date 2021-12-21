const fs = require('./connectDb')
const puppeteer = require('puppeteer'); //instância de um browser para coletar as informações


const db = fs.firestore().collection('alimentos') //referência da colletion do firebase

/* inicialização do bot para criar a instância do browser e coletar os dados
referentes aos alimentos, como nome, nome cientificio, grupo alimentar, marca, código
e guardar estes dados no firebase firestore de maneira dinâmica passando o código
como ID para cada documento.
*/
const init = async function () {
  const dbRef = db
  const browser = await puppeteer.launch(); //browser sendo inicializado (puppeteer utiliza o Chromiun)
  const page = await browser.newPage(); //abrir nova página

  //é necessário expor a função para que possa ter acesso a ela dentro do escopo de .evaluate
  await page.exposeFunction('addDoc', (id, data) => db.doc(id).set(data))
  // função responsável para criar os documentos recebendo o id (código) e 
  // o objeto data (nome, nomecientifico, grupo, marca)

  //laços para percorrer todas as páginas disponíveis
  for (var y = 1; y < 54; y++) {
    //navega para a página
    await page.goto(`http://www.tbca.net.br/base-dados/composicao_alimentos.php?pagina=${y}`)
    //debug
    console.log('Bot coletando dados da pagina: ', y)

    //.evaluate retorna uma Promise com o conteúdo da página para ser acessado
    const content = await page.evaluate(() => {
      //quantidade de alimentos por ṕágina na tabela
      const itensPage = document.documentElement.querySelectorAll('tbody tr').length
      const data = {}
      //laço para percorrer toda as linhas da tabela e inserir os dados no firestore
      for (var x = 0; x < itensPage; x++) {
        const newDict = {}
        const row = []
        const val = []


        cod = document.documentElement.querySelectorAll('tbody tr').item(x).querySelectorAll('td').item(0).innerText
        // criando um objeto key:value com o header e o valor de cada coluna(i) para cada linha(x)
        for (var i = 0; i < 6; i++) {

          row.push(document.documentElement.querySelectorAll('tbody tr').item(x).querySelectorAll('td').item(i).innerText)
          val.push(document.documentElement.querySelectorAll('thead tr th').item(i).innerText)

          newDict[val[i]] = row[i]
        }
        //chamda do método exposto lá em cima para adicionar o alimento com o código como ID
        //window.addDoc(cod, newDict)

        data[cod] = newDict
      }

      return {
        cod,
        data
      }
    })
  }
}()



