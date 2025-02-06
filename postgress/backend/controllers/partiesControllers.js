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
  get: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM parties WHERE id = $1", [
        id,
      ]);
      if (!result.rows.length) {
        return res.status(404).send("Festa não encontrada");
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        "DELETE FROM parties WHERE id = $1 RETURNING *",
        [id]
      );
      if (!result.rows.length) {
        return res.status(404).send("User not found");
      }
      res.json({ message: "User deleted", user: result.rows[0] });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { title, author, description, budget, image, services } = req.body;

    try {
      // Verifica se a festa existe
      const partyResult = await pool.query(
        "SELECT * FROM parties WHERE id = $1",
        [id]
      );
      if (partyResult.rows.length === 0) {
        return res.status(404).json({ msg: "❌ Festa não encontrada" });
      }

      // Verifica se já existe uma festa com o mesmo nome (se o título foi alterado)
      if (title) {
        const existingParty = await pool.query(
          "SELECT * FROM parties WHERE title = $1 AND id <> $2",
          [title, id]
        );
        if (existingParty.rows.length > 0) {
          return res
            .status(400)
            .json({ msg: "❌ Já existe uma festa com esse nome" });
        }
      }

      // Verifica se os serviços existem (se forem atualizados)
      if (services && services.length > 0) {
        const servicesExist = await checkServiceExists(services, res);
        if (!servicesExist) {
          return; // Interrompe a execução se algum serviço não existir
        }

        // Verifica se o orçamento é suficiente
        const budgetValid = await checkPartyBudget(
          budget || partyResult.rows[0].budget,
          services,
          res
        );
        if (!budgetValid) {
          return; // Interrompe se o orçamento for insuficiente
        }
      }

      // Monta a query de atualização dinamicamente
      const fields = [];
      const values = [];
      let index = 1;

      if (title) {
        fields.push(`title = $${index}`);
        values.push(title);
        index++;
      }
      if (author) {
        fields.push(`author = $${index}`);
        values.push(author);
        index++;
      }
      if (description) {
        fields.push(`description = $${index}`);
        values.push(description);
        index++;
      }
      if (budget) {
        fields.push(`budget = $${index}`);
        values.push(budget);
        index++;
      }
      if (image) {
        fields.push(`image = $${index}`);
        values.push(image);
        index++;
      }
      if (services) {
        fields.push(`services = $${index}`);
        values.push(services);
        index++;
      }

      if (fields.length === 0) {
        return res.status(400).json({ msg: "Nenhum campo para atualizar" });
      }

      values.push(id);
      const query = `UPDATE parties SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;

      const updatedParty = await pool.query(query, values);

      res.json({
        msg: "🎉 Festa atualizada com sucesso!",
        party: updatedParty.rows[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Erro interno do servidor!" });
    }
  },
};

module.exports = partyController;
