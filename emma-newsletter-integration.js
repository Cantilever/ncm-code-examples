const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email } = JSON.parse(event.body);
  const PUBLIC_API_KEY = 'your_public_api_key'; // Replace with your actual public API key
  const PRIVATE_API_KEY = 'your_private_api_key'; // Replace with your actual private API key
  const ACCOUNT_ID = 'your_emma_account_id';

  const url = `https://api.e2ma.net/${ACCOUNT_ID}/members/signup`;

  try {
    const response = await axios.post(url, {
      email: email,
      // Include any other required fields by the API or additional fields you want to capture
    }, {
      auth: {
        username: PUBLIC_API_KEY,
        password: PRIVATE_API_KEY
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Signup successful" })
    };
  } catch (error) {
    console.error('Signup error:', error.response ? error.response.data : error.message);
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ message: "Error during signup" })
    };
  }
};
