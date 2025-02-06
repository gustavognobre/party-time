const express = require("express");
const partyController = require("../controllers/partiesControllers");

const router = express.Router();

router.route("/parties").post((req, res) => partyController.create(req, res));
router.route("/parties").get((req, res) => partyController.getAll(req, res));
router.route("/parties/:id").get((req, res) => partyController.get(req, res));
router
  .route("/parties/:id")
  .delete((req, res) => partyController.delete(req, res));
router
  .route("/parties/:id")
  .patch((req, res) => partyController.update(req, res));
module.exports = router;
