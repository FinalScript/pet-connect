export const getTestToken = async () => {
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

  return (await res.json()).access_token;
};
