const { pool } = require("../db/conn");

const userController = {
  create: async (req, res) => {
    try {
      const { name, description, price, image } = req.body;
      const result = await pool.query(
        "INSERT INTO services (name, description, price, image) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, description, price, image]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Erro ao criar usuário:", err.message);
      res.status(500).send("Server error");
    }
  },

  getAll: async (_, res) => {
    try {
      const result = await pool.query("SELECT * FROM services");
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },

  get: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("SELECT * FROM services WHERE id = $1", [
        id,
      ]);
      if (!result.rows.length) {
        return res.status(404).send("User not found");
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
        "DELETE FROM services WHERE id = $1 RETURNING *",
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
    const { name, description, price, image } = req.body;

    try {
      const fields = [];
      const values = [];
      let index = 1;

      if (name) fields.push(`name = $${index++}`) && values.push(name);
      if (description)
        fields.push(`description = $${index++}`) && values.push(description);
      if (price) fields.push(`price = $${index++}`) && values.push(price);
      if (image) fields.push(`image = $${index++}`) && values.push(image);

      if (!fields.length) {
        return res.status(400).json({ error: "Nenhum campo para atualizar" });
      }

      values.push(id);
      const query = `UPDATE services SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;
      const result = await pool.query(query, values);

      if (!result.rows.length) {
        return res.status(404).json({ error: "Serviço não encontrado" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Erro no servidor");
    }
  },
};

module.exports = userController;
