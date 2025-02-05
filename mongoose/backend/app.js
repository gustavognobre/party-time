const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

//DB Connection

const conn = require("./db/conn");

conn();

//Routes
const routes = require("./routes/router");
app.use("/api", routes);

function startServer() {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

startServer();
