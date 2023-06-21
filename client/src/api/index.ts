import { Buffer } from 'buffer';
import axios from 'axios';
import { Image as ImageType } from 'react-native-image-crop-picker';

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

export const verifyToken = () => {
  return api({
    method: 'GET',
    url: '/api/private/verifyToken',
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

export const ownerUsernameExists = (username: string) => {
  return api({
    method: 'POST',
    url: '/api/private/owner/validateusername',
    data: { username },
  });
};

export const petUsernameExists = (username: string) => {
  return api({
    method: 'POST',
    url: '/api/private/pet/validateusername',
    data: { username },
  });
};

export interface PetCreationParams {
  name: string;
  username:string;
  type: string;
  description?: string;
  location?: string;
  profilePicture?: ImageType | null | undefined;
}

export const createPet = (data: PetCreationParams) => {
  return api({
    method: 'POST',
    url: '/api/private/pet/create',
    data,
  });
};

export const uploadProfilePic = (data: any, id: string) => {
  return api({
    method: 'POST',
    url: `/api/private/pet/${id}/profilepic/upload`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
