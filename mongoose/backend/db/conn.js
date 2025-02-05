require("dotenv").config();
const mongoose = require("mongoose");

async function main() {
  try {
    mongoose.set("strictQuery", true);
    const db_password = process.env.PASSWORD;
    await mongoose.connect(
      `mongodb+srv://gustavognobre:${db_password}@partytime.hrjqd.mongodb.net/?retryWrites=true&w=majority&appName=partytime`
    );
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");
  } catch (error) {
    console.log(`❌ Erro ao conectar ao banco de dados: ${error}`);
  }
}
module.exports = main;
