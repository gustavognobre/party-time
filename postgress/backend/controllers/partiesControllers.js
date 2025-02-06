const { pool } = require("../db/conn");

const checkPartyBudget = async (budget, servicesIds, res) => {
  try {
    const result = await pool.query(
      "SELECT SUM(price) AS total_price FROM services WHERE id = ANY($1::int[])",
      [servicesIds]
    );

    const priceSum = result.rows[0].total_price || 0;

    if (priceSum > budget) {
      res.status(406).json({ msg: "O seu orçamento é insuficiente!" });
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro interno do servidor" });
    return false;
  }
};

const checkServiceExists = async (servicesIds, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM services WHERE id = ANY($1::int[])`,
      [servicesIds.map((id) => Number(id))] // Converte para número
    );

    if (result.rows.length !== servicesIds.length) {
      return res
        .status(404)
        .json({ msg: "❌ Alguns serviços não foram encontrados" });
    }
    return true;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "🟡 Erro no servidor" });
    return false;
  }
};

const partyController = {
  create: async (req, res) => {
    try {
      const { title, author, description, budget, image, services } = req.body;

      const existingParty = await pool.query(
        "SELECT id FROM parties WHERE title = $1",
        [title]
      );
      if (existingParty.rows.length > 0) {
        return res
          .status(400)
          .json({ msg: "❌ Já existe uma festa com esse nome" });
      }

      if (!(await checkServiceExists(services, res))) return;
      if (!(await checkPartyBudget(budget, services, res))) return;

      const result = await pool.query(
        "INSERT INTO parties (title, author, description, budget, image, services) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [title, author, description, budget, image, services]
      );

      res
        .status(201)
        .json({ response: result.rows[0], msg: "Festa criada com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Erro interno do servidor!" });
    }
  },
  getAll: async (_, res) => {
    try {
      const result = await pool.query("SELECT * FROM parties");
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
};

module.exports = partyController;
