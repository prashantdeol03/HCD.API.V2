const axios = require("axios");

let accessToken = null;
let expiryTime = null;

const getZohoAccessToken = async () => {
  if (accessToken && expiryTime && Date.now() < expiryTime) {
    return accessToken;
  }

  const response = await axios.post(
    process.env.ZOHO_AUTH_URL,
    null,
    {
      params: {
        grant_type: "refresh_token",
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        refresh_token: process.env.ZOHO_REFRESH_TOKEN
      }
    }
  );

  accessToken = response.data.access_token;
  expiryTime = Date.now() + response.data.expires_in * 1000;

  return accessToken;
};

module.exports = { getZohoAccessToken };
