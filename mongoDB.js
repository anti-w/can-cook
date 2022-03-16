/* 
may be helpfull ~> https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
*/
const crawler = require("./crawler");
const { MongoClient } = require("mongodb");

async function main() {
  const uri = `mongodb+srv://antiw:170195-+cent@cluster0.o6yj8.mongodb.net/can-eat?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    await crawler(client);
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
