const { Service: ServiceModel } = require("../models/Service");

const serviceController = {
  //Cria novo serviço

  create: async (req, res) => {
    try {
      const { name, description, price, image } = req.body;

      // Verifica se já existe um serviço com o mesmo nome
      const existingService = await ServiceModel.findOne({ name });
      if (existingService) {
        return res
          .status(400)
          .json({ msg: "❌ Serviço já cadastrado com este nome" });
      }

      // Criação do novo serviço
      const service = await ServiceModel.create({
        name,
        description,
        price,
        image,
      });

      res.status(201).json({ service, msg: "✅ Serviço criado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).send("🟡 Erro com o servidor");
    }
  },

  //Recebe todos os dados

  getAll: async (req, res) => {
    try {
      const services = await ServiceModel.find();
      res.json(services);
    } catch (error) {
      console.log(error);
    }
  },

  //Recebe por id
  get: async (req, res) => {
    try {
      const id = req.params.id;
      const service = await ServiceModel.findById(id);

      if (!service) {
        res.status(404).json({ msg: "❌Serviço não encontrado" });
        return;
      }

      res.json(service);
    } catch (error) {
      console.log(error);
      res.status(500).send("🟡Erro com o servidor");
    }
  },

  //Deleta pelo ID

  delete: async (req, res) => {
    try {
      const id = req.params.id;

      const service = await ServiceModel.findById(id);

      if (!service) {
        res.status(404).json({ msg: "❌ Serviço não encontrado" });
        return;
      }

      const deletedService = await ServiceModel.findByIdAndDelete(id);

      res
        .status(200)
        .json({ deletedService, msg: "✅ Serviço excluído com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).send("🟡Erro com o servidor");
    }
  },

  // Atualização usando PATCH
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!Object.keys(updates).length) {
        return res
          .status(400)
          .json({ msg: "🟡 Nenhum campo enviado para atualização" });
      }

      // Verifica se o nome já existe antes de atualizar
      if (updates.name) {
        const existingService = await ServiceModel.findOne({
          name: updates.name,
        });
        if (existingService && existingService.id !== id) {
          return res
            .status(400)
            .json({ msg: "❌ Este serviço já esta em uso" });
        }
      }

      const updatedService = await ServiceModel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      );

      if (!updatedService) {
        return res.status(404).json({ msg: "❌ Serviço não encontrado" });
      }

      res
        .status(200)
        .json({ updatedService, msg: "✅ Serviço atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "🟡 Erro com o servidor" });
    }
  },
};

module.exports = serviceController;
