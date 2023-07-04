// src/validate.js

require('dotenv').config();
import { verify, VerifyErrors } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `https://petapp.us.auth0.com/.well-known/jwks.json`,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (error, key: any) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

interface Response {
  error?: VerifyErrors;
  id?: string;
}

export const isTokenValid = async (token: string) => {
  if (!token) {
    return { error: 'Token not provided', id: null };
  }

  const bearerToken = token.split(' ');

  const result: Response = await new Promise((resolve, reject) => {
    verify(
      bearerToken[1],
      getKey,
      {
        audience: 'https://pet-app.com/api/v2',
        issuer: `https://petapp.us.auth0.com/`,
        algorithms: ['RS256'],
      },
      (error, decoded) => {
        if (error) {
          resolve({ error });
        }
        if (decoded) {
          resolve({ id: decoded.sub.toString() });
        }
      }
    );
  });

  return result;
};
