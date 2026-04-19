const axios = require("axios");
const { getZohoAccessToken } = require("./zohoToken.service");

const cleanPayload = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

/**
 * SEARCH LEAD (duplicate check)
 */
const searchLead = async ({ Email, Phone }) => {
  const token = await getZohoAccessToken();

  if (!Email && !Phone) return null;

  const response = await axios.get(
    `${process.env.ZOHO_BASE_URL}/crm/v8/Leads/search`,
    {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
      params: Email ? { email: Email } : { phone: Phone }
    }
  );

  return response.data?.data?.[0] || null;
};

/**
 * FETCH LEADS
 */
const fetchLeads = async () => {
  const token = await getZohoAccessToken();

  const response = await axios.get(
    `${process.env.ZOHO_BASE_URL}/crm/v8/Leads`,
    {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
      params: {
        fields: [
          "Last_Name",
          "Email",
          "Phone",
          "Company",
          "Lead_Status",
          "Description",
          "Owner",
          "Loyalty_Points"
        ].join(","),
        per_page: 20,
        sort_by: "Modified_Time",
        sort_order: "desc"
      }
    }
  );

  return response.data;
};

/**
 * CREATE OR UPDATE LEAD
 */
const createLead = async (leadData) => {
  const token = await getZohoAccessToken();

  // ✅ REQUIRED BY ZOHO
  if (!leadData.Last_Name) {
    throw new Error("Last_Name is required");
  }

  const payload = {
    data: [
      {
        // ✅ FULL NAME STORED AS LAST NAME
        Last_Name: leadData.Last_Name,

        // Optional fields
        Email: leadData.Email || null,
        Phone: leadData.Phone || null,
        Country: leadData.Country || "India",
        Description: leadData.Description || null,
        First_Name: leadData.Last_Name || "NA",

        // CRM defaults
        Company: leadData.Last_Name,
        Lead_Source: "Website",
        Lead_Status: "Not Contacted",

        // ✅ HARD-CODED
        Loyalty_Points: 5000
      }
    ]
  };

  const response = await axios.post(
    `${process.env.ZOHO_BASE_URL}/crm/v8/Leads`,
    payload,
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};


module.exports = { fetchLeads, createLead };

