import { Buffer } from 'buffer';

export const btoa = (input: string) => {
  const buffer = Buffer.from(input, 'utf8');
  return buffer.toString('base64');
};

