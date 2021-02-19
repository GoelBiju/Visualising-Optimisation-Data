const express = require("express");

const RunController = require("../controllers/RunController");

const router = express.Router();

router.get("/runs", RunController.getRuns);
router.get("/runs/:runId", RunController.getRun);
router.post("/runs", RunController.createRun);

module.exports = router;
