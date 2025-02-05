const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

// Conexão com o banco

const { conn } = require("./db/conn");

conn();

// Rotas
const routes = require("./routes/router");
app.use("/api", routes);

function startServer() {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

startServer();
