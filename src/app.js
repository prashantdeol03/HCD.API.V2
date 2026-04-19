const express = require("express");
const cors = require("cors");
const leadRoutes = require("./routes/lead.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);

module.exports = app;
