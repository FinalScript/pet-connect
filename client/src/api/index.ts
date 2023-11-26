import axios from 'axios';

let api = axios.create({ baseURL: 'http://172.20.10.6:3000' });

export const setApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};

export const getApiBaseUrl = () => {
  return api.defaults.baseURL;
}

export const setBearerToken = (token: string) => {
  api.defaults.headers.common = { Authorization: token };
};

export const getBearerToken = () => {
  return api.defaults.headers.common;
};

export const ping = () => {
  return api({
    method: 'GET',
    url: '/health',
    timeout: 1000,
  });
};

export const uploadOwnerProfilePicture = (data: any) => {
  return api({
    method: 'POST',
    url: `/api/private/owner/profilepic/upload`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadPetProfilePicture = (data: any, id: string) => {
  return api({
    method: 'POST',
    url: `/api/private/pet/${id}/profilepic/upload`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
