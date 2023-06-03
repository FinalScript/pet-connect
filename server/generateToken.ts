require('dotenv').config();

const getTestToken = async () => {
  try {
    const res = await fetch('https://petapp.us.auth0.com/oauth/token', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        audience: 'https://pet-app.com/api/v2',
        grant_type: 'client_credentials',
      }),
    });

    console.log((await res.json()).access_token);
  } catch (e) {
    console.log(e);
  }
};

getTestToken();
