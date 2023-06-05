import axios from 'axios';

let api = axios.create({ baseURL: 'http://10.0.2.2:3000' });

export const setApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};

export const setBearerToken = (token: string) => {
  api.defaults.headers.common = { Authorization: token };
};

export const getBearerToken = () => {
  return api.defaults.headers.common;
};

export const ping = () => {
  return api({
    method: 'GET',
    url: '/api/public/',
    timeout: 3000,
  });
};

export const getOwnerData = () => {
  return api({
    method: 'GET',
    url: '/api/private/owner',
  });
};

interface SignUpParams {
  username: string;
  name?: string;
  location?: string;
}

export const signup = (data: SignUpParams) => {
  return api({
    method: 'POST',
    url: '/api/private/owner/signup',
    data,
  });
};

export const usernameExists = (username: string) => {
  return api({
    method: 'POST',
    url: '/api/private/owner/validateusername',
    data: { username },
  });
};
