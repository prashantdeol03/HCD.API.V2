const {
  fetchLeads,
  createLead
} = require("../services/zohoLead.service");

const getLeads = async (req, res) => {
  try {
    const data = await fetchLeads();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Failed to fetch leads"
    });
  }
};

const postLead = async (req, res) => {
  try {
    const result = await createLead(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({
      message: error.message
    });
  }
};

module.exports = { getLeads, postLead };
