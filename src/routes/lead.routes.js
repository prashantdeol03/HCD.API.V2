const express = require("express");
const {
  getLeads,
  postLead
} = require("../controllers/lead.controller");

const router = express.Router();

router.get("/", getLeads);
router.post("/", postLead);

module.exports = router;
