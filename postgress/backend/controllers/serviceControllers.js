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
  getAll: async (req, res) => {
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
      if (result.rows.length === 0) {
        return res.status(404).send("User not found");
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "DELETE FROM services WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
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
      const result = await pool.query(
        "UPDATE services SET name = $1, description= $2, price= $3, image=$4 WHERE id = $5 RETURNING *",
        [name, description, price, image, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).send("User not found");
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
};

module.exports = userController;
