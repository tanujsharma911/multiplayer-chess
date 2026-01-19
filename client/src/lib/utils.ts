import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAnalysis = async (fen: string, level?: number) => {
  const response = await axios
    .post(`https://chess-api.com/v1`, {
      fen,
      depth: level,
    })
    .then((res) => res.data);

  return response;
};
