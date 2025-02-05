const PartyModel = require("../models/Party");
const { Service: ServiceModel } = require("../models/Service");

const checkPartyBudget = async (budget, servicesIds, res) => {
  // Buscando os serviços pelo ID
  const services = await ServiceModel.find({ _id: { $in: servicesIds } });

  // Se algum serviço não for encontrado
  if (services.length !== servicesIds.length) {
    res.status(404).json({ msg: "❌ Alguns serviços não foram encontrados" });
    return false;
  }

  // Calcula o preço total somando o preço de cada serviço
  const priceSum = services.reduce((sum, service) => sum + service.price, 0);

  // Verifica se o orçamento é suficiente
  if (priceSum > budget) {
    res.status(406).json({ msg: "O seu orçamento é insuficiente!" });
    return false;
  }

  return true; // Retorna true se o orçamento for suficiente
};

const checkServiceExists = async (servicesIds, res) => {
  for (let serviceId of servicesIds) {
    try {
      const service = await ServiceModel.findById(serviceId);

      if (!service) {
        // Retorna o ID do serviço que não foi encontrado
        res
          .status(404)
          .json({ msg: `❌ Serviço com ID ${serviceId} não encontrado` });
        return false; // Interrompe a execução caso um serviço não seja encontrado
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("🟡Erro com o servidor");
      return false; // Interrompe em caso de erro no banco de dados
    }
  }
  return true; // Retorna true se todos os serviços forem encontrados
};

const partyController = {
  create: async (req, res) => {
    try {
      const party = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        budget: req.body.budget,
        image: req.body.image,
        services: req.body.services, // Lista de IDs de serviços
      };

      // Verifica se já existe uma festa com o mesmo nome
      const existingParty = await PartyModel.findOne({ title: party.title });
      if (existingParty) {
        return res
          .status(400)
          .json({ msg: "❌ Já existe uma festa com esse nome" });
      }

      // Verifica se todos os serviços existem
      const servicesExist = await checkServiceExists(party.services, res);
      if (!servicesExist) {
        return; // Se algum serviço não existir, o fluxo é interrompido
      }

      // Verifica se o orçamento é suficiente, agora com base nos preços dos serviços
      const budgetValid = await checkPartyBudget(
        party.budget,
        party.services,
        res
      );
      if (!budgetValid) {
        return; // Se o orçamento for insuficiente, o fluxo é interrompido
      }

      // Se tudo estiver ok, cria a festa
      const response = await PartyModel.create(party);

      res.status(201).json({ response, msg: "Festa criada com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro interno do servidor!" });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params; // ID da festa a ser atualizada
      const partyUpdates = req.body; // Dados para atualizar a festa

      // Verifica se o nome da festa já está sendo usado por outra festa (mas não pela festa que estamos atualizando)
      const existingParty = await PartyModel.findOne({
        title: partyUpdates.title,
        _id: { $ne: id }, // Exclui a festa com o mesmo ID
      });
      if (existingParty) {
        return res
          .status(400)
          .json({ msg: "❌ Já existe uma festa com esse nome" });
      }

      // Verifica se todos os serviços existem
      if (partyUpdates.services) {
        const servicesExist = await checkServiceExists(
          partyUpdates.services,
          res
        );
        if (!servicesExist) {
          return; // Se algum serviço não existir, o fluxo é interrompido
        }

        // Verifica se o orçamento é suficiente, agora com base nos preços dos serviços
        const budgetValid = await checkPartyBudget(
          partyUpdates.budget,
          partyUpdates.services,
          res
        );
        if (!budgetValid) {
          return; // Se o orçamento for insuficiente, o fluxo é interrompido
        }
      }

      // Atualiza a festa
      const updatedParty = await PartyModel.findByIdAndUpdate(
        id,
        partyUpdates,
        { new: true }
      );

      // Se a festa não for encontrada, retorna erro
      if (!updatedParty) {
        return res.status(404).json({ msg: "❌ Festa não encontrada" });
      }

      res
        .status(200)
        .json({ updatedParty, msg: "Festa atualizada com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro interno do servidor!" });
    }
  },

  getAll: async (req, res) => {
    try {
      const parties = await PartyModel.find();
      res.json(parties);
    } catch (error) {
      console.log(error);
    }
  },

  get: async (req, res) => {
    try {
      const id = req.params.id;
      const party = await PartyModel.findById(id);

      if (!party) {
        res.status(404).json({ msg: "Festa não encontrada" });
        return;
      }

      res.json(party);
    } catch (error) {
      console.log(error);
      res.status(500).send("🟡Erro com o servidor");
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;

      const party = await PartyModel.findById(id);

      if (!party) {
        res.status(404).json({ msg: "❌ Festa não encontrada" });
        return;
      }

      const deletedParty = await PartyModel.findByIdAndDelete(id);

      res
        .status(200)
        .json({ deletedParty, msg: "✅ Festa excluída com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).send("🟡Erro com o servidor");
    }
  },
};

module.exports = partyController;
