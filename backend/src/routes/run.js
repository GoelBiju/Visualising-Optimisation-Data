const express = require("express");

const RunController = require("../controllers/RunController");

const router = express.Router();

router.get("/runs", RunController.getRuns);
router.get("/runs/:runId", RunController.getRun);
router.get("/runs/:runId/:property", RunController.getProperty);
router.post("/runs", RunController.createRun);

module.exports = router;
