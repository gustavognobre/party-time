require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: "gnobre",
  host: "localhost",
  database: "partytime",
  password: process.env.PASSWORD,
  port: 5432,
});

async function conn() {
  try {
    const client = await pool.connect();
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");
    client.release();
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco de dados:", err.message);
    process.exit(1);
  }
}

module.exports = { pool, conn };
