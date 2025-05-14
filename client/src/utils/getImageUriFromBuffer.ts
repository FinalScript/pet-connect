import { Buffer } from 'buffer';

export const getImageUriFromBuffer = (data: any) => {
  return `data:image/*;base64,${Buffer.from(data).toString('base64')}`;
};
