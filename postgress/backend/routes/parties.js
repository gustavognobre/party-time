const express = require("express");
const partyController = require("../controllers/partiesControllers");

const router = express.Router();

router.route("/parties").post((req, res) => partyController.create(req, res));
router.route("/parties").get((req, res) => partyController.getAll(req, res));

module.exports = router;
