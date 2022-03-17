/* 
may be helpfull ~> https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
*/
require("dotenv/config");
const crawler = require("./crawler");
const { MongoClient } = require("mongodb");

async function main() {
  const uri = `mongodb+srv://${process.env.MONGODB_CREDENTIALS}@cluster0.o6yj8.mongodb.net/can-eat?retryWrites=true&w=majority`;
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
